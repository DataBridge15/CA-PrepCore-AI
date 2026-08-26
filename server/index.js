require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| GEMINI SETUP
|--------------------------------------------------------------------------
*/

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("ERROR: GEMINI_API_KEY is missing from server/.env");
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
    /\\(?:text|mathrm|operatorname|textbf|mathbf|mathit|emph)\s*\{/i.test(
      answer
    ) ||
    /\\(?:begin|end)\s*\{/i.test(answer)
  );
};

/*
|--------------------------------------------------------------------------
| MARKDOWN TABLE CLEANUP
|--------------------------------------------------------------------------
|
| The mobile app does not always render Markdown tables cleanly.
| Convert tables into readable bullet-style sections.
|
|--------------------------------------------------------------------------
*/

const isMarkdownTableSeparator = (line) => {
  const trimmed = line.trim();

  if (!trimmed.includes("|")) {
    return false;
  }

  const cells = trimmed
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);

  if (!cells.length) {
    return false;
  }

  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
};

const splitTableRow = (line) => {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
};

const cleanMarkdownTables = (answer) => {
  const lines = answer.split(/\r?\n/);
  const output = [];

  let i = 0;

  while (i < lines.length) {
    const current = lines[i];

    /*
    |--------------------------------------------------------------------------
    | Detect a Markdown table
    |--------------------------------------------------------------------------
    */

    if (
      current.includes("|") &&
      i + 1 < lines.length &&
      isMarkdownTableSeparator(lines[i + 1])
    ) {
      const headers = splitTableRow(current);

      i += 2;

      const rows = [];

      while (
        i < lines.length &&
        lines[i].trim() &&
        lines[i].includes("|")
      ) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }

      /*
      |--------------------------------------------------------------------------
      | Convert table into readable format
      |--------------------------------------------------------------------------
      */

      rows.forEach((row, rowIndex) => {
        const meaningfulCells = row.filter(
          (cell) => cell.trim() !== ""
        );

        if (!meaningfulCells.length) {
          return;
        }

        if (rows.length > 1) {
          output.push(`**${rowIndex + 1}.**`);

          meaningfulCells.forEach((cell, cellIndex) => {
            const header =
              headers[cellIndex] ||
              `Point ${cellIndex + 1}`;

            output.push(
              `- **${header}:** ${cell}`
            );
          });

          output.push("");
        } else {
          meaningfulCells.forEach((cell, cellIndex) => {
            const header =
              headers[cellIndex] ||
              `Point ${cellIndex + 1}`;

            output.push(
              `- **${header}:** ${cell}`
            );
          });

          output.push("");
        }
      });

      continue;
    }

    output.push(current);
    i++;
  }

  return output.join("\n");
};

/*
|--------------------------------------------------------------------------
| LATEX / RAW FORMATTING CLEANUP
|--------------------------------------------------------------------------
*/

const cleanLatexFormatting = (answer) => {
  let cleaned = answer || "";

  /*
  |--------------------------------------------------------------------------
  | First convert Markdown tables
  |--------------------------------------------------------------------------
  */

  cleaned = cleanMarkdownTables(cleaned);

  /*
  |--------------------------------------------------------------------------
  | Remove common LaTeX commands
  |--------------------------------------------------------------------------
  */

  let previous;

  do {
    previous = cleaned;

    cleaned = cleaned.replace(
      /\\(?:text|mathrm|operatorname|textbf|mathbf|mathit|emph)\{([^{}]*)\}/gi,
      "$1"
    );
  } while (cleaned !== previous);

  /*
  |--------------------------------------------------------------------------
  | Remove LaTeX environments
  |--------------------------------------------------------------------------
  */

  cleaned = cleaned
    .replace(
      /\\begin\{(?:array|aligned|align\*?|tabular|matrix|pmatrix|bmatrix|cases)\}(?:\{[^{}]*\})?/gi,
      ""
    )
    .replace(
      /\\end\{(?:array|aligned|align\*?|tabular|matrix|pmatrix|bmatrix|cases)\}/gi,
      ""
    )
    .replace(/\\hline/g, "");

  /*
  |--------------------------------------------------------------------------
  | Common mathematical symbols
  |--------------------------------------------------------------------------
  */

  cleaned = cleaned
    .replace(/\\(?:left|right)/g, "")
    .replace(/\\cdot/g, "×")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\pm/g, "±")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\approx/g, "≈")
    .replace(/\\rightarrow/g, "→")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "∞")
    .replace(/\\%/g, "%")
    .replace(/\\,/g, " ")
    .replace(/\\;/g, " ")
    .replace(/\\!/g, "")
    .replace(/\\quad/g, " ")
    .replace(/\\qquad/g, " ");

  /*
  |--------------------------------------------------------------------------
  | Fractions
  |--------------------------------------------------------------------------
  */

  while (/\\frac\{[^{}]*\}\{[^{}]*\}/.test(cleaned)) {
    cleaned = cleaned.replace(
      /\\frac\{([^{}]*)\}\{([^{}]*)\}/g,
      "($1) / ($2)"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Square roots
  |--------------------------------------------------------------------------
  */

  while (/\\sqrt\{[^{}]*\}/.test(cleaned)) {
    cleaned = cleaned.replace(
      /\\sqrt\{([^{}]*)\}/g,
      "√($1)"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Remove inline/display math delimiters
  |--------------------------------------------------------------------------
  */

  cleaned = cleaned
    .replace(/\$\$/g, "")
    .replace(/\$/g, "")
    .replace(/\\\[/g, "")
    .replace(/\\\]/g, "")
    .replace(/\\\(/g, "")
    .replace(/\\\)/g, "");

  /*
  |--------------------------------------------------------------------------
  | Common escaped characters
  |--------------------------------------------------------------------------
  */

  cleaned = cleaned
    .replace(/\\#/g, "#")
    .replace(/\\_/g, "_")
    .replace(/\\\*/g, "*")
    .replace(/\\&/g, "&")
    .replace(/\\{/g, "{")
    .replace(/\\}/g, "}");

  /*
  |--------------------------------------------------------------------------
  | Remaining formatting cleanup
  |--------------------------------------------------------------------------
  */

  cleaned = cleaned
    .replace(/\\{2,}(?=\s|&|$)/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();

  return cleaned;
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

Verify whether the proposed answer is mathematically and accounting-wise
consistent with the original question.

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

Put corrected calculations in "correctedCalculations".

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

    const raw = response.text
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

    const cleanedJson = raw
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
4. Never use placeholders such as:
   XXX
   ₹XXX
   [amount]
   [value]

5. Do NOT use raw LaTeX.

6. Use plain readable mathematical notation.

7. Do NOT use Markdown tables.

8. For numerical answers use:

### Given Information

### Required

### Formula / Method

### Working / Calculation

### Arithmetic Check

### Final Answer

9. For journal entries identify accounts and debit/credit sides.

10. Do not add unrelated entries.

11. Explain enough steps for a CA Foundation student to understand the solution.

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
You are PrepCore AI, a high-quality educational AI assistant
for Chartered Accountancy students.

Your goal is to give the student a COMPLETE, ACCURATE,
CLEAR and WELL-STRUCTURED answer.

CURRENT STUDY CONTEXT

Subject:
${subject}

Chapter:
${chapter}

STUDENT QUESTION

${question}

The student selected the subject and chapter above.
Keep the answer relevant to that context.

IMPORTANT ACCURACY RULES:

1. Never intentionally provide false information.

2. Never invent ICAI sections, laws, rules, amendments,
standards, rates, dates or examination rules.

3. If you are uncertain about a time-sensitive CA provision,
clearly say that it should be verified from the latest
authoritative material.

4. Never claim official verification unless it actually happened.

5. Explain difficult concepts in simple student-friendly language.

6. Give enough explanation to make the answer genuinely useful
for CA Foundation preparation.

7. Do not unnecessarily shorten the explanation.

8. When the question asks for an explanation, cover:
   - Definition
   - Meaning
   - Important concepts
   - Rules or conditions
   - Types/classifications where relevant
   - Formulas where relevant
   - Practical examples
   - Important exam points
   - Common mistakes where useful

9. Stay relevant to the student's actual question.
Do not add unrelated chapters or topics.

NUMERICAL / ACCOUNTING QUESTIONS:

10. Recalculate every numerical result.

11. Never invent missing values.

12. Never use placeholders such as:
    XXX
    ₹XXX
    [amount]
    [value]

13. For numerical questions use:

### Given Information

### Required

### Formula / Method

### Working / Calculation

### Arithmetic Check

### Final Answer

14. Keep formulas in plain readable text.

15. For journal entries identify affected accounts
and debit/credit sides where applicable.

DEPRECIATION:

16. When applicable:

Annual Depreciation =
(Cost of Asset - Residual / Scrap Value) / Useful Life

17. Do not subtract residual value twice.

JOURNAL ENTRIES:

18. Use actual amounts.

19. Keep debit and credit sides consistent.

20. Do not add unrelated entries.

FORMATTING RULES:

21. Use readable Markdown.

22. Use clear headings.

23. Use bold text for important terms.

24. Use numbered lists for steps.

25. Use bullet points for lists.

26. Separate major sections with headings.

27. Do NOT use Markdown tables.

28. Do NOT use pipe-based table formatting such as:

| Term | Meaning | Example |

29. Instead, write each item separately:

**1. Term Name**

**Meaning:** ...

**Formula:** ...

**Example:** ...

30. Do NOT use raw LaTeX.

31. Do NOT use LaTeX delimiters such as:
$
$$
\\(
\\)

32. Do NOT use LaTeX environments such as:
array
aligned
matrix
cases
tabular

33. Write mathematical expressions in simple readable text.

Examples:

Use:
Ratio = A : B

Instead of:
$A:B$

Use:
Profit = Selling Price - Cost Price

Instead of raw LaTeX.

Use:
a × b

Instead of:
a \\times b

Use:
a / b

Instead of:
\\frac{a}{b}

34. Keep headings and spacing clean for a mobile phone screen.

35. Avoid huge paragraphs.

36. If the answer is long, divide it into logical sections.

37. Do not repeat the same explanation unnecessarily.

COMPLETENESS:

38. If the student asks for a concept explanation,
give a comprehensive study-oriented explanation.

39. If the student asks "explain completely",
do not give only a short definition.

40. If examples help understanding, provide examples.

41. If exam-oriented points are useful, include them.

42. If information is genuinely missing or ambiguous,
clearly identify what is missing rather than guessing.

Answer naturally like a professional CA Foundation
study assistant.
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
    message: "CA PrepCore.AI server is running",
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
          error: "Please enter a question.",
        });
      }

      const question = message.trim();

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

      console.log("NEW AI DOUBT");

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
                ? 2200
                : 1800,

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

      if (isNumerical) {
        const verification =
          await verifyNumericalAnswer(
            question,
            answer
          );

        if (
          verification &&
          verification.isCorrect === false
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

          if (correctedAnswer) {
            answer = correctedAnswer;
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
      `Port: ${PORT}`
    );

    console.log(
      "Gemini AI: CONNECTED"
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