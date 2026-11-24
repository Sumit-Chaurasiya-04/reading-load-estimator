# Reading-Time & Cognitive-Load Estimator

A lightweight, client-side web utility that estimates realistic reading times by factoring in **vocabulary complexity** (Flesch-Kincaid Grade Level) and **code/technical symbol density**.

**Live Demo:** `https://sumit-chaurasiya-04.github.io/reading-load-estimator/` *(Update this link if your GitHub username differs)*

## Problem
Standard reading-time estimators divide word count by a flat ~238 WPM. They fail on dense academic abstracts, technical documentation, and articles containing code blocks, which take significantly longer to comprehend.

## Features
- **Zero-Backend & Privacy-First:** 100% browser-side JavaScript; no text is sent to any server.
- **Cognitive-Load Scoring:** Computes Flesch-Kincaid Grade Level using a heuristic syllable counter.
- **Technical Density Penalty:** Detects fenced code blocks and high syntax-symbol ratios to adjust reading speed dynamically.
- **One-Click Testing:** Includes a built-in sample technical passage for instant verification.

## Tech Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Hosting:** GitHub Pages

## Run Locally
No build step or package manager required:
1. Clone the repository:
   ```bash
   git clone [https://github.com/sumit-chaurasiya-04/reading-load-estimator.git](https://github.com/sumit-chaurasiya-04/reading-load-estimator.git)