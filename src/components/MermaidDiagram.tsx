"use client";

import { useEffect, useId, useRef, useState } from "react";
import mermaid from "mermaid";

let mermaidReady = false;

function ensureMermaid() {
  if (mermaidReady) return;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "dark",
    // Explicit metrics — `inherit` picks up neon fonts and skews label boxes.
    fontFamily:
      "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    themeVariables: {
      primaryColor: "#1a0a2e",
      primaryTextColor: "#eaf6ff",
      primaryBorderColor: "#3be8ff",
      lineColor: "#a855f7",
      secondaryColor: "#0b001b",
      tertiaryColor: "#120028",
      background: "#070012",
      mainBkg: "#120028",
      nodeBorder: "#3be8ff",
      clusterBkg: "#0b001b",
      titleColor: "#eaf6ff",
      edgeLabelBackground: "#0b001b",
      fontSize: "16px",
    },
    flowchart: {
      // SVG text avoids inheriting .md-content line-height / overflow-wrap.
      htmlLabels: false,
      curve: "basis",
      padding: 16,
      nodeSpacing: 40,
      rankSpacing: 50,
    },
  });
  mermaidReady = true;
}

type MermaidDiagramProps = {
  chart: string;
};

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const reactId = useId().replace(/:/g, "");
  const renderCount = useRef(0);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const source = chart.trim();
    if (!source) {
      setSvg(null);
      setError(null);
      return;
    }

    ensureMermaid();
    renderCount.current += 1;
    const renderId = `mermaid-${reactId}-${renderCount.current}`;

    mermaid
      .render(renderId, source)
      .then(({ svg: rendered }) => {
        if (cancelled) return;
        setSvg(rendered);
        setError(null);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setSvg(null);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      });

    return () => {
      cancelled = true;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <div className="md-mermaid md-mermaid-error" role="alert">
        <p className="neon-muted text-sm">Could not render Mermaid diagram.</p>
        <pre className="md-pre">
          <code>{chart.trim()}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="md-mermaid md-mermaid-loading neon-muted text-sm">
        Loading diagram…
      </div>
    );
  }

  return (
    <div
      className="md-mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
