import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContentStudio } from "../components/ContentStudio";

afterEach(() => cleanup());

describe("ContentStudio", () => {
  it("proposes three content options and creates a storyboard from the selected option", () => {
    render(<ContentStudio />);

    const topicInput = screen.getByLabelText("หัวข้อคอนเทนต์");
    fireEvent.change(topicInput, { target: { value: "ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น" } });
    expect(screen.getByRole("combobox", { name: "กลุ่มคนดู" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "แพลตฟอร์ม" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "โทน" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("กลุ่มคนดู"), { target: { value: "แม่ค้าออนไลน์" } });
    fireEvent.change(screen.getByLabelText("แพลตฟอร์ม"), { target: { value: "Facebook Reels" } });
    fireEvent.change(screen.getByLabelText("โทน"), { target: { value: "สอนแบบจับมือทำ" } });
    fireEvent.click(screen.getByRole("button", { name: "คิดคอนเทนต์ 3 แบบ" }));

    expect(screen.getByText("สอนทำ: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
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
