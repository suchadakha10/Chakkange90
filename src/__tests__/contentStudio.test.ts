import { describe, expect, it } from "vitest";
import { createStoryboard, generateContentOptions } from "../domain/contentStudio";

describe("content studio generator", () => {
  it("creates three broad content options from a topic", () => {
    const options = generateContentOptions({
      topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
      audience: "เจ้าของร้านเล็ก",
      platform: "TikTok",
      length: "20 วินาที",
      tone: "เข้าใจง่าย",
    });

    expect(options).toHaveLength(3);
    expect(options.map((option) => option.format)).toEqual(["How-to", "Problem-Solution", "Story"]);
    expect(options[0].hook).toContain("ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น");
  });

  it("turns a selected option into a six-frame storyboard pack", () => {
    const [option] = generateContentOptions({
      topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
      audience: "เจ้าของร้านเล็ก",
      platform: "TikTok",
      length: "20 วินาที",
      tone: "เข้าใจง่าย",
    });

    const storyboard = createStoryboard(option);

    expect(storyboard.frames).toHaveLength(6);
    expect(storyboard.frames[0]).toMatchObject({ beat: "Hook" });
    expect(storyboard.frames[5]).toMatchObject({ beat: "CTA" });
    expect(storyboard.productionNotes).toContain("CapCut");
  });
});
