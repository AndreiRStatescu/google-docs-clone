import { CONTENT_TYPE_REGULAR } from "@/app/constants/templates";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];
    for (const id of ids) {
      const document = await ctx.db.get(id);
      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id: id, name: "[Removed Document]" });
      }
    }
    return documents;
  },
});

export const getUserId = query({
  args: {},
  handler: async ctx => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }
    return user.tokenIdentifier;
  },
});

export const get = query({
  args: {
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { search, paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    if (search) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("search_title", q =>
          q.search("title", search).eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    } else {
      return await ctx.db
        .query("documents")
        .withIndex("by_organization_id", q => q.eq("organizationId", organizationId))
        .paginate(paginationOpts);
    }
  },
});

export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
    contentType: v.optional(v.string()),
    parentFolderId: v.optional(v.union(v.id("folders"), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    const documentId = await ctx.db.insert("documents", {
      title: args.title ?? "Untitled Document",
      ownerId: user.tokenIdentifier,
      organizationId: organizationId,
      initialContent: args.initialContent ?? "",
      contentType: args.contentType ?? CONTENT_TYPE_REGULAR,
      parentFolderId: args.parentFolderId ?? null,
    });

    return documentId;
  },
});

export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    if (document.ownerId !== user.tokenIdentifier) {
      throw new ConvexError("Forbidden");
    }

    await ctx.db.delete(args.id);
  },
});

export const removeByIds = mutation({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    // Validate ownership and delete all documents in a single transaction
    for (const id of args.ids) {
      const document = await ctx.db.get(id);
      if (!document) {
        throw new ConvexError(`Document ${id} not found`);
      }
      if (document.ownerId !== user.tokenIdentifier) {
        throw new ConvexError(`Forbidden to delete document ${id}`);
      }
      await ctx.db.delete(id);
    }
  },
});

export const updateById = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    updateTime: v.optional(v.number()),
    parentFolderId: v.optional(v.union(v.id("folders"), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    if (document.ownerId !== user.tokenIdentifier) {
      throw new ConvexError("Forbidden");
    }

    await ctx.db.patch(args.id, {
      ...(args.title !== undefined ? { title: args.title } : {}),
      ...(args.updateTime !== undefined ? { updateTime: args.updateTime } : {}),
      ...(args.parentFolderId !== undefined ? { parentFolderId: args.parentFolderId } : {}),
    });
  },
});

export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);
    if (!document) {
      throw new ConvexError("Document not found");
    }

    return document;
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

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_parent_folder_id", q => q.eq("parentFolderId", parentFolderId))
      .filter(q => q.eq(q.field("organizationId"), organizationId))
      .collect();

    // Sort documents alphabetically by title
    return documents.sort((a, b) => a.title.localeCompare(b.title));
  },
});

export const getRecent = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    const organizationId = user.organization_id
      ? (user.organization_id as string)
      : user.tokenIdentifier;

    // Fetch only documents with updateTime set, ordered by updateTime descending
    return await ctx.db
      .query("documents")
      .withIndex("by_organization_id_and_update_time", q => q.eq("organizationId", organizationId))
      .order("desc")
      .paginate(paginationOpts);
  },
});
