import { ConvexError, v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const getByParentFolderId = query({
  args: { parentFolderId: v.optional(v.string()) },
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
    parentFolderId: v.optional(v.string()),
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
    parentFolderId: v.optional(v.union(v.string(), v.null())),
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
    if (args.parentFolderId !== undefined && args.parentFolderId !== null) {
      const isCircular = await checkCircularDependency(
        ctx,
        args.id,
        args.parentFolderId as Id<"folders">
      );
      if (isCircular) {
        throw new ConvexError("Cannot move folder into itself or its descendants");
      }
    }

    const updateData: any = {};
    if (args.name !== undefined) {
      updateData.name = args.name;
    }
    if (args.parentFolderId !== undefined) {
      updateData.parentFolderId = args.parentFolderId === null ? undefined : args.parentFolderId;
    }

    await ctx.db.patch(args.id, updateData);
  },
});

// Helper function to check for circular dependencies
async function checkCircularDependency(
  ctx: any,
  folderId: Id<"folders">,
  targetParentId: Id<"folders">
): Promise<boolean> {
  // Can't move folder into itself
  if (folderId === targetParentId) {
    return true;
  }

  // Check if targetParentId is a descendant of folderId
  let currentId: string | undefined = targetParentId;
  while (currentId) {
    if (currentId === folderId) {
      return true;
    }
    const parent: any = await ctx.db.get(currentId as Id<"folders">);
    currentId = parent?.parentFolderId;
  }

  return false;
}
