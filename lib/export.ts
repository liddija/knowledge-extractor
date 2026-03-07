import JSZip from "jszip";
import { SOP, Pattern, PromptTemplate } from "./types";

function sopToMarkdown(sop: SOP): string {
  let md = `# ${sop.title}\n\n`;
  md += `**When to use:** ${sop.trigger}\n\n`;
  md += `## Steps\n\n`;
  sop.steps.forEach((step, i) => {
    md += `${i + 1}. ${step}\n`;
  });
  if (sop.tools.length > 0) {
    md += `\n## Tools & Resources\n\n`;
    sop.tools.forEach((tool) => {
      md += `- ${tool}\n`;
    });
  }
  md += `\n## Expected Outcome\n\n${sop.expectedOutcome}\n`;
  md += `\n---\n*Extracted from: ${sop.sourceConversations.join(", ")}*\n`;
  return md;
}

function patternToMarkdown(pattern: Pattern): string {
  let md = `# ${pattern.name}\n\n`;
  md += `**Frequency:** ~${pattern.frequency} occurrences\n\n`;
  md += `${pattern.description}\n\n`;
  if (pattern.decisions.length > 0) {
    md += `## Key Decisions\n\n`;
    pattern.decisions.forEach((d) => {
      md += `- ${d}\n`;
    });
  }
  if (pattern.insights.length > 0) {
    md += `\n## Insights\n\n`;
    pattern.insights.forEach((insight) => {
      md += `- ${insight}\n`;
    });
  }
  return md;
}

function promptToMarkdown(prompt: PromptTemplate): string {
  let md = `# ${prompt.title}\n\n`;
  md += `**Use case:** ${prompt.useCase}\n\n`;
  md += `## Template\n\n\`\`\`\n${prompt.template}\n\`\`\`\n\n`;
  if (prompt.variables.length > 0) {
    md += `## Variables\n\n`;
    prompt.variables.forEach((v) => {
      md += `- \`{{${v}}}\`: [describe]\n`;
    });
  }
  md += `\n## Original Prompt\n\n> ${prompt.originalPrompt}\n`;
  return md;
}

export async function exportToZip(
  sops: SOP[],
  patterns: Pattern[],
  prompts: PromptTemplate[]
): Promise<Blob> {
  const zip = new JSZip();

  // SOPs folder
  const sopsFolder = zip.folder("sops")!;
  sops.forEach((sop, i) => {
    const filename = `${String(i + 1).padStart(2, "0")}-${sop.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}.md`;
    sopsFolder.file(filename, sopToMarkdown(sop));
  });

  // Patterns folder
  const patternsFolder = zip.folder("patterns")!;
  patterns.forEach((pattern, i) => {
    const filename = `${String(i + 1).padStart(2, "0")}-${pattern.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}.md`;
    patternsFolder.file(filename, patternToMarkdown(pattern));
  });

  // Prompts folder
  const promptsFolder = zip.folder("prompt-templates")!;
  prompts.forEach((prompt, i) => {
    const filename = `${String(i + 1).padStart(2, "0")}-${prompt.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 50)}.md`;
    promptsFolder.file(filename, promptToMarkdown(prompt));
  });

  // Summary index file
  let index = `# Knowledge Extraction Report\n\n`;
  index += `Generated: ${new Date().toISOString().split("T")[0]}\n\n`;
  index += `## Summary\n\n`;
  index += `- **${sops.length}** Standard Operating Procedures\n`;
  index += `- **${patterns.length}** Patterns Identified\n`;
  index += `- **${prompts.length}** Reusable Prompt Templates\n\n`;

  if (sops.length > 0) {
    index += `## SOPs\n\n`;
    sops.forEach((sop, i) => {
      index += `${i + 1}. **${sop.title}** — ${sop.trigger}\n`;
    });
    index += `\n`;
  }

  if (patterns.length > 0) {
    index += `## Patterns\n\n`;
    patterns.forEach((pattern, i) => {
      index += `${i + 1}. **${pattern.name}** (~${pattern.frequency}x) — ${pattern.description.slice(0, 80)}...\n`;
    });
    index += `\n`;
  }

  if (prompts.length > 0) {
    index += `## Prompt Templates\n\n`;
    prompts.forEach((prompt, i) => {
      index += `${i + 1}. **${prompt.title}** — ${prompt.useCase}\n`;
    });
  }

  zip.file("README.md", index);

  return zip.generateAsync({ type: "blob" });
}
