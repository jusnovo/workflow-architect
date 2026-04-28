export interface Constraints {
  team: string;
  budget: string;
  tools: string[];
}

export interface WorkflowResult {
  fallback?: boolean;
  raw?: string;
  mermaidSyntax?: string;
  toolStack?: Array<{ name: string; role: string }>;
  workflowSteps?: Array<{
    id: number;
    title: string;
    phase: string;
    tool: string;
    description: string;
  }>;
  whyThisArchitecture?: string;
  tradeoffs?: string;
  risks?: Array<{ title: string; description: string }>;
  timeline?: {
    breakdown: Array<{ phase: string; duration: string }>;
    total: string;
  };
}
