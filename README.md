# 📱 JuryAi Mobile App (React Native)

A **production-grade Legal AI mobile application** built with React Native, designed as a **structured legal decision interface**, not a generic chatbot.

---

## 🧠 Overview

This app allows users to:
- Ask legal questions
- Select jurisdiction (global or country-specific)
- Choose explanation mode (basic or advanced)
- Receive **structured legal responses** (not plain text)

The backend is a **Python-based RAG (Retrieval-Augmented Generation) system** that ensures:
- Country-aware legal responses
- Use of official legal sources
- Structured and reliable outputs

---

## 🚀 Key Features

### ⚖️ Jurisdiction Modes
- 🌐 **Universal** → General legal guidance
- 🇮🇳 **Single Country** → Country-specific law
- 🌍 **Comparison Mode** → Compare laws across multiple countries

---

### 🧠 Explanation Modes
- 🟢 **Basic Mode**
  - Simple language
  - Direct answer
  - Risk level
  - Practical advice

- 🔵 **Advanced Mode**
  - Legal reasoning (Issue → Rule → Analysis → Conclusion)
  - References to legal provisions
  - Detailed explanation

---

### 💬 Chat Interface
- Chat-based UI
- Local chat history
- Structured AI responses (not plain text)

---

### 📊 Structured Response UI

Every AI response includes:

- **Legality** (Allowed / Restricted / Illegal)
- **Risk Level** (Low / Medium / High)
- **Explanation**
- **Actionable Advice**
- **Legal References**

---

### 🌍 Comparison Mode UI

When multiple countries are selected:

| Country | Legality | Risk |
|--------|---------|------|

---

## 🧠 State Management (Zustand)

```ts
{
  jurisdiction: "universal" | "single" | "comparison",
  countries: string[],
  mode: "basic" | "advanced"
}
```

--- 

### 👨‍💻 Authors

- Samrat Chauhan
- Ronak Malik
