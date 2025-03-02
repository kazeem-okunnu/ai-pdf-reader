import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    userName: v.string(),
    upgrade: v.boolean()

  }),
  pdfFiles: defineTable({
    fileId: v.string(),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileUrl: v.string(),
    createdBy: v.string(),
  }),
  notes: defineTable({
    fileId: v.string(),
    notes: v.any(),
    createdBy: v.string(),
  }),
  documents: defineTable({
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 768,
  })

});

