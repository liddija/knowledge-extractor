import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { apiKey, provider, systemPrompt, userContent } = await req.json();

  if (!apiKey || !systemPrompt || !userContent) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userContent }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${err}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const content = data.content?.[0]?.text || "";
    return NextResponse.json({ content });
  }

  // Fallback: proxy OpenAI calls too (in case of CORS issues)
  if (provider === "openai") {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { error: `OpenAI API error: ${err}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const content = data.choices[0].message.content;
    return NextResponse.json({ content });
  }

  return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
}
