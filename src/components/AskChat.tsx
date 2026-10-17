"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { api, type AskSource } from "@/lib/api";
import { MarkdownContent } from "@/components/MarkdownContent";

type ChatRole = "user" | "assistant" | "system";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  sources?: AskSource[];
};

function newId() {
  return crypto.randomUUID();
}

type AskChatProps = {
  /** Optional heading above the chat surface */
  title?: string;
  subtitle?: string;
  className?: string;
};

export function AskChat({
  title,
  subtitle,
  className = "",
}: AskChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content:
        "Ask about my experience, skills or projects.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, sending]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || sending) return;

    setError(null);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: newId(), role: "user", content: question },
    ]);
    setSending(true);

    try {
      const res = await api.ask.question(question, newId());
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: res.answer,
          sources: res.sources,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to get an answer";
      setError(message);
      const quotaHint =
        /quota|rate limit|concurrency/i.test(message)
          ? message
          : "I could not reach the orchestrator for that question. Try again in a moment.";
      setMessages((prev) => [
        ...prev,
        {
          id: newId(),
          role: "assistant",
          content: quotaHint,
        },
      ]);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void onSubmit(e as unknown as FormEvent);
    }
  }

  return (
    <div className={`flex min-h-0 w-full flex-col ${className}`}>
      {(title || subtitle) && (
        <header className="shrink-0 text-center sm:text-left">
          {title ? (
            <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
          ) : null}
          {subtitle ? (
            <p className="neon-muted mt-1 text-sm">{subtitle}</p>
          ) : null}
        </header>
      )}

      <div
        className={`neon-surface flex min-h-[min(60vh,32rem)] flex-1 flex-col overflow-hidden ${
          title || subtitle ? "mt-4" : ""
        }`}
      >
        <div
          className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-5"
          aria-live="polite"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}
          {sending && (
            <div className="neon-muted flex items-center gap-2 text-sm">
              <span className="ask-typing-dot" aria-hidden />
              <span className="ask-typing-dot" aria-hidden />
              <span className="ask-typing-dot" aria-hidden />
              <span className="sr-only">Thinking</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={onSubmit}
          className="neon-divider border-t px-4 py-4 sm:px-5"
        >
          {error && (
            <p className="mb-3 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <div className="flex items-end gap-3">
            <label className="sr-only" htmlFor="ask-input">
              Your question
            </label>
            <textarea
              id="ask-input"
              ref={inputRef}
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={sending}
              placeholder="e.g. Do you have Kubernetes migration experience?"
              className="ask-input min-h-[2.75rem] flex-1 resize-none px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="neon-btn shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
          <p className="neon-muted-2 mt-2 text-xs">
            Enter to send · Shift+Enter for a new line
          </p>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "system") {
    return (
      <p className="neon-muted text-sm leading-relaxed">{message.content}</p>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[92%] sm:max-w-[85%] ${
          isUser ? "ask-bubble-user" : "ask-bubble-assistant"
        } px-3.5 py-2.5 text-sm leading-relaxed`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownContent content={message.content} className="ask-md" />
        )}
        {message.sources && message.sources.length > 0 && (
          <ul className="neon-muted mt-2 space-y-1 border-t border-white/10 pt-2 text-xs">
            {message.sources.map((s, i) => (
              <li key={`${s.id ?? s.title ?? i}`}>
                {[s.type, s.title].filter(Boolean).join(" · ") || "Source"}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
