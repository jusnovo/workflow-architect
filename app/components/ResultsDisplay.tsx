"use client";

import Mermaid from "./Mermaid";
import { WorkflowResult } from "./types";

interface ResultsDisplayProps {
  result: WorkflowResult | null;
  loading: boolean;
  error: string | null;
  onExport: () => void;
  onShare: () => void;
  copyText: string;
}

export default function ResultsDisplay({
  result,
  loading,
  error,
  onExport,
  onShare,
  copyText,
}: any) {
  if (error) {
    return (
      <div className="pt-4 border-t">
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md text-center max-w-md mx-auto">
          <p className="font-semibold mb-1">Something went wrong</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!result && !loading) {
    return (
      <div className="pt-4 border-t">
        <p className="text-gray-400 text-center">
          Generate an architecture to see results
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pt-4 border-t">
        <p className="text-center text-gray-500 animate-pulse">Generating...</p>
      </div>
    );
  }

  return (
    <div className="pt-4 border-t space-y-0">
      {result && !result.fallback && (
        <div
          id="export-target"
          className="bg-white text-black px-6 py-6 max-w-[900px] mx-auto break-inside-avoid"
        >
          <div className="space-y-0">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Solution overview
            </h2>
          </div>

          {result?.mermaidSyntax && (
            <div className="break-inside-avoid">
              <h2 className="text-lg font-semibold mb-2 mt-8">
                Architecture diagram
              </h2>
              <div className="bg-white p-6 border rounded-lg flex justify-center">
                <div>
                  <div className="flex justify-center">
                    <Mermaid chart={result.mermaidSyntax} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {result?.toolStack && (
            <div className="print-section">
              <h2 className="text-lg font-semibold mb-2 mt-8">Tool Stack</h2>
              <div className="grid grid-cols-2 gap-4">
                {result.toolStack.map((tool: any, i: number) => (
                  <div
                    key={i}
                    className="p-4 border rounded-xl shadow-sm hover:shadow-md transition break-inside-avoid"
                  >
                    <div className="text-sm font-semibold">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.role}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result?.workflowSteps && (
            <div className="print-section">
              <h2 className="text-lg font-semibold mb-2 mt-8">
                Workflow Steps
              </h2>
              <div className="space-y-3">
                {result.workflowSteps.map((step: any) => (
                  <div
                    key={step.id}
                    className="border-l-2 pl-4 py-2 break-inside-avoid"
                  >
                    <div className="text-sm font-medium">
                      {step.id}. {step.title}
                    </div>

                    <div className="text-xs text-gray-500">
                      {step.phase} • {step.tool}
                    </div>

                    <div className="text-sm text-gray-700">
                      {step.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result?.whyThisArchitecture && (
            <div className="print-section">
              <h2 className="text-lg font-semibold mb-2 mt-8">
                Why this architecture?
              </h2>
              <p className="text-sm text-gray-700">
                {result.whyThisArchitecture}
              </p>
            </div>
          )}

          {result?.tradeoffs && (
            <div className="print-section">
              <h2 className="text-lg font-semibold mb-2 mt-8">Tradeoffs</h2>
              <p className="text-sm text-gray-700">{result.tradeoffs}</p>
            </div>
          )}

          {result?.risks && (
            <div className="print-section space-y-3">
              <h2 className="text-lg font-semibold mb-2 mt-8">Risks</h2>

              <ul className="space-y-2">
                {result.risks.map((risk: any, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-sm text-black">•</span>

                    <div>
                      <span className="text-sm font-medium">{risk.title}:</span>{" "}
                      <span className="text-sm text-gray-600">
                        {risk.description}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result?.timeline && (
            <div className="print-section space-y-3">
              <h2 className="text-lg font-semibold mb-2 mt-8">Timeline</h2>
              <div className="space-y-3">
                {result.timeline.breakdown?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="border-l-2 border-black pl-4 py-2 flex items-center justify-between w-full break-inside-avoid"
                  >
                    <div className="text-sm font-medium w-1/3 text-left">
                      {item.phase}
                    </div>
                    <div className="text-sm text-gray-600 w-1/3 text-left whitespace-nowrap">
                      {item.complexity}
                    </div>
                    <div className="text-sm text-gray-600w-1/3 text-right whitespace-nowrap">
                      {item.duration}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-3 flex items-center justify-between w-full text-sm font-semibold">
                <div className="text-left">Total timeline</div>
                <div className="w-1/3 text-right">{result.timeline.total}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {result?.fallback && (
        <div className="bg-red-100 p-4 rounded mt-4">
          <h2 className="font-semibold">Fallback response</h2>
          <pre className="text-xs overflow-auto">{result.raw}</pre>
        </div>
      )}

      {result && !result.fallback && (
        <div className="flex justify-end gap-3 relative z-10 no-print mt-8">
          <button
            onClick={onShare}
            className="text-sm px-4 py-2 bg-gray-100 text-black rounded-md border border-gray-200 hover:bg-gray-200 transition font-medium"
          >
            {copyText}
          </button>

          <button
            onClick={onExport}
            className="text-sm px-4 py-2 bg-gray-100 text-black rounded-md border border-gray-200 hover:bg-gray-200 transition font-medium"
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
