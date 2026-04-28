import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { industry, problem, constraints } = body;

    const prompt = `
You are a senior Solutions Engineer designing production-ready integration architectures for enterprises. Given a business scenario, generate a practical and realistic solution that can be deployed within the given constraints using widely available tools.

CRITICAL OUTPUT REQUIREMENTS:
- Output MUST be strictly valid JSON
- Do NOT include markdown blocks (\`\`\`json) outside or inside the JSON
- All values MUST be valid JSON types (strings must be quoted)
- If you cannot fully comply with the schema, return an empty JSON object {}

The solution should:
- Use realistic, commonly used tools
- Take into consideration all given constraints (e.g. no dev team, budget, compliance)
- Be implementable (avoid purely theoretical solutions)
- Be extremely specific and professional, avoid generic or vague statements
- Avoid generic phrases such as "seamless integration", "enhanced efficiency", or "leveraging AI"

Return JSON in the following EXACT structure:
{
  "toolStack": [
    {
      "name": "string",
      "role": "string"
    }
  ],
  "workflowSteps": [
    {
      "id": number,
      "phase": "string",
      "title": "string",
      "description": "string",
      "tool": "string"
    }
  ],
  "complexity": "low" | "medium" | "high",
  "whyThisArchitecture": "string",
  "tradeoffs": "string",
  "risks": [
    {
      "title": "string",
      "description": "string"
    }
  ],
  "timeline": {
    "total": "string",
    "breakdown": [
      {
        "phase": "string",
        "complexity": "low" | "medium" | "high",
        "duration": "string"
      }
    ]
  },
  "mermaidSyntax": "string"
}

GUIDELINES:

TOOL STACK & WORKFLOW STEPS (CRITICAL CONSISTENCY)
- toolStack must contain between 3 and 6 tools.
- workflowSteps must contain 5–8 steps in logical order.
- CRITICAL: EVERY tool in the toolStack MUST be used in at least one workflow step.
- CRITICAL: EVERY workflow step MUST use exactly one tool from the toolStack (character-for-character match).

PHASES & LOGIC
- Use consistent phase names (e.g. Ingestion, Processing, Validation, Output)
- Where steps can occur in parallel or where logic branches, represent this explicitly
- Avoid forcing all workflows into a single linear chain if branching is more accurate

ARCHITECTURE JUSTIFICATION
- whyThisArchitecture: explain why this solution fits the constraints, maximum of 3 sentences explained in professional language
- tradeoffs: explicitly describe downsides and compromises (e.g. vendor lock-in), maximum of 3 sentences explained in professional language
- risks: 3-5 word titles, one short sentence description in non-technical language

TIMELINE
- timeline breakdown phases must describe implementation activities (e.g. "Tool setup", "User acceptance testing"), NOT system pipeline phases like "Ingestion"

MERMAID DIAGRAM (CRITICAL CONSISTENCY)
- The diagram MUST be a perfect 1:1 visual map of the workflowSteps array.
- Do NOT invent new nodes. EVERY node label MUST exactly match a title from workflowSteps.
- Generate a valid Mermaid flowchart using "graph TD"
- Node IDs must be unique, short, and camelCase.
- Define ALL nodes at the top level first using bracket notation: camelCaseId[Exact Step Title]
- Subgraphs MUST group steps by phase (Subgraph names must match phase names exactly).
- Place each node inside the correct subgraph using ONLY its camelCase ID.
- Connect nodes using ONLY standard flowchart arrows (-->) and ONLY their camelCase IDs.
- CRITICAL: Do NOT use sequence diagram arrows (->>). Do NOT use nested brackets.

SCENARIO:
Industry: ${industry}
Problem: ${problem}
Constraints: ${JSON.stringify(constraints)}
`;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a senior Solutions Engineer. You ALWAYS respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const text = completion.choices[0].message.content || "{}";

    try {
      const json = JSON.parse(text);
      return NextResponse.json(json);
    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      return NextResponse.json({ fallback: true, raw: text });
    }
  } catch (error) {
    console.error("API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to communicate with AI provider" },
      { status: 500 },
    );
  }
}
