import { createStoryboard, generateContentOptions, generateTopicIdeas, normalizeBrief, type ContentBrief, type ContentFormat, type ContentOption, type StoryboardFrame, type StoryboardPack, type TopicIdea } from "../domain/contentStudio";

type GeminiJson = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
};

type GeminiOption = {
  id?: ContentFormat;
  format?: ContentFormat;
  title?: string;
  hook?: string;
  angle?: string;
  promise?: string;
  storyboard?: StoryboardFrame[];
};

type GeminiContentPayload = {
  options?: GeminiOption[];
  productionNotes?: string;
};

type GeminiTopicPayload = {
  topics?: Array<Partial<TopicIdea>>;
};

type GeminiHttpResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type GeneratedContentPack = {
  options: ContentOption[];
  storyboardsByOption: Partial<Record<ContentFormat, StoryboardPack>>;
  source: "gemini";
  model: string;
  attemptedKeys: number;
  activeKeyIndex: number;
};

export type GenerateGeminiContentPackInput = {
  brief: Partial<ContentBrief>;
  apiKeys: string[];
  model?: string;
  fetchGemini?: (apiKey: string, prompt: string, model: string) => Promise<GeminiHttpResponse>;
};

export type GeneratedTopicIdeasPack = {
  topics: TopicIdea[];
  source: "gemini";
  model: string;
  attemptedKeys: number;
  activeKeyIndex: number;
};

export type GenerateGeminiTopicIdeasInput = {
  brief: Partial<ContentBrief>;
  apiKeys: string[];
  model?: string;
  fetchGemini?: (apiKey: string, prompt: string, model: string) => Promise<GeminiHttpResponse>;
};

const contentFormats: ContentFormat[] = ["How-to", "Problem-Solution", "Story"];

export function extractGeminiApiKeys(env: Record<string, string | undefined>): string[] {
  const multiKeyValue = env.GEMINI_API_KEYS || env.GOOGLE_GENAI_API_KEYS || "";
  const multiKeys = multiKeyValue.split(",").map(cleanKey).filter(Boolean);
  const numberedKeys = Object.entries(env)
    .filter(([name]) => /^GOOGLE_GENAI_API_KEY_\d+$|^GEMINI_API_KEY_\d+$/.test(name))
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([, value]) => cleanKey(value))
    .filter(Boolean);
  const singleKeys = [env.GOOGLE_GENAI_API_KEY, env.GEMINI_API_KEY].map(cleanKey).filter(Boolean);
  return [...new Set([...multiKeys, ...numberedKeys, ...singleKeys])];
}

export function isQuotaError(status: number, body: unknown): boolean {
  const errorStatus = typeof body === "object" && body !== null && "error" in body ? (body as { error?: { status?: string } }).error?.status : undefined;
  return status === 429 || errorStatus === "RESOURCE_EXHAUSTED";
}

export async function generateGeminiContentPack({
  brief: briefInput,
  apiKeys,
  model = "gemini-2.5-flash",
  fetchGemini = fetchGeminiGenerateContent,
}: GenerateGeminiContentPackInput): Promise<GeneratedContentPack> {
  const keys = apiKeys.map(cleanKey).filter(Boolean);
  const brief = normalizeBrief(briefInput);
  const prompt = buildContentPrompt(brief);
  let lastError: unknown = new Error("No Gemini API keys configured");

  for (const [index, apiKey] of keys.entries()) {
    const response = await fetchGemini(apiKey, prompt, model);
    const body = await response.json();

    if (!response.ok) {
      lastError = body;
      if (isQuotaError(response.status, body)) {
        continue;
      }
      throw new Error(readGeminiError(body) || `Gemini request failed with status ${response.status}`);
    }

    return parseGeminiContentPack(body, brief, model, index + 1);
  }

  throw new Error(readGeminiError(lastError) || "All Gemini API keys are over quota or unavailable");
}

export async function generateGeminiTopicIdeas({
  brief: briefInput,
  apiKeys,
  model = "gemini-2.5-flash",
  fetchGemini = fetchGeminiGenerateContent,
}: GenerateGeminiTopicIdeasInput): Promise<GeneratedTopicIdeasPack> {
  const keys = apiKeys.map(cleanKey).filter(Boolean);
  const brief = normalizeBrief(briefInput);
  const prompt = buildTopicIdeasPrompt(brief);
  let lastError: unknown = new Error("No Gemini API keys configured");

  for (const [index, apiKey] of keys.entries()) {
    const response = await fetchGemini(apiKey, prompt, model);
    const body = await response.json();

    if (!response.ok) {
      lastError = body;
      if (isQuotaError(response.status, body)) {
        continue;
      }
      throw new Error(readGeminiError(body) || `Gemini request failed with status ${response.status}`);
    }

    return parseGeminiTopicIdeas(body, brief, model, index + 1);
  }

  throw new Error(readGeminiError(lastError) || "All Gemini API keys are over quota or unavailable");
}

function buildContentPrompt(brief: ContentBrief): string {
  return `คุณคือ Creative Director ภาษาไทยสำหรับ motion graphic short-form content ของแบรนด์ "เทคข้างร้าน"

สร้างคอนเทนต์ 3 รูปแบบจาก brief นี้:
- หัวข้อ: ${brief.topic}
- กลุ่มคนดู: ${brief.audience}
- แพลตฟอร์ม: ${brief.platform}
- ความยาว: ${brief.length}
- โทน: ${brief.tone}
- หมวดหมู่หัวข้อ: ${brief.topicCategory}

ข้อกำหนดคุณภาพ:
- คอนเทนต์ต้องเฉพาะเจาะจงกับร้านเล็ก/แม่ค้า/คนทำงานจริง หลีกเลี่ยงประโยคกว้าง ๆ
- hook ต้องชวนดูใน 3 วินาทีแรก
- angle ต้องบอกวิธีเล่า ไม่ใช่แค่ชื่อหัวข้อ
- promise ต้องจับต้องได้และทำตามได้
- storyboard แต่ละรูปแบบมี 6 เฟรม สำหรับวิดีโอแนวตั้ง 9:16
- textOverlay สั้น ชัด เหมาะกับจอมือถือ
- imagePrompt เขียนเป็นภาษาอังกฤษเพื่อใช้กับ image/video generator

ตอบกลับเป็น JSON เท่านั้น ห้ามมี markdown:
{
  "options": [
    {
      "id": "How-to",
      "format": "How-to",
      "title": "...",
      "hook": "...",
      "angle": "...",
      "promise": "...",
      "storyboard": [
        {
          "frame": 1,
          "time": "0:00-0:03",
          "beat": "Hook",
          "visual": "...",
          "textOverlay": "...",
          "motion": "...",
          "voiceover": "...",
          "imagePrompt": "..."
        }
      ]
    }
  ],
  "productionNotes": "..."
}

ต้องมี options ครบ 3 id: How-to, Problem-Solution, Story`;
}

function buildTopicIdeasPrompt(brief: ContentBrief): string {
  return `คุณคือ Thai Content Strategist ของแบรนด์ "เทคข้างร้าน"

ช่วยคิดหัวข้อคอนเทนต์ตามกระแสและพฤติกรรมการค้นหาของผู้ใช้บนแพลตฟอร์มนี้:
- กลุ่มคนดู: ${brief.audience}
- แพลตฟอร์ม: ${brief.platform}
- โทน: ${brief.tone}
- หมวดหมู่หัวข้อ: ${brief.topicCategory}

ต้องการ 6 หัวข้อ โดยให้ครอบคลุม 3 แหล่งคิด:
- กระแสกำลังมา
- คำค้นหายอดนิยม
- ปัญหาที่คนดูเจอบ่อย

แต่ละหัวข้อต้องอยู่ในหมวด "${brief.topicCategory}" เฉพาะเจาะจงกับแพลตฟอร์มและกลุ่มคนดู ไม่กว้างเกินไป และต้องนำไปต่อเป็นคลิป motion graphic ได้

ตอบกลับเป็น JSON เท่านั้น ห้ามมี markdown:
{
  "topics": [
    {
      "title": "...",
      "source": "กระแสกำลังมา",
      "insight": "...",
      "platform": "${brief.platform}",
      "searchIntent": "..."
    }
  ]
}`;
}

async function fetchGeminiGenerateContent(apiKey: string, prompt: string, model: string): Promise<GeminiHttpResponse> {
  return fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
      },
    }),
  });
}

function parseGeminiTopicIdeas(body: unknown, brief: ContentBrief, model: string, attemptedKeys: number): GeneratedTopicIdeasPack {
  const text = extractGeminiText(body);
  const payload = JSON.parse(stripJsonFence(text)) as GeminiTopicPayload;
  const fallbackTopics = generateTopicIdeas(brief);
  const topics = Array.from({ length: 6 }, (_, index) => normalizeTopicIdea(payload.topics?.[index], fallbackTopics[index], index, brief));

  return {
    topics,
    source: "gemini",
    model,
    attemptedKeys,
    activeKeyIndex: attemptedKeys,
  };
}

function parseGeminiContentPack(body: unknown, brief: ContentBrief, model: string, attemptedKeys: number): GeneratedContentPack {
  const text = extractGeminiText(body);
  const payload = JSON.parse(stripJsonFence(text)) as GeminiContentPayload;
  const templateOptions = generateContentOptions(brief);
  const options = contentFormats.map((format) => {
    const input = payload.options?.find((option) => option.id === format || option.format === format);
    const fallback = templateOptions.find((option) => option.id === format) ?? templateOptions[0];
    return normalizeContentOption(input, fallback, brief);
  });
  const storyboardsByOption: Partial<Record<ContentFormat, StoryboardPack>> = {};

  for (const option of options) {
    const input = payload.options?.find((item) => item.id === option.id || item.format === option.id);
    if (input?.storyboard?.length) {
      storyboardsByOption[option.id] = {
        option,
        frames: input.storyboard.map(normalizeFrame),
        productionNotes: payload.productionNotes?.trim() || createStoryboard(option).productionNotes,
      };
    }
  }

  return {
    options,
    storyboardsByOption,
    source: "gemini",
    model,
    attemptedKeys,
    activeKeyIndex: attemptedKeys,
  };
}

function normalizeTopicIdea(input: Partial<TopicIdea> | undefined, fallback: TopicIdea, index: number, brief: ContentBrief): TopicIdea {
  const allowedSources = ["กระแสกำลังมา", "คำค้นหายอดนิยม", "ปัญหาที่คนดูเจอบ่อย"] as const;
  const source = allowedSources.find((item) => item === input?.source) || fallback.source;
  return {
    id: input?.id?.trim() || fallback.id || `topic-${index + 1}`,
    title: input?.title?.trim() || fallback.title,
    source,
    insight: input?.insight?.trim() || fallback.insight,
    platform: input?.platform?.trim() || brief.platform,
    searchIntent: input?.searchIntent?.trim() || fallback.searchIntent,
  };
}

function normalizeContentOption(input: GeminiOption | undefined, fallback: ContentOption, brief: ContentBrief): ContentOption {
  return {
    id: fallback.id,
    format: fallback.format,
    title: input?.title?.trim() || fallback.title,
    hook: input?.hook?.trim() || fallback.hook,
    angle: input?.angle?.trim() || fallback.angle,
    promise: input?.promise?.trim() || fallback.promise,
    brief,
  };
}

function normalizeFrame(frame: StoryboardFrame): StoryboardFrame {
  return {
    frame: Number(frame.frame) || 1,
    time: frame.time?.trim() || "0:00-0:03",
    beat: frame.beat?.trim() || "Beat",
    visual: frame.visual?.trim() || "Visual direction",
    textOverlay: frame.textOverlay?.trim() || "Text overlay",
    motion: frame.motion?.trim() || "Motion direction",
    voiceover: frame.voiceover?.trim() || "Voiceover",
    imagePrompt: frame.imagePrompt?.trim() || "vertical 9:16 motion graphic storyboard frame",
  };
}

function extractGeminiText(body: unknown): string {
  const geminiBody = body as GeminiJson;
  const text = geminiBody.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("\n").trim();
  if (!text) {
    throw new Error("Gemini response did not include text");
  }
  return text;
}

function stripJsonFence(text: string): string {
  return text.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
}

function readGeminiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "object" && error !== null && "error" in error) {
    const geminiError = (error as { error?: { message?: string } }).error;
    return geminiError?.message || "";
  }
  return "";
}

function cleanKey(key: string | undefined): string {
  return (key || "").trim().replace(/^["']|["']$/g, "");
}
