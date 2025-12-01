import { NextResponse } from "next/server";
import OpenAI from "openai";
import { MODEL_GPT_5_NANO } from "../../constants/chatbot-options";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function callGpt5Model(message: string, mode: string, model: string) {
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content:
          mode === "ask"
            ? "You are a helpful assistant that answers questions concisely and accurately."
            : "You are a helpful writing assistant that helps users create content. Provide clear, well-written responses.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    max_completion_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || "No response generated";
}

async function callGpt4Model(message: string, mode: string, model: string) {
  const completion = await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content:
          mode === "ask"
            ? "You are a helpful assistant that answers questions concisely and accurately."
            : "You are a helpful writing assistant that helps users create content. Provide clear, well-written responses.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0]?.message?.content || "No response generated";
}

export async function POST(request: Request) {
  try {
    const { message, mode, model } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!mode || (mode !== "ask" && mode !== "write")) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    const selectedModel = model || MODEL_GPT_5_NANO;
    if (!selectedModel.startsWith("gpt-4") && !selectedModel.startsWith("gpt-5")) {
      return NextResponse.json(
        {
          error:
            "Invalid model. Supported models: any gpt-4 variant (e.g., gpt-4, gpt-4-turbo, gpt-4.1, gpt-4.1-mini, gpt-4.1-nano) and any gpt-5 variant (e.g., gpt-5-nano, gpt-5, gpt-5-mini, gpt-5.1)",
        },
        { status: 400 }
      );
    }

    // Dispatcher: call the appropriate function based on model
    let responseText;
    if (selectedModel.startsWith("gpt-5")) {
      responseText = await callGpt5Model(message, mode, selectedModel);
    } else {
      responseText = await callGpt4Model(message, mode, selectedModel);
    }

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
