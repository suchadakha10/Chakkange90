export type ContentBrief = {
  topic: string;
  audience: string;
  platform: string;
  length: string;
  tone: string;
};

export type ContentFormat = "How-to" | "Problem-Solution" | "Story";

export type ContentOption = {
  id: ContentFormat;
  format: ContentFormat;
  title: string;
  hook: string;
  angle: string;
  promise: string;
  brief: ContentBrief;
};

export type StoryboardFrame = {
  frame: number;
  time: string;
  beat: string;
  visual: string;
  textOverlay: string;
  motion: string;
  voiceover: string;
  imagePrompt: string;
};

export type StoryboardPack = {
  option: ContentOption;
  frames: StoryboardFrame[];
  productionNotes: string;
};

const fallbackBrief: ContentBrief = {
  topic: "หัวข้อคอนเทนต์",
  audience: "เจ้าของร้านเล็ก",
  platform: "TikTok",
  length: "20 วินาที",
  tone: "เข้าใจง่าย",
};

export function normalizeBrief(brief: Partial<ContentBrief>): ContentBrief {
  return {
    topic: brief.topic?.trim() || fallbackBrief.topic,
    audience: brief.audience?.trim() || fallbackBrief.audience,
    platform: brief.platform?.trim() || fallbackBrief.platform,
    length: brief.length?.trim() || fallbackBrief.length,
    tone: brief.tone?.trim() || fallbackBrief.tone,
  };
}

export function generateContentOptions(briefInput: Partial<ContentBrief>): ContentOption[] {
  const brief = normalizeBrief(briefInput);
  const { topic, audience, platform, length, tone } = brief;

  return [
    {
      id: "How-to",
      format: "How-to",
      title: `สอนทำ: ${topic}`,
      hook: `ถ้าอยากให้ ${topic} เริ่มจาก 3 ขั้นนี้`,
      angle: `คลิป ${platform} ${length} แบบสอนเร็วสำหรับ ${audience}`,
      promise: `คนดูได้ขั้นตอนที่ทำตามได้ทันที น้ำเสียง ${tone}`,
      brief,
    },
    {
      id: "Problem-Solution",
      format: "Problem-Solution",
      title: `แก้พลาด: ${topic}`,
      hook: `หลายร้านเสียเวลา เพราะยังไม่ได้ใช้วิธีนี้กับ ${topic}`,
      angle: `เปิดด้วยปัญหา แล้วพาไปทางแก้ที่จับต้องได้`,
      promise: `คนดูเห็นความเจ็บปวด เห็นทางแก้ และอยากลองทันที`,
      brief,
    },
    {
      id: "Story",
      format: "Story",
      title: `เรื่องเล่า: ${topic}`,
      hook: `เมื่อร้านเล็กลอง ${topic} ผลลัพธ์เปลี่ยนแบบนี้`,
      angle: `เล่าเป็นเคสสั้น มีภาพก่อน-หลัง และจบด้วยบทเรียน`,
      promise: `คนดูจำง่าย เพราะเห็นสถานการณ์จริงของ ${audience}`,
      brief,
    },
  ];
}

export function createStoryboard(option: ContentOption): StoryboardPack {
  const { topic, audience, platform, tone } = option.brief;
  const style = option.format === "Story" ? "Small Shop Reality" : option.format === "How-to" ? "Clean Tech Explainer" : "Urgent Fix";
  const frames: StoryboardFrame[] = [
    {
      frame: 1,
      time: "0:00-0:03",
      beat: "Hook",
      visual: `มือถือเด้งแชตลูกค้าหลายข้อความ พร้อมเจ้าของร้านมองหน้าจอ`,
      textOverlay: option.hook,
      motion: "Text pop เข้าจังหวะเร็ว ซูมเข้า notification",
      voiceover: option.hook,
      imagePrompt: `${style}, vertical 9:16, small shop owner with phone chat notifications, clear Thai text space, topic ${topic}`,
    },
    {
      frame: 2,
      time: "0:03-0:06",
      beat: "Problem",
      visual: `หน้าจอแสดงงานค้าง ลูกค้ารอคำตอบ และเวลาไหลผ่าน`,
      textOverlay: "ตอบช้า = เสียโอกาส",
      motion: "Split screen ก่อน-หลัง ใช้แถบเวลาวิ่งเร็ว",
      voiceover: `ปัญหาของ ${audience} คือมีงานเยอะ แต่ต้องตอบให้ไว`,
      imagePrompt: `${style}, vertical 9:16, busy small shop counter, delayed customer replies, visual problem scene`,
    },
    {
      frame: 3,
      time: "0:06-0:10",
      beat: "Reveal",
      visual: `กล่อง AI assistant โผล่ข้างแชต พร้อมตัวอย่างคำตอบสั้น`,
      textOverlay: "ให้ AI ช่วยร่างก่อน",
      motion: "Card slide in จากขวา แล้ว highlight คำตอบ",
      voiceover: `ให้ AI ช่วยร่างคำตอบก่อน แล้วเราค่อยปรับให้เป็นเสียงร้านเรา`,
      imagePrompt: `${style}, vertical 9:16, AI assistant card beside chat interface, clean explainer layout, ${tone}`,
    },
    {
      frame: 4,
      time: "0:10-0:14",
      beat: "Step",
      visual: `3 ขั้นตอนบนจอ: เก็บคำถามซ้ำ, เขียนคำตอบหลัก, ให้ AI ปรับภาษา`,
      textOverlay: "3 ขั้นตอน",
      motion: "Step cards appear one by one with check icons",
      voiceover: `เริ่มจากคำถามซ้ำ เขียนคำตอบหลัก แล้วให้ AI ปรับภาษาให้ชัด`,
      imagePrompt: `${style}, vertical 9:16, three step cards, checklist icons, practical tutorial for ${platform}`,
    },
    {
      frame: 5,
      time: "0:14-0:18",
      beat: "Proof",
      visual: `เปรียบเทียบก่อนหลัง: ก่อนตอบ 10 นาที หลังตอบ 1 นาที`,
      textOverlay: "เร็วขึ้น เหนื่อยน้อยลง",
      motion: "Before-after wipe พร้อมตัวเลขเด้งขึ้น",
      voiceover: `ผลคือร้านตอบไวขึ้น และไม่ต้องพิมพ์ใหม่ทุกครั้ง`,
      imagePrompt: `${style}, vertical 9:16, before after comparison, response time improvement, small business context`,
    },
    {
      frame: 6,
      time: "0:18-0:20",
      beat: "CTA",
      visual: `เจ้าของร้านยิ้มพร้อมปุ่ม save และข้อความชวนลอง`,
      textOverlay: "ลองกับคำถามซ้ำวันนี้",
      motion: "CTA button pulse แล้วจบด้วย logo/text lockup",
      voiceover: `วันนี้ลองเริ่มจากคำถามที่ลูกค้าถามซ้ำที่สุดหนึ่งข้อ`,
      imagePrompt: `${style}, vertical 9:16, friendly small shop owner, save button, clear CTA text area`,
    },
  ];

  return {
    option,
    frames,
    productionNotes: `เหมาะกับ CapCut หรือ Canva: ใช้ text pop, split screen, before-after wipe, icon check และเสียงพูดสั้นตามจังหวะ ${platform}`,
  };
}
