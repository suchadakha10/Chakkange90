import type { ChallengePlan, ChallengeWeek, ClipFormat, DailyMission } from "./types";

const weekThemes = [
  ["CapCut Production Sprint", "ได้คลิปจริง 2 คลิป, motion drill 2 งาน, และ template ใช้ซ้ำ 1 ชุด"],
  ["CapCut Shop Content System", "ได้ระบบตัดต่อ CapCut สำหรับคลิปร้าน 1 ชุด, คลิปพร้อมโพสต์ 2 ชิ้น, motion drill 2 งาน, และคลัง B-roll ร้าน"],
  ["Canva สำหรับร้านเล็ก", "สอนงานออกแบบที่ร้านค้าเอาไปใช้ได้ทันที"],
  ["ไฟล์พิมพ์ผิดพลาดบ่อย", "อธิบายปัญหาไฟล์ก่อนพิมพ์ที่ลูกค้ามักเจอ"],
  ["AI ช่วยทำคอนเทนต์ร้าน", "ใช้ AI ช่วยคิด hook, caption, script และ workflow"],
  ["พื้นฐานงานพิมพ์", "สอนสินค้า print ง่าย ๆ เช่น นามบัตร สติกเกอร์ ใบปลิว"],
  ["Before / After", "โชว์การแก้งานให้เห็นความต่างชัด"],
  ["คำถามจากลูกค้า", "เปลี่ยนคำถามให้เป็นคลิปสั้นที่มีประโยชน์"],
  ["ระบบทำงาน", "สอนการจัดไฟล์ ส่งต่องาน และทำซ้ำได้"],
  ["สร้างแพ็กเกจบริการ", "รวมงานคอนเทนต์และงานพิมพ์ให้เป็นข้อเสนอ"],
  ["เตรียมร้านพิมพ์", "เรียนรู้ก่อนซื้อเครื่องมือจริง"],
  ["Authority Series", "ทำ mini-series ที่สอนต่อเนื่องและดูน่าเชื่อถือ"],
  ["สรุปและ Best Of", "สรุป 90 วันและดึงบทเรียนที่แข็งแรงที่สุด"],
] as const;

const weekOne: Omit<DailyMission, "day" | "week">[] = [
  {
    title: "ทดสอบคลิป baseline",
    focus: "วัดความเร็วและคุณภาพการตัดต่อปัจจุบัน",
    format: "practice",
    requiresMotion: false,
    full: "ตัดคลิป 30-45 วินาที 1 คลิป และจับเวลาตั้งแต่นำเข้าไฟล์จน export",
    minimum: "ตัด draft 15 วินาที และเขียนว่าอะไรทำให้ช้า",
    emergency: "ตัด raw clip สั้น ๆ แล้ว export proof 5 วินาที",
    proofPrompt: "ใส่ชื่อไฟล์ export, เวลาที่ใช้, และจุดที่ทำให้ช้าที่สุด",
  },
  {
    title: "ฝึก Hook และจังหวะคลิป",
    focus: "ทำ 3 วินาทีแรกให้น่าดูขึ้นและตัดช่วงเนือยออก",
    format: "practice",
    requiresMotion: false,
    full: "ทำ opening 3 แบบจากคลิปเดียวกัน แล้วเลือกแบบที่แข็งแรงที่สุด",
    minimum: "ทำ opening 2 แบบ และเขียนว่าแบบไหนดีกว่าเพราะอะไร",
    emergency: "เขียน hook 3 บรรทัดสำหรับหัวข้อเดียวกัน",
    proofPrompt: "ใส่เวอร์ชัน hook หรือ draft ที่ export แล้ว",
  },
  {
    title: "ระบบซับไตเติลประจำช่อง",
    focus: "สร้างซับที่อ่านง่ายและใช้ซ้ำได้",
    format: "saveable",
    requiresMotion: false,
    full: "กำหนดขนาดฟอนต์ สี ตำแหน่ง และกติกาการไฮไลต์คำ",
    minimum: "ทำ preset ซับ 1 แบบ และทดสอบกับวิดีโอ 10 วินาที",
    emergency: "เขียนกติกาซับ: ขนาด สี และไม่เกิน 2 บรรทัด",
    proofPrompt: "ใส่ screenshot หรือ export สั้น ๆ ที่โชว์สไตล์ซับ",
  },
  {
    title: "Motion Text Pop Drill",
    focus: "เริ่มบันได motion graphic ที่ L1",
    format: "motion",
    requiresMotion: true,
    full: "ทำ text pop animation 3 แบบ แล้ว export motion drill 5-10 วินาที",
    minimum: "ทำ text pop animation 1 แบบแล้ว export",
    emergency: "วาด/เขียน storyboard 3 เฟรมของ text pop",
    proofPrompt: "ใส่ motion drill ที่ export หรือ proof storyboard",
  },
  {
    title: "คลิปสอนแบบอัดหน้าจอ",
    focus: "ทำ tutorial ที่ร้านเล็กใช้ประโยชน์ได้จริง",
    format: "screen",
    requiresMotion: false,
    full: "อัดหน้าจอและตัด tutorial สั้น ๆ แล้วโพสต์หรือเตรียมโพสต์",
    minimum: "อัดหน้าจอและตัด 20 วินาทีแรก",
    emergency: "เขียน script แบบ Hook/Problem/Steps/CTA",
    proofPrompt: "ใส่ลิงก์โพสต์, draft export, หรือ script",
  },
  {
    title: "ใส่ Motion ในคลิปจริง",
    focus: "เอา motion ไปใช้ในคอนเทนต์จริง ไม่ใช่แค่ซ้อม",
    format: "motion",
    requiresMotion: true,
    full: "ใส่ label, ลูกศร หรือ step card ที่ขยับได้ในคลิปจริงแล้ว export",
    minimum: "ใส่ motion label 1 จุดใน draft 10 วินาที",
    emergency: "ทำ animated label 1 ชิ้นแยกออกมา",
    proofPrompt: "ใส่คลิป export หรือ motion overlay ที่ export แล้ว",
  },
  {
    title: "Template และ Shot List",
    focus: "เตรียมของสำหรับสัปดาห์หน้าตอนกลับไปทำคอนเทนต์ร้าน",
    format: "practice",
    requiresMotion: false,
    full: "ทำ CapCut template ใช้ซ้ำ 1 ชุด และ shot list ของร้านสำหรับสัปดาห์หน้า",
    minimum: "ทำ template หรือ shot list 10 ข้อ อย่างใดอย่างหนึ่ง",
    emergency: "เขียน 5 shot ที่ต้องถ่ายเมื่อกลับร้าน",
    proofPrompt: "ใส่โน้ต template, screenshot, หรือ shot list",
  },
];

const weekTwo: Omit<DailyMission, "day" | "week">[] = [
  {
    title: "ตั้งระบบโปรเจกต์ CapCut ประจำช่อง",
    focus: "ทำให้เริ่มตัดคลิปใหม่ได้เร็ว ไม่ต้องตั้งค่าซ้ำทุกครั้ง",
    format: "practice",
    requiresMotion: false,
    full: "สร้าง CapCut project template ที่มี canvas 9:16, intro 1 แบบ, subtitle style, logo/ชื่อช่อง, sound level และ export setting พร้อมใช้",
    minimum: "ตั้ง subtitle style กับ export setting ให้เสร็จ และบันทึกเป็น project ต้นแบบ",
    emergency: "เขียน checklist 5 ข้อของ CapCut template ที่ต้องมี",
    proofPrompt: "ใส่ screenshot project template หรือโน้ต checklist พร้อมชื่อไฟล์ต้นแบบ",
  },
  {
    title: "เก็บ B-roll ร้านสำหรับตัดต่อ",
    focus: "มีวัตถุดิบภาพให้ CapCut ไม่ต้องใช้แต่หน้าพูดหรือหน้าจอ",
    format: "practice",
    requiresMotion: false,
    full: "ถ่ายหรือรวบรวม B-roll ร้าน 15 shot เช่น โต๊ะทำงาน มือหยิบของ แพ็กงาน เครื่องมือ ไฟล์ลูกค้า หน้าจอแก้งาน และจัดเข้าโฟลเดอร์พร้อมชื่อไฟล์",
    minimum: "ถ่ายหรือรวบรวม B-roll 7 shot และจัดชื่อไฟล์ให้อ่านรู้เรื่อง",
    emergency: "เขียน shot list ร้าน 10 shot ที่จะถ่ายในวันถัดไป",
    proofPrompt: "ใส่รูปโฟลเดอร์, รายชื่อ shot, หรือ raw clip ตัวอย่าง 3 ชิ้น",
  },
  {
    title: "CapCut Hook Template 3 แบบ",
    focus: "ทำ 3 วินาทีแรกให้มีแพตเทิร์นใช้ซ้ำสำหรับคอนเทนต์ร้านเล็ก",
    format: "motion",
    requiresMotion: true,
    full: "ทำ hook opening ใน CapCut 3 แบบ: pain text pop, before-after split, และ checklist card แล้ว export ตัวอย่าง 5-10 วินาที",
    minimum: "ทำ hook opening 1 แบบให้ export ได้จริง",
    emergency: "วาด storyboard hook 3 เฟรม พร้อมคำบนจอ",
    proofPrompt: "ใส่ไฟล์ export, screenshot timeline, หรือ storyboard hook",
  },
  {
    title: "ตัดคลิปสอน CapCut 1 ชิ้น",
    focus: "สอนสิ่งเล็กที่ร้านเล็กใช้ได้ทันที โดยใช้จังหวะตัดต่อจริง",
    format: "screen",
    requiresMotion: false,
    full: "ทำคลิป 30-45 วินาทีหัวข้อ CapCut สำหรับร้านเล็ก เช่น ใส่ซับเร็ว, ตัดเสียงเงียบ, ทำปกคลิป, หรือใส่ text pop แล้วเตรียมโพสต์",
    minimum: "อัดหน้าจอและตัด draft 20 วินาทีแรกให้มี hook, step, CTA",
    emergency: "เขียน script แบบ Hook/Problem/Steps/CTA สำหรับคลิป CapCut 1 เรื่อง",
    proofPrompt: "ใส่ลิงก์โพสต์, draft export, screenshot timeline, หรือ script",
  },
  {
    title: "รีแพ็กคลิปเก่าให้เป็นสไตล์เทคข้างร้าน",
    focus: "ฝึกใช้ template กับงานจริง ไม่เริ่มใหม่จากศูนย์",
    format: "saveable",
    requiresMotion: false,
    full: "เลือกคลิปเก่าหรือ raw clip 1 ชิ้นมาตัดใหม่ใน CapCut ด้วย subtitle style, hook template, B-roll และ caption สำหรับ TikTok/Facebook",
    minimum: "ตัดใหม่ 15-20 วินาที และเขียนว่าเวอร์ชันใหม่ดีขึ้นตรงไหน",
    emergency: "เลือกคลิปเก่า 1 ชิ้น แล้วเขียน 3 จุดที่จะแก้ใน CapCut",
    proofPrompt: "ใส่ before/after note, draft export, หรือ caption ที่เตรียมโพสต์",
  },
  {
    title: "Motion Label สำหรับคลิปร้าน",
    focus: "เพิ่ม motion ที่ช่วยอธิบาย ไม่ใช่แต่งเล่นอย่างเดียว",
    format: "motion",
    requiresMotion: true,
    full: "ทำ motion label ใน CapCut 3 แบบสำหรับชี้จุดสำคัญ เช่น ราคา, ขั้นตอน, ข้อผิดพลาดไฟล์ หรือคำเตือน แล้วใส่ในคลิปจริง 1 จุด",
    minimum: "ทำ motion label 1 แบบและใส่ใน draft 10 วินาที",
    emergency: "ทำ text label 1 ชิ้นพร้อม keyframe เข้า-ออก",
    proofPrompt: "ใส่ export motion label, screenshot keyframe, หรือคลิป draft ที่ใส่ label แล้ว",
  },
  {
    title: "ล็อก Workflow CapCut สัปดาห์หน้า",
    focus: "สรุปสิ่งที่ใช้ได้จริงให้กลายเป็นระบบตัดต่อประจำช่อง",
    format: "practice",
    requiresMotion: false,
    full: "ทำ CapCut workflow 1 หน้า: import, rough cut, subtitle, hook, B-roll, motion label, sound, export และเลือก 2 หัวข้อคลิปที่จะผลิตต่อสัปดาห์หน้า",
    minimum: "เขียน workflow 7 ขั้นตอน และเลือกหัวข้อคลิปต่อไป 1 เรื่อง",
    emergency: "เขียนบทเรียน 3 ข้อจากการใช้ CapCut สัปดาห์นี้",
    proofPrompt: "ใส่ workflow, หัวข้อคลิปถัดไป, บทเรียน, หรือ screenshot template ที่ล็อกแล้ว",
  },
];

function makeFallbackDay(day: number, week: number, theme: string): DailyMission {
  const rotation: ClipFormat[] = ["motion", "screen", "talking-head", "saveable", "practice", "screen", "practice"];
  const format = rotation[(day - 1) % rotation.length];
  const requiresMotion = format === "motion";

  return {
    day,
    week,
    title: `${theme} วันที่ ${((day - 1) % 7) + 1}`,
    focus: `ผลิตงานเทคข้างร้าน 1 ชิ้นที่ใช้ได้จริงในหัวข้อ ${theme}`,
    format,
    requiresMotion,
    full: requiresMotion ? "ทำ motion graphic สั้น ๆ และผูกกับไอเดียคอนเทนต์ที่มีประโยชน์" : "สร้างหรือโพสต์คอนเทนต์ 1 ชิ้นสำหรับร้านเล็ก",
    minimum: requiresMotion ? "Export motion drill 5-10 วินาที 1 งาน" : "เขียน script 1 ชิ้น, ถ่าย raw clip 1 คลิป, หรือทำ mockup ที่ใช้ได้ 1 ชิ้น",
    emergency: requiresMotion ? "Storyboard motion 3 เฟรม หรือ animate text pop 1 จุด" : "เขียน hook 1 บรรทัด หรือบทเรียน 1 ข้อ",
    proofPrompt: "ใส่ลิงก์, โน้ต export, screenshot, script, hook, หรือบทเรียนเป็นหลักฐาน",
  };
}

function buildWeeks(): ChallengeWeek[] {
  let day = 1;
  return weekThemes.map(([theme, outcome], index) => {
    const week = index + 1;
    const dayCount = week === 13 ? 6 : 7;
    const days = Array.from({ length: dayCount }, (_, dayIndex) => {
      if (week === 1) {
        const mission = weekOne[dayIndex];
        return { ...mission, day: day++, week };
      }
      if (week === 2) {
        const mission = weekTwo[dayIndex];
        return { ...mission, day: day++, week };
      }
      return makeFallbackDay(day++, week, theme);
    });

    return { week, theme, outcome, days };
  });
}

export const seedPlan: ChallengePlan = {
  weeks: buildWeeks(),
};
