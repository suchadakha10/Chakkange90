import { describe, expect, it, vi } from "vitest";
import { extractGeminiApiKeys, generateGeminiContentPack, generateGeminiTopicIdeas, isQuotaError } from "../server/geminiContent";
import type { ContentBrief } from "../domain/contentStudio";

const brief: ContentBrief = {
  topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
  audience: "แม่ค้าออนไลน์",
  platform: "Facebook Reels",
  length: "20 วินาที",
  tone: "สอนแบบจับมือทำ",
  topicCategory: "การขายออนไลน์",
};

describe("generateGeminiContentPack", () => {
  it("extracts Gemini keys from comma-separated, numbered, and single env values", () => {
    expect(
      extractGeminiApiKeys({
        GOOGLE_GENAI_API_KEYS: "alpha, beta",
        GOOGLE_GENAI_API_KEY_2: "gamma",
        GOOGLE_GENAI_API_KEY: "delta",
      }),
    ).toEqual(["alpha", "beta", "gamma", "delta"]);
  });

  it("tries the next Gemini key when the current key is over quota", async () => {
    const fetchGemini = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: async () => ({ error: { status: "RESOURCE_EXHAUSTED", message: "quota" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [
                  {
                    text: JSON.stringify({
                      options: [
                        {
                          id: "How-to",
                          format: "How-to",
                          title: "สอนทำตอบลูกค้าไวแบบไม่เสียเสียงร้าน",
                          hook: "ถ้าลูกค้าทักพร้อมกัน 10 คน ใช้สูตรนี้ตอบให้ไวขึ้น",
                          angle: "คลิปสอนเร็วสำหรับแม่ค้าออนไลน์",
                          promise: "ได้ขั้นตอนพร้อมเอาไปใช้วันนี้",
                          storyboard: [
                            {
                              frame: 1,
                              time: "0:00-0:03",
                              beat: "Hook",
                              visual: "หน้าจอแชตเด้งหลายข้อความ",
                              textOverlay: "ลูกค้าทักรัว ทำยังไงให้ตอบทัน",
                              motion: "ซูมเข้า notification",
                              voiceover: "ถ้าลูกค้าทักรัว ลองทำแบบนี้",
                              imagePrompt: "vertical small online seller chat notifications",
                            },
                          ],
                        },
                        {
                          id: "Problem-Solution",
                          format: "Problem-Solution",
                          title: "แก้ปัญหาตอบลูกค้าช้า",
                          hook: "ตอบช้าเสียโอกาส แต่แก้ได้ด้วยข้อความต้นแบบ",
                          angle: "เปิดปัญหาแล้วแก้ทันที",
                          promise: "รู้วิธีลดเวลาตอบซ้ำ",
                          storyboard: [],
                        },
                        {
                          id: "Story",
                          format: "Story",
                          title: "เรื่องเล่าร้านที่ตอบไวขึ้น",
                          hook: "ร้านเล็กลองใช้ AI แล้วเวลาตอบลูกค้าลดลง",
                          angle: "เล่าเคสก่อนหลัง",
                          promise: "เห็นภาพจริงและทำตามได้",
                          storyboard: [],
                        },
                      ],
                      productionNotes: "ตัดเร็ว ใช้ text pop และ before-after",
                    }),
                  },
                ],
              },
            },
          ],
        }),
      });

    const pack = await generateGeminiContentPack({
      brief,
      apiKeys: ["quota-key", "working-key"],
      fetchGemini,
    });

    expect(fetchGemini).toHaveBeenCalledTimes(2);
    expect(fetchGemini.mock.calls[0][0]).toBe("quota-key");
    expect(fetchGemini.mock.calls[1][0]).toBe("working-key");
    expect(pack.options).toHaveLength(3);
    expect(pack.options[0].title).toBe("สอนทำตอบลูกค้าไวแบบไม่เสียเสียงร้าน");
    expect(pack.storyboardsByOption["How-to"]?.frames[0].textOverlay).toBe("ลูกค้าทักรัว ทำยังไงให้ตอบทัน");
    expect(pack.source).toBe("gemini");
    expect(pack.attemptedKeys).toBe(2);
    expect(pack.activeKeyIndex).toBe(2);
  });

  it("marks Gemini 429 resource exhausted responses as quota errors", async () => {
    expect(isQuotaError(429, { error: { status: "RESOURCE_EXHAUSTED" } })).toBe(true);
    expect(isQuotaError(400, { error: { status: "INVALID_ARGUMENT" } })).toBe(false);
  });

  it("generates trend and search topic ideas with the active key index", async () => {
    const fetchGemini = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    topics: [
                      {
                        title: "3 เรื่อง AI ที่แม่ค้าออนไลน์ค้นหาบ่อยบน Facebook Reels",
                        source: "คำค้นหายอดนิยม",
                        insight: "คนอยากตอบแชตไวขึ้นแต่กลัวเสียความเป็นร้าน",
                        platform: "Facebook Reels",
                        searchIntent: "วิธีใช้ AI ตอบลูกค้า",
                      },
                    ],
                  }),
                },
              ],
            },
          },
        ],
      }),
    });

    const pack = await generateGeminiTopicIdeas({
      brief,
      apiKeys: ["topic-key"],
      fetchGemini,
    });

    expect(fetchGemini).toHaveBeenCalledWith("topic-key", expect.stringContaining("หมวดหมู่หัวข้อ: การขายออนไลน์"), "gemini-2.5-flash");
    expect(pack.topics[0]).toMatchObject({
      source: "คำค้นหายอดนิยม",
      platform: "Facebook Reels",
      searchIntent: "วิธีใช้ AI ตอบลูกค้า",
    });
    expect(pack.source).toBe("gemini");
    expect(pack.activeKeyIndex).toBe(1);
  });
});
