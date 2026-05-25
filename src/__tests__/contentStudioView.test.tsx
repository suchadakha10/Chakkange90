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
    fireEvent.click(screen.getByRole("button", { name: "คิดคอนเทนต์ 3 แบบ" }));

    expect(screen.getByText("สอนทำ: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
    expect(screen.getByText("แก้พลาด: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();
    expect(screen.getByText("เรื่องเล่า: ร้านเล็กใช้ AI ตอบลูกค้าเร็วขึ้น")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "เลือกแบบ How-to" }));

    expect(screen.getByText("Storyboard Design")).toBeInTheDocument();
    expect(screen.getByText("Visual board 6 เฟรม")).toBeInTheDocument();
    expect(screen.getAllByText("Frame 1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Frame 6").length).toBeGreaterThan(0);
    expect(screen.getByText("Image prompts")).toBeInTheDocument();
  });
});
