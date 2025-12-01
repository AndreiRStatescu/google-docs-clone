import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getById = query({
  args: { id: v.id("folders") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const folder = await ctx.db.get(id);
    if (!folder) {
      return null;
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    if (folder.organizationId !== organizationId) {
      throw new ConvexError("Forbidden");
    }

    return folder;
  },
});

export const getPath = query({
  args: { id: v.id("folders") },
  handler: async (ctx, { id }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    const path: Array<{ _id: string; name: string }> = [];
    let currentId: Id<"folders"> | null = id;

    while (currentId !== null) {
      const folder = await ctx.db.get(currentId);
      if (!folder) {
        break;
      }

      if (folder.organizationId !== organizationId) {
        throw new ConvexError("Forbidden");
      }

      path.unshift({
        _id: folder._id,
        name: folder.name,
      });

      currentId = folder.parentFolderId as Id<"folders"> | null;
    }

    return path;
  },
});

export const getByParentFolderId = query({
  args: { parentFolderId: v.union(v.id("folders"), v.null()) },
  handler: async (ctx, { parentFolderId }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    const folders = await ctx.db
      .query("folders")
      .withIndex("by_parent_folder_id", q => q.eq("parentFolderId", parentFolderId))
      .filter(q => q.eq(q.field("organizationId"), organizationId))
      .collect();

    // Sort folders alphabetically
    return folders.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    parentFolderId: v.union(v.id("folders"), v.null()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    const folderId = await ctx.db.insert("folders", {
      name: args.name,
      ownerId: user.tokenIdentifier,
      organizationId: organizationId,
      parentFolderId: args.parentFolderId,
    });

    return folderId;
  },
});

export const removeById = mutation({
  args: { id: v.id("folders") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const folder = await ctx.db.get(args.id);
    if (!folder) {
      throw new ConvexError("Folder not found");
    }
    if (folder.ownerId !== user.tokenIdentifier) {
      throw new ConvexError("Forbidden");
    }

    // Recursive helper function to delete folder and all its contents
    const deleteFolderRecursively = async (folderId: Id<"folders">) => {
      // Get all subfolders
      const subFolders = await ctx.db
        .query("folders")
        .withIndex("by_parent_folder_id", q => q.eq("parentFolderId", folderId))
        .collect();

      // Recursively delete all subfolders
      for (const subFolder of subFolders) {
        await deleteFolderRecursively(subFolder._id);
      }

      // Get all documents in this folder
      const documents = await ctx.db
        .query("documents")
        .withIndex("by_parent_folder_id", q => q.eq("parentFolderId", folderId))
        .collect();

      // Delete all documents in this folder
      for (const document of documents) {
        await ctx.db.delete(document._id);
      }

      // Finally, delete the folder itself
      await ctx.db.delete(folderId);
    };

    await deleteFolderRecursively(args.id);
  },
});

export const updateById = mutation({
  args: {
    id: v.id("folders"),
    name: v.optional(v.string()),
    parentFolderId: v.optional(v.union(v.id("folders"), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const folder = await ctx.db.get(args.id);
    if (!folder) {
      throw new ConvexError("Folder not found");
    }
    if (folder.ownerId !== user.tokenIdentifier) {
      throw new ConvexError("Forbidden");
    }

    // Check for circular dependencies when moving folders
    if (args.parentFolderId !== undefined) {
      if (args.parentFolderId !== null) {
        const isCircular = await checkCircularDependency(ctx, args.id, args.parentFolderId);
        if (isCircular) {
          throw new ConvexError("Cannot move folder into itself or its descendants");
        }
      }
    }

    const updateData: Partial<{ name: string; parentFolderId: Id<"folders"> | null }> = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.parentFolderId !== undefined) {
      updateData.parentFolderId = args.parentFolderId;
    }

    await ctx.db.patch(args.id, updateData);
  },
});

// Helper function to check for circular dependencies
async function checkCircularDependency(
  ctx: {
    db: { get: (id: Id<"folders">) => Promise<{ parentFolderId: Id<"folders"> | null } | null> };
  },
  folderId: Id<"folders">,
  targetParentId: Id<"folders">
): Promise<boolean> {
  // Can't move folder into itself
  if (folderId === targetParentId) {
    return true;
  }

  // Check if targetParentId is a descendant of folderId
  let currentId: Id<"folders"> | null = targetParentId;
  while (currentId) {
    if (currentId === folderId) {
      return true;
    }
    const parent = await ctx.db.get(currentId);
    currentId = parent?.parentFolderId ?? null;
  }

  return false;
}
