/*
 * AUTO ANNOTATION
 * File: scripts/sqlite-vec-smoke.mjs
 * Purpose: Operational script for maintenance/build/release/test workflows (sqlite-vec-smoke.mjs).
 * Module area: Repo utility, build, release, and maintenance scripts
 * System effect: Used by developers/CI to automate setup, checks, packaging, and diagnostics.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { DatabaseSync } from "node:sqlite";
import { load, getLoadablePath } from "sqlite-vec";

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
function vec(values) {
  return Buffer.from(new Float32Array(values).buffer);
}

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const db = new DatabaseSync(":memory:", { allowExtension: true });

try {
  load(db);
} catch (err) {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
  const message = err instanceof Error ? err.message : String(err);
  console.error("sqlite-vec load failed:");
  console.error(message);
  console.error("expected extension path:", getLoadablePath());
  process.exit(1);
}

db.exec(`
  CREATE VIRTUAL TABLE v USING vec0(
    id TEXT PRIMARY KEY,
    embedding FLOAT[4]
  );
`);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const insert = db.prepare("INSERT INTO v (id, embedding) VALUES (?, ?)");
insert.run("a", vec([1, 0, 0, 0]));
insert.run("b", vec([0, 1, 0, 0]));
insert.run("c", vec([0.2, 0.2, 0, 0]));

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const query = vec([1, 0, 0, 0]);
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
const rows = db
  .prepare("SELECT id, vec_distance_cosine(embedding, ?) AS dist FROM v ORDER BY dist ASC")
  .all(query);

console.log("sqlite-vec ok");
console.log(rows);
