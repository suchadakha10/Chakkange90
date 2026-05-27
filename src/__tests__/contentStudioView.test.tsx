import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentStudio } from "../components/ContentStudio";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("ContentStudio", () => {
  it("lets the user choose a topic category or type a custom category for topic search", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        topics: [
          {
            id: "topic-1",
            title: "ภาษีร้านเล็กต้องรู้ก่อนโพสต์ขาย",
            source: "คำค้นหายอดนิยม",
            insight: "คนขายออนไลน์ค้นหาเรื่องภาษีแต่กลัวภาษายาก",
            platform: "Facebook Reels",
            searchIntent: "ภาษีร้านเล็ก",
          },
        ],
        source: "gemini",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<ContentStudio />);

    fireEvent.change(screen.getByLabelText("หมวดหมู่หัวข้อ"), { target: { value: "กำหนดเอง" } });
    fireEvent.change(screen.getByLabelText("หมวดหมู่ที่ต้องการค้นหา"), { target: { value: "ภาษีร้านเล็ก" } });
    fireEvent.click(screen.getByRole("button", { name: "คิดหัวข้อจากหมวดหมู่" }));

    expect(await screen.findByText("ภาษีร้านเล็กต้องรู้ก่อนโพสต์ขาย")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/content-studio/topics",
      expect.objectContaining({
        body: expect.stringContaining("\"topicCategory\":\"ภาษีร้านเล็ก\""),
      }),
    );
  });

  it("starts with category context before the editable selected topic", async () => {
    const { container } = render(<ContentStudio />);

    const text = container.textContent || "";
    expect(text.indexOf("หมวดหมู่หัวข้อ")).toBeGreaterThan(-1);
    expect(text.indexOf("หัวข้อที่เลือก")).toBeGreaterThan(-1);
    expect(text.indexOf("หมวดหมู่หัวข้อ")).toBeLessThan(text.indexOf("หัวข้อที่เลือก"));
    expect(screen.getByRole("button", { name: "คิดหัวข้อจากหมวดหมู่" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "คิดหัวข้อตามกระแส" })).not.toBeInTheDocument();
  });

  it("lets the user generate category topics and choose one as the editable selected topic", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          topics: [
            {
              id: "topic-1",
              title: "AI ช่วยตอบลูกค้าแบบไหนที่แม่ค้าออนไลน์ค้นหาบ่อย",
              source: "คำค้นหายอดนิยม",
              insight: "คนดูอยากได้วิธีตอบแชตไวขึ้นแต่ยังดูเป็นธรรมชาติ",
              platform: "Facebook Reels",
              searchIntent: "ใช้ AI ตอบลูกค้า",
            },
          ],
          source: "gemini",
          model: "gemini-2.5-flash",
          attemptedKeys: 1,
          activeKeyIndex: 1,
        }),
      }),
    );

    render(<ContentStudio />);

    fireEvent.change(screen.getByLabelText("กลุ่มคนดู"), { target: { value: "แม่ค้าออนไลน์" } });
    fireEvent.change(screen.getByLabelText("แพลตฟอร์ม"), { target: { value: "Facebook Reels" } });
    fireEvent.click(screen.getByRole("button", { name: "คิดหัวข้อจากหมวดหมู่" }));

    expect(await screen.findByText("AI ช่วยตอบลูกค้าแบบไหนที่แม่ค้าออนไลน์ค้นหาบ่อย")).toBeInTheDocument();
    expect(screen.getByText("คำค้นหายอดนิยม")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "ใช้หัวข้อนี้" }));

    expect(screen.getByLabelText("หัวข้อที่เลือก")).toHaveValue("AI ช่วยตอบลูกค้าแบบไหนที่แม่ค้าออนไลน์ค้นหาบ่อย");
  });

  it("uses the Gemini API content pack when the local API returns one", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          options: [
            {
              id: "How-to",
              format: "How-to",
              title: "Gemini: ตอบลูกค้าไวโดยไม่เสียความเป็นร้าน",
              hook: "ลูกค้าทักพร้อมกันหลายคน ใช้ข้อความต้นแบบแบบนี้",
              angle: "สอนเป็นขั้นตอนสำหรับแม่ค้าออนไลน์",
              promise: "ได้ flow ที่เอาไปใช้ได้วันนี้",
              brief: {
                topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
                audience: "แม่ค้าออนไลน์",
                platform: "Facebook Reels",
                length: "20 วินาที",
                tone: "สอนแบบจับมือทำ",
              },
            },
            {
              id: "Problem-Solution",
              format: "Problem-Solution",
              title: "Gemini: แก้จุดเสียเวลาตอบซ้ำ",
              hook: "ตอบคำถามเดิมซ้ำทุกวันคือเวลาที่หายไป",
              angle: "เปิดปัญหาแล้วให้วิธีแก้",
              promise: "ลดเวลาตอบคำถามซ้ำ",
              brief: {
                topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
                audience: "แม่ค้าออนไลน์",
                platform: "Facebook Reels",
                length: "20 วินาที",
                tone: "สอนแบบจับมือทำ",
              },
            },
            {
              id: "Story",
              format: "Story",
              title: "Gemini: ก่อนหลังใช้ AI ช่วยตอบ",
              hook: "จากตอบไม่ทันเป็นมีระบบตอบที่นิ่งขึ้น",
              angle: "เล่าเป็นเคสสั้น",
              promise: "เห็นภาพก่อนหลัง",
              brief: {
                topic: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น",
                audience: "แม่ค้าออนไลน์",
                platform: "Facebook Reels",
                length: "20 วินาที",
                tone: "สอนแบบจับมือทำ",
              },
            },
          ],
          storyboardsByOption: {
            "How-to": {
              optionId: "How-to",
              frames: [
                {
                  frame: 1,
                  time: "0:00-0:03",
                  beat: "Hook",
                  visual: "เปิดด้วยหน้าจอแชตลูกค้าเด้งรัว",
                  textOverlay: "ลูกค้าทักรัว ตอบยังไงให้ทัน",
                  motion: "ซูมเข้าแชตแล้ว text pop",
                  voiceover: "ถ้าลูกค้าทักพร้อมกันหลายคน ลองทำแบบนี้",
                  imagePrompt: "vertical online seller chat notifications",
                },
              ],
              productionNotes: "ใช้จังหวะเร็วและตัวเลขก่อนหลัง",
            },
          },
          source: "gemini",
          model: "gemini-2.5-flash",
          attemptedKeys: 1,
          activeKeyIndex: 2,
        }),
      }),
    );

    render(<ContentStudio />);

    fireEvent.change(screen.getByLabelText("หัวข้อที่เลือก"), { target: { value: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น" } });
    fireEvent.change(screen.getByLabelText("กลุ่มคนดู"), { target: { value: "แม่ค้าออนไลน์" } });
    fireEvent.change(screen.getByLabelText("แพลตฟอร์ม"), { target: { value: "Facebook Reels" } });
    fireEvent.change(screen.getByLabelText("โทน"), { target: { value: "สอนแบบจับมือทำ" } });
    fireEvent.click(screen.getByRole("button", { name: "คิดคอนเทนต์ 3 แบบ" }));

    expect(await screen.findByText("Gemini: ตอบลูกค้าไวโดยไม่เสียความเป็นร้าน")).toBeInTheDocument();
    expect(screen.getByText("Gemini API", { exact: false, selector: ".generation-source" })).toBeInTheDocument();
    expect(screen.getByText("key #2", { exact: false, selector: ".generation-source" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "เลือกแบบ How-to" }));

    expect(screen.getAllByText("ลูกค้าทักรัว ตอบยังไงให้ทัน").length).toBeGreaterThan(0);
    expect(screen.getByText("ใช้จังหวะเร็วและตัวเลขก่อนหลัง")).toBeInTheDocument();
  });

  it("proposes three content options and creates a storyboard from the selected option", async () => {
    render(<ContentStudio />);

    const topicInput = screen.getByLabelText("หัวข้อที่เลือก");
    fireEvent.change(topicInput, { target: { value: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น" } });
    expect(screen.getByRole("combobox", { name: "กลุ่มคนดู" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "แพลตฟอร์ม" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "โทน" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("กลุ่มคนดู"), { target: { value: "แม่ค้าออนไลน์" } });
    fireEvent.change(screen.getByLabelText("แพลตฟอร์ม"), { target: { value: "Facebook Reels" } });
    fireEvent.change(screen.getByLabelText("โทน"), { target: { value: "สอนแบบจับมือทำ" } });
    fireEvent.click(screen.getByRole("button", { name: "คิดคอนเทนต์ 3 แบบ" }));

    expect(await screen.findByText("สอนทำ: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
    expect(screen.getByText("แก้พลาด: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
    expect(screen.getByText("เรื่องเล่า: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
    expect(screen.getByText("คลิป Facebook Reels 20 วินาที แบบสอนเร็วสำหรับ แม่ค้าออนไลน์")).toBeInTheDocument();
    expect(screen.getByText("คนดูได้ขั้นตอนที่ทำตามได้ทันที น้ำเสียง สอนแบบจับมือทำ")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "เลือกแบบ How-to" }));

    expect(screen.getByText("Storyboard Design")).toBeInTheDocument();
    expect(screen.getByText("Visual board 6 เฟรม")).toBeInTheDocument();
    expect(screen.getAllByText("Frame 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Frame 6").length).toBeGreaterThan(0);
    expect(screen.getByText("Image prompts")).toBeInTheDocument();
  });
});
