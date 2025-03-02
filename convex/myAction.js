

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { action } from "./_generated/server.js";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText:v.any(),
    fileId:v.string(),
  },
  handler: async (ctx,args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText, //array
      args.fileId, //string
      new GoogleGenerativeAIEmbeddings({
        apiKey:"AIzaSyDs125UAeLxofkBAGc5eXff6NyXLbD4DoQ",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
     
    );
     return "completed.."
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(new GoogleGenerativeAIEmbeddings(
      {
        apiKey:"AIzaSyDs125UAeLxofkBAGc5eXff6NyXLbD4DoQ",
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }
    ), { ctx });


    const resultOne = await vectorStore.similaritySearch(args.query, 1);
    console.log(resultOne);
    return JSON.stringify(resultOne);
  },
});