import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    initialContent: v.optional(v.string()),
    ownerId: v.string(),
    roomId: v.optional(v.string()),
    parentFolderId: v.union(v.id("folders"), v.null()),
    organizationId: v.optional(v.string()),
    updateTime: v.optional(v.number()),
    contentType: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .index("by_organization_id_and_update_time", ["organizationId", "updateTime"])
    .index("by_parent_folder_id", ["parentFolderId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["ownerId", "organizationId"],
    }),

  folders: defineTable({
    name: v.string(),
    ownerId: v.string(),
    parentFolderId: v.union(v.id("folders"), v.null()),
    organizationId: v.optional(v.string()),
  })
    .index("by_owner_id", ["ownerId"])
    .index("by_organization_id", ["organizationId"])
    .index("by_parent_folder_id", ["parentFolderId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["ownerId", "organizationId"],
    }),
});
