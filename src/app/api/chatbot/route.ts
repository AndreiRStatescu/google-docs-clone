import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message, mode } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!mode || (mode !== "ask" && mode !== "write")) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    }

    // Call OpenAI API with gpt-4o-mini model
    // Note: As of December 2025, gpt-4o-mini is the latest nano model available
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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

    const responseText = completion.choices[0]?.message?.content || "No response generated";

    return NextResponse.json({ response: responseText });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response", details: error.message },
      { status: 500 }
    );
  }
}
