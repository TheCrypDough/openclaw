/*
 * AUTO ANNOTATION
 * File: vendor/a2ui/specification/0.9/eval/src/evaluator.ts
 * Purpose: File in vendor area for project orchestration/configuration/data.
 * Module area: Vendored third-party code/assets (e.g., bundled UI runtime)
 * System effect: Change can influence vendored third-party code/assets (e.g., bundled ui runtime) and therefore affects build/runtime behavior indirectly.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { evaluationFlow } from "./evaluation_flow";
import { ValidatedResult, EvaluatedResult } from "./types";
import { logger } from "./logger";
import { rateLimiter } from "./rateLimiter";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import { IssueSeverity } from "./types";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
export class Evaluator {
  constructor(
    private schemas: any,
    private evalModel: string,
    private outputDir?: string
  ) {}

  async run(results: ValidatedResult[]): Promise<EvaluatedResult[]> {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const passedResults = results.filter(
      (r) => r.validationErrors.length === 0 && r.components
    );
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const skippedCount = results.length - passedResults.length;

    logger.info(
      `Starting Phase 3: LLM Evaluation (${passedResults.length} items to evaluate, ${skippedCount} skipped due to validation failure)`
    );

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const totalJobs = passedResults.length;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let completedCount = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    let failedCount = 0;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const evaluatedResults: EvaluatedResult[] = [];

    // Initialize results with skipped items
    for (const result of results) {
      if (result.validationErrors.length > 0) {
        evaluatedResults.push({
          ...result,
          evaluationResult: {
            pass: false,
            reason: "Schema validation failure",
            issues: [
              {
                issue: result.validationErrors.join("\n"),
                severity: "criticalSchema",
              },
            ],
            overallSeverity: "criticalSchema",
          },
        });
      } else if (!result.components) {
        evaluatedResults.push({ ...result });
      }
    }

    if (totalJobs === 0) {
      logger.info("Phase 3: Evaluation Complete (No items to evaluate)");
      return evaluatedResults;
    }

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const progressInterval = setInterval(() => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const queuedCount = rateLimiter.waitingCount;
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
      const inProgressCount =
        totalJobs - completedCount - failedCount - queuedCount;
      const pct = Math.round(
        ((completedCount + failedCount) / totalJobs) * 100
      );
      process.stderr.write(
        `\r[Phase 3] Progress: ${pct}% | Completed: ${completedCount} | In Progress: ${inProgressCount} | Queued: ${queuedCount} | Failed: ${failedCount}          `
      );
    }, 1000);

    const promises = passedResults.map((result) =>
      this.runJob(result).then((evalResult) => {
        if (evalResult.evaluationResult) {
          completedCount++;
        } else {
          failedCount++; // Failed to run evaluation flow (e.g. error)
        }
        evaluatedResults.push(evalResult);
        return evalResult;
      })
    );

    await Promise.all(promises);
    clearInterval(progressInterval);
    process.stderr.write("\n");
    logger.info("Phase 3: Evaluation Complete");

    return evaluatedResults;
  }

  private async runJob(result: ValidatedResult): Promise<EvaluatedResult> {
    const maxEvalRetries = 3;
    let evaluationResult:
      | {
          pass: boolean;
          reason: string;
          issues?: { issue: string; severity: IssueSeverity }[];
        }
      | undefined;

    for (let evalRetry = 0; evalRetry < maxEvalRetries; evalRetry++) {
      try {
        evaluationResult = await evaluationFlow({
          originalPrompt: result.prompt.promptText,
          generatedOutput: result.rawText || "",
          evalModel: this.evalModel,
          schemas: this.schemas,
        });
        break;
      } catch (e: any) {
        if (evalRetry === maxEvalRetries - 1) {
          logger.warn(
            `Evaluation failed for ${result.prompt.name} run ${result.runNumber}: ${e.message}`
          );
          evaluationResult = {
            pass: false,
            reason: `Evaluation flow failed: ${e.message}`,
          };
        } else {
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, evalRetry))
          );
        }
      }
    }

    let overallSeverity: IssueSeverity | undefined;
    if (evaluationResult && !evaluationResult.pass && evaluationResult.issues) {
      const severities = evaluationResult.issues.map((i) => i.severity);
      if (severities.includes("critical")) {
        overallSeverity = "critical";
      } else if (severities.includes("significant")) {
        overallSeverity = "significant";
      } else if (severities.includes("minor")) {
        overallSeverity = "minor";
      }
    }

    if (this.outputDir && evaluationResult) {
      this.saveEvaluation(result, evaluationResult, overallSeverity);
    }

    return {
      ...result,
      evaluationResult: evaluationResult
        ? { ...evaluationResult, overallSeverity }
        : undefined,
    };
  }

  private saveEvaluation(
    result: ValidatedResult,
    evaluationResult: {
      pass: boolean;
      reason: string;
      issues?: { issue: string; severity: IssueSeverity }[];
      evalPrompt?: string;
    },
    overallSeverity?: IssueSeverity
  ) {
    if (!this.outputDir) return;

    // Only save if the evaluation failed
    if (evaluationResult.pass) return;

    const modelDir = path.join(
      this.outputDir,
      `output-${result.modelName.replace(/[\/:]/g, "_")}`
    );
    const detailsDir = path.join(modelDir, "details");
    fs.writeFileSync(
      path.join(
        detailsDir,
        `${result.prompt.name}.${result.runNumber}.failed.yaml`
      ),
      yaml.dump({ ...evaluationResult, overallSeverity })
    );

    if (evaluationResult.evalPrompt) {
      fs.writeFileSync(
        path.join(
          detailsDir,
          `${result.prompt.name}.${result.runNumber}.eval_prompt.txt`
        ),
        evaluationResult.evalPrompt
      );
    }
  }
}
