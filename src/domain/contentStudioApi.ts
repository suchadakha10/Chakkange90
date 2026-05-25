import type { ContentBrief, ContentFormat, ContentOption, StoryboardPack, TopicIdea } from "./contentStudio";

export type ContentStudioApiPack = {
  options: ContentOption[];
  storyboardsByOption?: Partial<Record<ContentFormat, StoryboardPack | Omit<StoryboardPack, "option">>>;
  source?: "gemini" | "template";
  model?: string;
  attemptedKeys?: number;
  activeKeyIndex?: number;
  warning?: string;
};

export type TopicIdeasApiPack = {
  topics: TopicIdea[];
  source?: "gemini" | "template";
  model?: string;
  attemptedKeys?: number;
  activeKeyIndex?: number;
  warning?: string;
};

export async function requestGeminiTopicIdeas(brief: ContentBrief): Promise<TopicIdeasApiPack> {
  const response = await fetch("/api/content-studio/topics", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief }),
  });

  if (!response.ok) {
    throw new Error(`Content Studio topic API failed with status ${response.status}`);
  }

  return response.json() as Promise<TopicIdeasApiPack>;
}

export async function requestGeminiContentPack(brief: ContentBrief): Promise<ContentStudioApiPack> {
  const response = await fetch("/api/content-studio/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ brief }),
  });

  if (!response.ok) {
    throw new Error(`Content Studio API failed with status ${response.status}`);
  }

  return response.json() as Promise<ContentStudioApiPack>;
}
