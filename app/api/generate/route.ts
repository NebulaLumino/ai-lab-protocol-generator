import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const SYSTEM_PROMPT = `You are an expert laboratory scientist and methodologist. Based on the user's input about their experiment type, available equipment, safety level, skill requirements, and sample count, generate a detailed laboratory protocol including:
1. Step-by-step protocol (numbered, detailed instructions)
2. Materials list (reagents, consumables, equipment with quantities)
3. Safety notes (hazard warnings, PPE requirements, disposal procedures)
4. Expected results (what success looks like, typical yields/ranges)
5. Troubleshooting guide (common failure modes and solutions)
6. Quality control checkpoints

Format output as structured markdown with clear headings. Be specific with concentrations, temperatures, and timings.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey, baseURL: "https://api.deepseek.com/v1" });
    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.75,
    });
    const output = completion.choices[0]?.message?.content || "No output generated.";
    return NextResponse.json({ output });
  } catch (error: unknown) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
