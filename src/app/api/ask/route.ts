import { NextRequest, NextResponse } from "next/server";

export type AskSource = {
  type?: string;
  title?: string;
  id?: string;
  url?: string;
};

export type AskResponseBody = {
  answer: string;
  sources?: AskSource[];
  recipe?: string;
};

type AskRequestBody = {
  question?: unknown;
};

const orchestratorBase =
  process.env.ORCHESTRATOR_INTERNAL_URL?.trim() || "http://localhost:8090";
const orchestratorKey = process.env.ORCHESTRATOR_API_KEY?.trim() || "";
const mockEnabled = process.env.ORCHESTRATOR_MOCK?.trim() === "true";

function mockAnswer(question: string): AskResponseBody {
  return {
    answer:
      "The orchestrator is running in mock mode, so this is a placeholder reply. " +
      `You asked: “${question}”. Wire ORCHESTRATOR_INTERNAL_URL to the Python backend when it is ready.`,
    sources: [],
    recipe: "kt-qa",
  };
}

export async function POST(req: NextRequest) {
  let body: AskRequestBody;
  try {
    body = (await req.json()) as AskRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const question =
    typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }
  if (question.length > 4000) {
    return NextResponse.json(
      { error: "question is too long (max 4000 characters)" },
      { status: 400 }
    );
  }

  if (mockEnabled) {
    return NextResponse.json(mockAnswer(question));
  }

  const idempotencyKey =
    req.headers.get("idempotency-key")?.trim() || crypto.randomUUID();
  const visitorId = req.headers.get("x-visitor-id")?.trim() || "";

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };
  if (orchestratorKey) {
    headers.Authorization = `Bearer ${orchestratorKey}`;
  }
  if (visitorId) {
    headers["X-Visitor-Id"] = visitorId;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${orchestratorBase}/v1/kt/ask`, {
      method: "POST",
      headers,
      body: JSON.stringify({ question, recipe: "kt-qa" }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Orchestrator unreachable. Set ORCHESTRATOR_INTERNAL_URL or ORCHESTRATOR_MOCK=true for local UI work.",
      },
      { status: 502 }
    );
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson
    ? await upstream.json().catch(() => ({}))
    : { error: await upstream.text().catch(() => upstream.statusText) };

  if (!upstream.ok) {
    const message =
      typeof payload === "object" &&
      payload &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : upstream.statusText || "Orchestrator request failed";

    const res = NextResponse.json({ error: message }, { status: upstream.status });
    const retryAfter = upstream.headers.get("retry-after");
    if (retryAfter) res.headers.set("Retry-After", retryAfter);
    return res;
  }

  const data = payload as AskResponseBody;
  if (!data || typeof data.answer !== "string") {
    return NextResponse.json(
      { error: "Orchestrator returned an unexpected payload" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    answer: data.answer,
    sources: data.sources ?? [],
    recipe: data.recipe ?? "kt-qa",
  } satisfies AskResponseBody);
}
