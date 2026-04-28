"use client";

import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";

export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!chart) return;
    setHasError(false);

    try {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      const id = "mermaid-" + Math.random().toString(36).slice(2);

      mermaid
        .render(id, chart)
        .then(({ svg }) => {
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        })
        .catch((err) => {
          console.error("Mermaid syntax error:", err);
          setHasError(true);
        });
    } catch (error) {
      console.log("Mermaid init error:", error);
      setHasError(true);
    }
  }, [chart]);

  if (hasError) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-md text-sm text-center w-full">
        <p className="font-semibold">Diagram generation failed</p>
        <p className="text-xs mt-1 text-red-500">
          The AI generated invalid Mermaid syntax.
        </p>
        <pre className="mt-4 p-2 bg-white border border-red-100 text-left text-[10px] overflow-auto text-black">
          {chart}
        </pre>
      </div>
    );
  }

  return <div ref={ref} />;
}
