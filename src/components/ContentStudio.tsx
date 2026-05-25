import { Lightbulb, PanelsTopLeft, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { createStoryboard, generateContentOptions, normalizeBrief, type ContentBrief, type ContentOption, type StoryboardPack } from "../domain/contentStudio";

const defaultBrief: ContentBrief = normalizeBrief({});

const audienceOptions = [
  "เจ้าของร้านเล็ก",
  "แม่ค้าออนไลน์",
  "ร้านอาหาร/คาเฟ่",
  "ร้านพิมพ์/ถ่ายเอกสาร",
  "คนเริ่มทำคอนเทนต์",
  "มือใหม่ใช้ AI/Canva/CapCut",
  "ลูกค้าทั่วไปที่ไม่ถนัดเทค",
  "นักเรียน/นักศึกษา",
  "ฟรีแลนซ์/คนทำงานคนเดียว",
];

const platformOptions = [
  "TikTok",
  "Facebook Reels",
  "Instagram Reels",
  "YouTube Shorts",
  "Facebook Post",
  "Facebook Page",
  "LINE OA Broadcast",
  "Canva Presentation",
  "CapCut Video",
];

const toneOptions = [
  "เข้าใจง่าย",
  "จริงใจ/เป็นกันเอง",
  "กระตุ้นให้ลงมือทำ",
  "สอนแบบจับมือทำ",
  "เตือนข้อผิดพลาด",
  "มืออาชีพ/น่าเชื่อถือ",
  "สนุก/ไว/จังหวะเร็ว",
  "อบอุ่น/ช่วยเหลือ",
  "ขายแบบไม่ยัดเยียด",
];

export function ContentStudio() {
  const [brief, setBrief] = useState<ContentBrief>(defaultBrief);
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ContentOption | null>(null);
  const storyboard: StoryboardPack | null = useMemo(() => (selectedOption ? createStoryboard(selectedOption) : null), [selectedOption]);
  const canGenerate = brief.topic.trim().length > 0;

  function updateBrief(field: keyof ContentBrief, value: string) {
    setBrief((currentBrief) => ({ ...currentBrief, [field]: value }));
  }

  function handleGenerateOptions() {
    const nextOptions = generateContentOptions(brief);
    setOptions(nextOptions);
    setSelectedOption(null);
  }

  function handleSelectOption(option: ContentOption) {
    setSelectedOption(option);
  }

  return (
    <div className="page-stack content-studio">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Content Studio</p>
          <h2>คิดคอนเทนต์ + Storyboard</h2>
          <p>ใส่หัวข้อครั้งเดียว ระบบเสนอ 3 รูปแบบ แล้วแตกเป็น storyboard พร้อม prompt สำหรับทำคลิปต่อ</p>
        </div>
      </header>

      <section className="panel studio-brief-panel">
        <div className="panel-heading">
          <div>
            <h3>Brief</h3>
            <p className="muted">เวอร์ชันนี้เป็น template-based ไม่มีค่า API เพิ่ม</p>
          </div>
          <Sparkles aria-hidden="true" />
        </div>
        <div className="studio-form-grid">
          <label>
            <span>หัวข้อคอนเทนต์</span>
            <textarea aria-label="หัวข้อคอนเทนต์" value={brief.topic} onChange={(event) => updateBrief("topic", event.target.value)} rows={3} />
          </label>
          <label>
            <span>กลุ่มคนดู</span>
            <select value={brief.audience} onChange={(event) => updateBrief("audience", event.target.value)}>
              {audienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>แพลตฟอร์ม</span>
            <select value={brief.platform} onChange={(event) => updateBrief("platform", event.target.value)}>
              {platformOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>ความยาว</span>
            <input value={brief.length} onChange={(event) => updateBrief("length", event.target.value)} />
          </label>
          <label>
            <span>โทน</span>
            <select value={brief.tone} onChange={(event) => updateBrief("tone", event.target.value)}>
              {toneOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="action-row">
          <button className="primary-action" disabled={!canGenerate} onClick={handleGenerateOptions} type="button">
            <Lightbulb size={18} />
            คิดคอนเทนต์ 3 แบบ
          </button>
        </div>
      </section>

      {options.length > 0 && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Content Options</h3>
              <p className="muted">เลือก angle ที่เหมาะกับคลิปวันนี้ที่สุด</p>
            </div>
            <PanelsTopLeft aria-hidden="true" />
          </div>
          <div className="content-option-grid">
            {options.map((option) => (
              <article className={`content-option ${selectedOption?.id === option.id ? "is-selected" : ""}`} key={option.id}>
                <span className="tag">{option.format}</span>
                <h4>{option.title}</h4>
                <p>{option.hook}</p>
                <dl>
                  <div>
                    <dt>Angle</dt>
                    <dd>{option.angle}</dd>
                  </div>
                  <div>
                    <dt>Promise</dt>
                    <dd>{option.promise}</dd>
                  </div>
                </dl>
                <button className="secondary-action" onClick={() => handleSelectOption(option)} type="button">
                  เลือกแบบ {option.format}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {storyboard && (
        <section className="panel storyboard-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow dark">Storyboard Design</p>
              <h3>Visual board 6 เฟรม</h3>
              <p className="muted">{storyboard.option.title}</p>
            </div>
          </div>
          <div className="storyboard-design-sheet" aria-label="Storyboard Design">
            {storyboard.frames.map((frame) => (
              <article className="storyboard-design-cell" key={`design-${frame.frame}`}>
                <strong>Frame {frame.frame}</strong>
                <span>{frame.beat}</span>
                <p>{frame.textOverlay}</p>
              </article>
            ))}
          </div>
          <div className="storyboard-grid">
            {storyboard.frames.map((frame) => (
              <article className="storyboard-frame" key={frame.frame}>
                <div className="frame-preview">
                  <strong>Frame {frame.frame}</strong>
                  <span>{frame.beat}</span>
                </div>
                <div className="frame-details">
                  <h4>{frame.time}</h4>
                  <p>{frame.visual}</p>
                  <b>{frame.textOverlay}</b>
                  <small>{frame.motion}</small>
                  <em>{frame.voiceover}</em>
                </div>
              </article>
            ))}
          </div>
          <div className="prompt-grid">
            <section>
              <h3>Image prompts</h3>
              <ol>
                {storyboard.frames.map((frame) => (
                  <li key={frame.frame}>{frame.imagePrompt}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3>Production notes</h3>
              <p>{storyboard.productionNotes}</p>
            </section>
          </div>
        </section>
      )}
    </div>
  );
}
