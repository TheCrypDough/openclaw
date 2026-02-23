/*
 * AUTO ANNOTATION
 * File: scripts/copy-export-html-templates.ts
 * Purpose: Operational script for maintenance/build/release/test workflows (copy-export-html-templates.ts).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
#!/usr/bin/env tsx
/**
 * Copy export-html templates from src to dist
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const projectRoot = path.resolve(__dirname, "..");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const srcDir = path.join(projectRoot, "src", "auto-reply", "reply", "export-html");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const distDir = path.join(projectRoot, "dist", "export-html");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function copyExportHtmlTemplates() {
  if (!fs.existsSync(srcDir)) {
    console.warn("[copy-export-html-templates] Source directory not found:", srcDir);
    return;
  }

  // Create dist directory
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Copy main template files
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const templateFiles = ["template.html", "template.css", "template.js"];
  for (const file of templateFiles) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const srcFile = path.join(srcDir, file);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const distFile = path.join(distDir, file);
    if (fs.existsSync(srcFile)) {
      fs.copyFileSync(srcFile, distFile);
      console.log(`[copy-export-html-templates] Copied ${file}`);
    }
  }

  // Copy vendor files
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const srcVendor = path.join(srcDir, "vendor");
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const distVendor = path.join(distDir, "vendor");
  if (fs.existsSync(srcVendor)) {
    if (!fs.existsSync(distVendor)) {
      fs.mkdirSync(distVendor, { recursive: true });
    }
    const vendorFiles = fs.readdirSync(srcVendor);
    for (const file of vendorFiles) {
      const srcFile = path.join(srcVendor, file);
      const distFile = path.join(distVendor, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, distFile);
        console.log(`[copy-export-html-templates] Copied vendor/${file}`);
      }
    }
  }

  console.log("[copy-export-html-templates] Done");
}

copyExportHtmlTemplates();
