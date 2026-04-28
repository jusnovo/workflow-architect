"use client";

import { Constraints } from "./types";

const INDUSTRIES = [
  "E-commerce",
  "SaaS",
  "Finance",
  "Healthcare",
  "Marketing",
  "Operations",
];

const TOOLS = [
  "Notion",
  "Slack",
  "HubSpot",
  "Salesforce",
  "Zapier",
  "Shopify",
  "Google Workspace",
  "Zendesk",
];

interface ProjectFormProps {
  industry: string;
  setIndustry: (industry: string) => void;
  problem: string;
  setProblem: (problem: string) => void;
  constraints: Constraints;
  setConstraints: (constraints: Constraints) => void;
}

export default function ProjectForm({
  industry,
  setIndustry,
  problem,
  setProblem,
  constraints,
  setConstraints,
}: ProjectFormProps) {
  return (
    <div>
      <div className="space-y-4 pt-6">
        <p className="text-base font-semibold text-center">
          Choose your industry
        </p>
        <div className="flex justify-center flex-wrap gap-3 mx-auto">
          {INDUSTRIES.map((item) => (
            <button
              key={item}
              onClick={() => setIndustry(item)}
              className={`px-4 py-1.5 text-sm rounded-full border transition-all duration-150 ${
                industry === item
                  ? "border-2 border-black font-medium"
                  : "border border-black/40 text-gray-700 hover:border-black"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <p className="text-base font-semibold text-center">
          Describe your business problem
        </p>
        <textarea
          placeholder="Describe your business problem..."
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="w-full p-3 border rounded-md text-sm"
        />
      </div>

      <div className="mt-5 space-y-1">
        <p className="text-base font-semibold text-center mb-3">
          Define constraints
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 ml-2">Team capacity</p>
            <select
              value={constraints.team}
              onChange={(e) =>
                setConstraints({ ...constraints, team: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="no-team">No technical team</option>
              <option value="small-team">Small technical team (1 – 3)</option>
              <option value="engineering">Dedicated engineering team</option>
            </select>
          </div>

          <div className="space-y-0.5">
            <p className="text-xs text-gray-500 ml-2">Budget</p>
            <select
              value={constraints.budget}
              onChange={(e) =>
                setConstraints({ ...constraints, budget: e.target.value })
              }
              className="w-full border rounded-md p-2 text-sm"
            >
              <option value="low">Low (free / &lt;$100)</option>
              <option value="medium">Medium ($100 – $1000)</option>
              <option value="high">High ($1000+)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-xs text-gray-500 ml-2 text-center">
            Existing tools
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            {TOOLS.map((tool) => {
              const isSelected = constraints.tools.includes(tool);
              return (
                <button
                  key={tool}
                  onClick={() => {
                    const updated = isSelected
                      ? constraints.tools.filter((t: string) => t !== tool)
                      : [...constraints.tools, tool];
                    setConstraints({ ...constraints, tools: updated });
                  }}
                  className={`px-3 py-1 text-sm rounded-full border transition-all ${
                    isSelected
                      ? "border-2 border-black"
                      : "border border-black/40 text-gray-700 hover:border-black"
                  }`}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
