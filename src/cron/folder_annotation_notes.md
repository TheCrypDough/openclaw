# Folder Annotation

- **Path:** `src/cron`
- **Folder role:** Core application source (gateway, CLI, providers, channels)
- **Contains:** 2 folders, 49 files

## Purpose
This folder stores components that collectively support the role above.

## System effect
Changes in this folder influence the runtime behavior of its subsystem and can alter how user requests, integrations, or tooling are processed.

## Contents overview
### Subfolders
- service/
- isolated-agent/
### Files
- session-reaper.test.ts
- isolated-agent.skips-delivery-without-whatsapp-recipient-besteffortdeliver-true.e2e.test.ts
- schedule.ts
- service.read-ops-nonblocking.test.ts
- store.ts
- service.every-jobs-fire.test.ts
- webhook-url.ts
- service.jobs.test.ts
- isolated-agent.delivery-target-thread-session.test.ts
- payload-migration.ts
- service.ts
- service.prevents-duplicate-timers.test.ts
- service.issue-16156-list-skips-cron.test.ts
- service.issue-regressions.test.ts
- isolated-agent.delivers-response-has-heartbeat-ok-but-includes.test.ts
- run-log.ts
- service.store.migration.test.ts
- validate-timestamp.ts
- service.issue-17852-daily-skip.test.ts
- service.delivery-plan.test.ts
- service.store-migration.test.ts
- service.restart-catchup.test.ts
- store.test.ts
- isolated-agent.mocks.ts
- delivery.test.ts
- normalize.ts
- run-log.test.ts
- service.get-job.test.ts
- service.skips-main-jobs-empty-systemevent-text.test.ts
- service.issue-13992-regression.test.ts
- service.persists-delivered-status.test.ts
- isolated-agent.test-setup.ts
- session-reaper.ts
- service.rearm-timer-when-running.test.ts
- delivery.ts
- stagger.test.ts
- isolated-agent.uses-last-non-empty-agent-text-as.e2e.test.ts
- service.runs-one-shot-main-job-disables-it.test.ts
- types.ts
- schedule.test.ts
- cron-protocol-conformance.test.ts
- parse.ts
- stagger.ts
- service.test-harness.ts
- normalize.test.ts
- legacy-delivery.ts
- service.jobs.top-of-hour-stagger.test.ts
- isolated-agent.ts
- isolated-agent.test-harness.ts

