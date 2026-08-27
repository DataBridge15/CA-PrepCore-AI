require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| APP UPDATE INFORMATION
|--------------------------------------------------------------------------
*/

const APP_VERSION = "2.0.0";
const APP_VERSION_CODE = 2;

const APK_DOWNLOAD_URL =
  "https://github.com/DataBridge15/CA-PrepCore-AI/releases/latest";

app.get("/api/app-version", (req, res) => {
  res.json({
    success: true,
    version: APP_VERSION,
    versionCode: APP_VERSION_CODE,
    downloadUrl: APK_DOWNLOAD_URL,
    forceUpdate: false,
    releaseNotes:
      "Initial public release of CA PrepCore AI.",
  });
});

/*
|--------------------------------------------------------------------------
| GEMINI SETUP
|--------------------------------------------------------------------------
*/

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error(
    "ERROR: GEMINI_API_KEY is missing from server/.env"
  );

  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
});

/*
|--------------------------------------------------------------------------
| RESPONSE VALIDATION
|--------------------------------------------------------------------------
*/

const hasUnresolvedAnswerContent = (answer) => {
  return (
    /(?:₹\s*)?XXX\b/i.test(answer) ||
    /\[(?:amount|value)\]/i.test(answer) ||
    /\.\.\./.test(answer) ||
    /\\(?:text|mathrm|operatorname|textbf|mathbf|mathit|emph)\s*\{/i.test(
      answer
    ) ||
    /\\(?:begin|end)\s*\{/i.test(answer)
  );
};

/*
|--------------------------------------------------------------------------
| LATEX / RAW FORMATTING CLEANUP
|--------------------------------------------------------------------------
*/

const cleanLatexFormatting = (answer) => {
  let cleaned = answer || "";
  let previous;

  do {
    previous = cleaned;

    cleaned = cleaned.replace(
      /\\(?:text|mathrm|operatorname|textbf|mathbf|mathit|emph)\{([^{}]*)\}/gi,
      "$1"
    );
  } while (cleaned !== previous);

  cleaned = cleaned
    .replace(
      /\\begin\{(?:array|aligned|align\*?|tabular|matrix|pmatrix|bmatrix|cases)\}(?:\{[^{}]*\})?/gi,
      ""
    )
    .replace(
      /\\end\{(?:array|aligned|align\*?|tabular|matrix|pmatrix|bmatrix|cases)\}/gi,
      ""
    )
    .replace(/\\hline/g, "")
    .replace(/\\(?:left|right)/g, "")
    .replace(/\\(?:cdot|times)/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\%/g, "%");

  while (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(cleaned)) {
    cleaned = cleaned.replace(
      /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      "($1) / ($2)"
    );
  }

  while (/\\sqrt\{[^{}]*\}/.test(cleaned)) {
    cleaned = cleaned.replace(
      /\\sqrt\{([^{}]*)\}/g,
      "√($1)"
    );
  }

  return cleaned
    .replace(/\$\$/g, "")
    .replace(/\\(?:\[|\]|\(|\))/g, "")
    .replace(/\\{2,}(?=\s|&|$)/g, "\n")
    .replace(/(^|\n)\s*&\s*/g, "$1    ")
    .replace(/\s*&\s*/g, " ")
    .replace(/\\(?:,|;|!|quad|qquad)\s*/g, " ")
    .replace(/\.\.\./g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

/*
|--------------------------------------------------------------------------
| NUMERICAL / ACCOUNTING QUESTION DETECTION
|--------------------------------------------------------------------------
*/

const looksLikeNumericalQuestion = (question) => {
  const text = question.toLowerCase();

  const numericalKeywords = [
    "calculate",
    "calculation",
    "find",
    "compute",
    "amount",
    "percentage",
    "rate",
    "ratio",
    "profit",
    "loss",
    "cost",
    "price",
    "value",
    "depreciation",
    "depreciable",
    "residual",
    "scrap",
    "useful life",
    "years",
    "months",
    "interest",
    "discount",
    "capital",
    "revenue",
    "expense",
    "journal entry",
    "journal entries",
    "debit",
    "credit",
    "accounting",
    "straight line",
    "written down",
    "w.d.v",
    "wdv",
    "inventory",
    "stock",
    "salary",
    "commission",
    "tax",
    "gst",
    "igst",
    "cgst",
    "sgst",
  ];

  const hasNumber = /\d/.test(text);

  const hasCurrency =
    /₹|\brs\.?\b|\binr\b|\$|€|£/i.test(text);

  return (
    (hasNumber &&
      numericalKeywords.some((word) =>
        text.includes(word)
      )) ||
    (hasCurrency &&
      numericalKeywords.some((word) =>
        text.includes(word)
      ))
  );
};

/*
|--------------------------------------------------------------------------
| INDEPENDENT NUMERICAL VERIFICATION
|--------------------------------------------------------------------------
*/

const verifyNumericalAnswer = async (
  question,
  answer
) => {
  try {
    const verificationPrompt = `
You are the independent numerical verification engine for CA PrepCore.AI.

Do NOT rewrite the answer.

Verify whether the proposed answer is mathematically and
accounting-wise consistent with the original question.

ORIGINAL QUESTION:
${question}

PROPOSED ANSWER:
${answer}

Check:

1. Every numerical value given in the question.
2. Correct use of all relevant values.
3. Every numerical calculation.
4. Formula correctness.
5. Addition and subtraction.
6. Division, percentages and rates.
7. Double counting or double subtraction.
8. Depreciation calculations.
9. Journal entry amounts and debit/credit consistency.
10. Placeholder or incomplete values.

Do not assume the proposed answer is correct.

Return ONLY valid JSON:

{
  "isCorrect": true,
  "issues": [],
  "correctedCalculations": [],
  "correctFinalAnswer": ""
}

If wrong:

"isCorrect": false

Put every problem in "issues".

Put corrected calculations in
"correctedCalculations".

Put a concise corrected student-facing answer in
"correctFinalAnswer".

If required information is genuinely missing,
mention it in "issues" and do not invent values.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: verificationPrompt,
        config: {
          maxOutputTokens: 1200,
          temperature: 0.1,
        },
      });

    const raw =
      response.text
        ? response.text.trim()
        : "";

    if (!raw) {
      return {
        isCorrect: true,
        issues: [],
        correctedCalculations: [],
        correctFinalAnswer: "",
      };
    }

    const cleanedJson =
      raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

    try {
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error(
        "NUMERICAL VERIFICATION JSON ERROR:",
        raw
      );

      return {
        isCorrect: true,
        issues: [],
        correctedCalculations: [],
        correctFinalAnswer: "",
      };
    }
  } catch (error) {
    console.error(
      "NUMERICAL VERIFICATION ERROR:",
      error
    );

    return {
      isCorrect: true,
      issues: [],
      correctedCalculations: [],
      correctFinalAnswer: "",
    };
  }
};

/*
|--------------------------------------------------------------------------
| CORRECT FAILED NUMERICAL ANSWER
|--------------------------------------------------------------------------
*/

const correctNumericalAnswer = async (
  question,
  answer,
  verification
) => {
  const correctionPrompt = `
You are PrepCore AI.

The original answer failed numerical/accounting verification.

ORIGINAL QUESTION:
${question}

ORIGINAL ANSWER:
${answer}

VERIFICATION:
${JSON.stringify(
  verification,
  null,
  2
)}

Rewrite the answer completely and correctly.

Rules:

1. Recalculate everything yourself.
2. Use every relevant value from the question.
3. Never invent missing information.
4. Never use:
   XXX
   ₹XXX
   [amount]
   [value]
   ...
5. Do not use raw LaTeX.
6. Use plain-text formulas.
7. For numerical answers use:

Given Information
Required
Formula / Method
Working / Calculation
Arithmetic Check
Final Answer

8. For journal entries identify accounts and
   debit/credit sides where applicable.
9. Do not add unrelated entries.
10. Keep the answer reasonably concise.

Return ONLY the corrected student-facing answer.
`;

  const response =
    await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: correctionPrompt,
      config: {
        maxOutputTokens: 1800,
        temperature: 0.1,
      },
    });

  return response.text
    ? cleanLatexFormatting(
        response.text
      )
    : "";
};

/*
|--------------------------------------------------------------------------
| MAIN AI PROMPT
|--------------------------------------------------------------------------
*/

const buildMainPrompt = ({
  question,
  subject,
  chapter,
}) => {
  return `
You are PrepCore AI, an educational AI assistant for Chartered Accountancy students.

CURRENT STUDY CONTEXT

Subject:
${subject}

Chapter:
${chapter}

STUDENT QUESTION

${question}

The student selected the subject and chapter above.
Keep the answer relevant to that context.

IMPORTANT RULES:

1. Never intentionally provide false information.
2. Never invent ICAI sections, laws, rules, amendments,
   standards, rates, dates or examination rules.
3. If you are uncertain about a time-sensitive factual
   CA provision, clearly say it needs verification from
   the latest authoritative material.
4. Never claim official verification unless it actually
   happened.
5. Explain difficult concepts simply.
6. Keep the answer focused and useful.

NUMERICAL / ACCOUNTING QUESTIONS:

7. Recalculate every numerical result.
8. Never invent missing values.
9. Never use placeholders such as:
   XXX
   ₹XXX
   [amount]
   [value]
   ...
10. For numerical questions use:

Given Information

Required

Formula / Method

Working / Calculation

Arithmetic Check

Final Answer

11. Keep formulas in plain readable text.
12. For journal entries identify affected accounts
    and debit/credit sides where applicable.

DEPRECIATION:

13. When applicable:

Annual Depreciation =
(Cost of Asset - Residual / Scrap Value) / Useful Life

14. Do not subtract residual value twice.

JOURNAL ENTRIES:

15. Use actual amounts.
16. Keep debit and credit sides consistent.
17. Do not add unrelated entries.

FORMATTING:

18. Use readable Markdown.
19. Use headings, bold text, bullets and numbered points
    where useful.
20. Do not output raw LaTeX commands.
21. Do not output LaTeX environments.
22. Do not use unnecessary filler.

IMPORTANT:

If information is genuinely missing or ambiguous,
clearly identify what is missing rather than guessing.

Answer naturally like a high-quality CA study assistant.
`;
};

/*
|--------------------------------------------------------------------------
| HEALTH CHECK
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "CA PrepCore.AI server is running",
  });
});

/*
|--------------------------------------------------------------------------
| AI DOUBT SOLVER
|--------------------------------------------------------------------------
*/

app.post(
  "/api/ai",
  async (req, res) => {
    try {
      const {
        message,
        subject,
        chapter,
      } = req.body;

      if (
        !message ||
        typeof message !== "string" ||
        !message.trim()
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Please enter a question.",
        });
      }

      const question =
        message.trim();

      const currentSubject =
        typeof subject === "string" &&
        subject.trim()
          ? subject.trim()
          : "General CA";

      const currentChapter =
        typeof chapter === "string" &&
        chapter.trim()
          ? chapter.trim()
          : "General";

      const isNumerical =
        looksLikeNumericalQuestion(
          question
        );

      console.log("");
      console.log(
        "----------------------------------------"
      );
      console.log(
        "NEW AI DOUBT"
      );
      console.log(
        "Subject:",
        currentSubject
      );
      console.log(
        "Chapter:",
        currentChapter
      );
      console.log(
        "Numerical:",
        isNumerical
      );
      console.log(
        "Question:",
        question
      );
      console.log(
        "----------------------------------------"
      );

      /*
      |--------------------------------------------------------------------------
      | CALL 1 — MAIN ANSWER
      |--------------------------------------------------------------------------
      */

      const response =
        await ai.models.generateContent({
          model: "gemini-3.6-flash",

          contents: buildMainPrompt({
            question,
            subject: currentSubject,
            chapter: currentChapter,
          }),

          config: {
            maxOutputTokens:
              isNumerical
                ? 1800
                : 1200,

            temperature: 0.1,
          },
        });

      let answer =
        response.text
          ? cleanLatexFormatting(
              response.text
            )
          : "";

      if (!answer) {
        return res.status(500).json({
          success: false,
          error:
            "AI returned an empty response.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | CALL 2 — ONLY FOR NUMERICAL QUESTIONS
      |--------------------------------------------------------------------------
      */

      if (
        isNumerical
      ) {
        const verification =
          await verifyNumericalAnswer(
            question,
            answer
          );

        if (
          verification &&
          verification.isCorrect ===
            false
        ) {
          console.log(
            "NUMERICAL VERIFICATION FAILED"
          );

          /*
          |--------------------------------------------------------------------------
          | CALL 3 — CORRECTION ONLY IF NEEDED
          |--------------------------------------------------------------------------
          */

          const correctedAnswer =
            await correctNumericalAnswer(
              question,
              answer,
              verification
            );

          if (
            correctedAnswer
          ) {
            answer =
              correctedAnswer;
          }
        }
      }

      /*
      |--------------------------------------------------------------------------
      | FINAL CLEANUP
      |--------------------------------------------------------------------------
      */

      answer =
        cleanLatexFormatting(
          answer
        );

      if (
        !answer ||
        hasUnresolvedAnswerContent(
          answer
        )
      ) {
        return res.status(502).json({
          success: false,
          error:
            "PrepCore AI could not produce a complete answer. Please rephrase the question or provide the missing information.",
        });
      }

      console.log(
        "AI RESPONSE SUCCESS"
      );

      console.log(
        "Calls used for this request:",
        isNumerical
          ? "2 normally, 3 only if correction required"
          : "1"
      );

      console.log(
        "----------------------------------------"
      );

      return res.json({
        success: true,
        answer,
      });
    } catch (error) {
      console.error("");
      console.error(
        "GEMINI ERROR:"
      );
      console.error(error);
      console.error("");

      /*
      |--------------------------------------------------------------------------
      | QUOTA ERROR
      |--------------------------------------------------------------------------
      */

      if (
        error?.status === 429 ||
        error?.code === 429 ||
        error?.message?.includes(
          "RESOURCE_EXHAUSTED"
        ) ||
        error?.message?.includes(
          "quota"
        )
      ) {
        return res.status(429).json({
          success: false,

          error:
            "CA PrepCore AI is temporarily unavailable because the Gemini API quota has been reached. Please try again after the quota resets or use a project with available API quota.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | AUTH ERROR
      |--------------------------------------------------------------------------
      */

      if (
        error?.status === 401 ||
        error?.status === 403
      ) {
        return res.status(500).json({
          success: false,
          error:
            "CA PrepCore AI could not authenticate with the Gemini API. Check the GEMINI_API_KEY in server/.env.",
        });
      }

      /*
      |--------------------------------------------------------------------------
      | GENERAL ERROR
      |--------------------------------------------------------------------------
      */

      return res.status(500).json({
        success: false,

        error:
          error?.message ||
          "Unable to process the question right now.",
      });
    }
  }
);

/*
|--------------------------------------------------------------------------
| START SERVER
|--------------------------------------------------------------------------
*/

app.listen(
  PORT,
  () => {
    console.log(
      "========================================"
    );

    console.log(
      "CA PrepCore.AI server running"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "Gemini AI: CONNECTED"
    );

    console.log(
      "App version:",
      APP_VERSION
    );

    console.log(
      "App version code:",
      APP_VERSION_CODE
    );

    console.log(
      "Normal question: 1 Gemini call"
    );

    console.log(
      "Numerical question: 2 calls normally"
    );

    console.log(
      "========================================"
    );
  }
);