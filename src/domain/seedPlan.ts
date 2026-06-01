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
    title: "วันถ่ายทำคลิปร้าน",
    focus: "เก็บวัตถุดิบภาพและเสียงให้พอสำหรับตัดต่อหลายคลิป",
    format: "talking-head",
    requiresMotion: false,
    full: "ถ่าย raw clip ร้าน 3 ชุด: หน้าพูด 1 คลิป, B-roll 10 shot, และหน้าจอ/มือทำงาน 5 shot แล้วจัดเข้าโฟลเดอร์",
    minimum: "ถ่าย raw clip 1 คลิปและ B-roll 5 shot พร้อมตั้งชื่อไฟล์ให้อ่านรู้เรื่อง",
    emergency: "ถ่ายคลิปดิบ 1 คลิปไม่เกิน 60 วินาที หรือถ่าย B-roll 3 shot",
    proofPrompt: "ใส่รูปโฟลเดอร์, รายชื่อ shot, หรือ raw clip ตัวอย่างจากวันถ่ายทำ",
  },
  {
    title: "Template, Shot List และ Motion Hook",
    focus: "คัดฟุตเทจจากวันถ่ายทำและทำ motion hook สั้น ๆ ให้พร้อมตัดต่อสัปดาห์หน้า",
    format: "motion",
    requiresMotion: true,
    full: "คัดฟุตเทจที่ถ่ายเมื่อวานเป็น 3 กอง: ใช้ทำ hook, ใช้เป็น B-roll, ใช้ทำ tutorial แล้วทำ motion hook หรือ motion label 5-10 วินาทีจาก shot ที่ดีที่สุด",
    minimum: "คัดฟุตเทจ 10 ไฟล์และทำ motion hook 1 แบบจาก shot เปิดคลิป",
    emergency: "เลือก 1 shot ที่ถ่ายแล้ว แล้ววาด storyboard motion hook 3 เฟรม",
    proofPrompt: "ใส่โน้ตคัดฟุตเทจ, export motion hook, screenshot template, หรือรายชื่อ shot ที่จะใช้ตัด",
  },
];

const weekTwo: Omit<DailyMission, "day" | "week">[] = [
  {
    title: "ตั้งระบบโปรเจกต์ CapCut ประจำช่อง",
    focus: "เอาฟุตเทจที่ถ่ายไว้เข้า template เพื่อเริ่มตัดคลิปใหม่ได้เร็ว",
    format: "practice",
    requiresMotion: false,
    full: "สร้าง CapCut project template ที่มี canvas 9:16, intro 1 แบบ, subtitle style, logo/ชื่อช่อง, sound level, export setting และ import ฟุตเทจที่ถ่ายไว้เป็น bin พร้อมใช้",
    minimum: "ตั้ง subtitle style กับ export setting ให้เสร็จ แล้ว import ฟุตเทจวันถ่ายทำอย่างน้อย 5 ไฟล์",
    emergency: "เขียน checklist 5 ข้อของ project template และเลือกไฟล์ดิบ 3 ไฟล์ที่จะเริ่มตัด",
    proofPrompt: "ใส่ screenshot project template, media bin, หรือโน้ต checklist พร้อมชื่อไฟล์ต้นแบบ",
  },
  {
    title: "เติม B-roll ที่ยังขาด",
    focus: "อุดช่องว่างจากวันถ่ายทำให้ฟุตเทจพอต่อการตัดจริง",
    format: "practice",
    requiresMotion: false,
    full: "ดูฟุตเทจที่ถ่ายไว้แล้วถ่ายเติม B-roll 8 shot ที่ยังขาด เช่น close-up มือทำงาน, หน้าจอแก้ไฟล์, ของก่อน/หลัง, และจัดเข้าโฟลเดอร์เดียวกัน",
    minimum: "ถ่ายเติม B-roll 4 shot และตั้งชื่อไฟล์ให้ต่อกับชุดเดิม",
    emergency: "เขียน shot ที่ยังขาด 5 ข้อจากฟุตเทจวันถ่ายทำ",
    proofPrompt: "ใส่รูปโฟลเดอร์, รายชื่อ shot ที่เติม, หรือ raw clip ตัวอย่าง 3 ชิ้น",
  },
  {
    title: "CapCut Hook Template 3 แบบ",
    focus: "ทำ 3 วินาทีแรกจากฟุตเทจจริงให้มีแพตเทิร์นใช้ซ้ำ",
    format: "motion",
    requiresMotion: true,
    full: "ทำ hook opening ใน CapCut 3 แบบจากฟุตเทจวันถ่ายทำ: pain text pop, before-after split, และ checklist card แล้ว export ตัวอย่าง 5-10 วินาที",
    minimum: "ทำ hook opening 1 แบบจากฟุตเทจจริงให้ export ได้",
    emergency: "เลือก shot เปิดคลิป 1 shot แล้ววาด storyboard hook 3 เฟรมพร้อมคำบนจอ",
    proofPrompt: "ใส่ไฟล์ export, screenshot timeline, หรือ storyboard hook",
  },
  {
    title: "ตัดคลิปสอน CapCut 1 ชิ้น",
    focus: "ใช้ฟุตเทจที่ถ่ายแล้วผลิตคลิปสอนหนึ่งชิ้นให้จบ",
    format: "screen",
    requiresMotion: false,
    full: "ทำคลิป 30-45 วินาทีจากฟุตเทจวันถ่ายทำ หัวข้อ CapCut สำหรับร้านเล็ก เช่น ใส่ซับเร็ว, ตัดเสียงเงียบ, ทำปกคลิป, หรือใส่ text pop แล้วเตรียมโพสต์",
    minimum: "อัดหน้าจอและตัด draft 20 วินาทีแรกให้มี hook, step, CTA",
    emergency: "เขียน script แบบ Hook/Problem/Steps/CTA สำหรับคลิป CapCut 1 เรื่อง",
    proofPrompt: "ใส่ลิงก์โพสต์, draft export, screenshot timeline, หรือ script",
  },
  {
    title: "รีแพ็กคลิปเก่าให้เป็นสไตล์เทคข้างร้าน",
    focus: "ทำเวอร์ชันสำรองจากฟุตเทจเดิม ไม่เริ่มใหม่จากศูนย์",
    format: "saveable",
    requiresMotion: false,
    full: "เลือก raw clip จากฟุตเทจวันถ่ายทำ 1 ชิ้นมาตัดเป็นเวอร์ชันใหม่ใน CapCut ด้วย subtitle style, hook template, B-roll และ caption สำหรับ TikTok/Facebook",
    minimum: "ตัดเวอร์ชันใหม่ 15-20 วินาทีจากฟุตเทจเดิม และเขียนว่าเวอร์ชันนี้ดีขึ้นตรงไหน",
    emergency: "เลือก raw clip 1 ชิ้น แล้วเขียน 3 จุดที่จะแก้ใน CapCut",
    proofPrompt: "ใส่ before/after note, draft export, หรือ caption ที่เตรียมโพสต์",
  },
  {
    title: "Motion Label สำหรับคลิปร้าน",
    focus: "เพิ่ม motion ที่ช่วยอธิบายฟุตเทจจริง ไม่ใช่แต่งเล่นอย่างเดียว",
    format: "motion",
    requiresMotion: true,
    full: "ทำ motion label ใน CapCut 3 แบบสำหรับชี้จุดสำคัญจากฟุตเทจที่ถ่าย เช่น ราคา, ขั้นตอน, ข้อผิดพลาดไฟล์ หรือคำเตือน แล้วใส่ในคลิปจริง 1 จุด",
    minimum: "ทำ motion label 1 แบบและใส่ใน draft จากฟุตเทจจริง 10 วินาที",
    emergency: "ทำ text label 1 ชิ้นพร้อม keyframe เข้า-ออก",
    proofPrompt: "ใส่ export motion label, screenshot keyframe, หรือคลิป draft ที่ใส่ label แล้ว",
  },
  {
    title: "ล็อก Workflow CapCut สัปดาห์หน้า",
    focus: "สรุป workflow จากรอบถ่ายทำจริงให้กลายเป็นระบบตัดต่อประจำช่อง",
    format: "practice",
    requiresMotion: false,
    full: "ทำ CapCut workflow 1 หน้าจากรอบถ่ายทำจริง: ถ่าย, import, rough cut, subtitle, hook, B-roll, motion label, sound, export และเลือก 2 หัวข้อคลิปที่จะผลิตต่อสัปดาห์หน้า",
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
