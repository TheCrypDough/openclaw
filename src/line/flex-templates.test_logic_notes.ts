/*
 * AUTO ANNOTATION
 * File: src/line/flex-templates.test.ts
 * Purpose: Implements core OpenClaw runtime behavior for core application source (gateway, cli, providers, channels).
 * Module area: Core application source (gateway, CLI, providers, channels)
 * System effect: When changed, core execution path for message, session, or provider behavior may change.
 * Marker: AUTOPLACEHOLDER_ANNOTATION
 */
import { describe, expect, it } from "vitest";
import {
  createInfoCard,
  createListCard,
  createImageCard,
  createActionCard,
  createCarousel,
  createEventCard,
  createDeviceControlCard,
} from "./flex-templates.js";

describe("createInfoCard", () => {
  it("includes footer when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const card = createInfoCard("Title", "Body", "Footer text");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const footer = card.footer as { contents: Array<{ text: string }> };
    expect(footer.contents[0].text).toBe("Footer text");
  });
});

describe("createListCard", () => {
  it("limits items to 8", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const items = Array.from({ length: 15 }, (_, i) => ({ title: `Item ${i}` }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const card = createListCard("List", items);

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = card.body as { contents: Array<{ type: string; contents?: unknown[] }> };
    // The list items are in the third content (after title and separator)
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const listBox = body.contents[2] as { contents: unknown[] };
    expect(listBox.contents.length).toBe(8);
  });
});

describe("createImageCard", () => {
  it("includes body text when provided", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const card = createImageCard("https://example.com/img.jpg", "Title", "Body text");

 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const body = card.body as { contents: Array<{ text: string }> };
    expect(body.contents.length).toBe(2);
    expect(body.contents[1].text).toBe("Body text");
  });
});

describe("createActionCard", () => {
  it("limits actions to 4", () => {
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const actions = Array.from({ length: 6 }, (_, i) => ({
      label: `Action ${i}`,
      action: { type: "message" as const, label: `A${i}`, text: `action${i}` },
    }));
 * AUTO SECTION NOTE: this declaration marks a core boundary in this module
    const card = createActionCard("Title", "Body", actions);

    const footer = card.footer as { contents: unknown[] };
    expect(footer.contents.length).toBe(4);
  });
});

describe("createCarousel", () => {
  it("limits to 12 bubbles", () => {
    const bubbles = Array.from({ length: 15 }, (_, i) => createInfoCard(`Card ${i}`, `Body ${i}`));
    const carousel = createCarousel(bubbles);

    expect(carousel.contents.length).toBe(12);
  });
});

describe("createDeviceControlCard", () => {
  it("limits controls to 6", () => {
    const card = createDeviceControlCard({
      deviceName: "Device",
      controls: Array.from({ length: 10 }, (_, i) => ({
        label: `Control ${i}`,
        data: `action=${i}`,
      })),
    });

    // Should have max 3 rows of 2 buttons
    const footer = card.footer as { contents: unknown[] };
    expect(footer.contents.length).toBeLessThanOrEqual(3);
  });
});

describe("createEventCard", () => {
  it("includes all optional fields together", () => {
    const card = createEventCard({
      title: "Team Offsite",
      date: "February 15, 2026",
      time: "9:00 AM - 5:00 PM",
      location: "Mountain View Office",
      description: "Annual team building event",
    });

    expect(card.size).toBe("mega");
    const body = card.body as { contents: Array<{ type: string }> };
    expect(body.contents).toHaveLength(3);
  });
});
