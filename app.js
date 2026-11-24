const textInput = document.getElementById("text-input");
const analyzeBtn = document.getElementById("analyze-btn");
const sampleBtn = document.getElementById("sample-btn");
const clearBtn = document.getElementById("clear-btn");

const wordCountEl = document.getElementById("word-count");
const sentenceCountEl = document.getElementById("sentence-count");
const standardTimeEl = document.getElementById("standard-time");
const adjustedTimeEl = document.getElementById("adjusted-time");
const penaltyDetailEl = document.getElementById("penalty-detail");
const complexityLabelEl = document.getElementById("complexity-label");
const gradeLevelEl = document.getElementById("grade-level");

const SAMPLE_TEXT = `Asynchronous programming in JavaScript relies on the event loop, microtask queues, and Promises to prevent blocking the main execution thread.

When you execute an async function:
\`\`\`javascript
async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
  return await response.json();
}
\`\`\`

Unlike synchronous I/O operations, non-blocking architectures allow single-threaded runtimes to handle high concurrency efficiently, though improper error propagation can lead to unhandled promise rejections.`;

// Heuristic syllable counter for English words
function countSyllables(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (clean.length <= 3) return 1;
  const trimmed = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    .replace(/^y/, "");
  const matches = trimmed.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

function formatTime(minutes) {
  if (minutes === 0) return "0 min";
  if (minutes < 1) return "< 1 min";
  return `${Math.ceil(minutes)} min`;
}

function analyzeText(rawText) {
  const trimmed = rawText.trim();
  if (!trimmed) {
    resetUI();
    return;
  }

  // 1. Basic counts
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  // 2. Syllable count & Flesch-Kincaid Grade Level
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const gradeLevel = Math.max(
    1,
    0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59
  );

  // 3. Detect code blocks & technical symbol density (e.g., {}, =>, (), ;)
  const codeBlockMatches = trimmed.match(/```[\s\S]*?```/g) || [];
  const techSymbolMatches = trimmed.match(/[{}\[\]()=>;]/g) || [];
  const symbolRatio = techSymbolMatches.length / wordCount;
  const hasHeavyCode = codeBlockMatches.length > 0 || symbolRatio > 0.15;

  // 4. Calculate reading times
  const baseWPM = 238; // Average adult silent reading speed
  const standardMinutes = wordCount / baseWPM;

  let speedMultiplier = 1.0;
  const reasons = [];

  if (gradeLevel >= 12) {
    speedMultiplier -= 0.2;
    reasons.push("dense vocabulary");
  } else if (gradeLevel >= 9) {
    speedMultiplier -= 0.1;
    reasons.push("moderate vocabulary");
  }

  if (hasHeavyCode) {
    speedMultiplier -= 0.25;
    reasons.push("code/syntax");
  }

  const adjustedWPM = Math.max(90, baseWPM * speedMultiplier);
  const adjustedMinutes = wordCount / adjustedWPM;

  // 5. Complexity classification
  let loadLabel = "Light";
  if (gradeLevel >= 13 || (gradeLevel >= 10 && hasHeavyCode)) {
    loadLabel = "Heavy";
  } else if (gradeLevel >= 9 || hasHeavyCode) {
    loadLabel = "Moderate";
  }

  // 6. Update DOM
  wordCountEl.textContent = wordCount.toLocaleString();
  sentenceCountEl.textContent = `${sentenceCount} sentence${sentenceCount === 1 ? "" : "s"}`;
  standardTimeEl.textContent = formatTime(standardMinutes);
  adjustedTimeEl.textContent = formatTime(adjustedMinutes);
  penaltyDetailEl.textContent =
    reasons.length > 0 ? `Adjusted for ${reasons.join(" + ")}` : "Standard pace";
  complexityLabelEl.textContent = loadLabel;
  gradeLevelEl.textContent = `Grade Level: ${gradeLevel.toFixed(1)}`;
}

function resetUI() {
  wordCountEl.textContent = "0";
  sentenceCountEl.textContent = "0 sentences";
  standardTimeEl.textContent = "0 min";
  adjustedTimeEl.textContent = "0 min";
  penaltyDetailEl.textContent = "No complexity penalty";
  complexityLabelEl.textContent = "—";
  gradeLevelEl.textContent = "Grade Level: —";
}

analyzeBtn.addEventListener("click", () => analyzeText(textInput.value));

sampleBtn.addEventListener("click", () => {
  textInput.value = SAMPLE_TEXT;
  analyzeText(SAMPLE_TEXT);
});

clearBtn.addEventListener("click", () => {
  textInput.value = "";
  resetUI();
});