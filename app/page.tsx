"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProjectForm from "./components/ProjectForm";
import ResultsDisplay from "./components/ResultsDisplay";
import { Constraints, WorkflowResult } from "./components/types";

function HomeContent() {
  const [industry, setIndustry] = useState<string>("E-commerce");
  const [problem, setProblem] = useState<string>("");
  const [constraints, setConstraints] = useState<Constraints>({
    team: "no-team",
    budget: "low",
    tools: [],
  });

  const [result, setResult] = useState<WorkflowResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState("Copy link");

  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const configParam = searchParams.get("config");
    if (configParam) {
      try {
        const decoded = JSON.parse(atob(configParam));
        setIndustry(decoded.industry);
        setProblem(decoded.problem);
        setConstraints(decoded.constraints);

        handleGenerate(decoded);
      } catch (e) {
        console.error("Failed to parse config from URL");
      }
    }
  }, [searchParams]);

  const handleGenerate = async (autoParams?: any) => {
    setLoading(true);
    setResult(null);
    setError(null);

    const payload =
      autoParams && autoParams.industry
        ? autoParams
        : { industry, problem, constraints };

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to generate architecture. Please try again.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const stateToSave = { industry, problem, constraints };
    const base64State = btoa(JSON.stringify(stateToSave));
    const shareUrl = `${window.location.origin}${pathname}?config=${base64State}`;

    navigator.clipboard.writeText(shareUrl);
    setCopyText("Copied!");
    setTimeout(() => setCopyText("Copy link"), 2000);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      <div className="no-print">
        <h1 className="text-3xl font-semibold text-center mb-0">
          Workflow Architect
        </h1>

        <ProjectForm
          industry={industry}
          setIndustry={setIndustry}
          problem={problem}
          setProblem={setProblem}
          constraints={constraints}
          setConstraints={setConstraints}
        />

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !problem.trim()}
            className="bg-black text-white px-5 py-2 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate architecture"}
          </button>
        </div>
      </div>

      <ResultsDisplay
        result={result}
        loading={loading}
        error={error}
        onExport={handleExport}
        onShare={handleShare}
        copyText={copyText}
      />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense
        fallback={
          <div className="text-center py-12 text-gray-500">
            Loading application...
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  );
}
