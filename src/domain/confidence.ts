import type { ProofEntry, TaskLevel } from "./types";

export type ConfidencePhaseKey = "discipline" | "courage" | "identity";

export interface ConfidencePhase {
  key: ConfidencePhaseKey;
  dayRange: string;
  startDay: number;
  endDay: number;
  title: string;
  promise: string;
  evidence: string;
}

export interface ConfidenceContract {
  phase: ConfidencePhase;
  full: string;
  minimum: string;
  emergency: string;
  proofPrompt: string;
}

export const confidencePhases: ConfidencePhase[] = [
  {
    key: "discipline",
    dayRange: "Day 1-30",
    startDay: 1,
    endDay: 30,
    title: "ความมีวินัย",
    promise: "รักษาคำสัญญาเล็ก ๆ กับตัวเองทุกวัน",
    evidence: "หลักฐานว่าคุณทำตามที่พูด แม้งานจะเล็กก็ตาม",
  },
  {
    key: "courage",
    dayRange: "Day 31-60",
    startDay: 31,
    endDay: 60,
    title: "ความกล้า",
    promise: "ทำสิ่งที่เห็นได้หรือทำให้ไม่สบายใจวันละหนึ่งอย่าง",
    evidence: "หลักฐานว่าความกลัวมาได้ แต่ไม่ได้เป็นคนขับ",
  },
  {
    key: "identity",
    dayRange: "Day 61-90",
    startDay: 61,
    endDay: 90,
    title: "ตัวตนใหม่",
    promise: "ลงมือแบบคนที่คุณกำลังจะเป็น ก่อนที่มันจะรู้สึกธรรมชาติ",
    evidence: "หลักฐานว่าความสม่ำเสมอเริ่มเป็นระบบของตัวเองแล้ว",
  },
];

export function getConfidencePhase(day: number): ConfidencePhase {
  if (day <= 30) return confidencePhases[0];
  if (day <= 60) return confidencePhases[1];
  return confidencePhases[2];
}

export function getConfidenceContract(day: number): ConfidenceContract {
  const phase = getConfidencePhase(day);

  if (phase.key === "discipline") {
    return {
      phase,
      full: "ทำงานสำคัญให้จบ 25 นาที แล้วบันทึกว่ารักษาคำสัญญาอะไรกับตัวเอง",
      minimum: "ทำเวอร์ชัน 10 นาทีของงานนั้น แล้วเขียนคำสัญญาเป็นประโยคเดียว",
      emergency: "ทำแค่ 5 นาที แล้วเขียนหลักฐาน 1 บรรทัดก่อนหมดวัน",
      proofPrompt: "วันนี้รักษาคำสัญญาอะไรได้? สิ่งนี้พิสูจน์อะไรเกี่ยวกับวินัยของคุณ?",
    };
  }

  if (phase.key === "courage") {
    return {
      phase,
      full: "ทำสิ่งที่คนอื่นเห็นได้ 1 อย่าง: โพสต์ อัดคลิป ถาม ขาย ส่งงาน หรือขอ feedback",
      minimum: "ทำเวอร์ชันเล็กของความกล้า: ส่งข้อความ 1 คน อัด raw take 1 รอบ หรือร่างโพสต์ให้พร้อม",
      emergency: "ใช้ 5 นาทีเขียนว่ากลัวอะไร แล้วทำก้าวเล็กที่สุดที่ยังมองเห็นได้",
      proofPrompt: "วันนี้กล้าทำอะไรที่เห็นได้? สิ่งนี้พิสูจน์อะไรเกี่ยวกับความกล้าของคุณ?",
    };
  }

  return {
    phase,
    full: "ทำหลักฐานให้จบ 1 ชิ้นแบบคนที่สม่ำเสมอจะทำ",
    minimum: "รักษาตัวตนใหม่ด้วยงานเล็กที่จบจริง 1 ชิ้น ข้อความ 1 อัน หรือการตัดสินใจ 1 เรื่อง",
    emergency: "ทำ 5 นาทีเพื่อปกป้องตัวตนใหม่: hook 1 บรรทัด note 1 ข้อ หรือ check-in ตรง ๆ 1 ครั้ง",
    proofPrompt: "วันนี้คุณเสริมตัวตนแบบไหน? สิ่งนี้พิสูจน์อะไรเกี่ยวกับคนที่คุณกำลังเป็น?",
  };
}

export function confidenceProofTypeForLevel(level: TaskLevel): ProofEntry["proofType"] {
  if (level === "emergency") return "lesson";
  if (level === "minimum") return "draft";
  return "post";
}
