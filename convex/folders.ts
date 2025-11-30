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
    name: v.string(),
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

    await ctx.db.patch(args.id, {
      name: args.name,
    });
  },
});
