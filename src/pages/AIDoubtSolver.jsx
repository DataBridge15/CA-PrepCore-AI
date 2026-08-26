import {
  useMemo,
  useState,
} from 'react'

const API_URL =
  'https://ca-prepcore-ai.onrender.com/api/ai'

function createMessage(
  role,
  content,
) {
  return {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    role,
    content,
    createdAt: Date.now(),
  }
}

function getInitialMessage() {
  return createMessage(
    'ai',
    'Hello! I’m your CA study assistant. Select a subject and chapter, then ask your doubt.',
  )
}

/* =========================================================
   MARKDOWN RENDERER
========================================================= */

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inlineMarkdown(text) {
  let output = escapeHtml(text)

  output = output.replace(
    /\*\*(.+?)\*\*/g,
    '<strong>$1</strong>',
  )

  output = output.replace(
    /(?<!\*)\*([^\*]+)\*(?!\*)/g,
    '<em>$1</em>',
  )

  output = output.replace(
    /`([^`]+)`/g,
    '<code>$1</code>',
  )

  return output
}

function renderMarkdown(markdown) {
  const lines = String(
    markdown || '',
  )
    .replace(/\r\n/g, '\n')
    .split('\n')

  const html = []

  let inBulletList = false
  let inNumberedList = false
  let paragraph = []

  const closeLists = () => {
    if (inBulletList) {
      html.push('</ul>')
      inBulletList = false
    }

    if (inNumberedList) {
      html.push('</ol>')
      inNumberedList = false
    }
  }

  const flushParagraph = () => {
    if (paragraph.length === 0) {
      return
    }

    const text = paragraph.join(' ').trim()

    if (text) {
      html.push(
        `<p>${inlineMarkdown(text)}</p>`,
      )
    }

    paragraph = []
  }

  lines.forEach((rawLine) => {
    const line = rawLine.trim()

    if (!line) {
      flushParagraph()
      closeLists()
      return
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph()
      closeLists()
      html.push('<hr />')
      return
    }

    if (/^#\s+/.test(line)) {
      flushParagraph()
      closeLists()

      html.push(
        `<h2>${inlineMarkdown(
          line.replace(/^#\s+/, ''),
        )}</h2>`,
      )

      return
    }

    if (/^##\s+/.test(line)) {
      flushParagraph()
      closeLists()

      html.push(
        `<h3>${inlineMarkdown(
          line.replace(/^##\s+/, ''),
        )}</h3>`,
      )

      return
    }

    if (
      /^###\s+/.test(line) ||
      /^####\s+/.test(line) ||
      /^#####\s+/.test(line)
    ) {
      flushParagraph()
      closeLists()

      html.push(
        `<h4>${inlineMarkdown(
          line.replace(/^#{3,5}\s+/, ''),
        )}</h4>`,
      )

      return
    }

    const bulletMatch = line.match(
      /^[-*•]\s+(.+)$/,
    )

    if (bulletMatch) {
      flushParagraph()

      if (inNumberedList) {
        html.push('</ol>')
        inNumberedList = false
      }

      if (!inBulletList) {
        html.push('<ul>')
        inBulletList = true
      }

      html.push(
        `<li>${inlineMarkdown(
          bulletMatch[1],
        )}</li>`,
      )

      return
    }

    const numberedMatch = line.match(
      /^\d+\.\s+(.+)$/,
    )

    if (numberedMatch) {
      flushParagraph()

      if (inBulletList) {
        html.push('</ul>')
        inBulletList = false
      }

      if (!inNumberedList) {
        html.push('<ol>')
        inNumberedList = true
      }

      html.push(
        `<li>${inlineMarkdown(
          numberedMatch[1],
        )}</li>`,
      )

      return
    }

    if (line.startsWith('> ')) {
      flushParagraph()
      closeLists()

      html.push(
        `<blockquote>${inlineMarkdown(
          line.slice(2),
        )}</blockquote>`,
      )

      return
    }

    paragraph.push(line)
  })

  flushParagraph()
  closeLists()

  return html.join('')
}

/* =========================================================
   AI MESSAGE
========================================================= */

function AIMessage({
  content,
}) {
  const rendered = useMemo(
    () => renderMarkdown(content),
    [content],
  )

  return (
    <div className="ai-message-row">
      <div className="ai-message-inner">
        <div className="ai-message-avatar">
          ✦
        </div>

        <div
          className="ai-message-content"
          dangerouslySetInnerHTML={{
            __html: rendered,
          }}
        />
      </div>
    </div>
  )
}

/* =========================================================
   USER MESSAGE
========================================================= */

function UserMessage({
  content,
}) {
  return (
    <div className="user-message-row">
      <div className="user-message-inner">
        <div className="user-message-avatar">
          ME
        </div>

        <div className="user-message-bubble">
          {content}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AIDoubtSolver({
  subjects = [],
}) {
  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] = useState(
    subjects?.[0]?.id || '',
  )

  const selectedSubject =
    useMemo(
      () =>
        subjects.find(
          (subject) =>
            subject.id ===
            selectedSubjectId,
        ) ||
        subjects?.[0] ||
        null,
      [
        subjects,
        selectedSubjectId,
      ],
    )

  const [
    selectedChapter,
    setSelectedChapter,
  ] = useState(
    selectedSubject
      ?.chapterList?.[0] || '',
  )

  const [
    question,
    setQuestion,
  ] = useState('')

  const [
    messages,
    setMessages,
  ] = useState([
    getInitialMessage(),
  ])

  const [
    sending,
    setSending,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const suggestions = [
    'Explain this concept simply.',
    'Give me an exam-style example.',
    'What is the key point to remember?',
    'Test me with one question.',
  ]

  const handleSubjectChange = (
    subjectId,
  ) => {
    const subject = subjects.find(
      (item) =>
        item.id === subjectId,
    )

    setSelectedSubjectId(
      subjectId,
    )

    setSelectedChapter(
      subject?.chapterList?.[0] ||
        '',
    )
  }

  const sendQuestion = async (
    text = question,
  ) => {
    const clean = text.trim()

    if (
      !clean ||
      !selectedSubject ||
      !selectedChapter ||
      sending
    ) {
      return
    }

    setError('')

    const userMessage =
      createMessage(
        'user',
        clean,
      )

    setMessages(
      (previous) => [
        ...previous,
        userMessage,
      ],
    )

    setQuestion('')
    setSending(true)

    try {
      const response =
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            message: clean,
            subject:
              selectedSubject.name,
            chapter:
              selectedChapter,
          }),
        })

      let data = null

      try {
        data =
          await response.json()
      } catch {
        data = null
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            'AI server request failed.',
        )
      }

      if (
        !data?.success ||
        !data?.answer
      ) {
        throw new Error(
          data?.error ||
            'AI returned an empty response.',
        )
      }

      setMessages(
        (previous) => [
          ...previous,
          createMessage(
            'ai',
            data.answer,
          ),
        ],
      )
    } catch (requestError) {
      console.error(
        'AI DOUBT ERROR:',
        requestError,
      )

      const errorMessage =
        requestError?.message ||
        'Unable to connect to PrepCore AI server.'

      setError(errorMessage)

      setMessages(
        (previous) => [
          ...previous,
          createMessage(
            'ai',
            'I could not answer that right now. Please check that the CA PrepCore AI server is running.',
          ),
        ],
      )
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (
    event,
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      sendQuestion()
    }
  }

  const clearChat = () => {
    setMessages([
      getInitialMessage(),
    ])

    setQuestion('')
    setError('')
  }

  if (!selectedSubject) {
    return (
      <div className="page">
        <div className="page-intro">
          <div>
            <p className="eyebrow">
              AI STUDY ASSISTANT
            </p>

            <h2>
              AI Doubt Solver
            </h2>

            <p>
              Add subjects first to use
              the AI study workspace.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page ai-page">
      <div className="ai-page-heading">
        <div>
          <p className="eyebrow">
            AI STUDY ASSISTANT
          </p>

          <h2>
            AI Doubt Solver
          </h2>

          <p>
            Ask CA concepts, examples and
            exam-focused doubts.
          </p>
        </div>

        <button
          className="filter-button"
          onClick={clearChat}
          type="button"
        >
          Clear Chat
        </button>
      </div>

      {/* =====================================================
          MAIN AI WORKSPACE
      ===================================================== */}

      <div className="ai-workspace">

        {/* ===================================================
            STUDY CONTEXT
        =================================================== */}

        <aside className="ai-context-panel">
          <span className="ai-context-eyebrow">
            STUDY CONTEXT
          </span>

          <h3 className="ai-context-title">
            What are you studying?
          </h3>

          <label className="ai-field">
            <span>
              SUBJECT
            </span>

            <select
              value={
                selectedSubjectId
              }
              onChange={(event) =>
                handleSubjectChange(
                  event.target.value,
                )
              }
            >
              {subjects.map(
                (subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                ),
              )}
            </select>
          </label>

          <label className="ai-field">
            <span>
              CHAPTER
            </span>

            <select
              value={
                selectedChapter
              }
              onChange={(event) =>
                setSelectedChapter(
                  event.target.value,
                )
              }
            >
              {selectedSubject.chapterList.map(
                (chapter) => (
                  <option
                    key={chapter}
                    value={chapter}
                  >
                    {chapter}
                  </option>
                ),
              )}
            </select>
          </label>

          <div className="ai-current-context">
            <span>
              CURRENT CONTEXT
            </span>

            <strong>
              {selectedSubject.name}
            </strong>

            <p>
              {selectedChapter}
            </p>
          </div>

          <div className="ai-context-note">
            <strong>
              CA PrepCore AI
            </strong>

            <p>
              Your selected subject and
              chapter are used as the study
              context for your doubt.
            </p>
          </div>
        </aside>

        {/* ===================================================
            CHAT
        =================================================== */}

        <section className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-brand-icon">
              ✦

              <span />
            </div>

            <div>
              <strong>
                CA PrepCore AI
              </strong>

              <small>
                CA Study Assistant
              </small>
            </div>
          </div>

          <div className="ai-chat-body">
            <div className="ai-chat-messages">
              {messages.map(
                (message) =>
                  message.role ===
                  'ai' ? (
                    <AIMessage
                      key={message.id}
                      content={
                        message.content
                      }
                    />
                  ) : (
                    <UserMessage
                      key={message.id}
                      content={
                        message.content
                      }
                    />
                  ),
              )}

              {sending && (
                <div className="ai-thinking">
                  <span>
                    ✦
                  </span>

                  CA PrepCore AI is
                  thinking...
                </div>
              )}

              {error && (
                <div className="ai-error">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              INPUT
          ================================================= */}

          <div className="ai-input-area">
            <div className="ai-input-box">
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(
                    event.target.value,
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="Ask your CA doubt..."
                rows={1}
              />

              <button
                type="button"
                onClick={() =>
                  sendQuestion()
                }
                disabled={
                  !question.trim() ||
                  sending
                }
              >
                ↑
              </button>
            </div>

            <div className="ai-input-help">
              <span>
                Enter to send · Shift +
                Enter for new line
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          QUICK QUESTIONS
      ===================================================== */}

      <div className="ai-suggestions">
        {suggestions.map(
          (suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                sendQuestion(
                  suggestion,
                )
              }
            >
              {suggestion}
            </button>
          ),
        )}
      </div>

      {/* =====================================================
          AI MESSAGE STYLES
      ===================================================== */}

      <style>
        {`
          .ai-page {
            width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }

          .ai-page-heading {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 18px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .ai-page-heading h2 {
            margin: 6px 0;
            color: #123a60;
            font-family: 'Manrope', sans-serif;
            font-size: 26px;
            letter-spacing: -.8px;
          }

          .ai-page-heading p:last-child {
            margin: 0;
            color: #7087a0;
            font-size: 13px;
            line-height: 1.5;
          }

          /* ================================
             WORKSPACE
          ================================ */

          .ai-workspace {
            width: 100%;
            min-width: 0;
            display: grid;
            grid-template-columns: 280px minmax(0, 1fr);
            min-height: 620px;
            background: #fff;
            border: 1px solid #dce6f0;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 12px 35px rgba(20,50,80,.06);
          }

          /* ================================
             CONTEXT
          ================================ */

          .ai-context-panel {
            min-width: 0;
            padding: 20px;
            background: #f7faff;
            border-right: 1px solid #e4ecf4;
          }

          .ai-context-eyebrow {
            display: block;
            color: #7d92a8;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .12em;
          }

          .ai-context-title {
            margin: 6px 0 18px;
            color: #123a60;
            font-size: 16px;
            line-height: 1.3;
          }

          .ai-field {
            display: block;
            margin-bottom: 14px;
          }

          .ai-field > span {
            display: block;
            margin-bottom: 7px;
            color: #52718e;
            font-size: 10px;
            font-weight: 800;
          }

          .ai-field select {
            width: 100%;
            min-height: 43px;
            padding: 0 10px;
            border: 1px solid #d5e0e9;
            border-radius: 9px;
            background: #fff;
            color: #173c61;
            font-size: 11px;
            outline: none;
          }

          .ai-field select:focus {
            border-color: #1d4f83;
            box-shadow: 0 0 0 3px rgba(29,79,131,.08);
          }

          .ai-current-context {
            margin-top: 20px;
            padding: 13px;
            border: 1px solid #dce7f0;
            border-radius: 11px;
            background: #fff;
          }

          .ai-current-context > span {
            display: block;
            color: #8297ab;
            font-size: 9px;
            font-weight: 800;
          }

          .ai-current-context > strong {
            display: block;
            margin-top: 6px;
            color: #173d63;
            font-size: 11px;
            line-height: 1.4;
          }

          .ai-current-context > p {
            margin: 3px 0 0;
            color: #7c91a7;
            font-size: 10px;
            line-height: 1.45;
          }

          .ai-context-note {
            margin-top: 20px;
            padding: 13px;
            border-radius: 11px;
            background: #eaf3fb;
            color: #51708e;
            font-size: 9px;
            line-height: 1.55;
          }

          .ai-context-note strong {
            display: block;
            margin-bottom: 4px;
            color: #1d4f83;
          }

          .ai-context-note p {
            margin: 0;
          }

          /* ================================
             CHAT PANEL
          ================================ */

          .ai-chat-panel {
            min-width: 0;
            min-height: 0;
            display: flex;
            flex-direction: column;
            background: #fff;
          }

          .ai-chat-header {
            min-height: 76px;
            padding: 14px 19px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #edf2f6;
          }

          .ai-chat-brand-icon {
            position: relative;
            width: 42px;
            height: 42px;
            flex: 0 0 42px;
            display: grid;
            place-items: center;
            border-radius: 13px;
            background: linear-gradient(135deg,#0d3561,#2674aa);
            color: #fff;
            font-size: 17px;
            font-weight: 900;
          }

          .ai-chat-brand-icon span {
            position: absolute;
            right: -2px;
            bottom: -2px;
            width: 10px;
            height: 10px;
            border: 2px solid #fff;
            border-radius: 50%;
            background: #48b88d;
          }

          .ai-chat-header strong {
            display: block;
            color: #133a60;
            font-size: 13px;
          }

          .ai-chat-header small {
            display: block;
            margin-top: 3px;
            color: #8095aa;
            font-size: 9px;
          }

          .ai-chat-body {
            min-width: 0;
            min-height: 0;
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 20px;
            background: #fbfcfe;
          }

          .ai-chat-messages {
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .ai-message-row,
          .user-message-row {
            width: 100%;
            min-width: 0;
          }

          .ai-message-inner,
          .user-message-inner {
            width: 100%;
            max-width: 88%;
            min-width: 0;
            display: flex;
            gap: 9px;
            align-items: flex-start;
          }

          .user-message-inner {
            max-width: 78%;
            margin-left: auto;
            flex-direction: row-reverse;
          }

          .ai-message-avatar,
          .user-message-avatar {
            width: 30px;
            height: 30px;
            flex: 0 0 30px;
            display: grid;
            place-items: center;
            border-radius: 9px;
            font-size: 9px;
            font-weight: 900;
          }

          .ai-message-avatar {
            background: #eaf3fb;
            color: #1d4f83;
            font-size: 10px;
          }

          .user-message-avatar {
            background: #173f64;
            color: #fff;
          }

          .ai-message-content {
            min-width: 0;
            max-width: 100%;
            padding: 14px 16px;
            border: 1px solid #e2eaf1;
            border-radius: 5px 16px 16px 16px;
            background: #fff;
            color: #4e6983;
            font-size: 11px;
            line-height: 1.75;
            box-shadow: 0 4px 15px rgba(20,50,80,.04);
            overflow-wrap: anywhere;
            word-break: break-word;
          }

          .user-message-bubble {
            min-width: 0;
            max-width: 100%;
            padding: 12px 14px;
            border-radius: 14px 5px 14px 14px;
            background: #173f64;
            color: #fff;
            font-size: 11px;
            line-height: 1.6;
            white-space: pre-line;
            overflow-wrap: anywhere;
            word-break: break-word;
            box-shadow: 0 5px 15px rgba(15,57,91,.12);
          }

          .ai-thinking {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #7d92a8;
            font-size: 10px;
            font-weight: 600;
          }

          .ai-thinking span {
            color: #1d4f83;
            font-size: 12px;
          }

          .ai-error {
            padding: 10px 12px;
            border: 1px solid #efdada;
            border-radius: 10px;
            background: #fff5f5;
            color: #a24b4b;
            font-size: 10px;
            line-height: 1.5;
            overflow-wrap: anywhere;
          }

          /* ================================
             INPUT
          ================================ */

          .ai-input-area {
            padding: 13px 15px;
            border-top: 1px solid #e5edf3;
            background: #fff;
          }

          .ai-input-box {
            width: 100%;
            min-width: 0;
            display: flex;
            align-items: flex-end;
            gap: 9px;
            padding: 8px;
            border: 1px solid #d7e2eb;
            border-radius: 14px;
            background: #fbfdff;
            box-shadow: 0 6px 22px rgba(20,50,80,.04);
          }

          .ai-input-box textarea {
            min-width: 0;
            flex: 1;
            resize: none;
            min-height: 38px;
            max-height: 120px;
            border: 0;
            outline: 0;
            background: transparent;
            color: #173d63;
            padding: 8px 5px;
            font-family: inherit;
            font-size: 11px;
            line-height: 1.5;
          }

          .ai-input-box textarea::placeholder {
            color: #91a2b2;
          }

          .ai-input-box button {
            width: 40px;
            height: 40px;
            flex: 0 0 40px;
            border: 0;
            border-radius: 11px;
            background: #1d4f83;
            color: #fff;
            font-size: 15px;
            font-weight: 900;
          }

          .ai-input-box button:disabled {
            background: #d8e2eb;
            cursor: not-allowed;
          }

          .ai-input-help {
            margin-top: 7px;
            color: #9aabba;
            font-size: 8px;
          }

          /* ================================
             QUICK QUESTIONS
          ================================ */

          .ai-suggestions {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
            margin-top: 12px;
          }

          .ai-suggestions button {
            padding: 8px 10px;
            border: 1px solid #dce6f0;
            border-radius: 9px;
            background: #fff;
            color: #58758f;
            font-size: 9px;
            line-height: 1.4;
            cursor: pointer;
          }

          .ai-suggestions button:hover {
            border-color: #bfcfdd;
            color: #1d4f83;
          }

          /* ================================
             MARKDOWN
          ================================ */

          .ai-message-content h2,
          .ai-message-content h3,
          .ai-message-content h4 {
            margin: 16px 0 8px;
            color: #123a60;
            font-weight: 800;
          }

          .ai-message-content h2 {
            font-size: 17px;
          }

          .ai-message-content h3 {
            font-size: 15px;
          }

          .ai-message-content h4 {
            font-size: 13px;
          }

          .ai-message-content p {
            margin: 0 0 11px;
          }

          .ai-message-content p:last-child {
            margin-bottom: 0;
          }

          .ai-message-content strong {
            color: #173f64;
            font-weight: 800;
          }

          .ai-message-content em {
            font-style: italic;
          }

          .ai-message-content ul,
          .ai-message-content ol {
            margin: 7px 0 13px;
            padding-left: 20px;
          }

          .ai-message-content li {
            margin: 4px 0;
          }

          .ai-message-content hr {
            border: 0;
            border-top: 1px solid #e3ebf2;
            margin: 14px 0;
          }

          .ai-message-content blockquote {
            margin: 10px 0;
            padding: 9px 12px;
            border-left: 3px solid #2b6b9f;
            border-radius: 0 8px 8px 0;
            background: #f5f9fc;
            color: #5c748c;
          }

          .ai-message-content code {
            padding: 2px 5px;
            border-radius: 5px;
            background: #edf3f8;
            color: #1c537e;
            font-size: 10px;
          }

          /* =================================================
             PORTRAIT ONLY
             Landscape remains desktop two-column
          ================================================= */

          @media (max-width: 768px) and (orientation: portrait) {

            .ai-page-heading {
              align-items: flex-start;
              gap: 12px;
            }

            .ai-page-heading > div {
              min-width: 0;
              width: 100%;
            }

            .ai-page-heading h2 {
              font-size: 22px;
              line-height: 1.2;
            }

            .ai-page-heading p:last-child {
              font-size: 11px;
            }

            .ai-page-heading .filter-button {
              width: 100%;
              justify-content: center;
            }

            /*
              THIS is the main fix:
              280px + 1fr becomes one full-width column.
            */

            .ai-workspace {
              grid-template-columns: 1fr !important;
              min-height: auto;
              width: 100%;
              overflow: visible;
              border-radius: 16px;
            }

            .ai-context-panel {
              width: 100%;
              min-width: 0;
              border-right: 0;
              border-bottom: 1px solid #e4ecf4;
              padding: 18px 15px;
            }

            .ai-context-title {
              font-size: 18px;
              margin-bottom: 18px;
            }

            .ai-field {
              margin-bottom: 13px;
            }

            .ai-field select {
              min-height: 48px;
              font-size: 12px;
            }

            .ai-current-context {
              margin-top: 16px;
            }

            .ai-context-note {
              margin-top: 14px;
            }

            .ai-chat-panel {
              width: 100%;
              min-width: 0;
              min-height: 520px;
            }

            .ai-chat-header {
              padding: 13px 15px;
              min-height: 68px;
            }

            .ai-chat-body {
              min-height: 330px;
              max-height: none;
              padding: 14px 12px;
            }

            .ai-message-inner {
              max-width: 100%;
              width: 100%;
            }

            .user-message-inner {
              max-width: 100%;
              width: 100%;
            }

            .ai-message-content,
            .user-message-bubble {
              min-width: 0;
              font-size: 10px;
              line-height: 1.65;
            }

            .ai-message-content {
              padding: 12px 13px;
            }

            .user-message-bubble {
              padding: 11px 12px;
            }

            .ai-message-avatar,
            .user-message-avatar {
              width: 28px;
              height: 28px;
              flex-basis: 28px;
            }

            .ai-input-area {
              padding: 11px 10px;
            }

            .ai-input-box {
              padding: 6px;
              border-radius: 12px;
            }

            .ai-input-box textarea {
              font-size: 10px;
              min-height: 38px;
            }

            .ai-input-box button {
              width: 38px;
              height: 38px;
              flex-basis: 38px;
            }

            .ai-suggestions {
              display: grid;
              grid-template-columns: 1fr;
              gap: 8px;
            }

            .ai-suggestions button {
              width: 100%;
              text-align: left;
              padding: 10px 11px;
              font-size: 9px;
            }
          }

          /* very small portrait phones */

          @media (max-width: 420px) and (orientation: portrait) {

            .ai-page-heading h2 {
              font-size: 20px;
            }

            .ai-context-panel {
              padding: 16px 12px;
            }

            .ai-chat-body {
              padding: 12px 10px;
            }

            .ai-chat-panel {
              min-height: 500px;
            }

            .ai-message-inner,
            .user-message-inner {
              gap: 7px;
            }

            .ai-message-content,
            .user-message-bubble {
              font-size: 9px;
            }
          }
        `}
      </style>
    </div>
  )
}