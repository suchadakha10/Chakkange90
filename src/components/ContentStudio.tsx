import { Lightbulb, PanelsTopLeft, Search, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { requestGeminiContentPack, requestGeminiTopicIdeas, type ContentStudioApiPack, type TopicIdeasApiPack } from "../domain/contentStudioApi";
import { createStoryboard, generateContentOptions, generateTopicIdeas, normalizeBrief, type ContentBrief, type ContentOption, type StoryboardPack, type TopicIdea } from "../domain/contentStudio";

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

const topicCategoryOptions = [
  "AI ช่วยงานร้าน",
  "Canva / งานออกแบบ",
  "CapCut / ตัดต่อคลิป",
  "การขายออนไลน์",
  "งานพิมพ์ / เอกสาร",
  "คอนเทนต์ร้านเล็ก",
  "ปัญหาลูกค้าถามบ่อย",
  "ไอเดียตามกระแส",
  "กำหนดเอง",
];

export function ContentStudio() {
  const [brief, setBrief] = useState<ContentBrief>(defaultBrief);
  const [topicCategoryMode, setTopicCategoryMode] = useState(defaultBrief.topicCategory);
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [selectedOption, setSelectedOption] = useState<ContentOption | null>(null);
  const [storyboardsByOption, setStoryboardsByOption] = useState<ContentStudioApiPack["storyboardsByOption"]>({});
  const [generationMeta, setGenerationMeta] = useState<ContentStudioApiPack | null>(null);
  const [topicIdeas, setTopicIdeas] = useState<TopicIdea[]>([]);
  const [topicMeta, setTopicMeta] = useState<TopicIdeasApiPack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState(false);
  const storyboard: StoryboardPack | null = useMemo(() => {
    if (!selectedOption) {
      return null;
    }
    const remoteStoryboard = storyboardsByOption?.[selectedOption.id];
    if (remoteStoryboard) {
      return {
        option: selectedOption,
        frames: remoteStoryboard.frames,
        productionNotes: remoteStoryboard.productionNotes,
      };
    }
    return createStoryboard(selectedOption);
  }, [selectedOption, storyboardsByOption]);
  const canGenerate = brief.topic.trim().length > 0;

  function updateBrief(field: keyof ContentBrief, value: string) {
    setBrief((currentBrief) => ({ ...currentBrief, [field]: value }));
  }

  function updateTopicCategoryMode(value: string) {
    setTopicCategoryMode(value);
    if (value !== "กำหนดเอง") {
      updateBrief("topicCategory", value);
    } else {
      updateBrief("topicCategory", "");
    }
  }

  async function handleGenerateTopicIdeas() {
    setIsGeneratingTopics(true);
    try {
      const pack = await requestGeminiTopicIdeas(brief);
      if (pack.topics.length) {
        setTopicIdeas(pack.topics);
        setTopicMeta(pack);
        return;
      }
    } catch {
      // Fall back to local topic templates when Gemini is unavailable.
    } finally {
      setIsGeneratingTopics(false);
    }

    const nextTopics = generateTopicIdeas(brief);
    setTopicIdeas(nextTopics);
    setTopicMeta({
      topics: nextTopics,
      source: "template",
      warning: "ใช้ template สำรอง เพราะ Gemini API ยังไม่พร้อมใช้งาน",
    });
  }

  async function handleGenerateOptions() {
    setIsGenerating(true);
    setSelectedOption(null);
    try {
      const pack = await requestGeminiContentPack(brief);
      if (pack.options.length) {
        setOptions(pack.options);
        setStoryboardsByOption(pack.storyboardsByOption || {});
        setGenerationMeta(pack);
        return;
      }
    } catch {
      // Fall back to the built-in template when Gemini is unavailable or over quota.
    } finally {
      setIsGenerating(false);
    }

    const nextOptions = generateContentOptions(brief);
    setOptions(nextOptions);
    setStoryboardsByOption({});
    setGenerationMeta({
      options: nextOptions,
      source: "template",
      warning: "ใช้ template สำรอง เพราะ Gemini API ยังไม่พร้อมใช้งาน",
    });
  }

  function handleSelectOption(option: ContentOption) {
    setSelectedOption(option);
  }

  function handleUseTopic(idea: TopicIdea) {
    setBrief((currentBrief) => ({ ...currentBrief, topic: idea.title }));
    setOptions([]);
    setSelectedOption(null);
    setStoryboardsByOption({});
    setGenerationMeta(null);
  }

  return (
    <div className="page-stack content-studio">
      <header className="page-header">
        <div>
          <p className="eyebrow dark">Content Studio</p>
          <h2>คิดคอนเทนต์ + Storyboard</h2>
          <p>เลือกหมวดหมู่ก่อน ระบบช่วยคิดหัวข้อ แล้วค่อยแตกเป็นคอนเทนต์ 3 แบบและ storyboard</p>
        </div>
      </header>

      <section className="panel studio-brief-panel">
        <div className="panel-heading">
          <div>
            <h3>1. ตั้งค่าการค้นหาหัวข้อ</h3>
            <p className="muted">เริ่มจากบริบทและหมวดหมู่ แล้วให้ Gemini ช่วยคิดหัวข้อที่เหมาะกับแพลตฟอร์ม</p>
          </div>
          <Sparkles aria-hidden="true" />
        </div>
        <div className="studio-form-grid">
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
            <span>หมวดหมู่หัวข้อ</span>
            <select aria-label="หมวดหมู่หัวข้อ" value={topicCategoryMode} onChange={(event) => updateTopicCategoryMode(event.target.value)}>
              {topicCategoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          {topicCategoryMode === "กำหนดเอง" && (
            <label>
              <span>หมวดหมู่ที่ต้องการค้นหา</span>
              <input aria-label="หมวดหมู่ที่ต้องการค้นหา" value={brief.topicCategory} onChange={(event) => updateBrief("topicCategory", event.target.value)} />
            </label>
          )}
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
          <label>
            <span>ความยาว</span>
            <input value={brief.length} onChange={(event) => updateBrief("length", event.target.value)} />
          </label>
        </div>
        <div className="action-row">
          <button className="secondary-action" disabled={isGeneratingTopics} onClick={handleGenerateTopicIdeas} type="button">
            <Search size={18} />
            {isGeneratingTopics ? "กำลังคิดหัวข้อ..." : "คิดหัวข้อจากหมวดหมู่"}
          </button>
        </div>
        {topicIdeas.length > 0 && (
          <div className="topic-radar">
            <div>
              <h3>Topic Radar</h3>
              <p className="muted">เลือกหัวข้อจากกระแส/คำค้นหา หรือแก้หัวข้อเองในช่องด้านบนได้</p>
              {topicMeta && (
                <p className="generation-source">
                  {topicMeta.source === "gemini" ? "Gemini API" : "Template สำรอง"}
                  {topicMeta.model ? ` · ${topicMeta.model}` : ""}
                  {topicMeta.activeKeyIndex ? ` · key #${topicMeta.activeKeyIndex}` : ""}
                  {topicMeta.attemptedKeys ? ` · ลอง ${topicMeta.attemptedKeys} key` : ""}
                  {topicMeta.warning ? ` · ${topicMeta.warning}` : ""}
                </p>
              )}
            </div>
            <div className="topic-idea-grid">
              {topicIdeas.map((idea) => (
                <article className="topic-idea-card" key={idea.id}>
                  <span className="tag">{idea.source}</span>
                  <h4>{idea.title}</h4>
                  <p>{idea.insight}</p>
                  <small>{idea.platform} · {idea.searchIntent}</small>
                  <button className="secondary-action" onClick={() => handleUseTopic(idea)} type="button">
                    ใช้หัวข้อนี้
                  </button>
                </article>
              ))}
            </div>
          </div>
        )}
        <div className="topic-compose">
          <div>
            <h3>2. เลือกหรือพิมพ์หัวข้อ</h3>
            <p className="muted">เลือกจาก Topic Radar หรือพิมพ์หัวข้อเองได้ ก่อนสร้างคอนเทนต์ 3 แบบ</p>
          </div>
          <label>
            <span>หัวข้อที่เลือก</span>
            <textarea aria-label="หัวข้อที่เลือก" value={brief.topic} onChange={(event) => updateBrief("topic", event.target.value)} rows={3} />
          </label>
          <button className="primary-action" disabled={!canGenerate || isGenerating} onClick={handleGenerateOptions} type="button">
            <Lightbulb size={18} />
            {isGenerating ? "กำลังให้ Gemini คิด..." : "คิดคอนเทนต์ 3 แบบ"}
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
          {generationMeta && (
            <p className="generation-source">
              {generationMeta.source === "gemini" ? "Gemini API" : "Template สำรอง"}
              {generationMeta.model ? ` · ${generationMeta.model}` : ""}
              {generationMeta.activeKeyIndex ? ` · key #${generationMeta.activeKeyIndex}` : ""}
              {generationMeta.attemptedKeys ? ` · ลอง ${generationMeta.attemptedKeys} key` : ""}
              {generationMeta.warning ? ` · ${generationMeta.warning}` : ""}
            </p>
          )}
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
