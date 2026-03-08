import JSZip from "jszip";
import { SOP } from "./types";

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

export async function exportToZip(sops: SOP[]): Promise<Blob> {
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

  // Summary index file
  let index = `# SOP Extraction Report\n\n`;
  index += `Generated: ${new Date().toISOString().split("T")[0]}\n\n`;
  index += `## Summary\n\n`;
  index += `**${sops.length}** Standard Operating Procedures extracted.\n\n`;

  if (sops.length > 0) {
    index += `## SOPs\n\n`;
    sops.forEach((sop, i) => {
      index += `${i + 1}. **${sop.title}** — ${sop.trigger}\n`;
    });
  }

  zip.file("README.md", index);

  return zip.generateAsync({ type: "blob" });
}
