import {
  useEffect,
  useMemo,
  useState,
} from 'react'

const MOCK_HISTORY_PREFIX =
  'prepcore_mock_history_'

const MOCK_QUESTIONS = [
  {
    id: 1,

    subject:
      'Advanced Accounting',

    chapter:
      'Introduction to Accounting Standards',

    question:
      'Which of the following is the primary purpose of accounting standards?',

    options: [
      'To increase the number of journal entries',
      'To bring uniformity and comparability in financial reporting',
      'To eliminate all business risks',
      'To reduce the number of financial statements',
    ],

    answer: 1,

    difficulty:
      'easy',

    explanation:
      'Accounting standards provide a common framework for recognising, measuring, presenting and disclosing financial information. This improves consistency, comparability and usefulness of financial statements.',

    optionExplanations: [
      'Incorrect. Increasing the number of journal entries is not the purpose of accounting standards.',

      'Correct. Accounting standards promote consistency and comparability in financial reporting.',

      'Incorrect. Accounting standards do not eliminate business risks.',

      'Incorrect. Reducing the number of financial statements is not their primary objective.',
    ],
  },

  {
    id: 2,

    subject:
      'Advanced Accounting',

    chapter:
      'Introduction to Accounting Standards',

    question:
      'Which quality of financial information is improved by consistent accounting treatment?',

    options: [
      'Comparability',
      'Advertising',
      'Profit guarantee',
      'Cash availability',
    ],

    answer: 0,

    difficulty:
      'easy',

    explanation:
      'When similar transactions are accounted for consistently, users can compare financial information across periods and between entities more meaningfully.',

    optionExplanations: [
      'Correct. Consistency improves comparability of financial information.',

      'Incorrect. Advertising is unrelated to the quality of financial reporting.',

      'Incorrect. Consistent accounting treatment cannot guarantee profit.',

      'Incorrect. Consistency in accounting does not guarantee availability of cash.',
    ],
  },

  {
    id: 3,

    subject:
      'Advanced Accounting',

    chapter:
      'Property, Plant and Equipment',

    question:
      'A company purchases an asset for ₹5,00,000 and installation charges are ₹20,000. Which amount is generally considered while determining the cost of the asset, subject to applicable accounting requirements?',

    options: [
      '₹5,00,000',
      '₹4,80,000',
      '₹5,20,000',
      '₹20,000',
    ],

    answer: 2,

    difficulty:
      'medium',

    explanation:
      'Installation charges that are directly attributable to bringing the asset to the location and condition necessary for its intended use may form part of the asset cost. Therefore, ₹5,00,000 + ₹20,000 = ₹5,20,000.',

    optionExplanations: [
      'Incorrect. ₹5,00,000 ignores the directly attributable installation cost in this example.',

      'Incorrect. ₹4,80,000 incorrectly subtracts the installation charges.',

      'Correct. ₹5,00,000 + ₹20,000 = ₹5,20,000.',

      'Incorrect. ₹20,000 is only the installation charge, not the total asset cost.',
    ],
  },

  {
    id: 4,

    subject:
      'Advanced Accounting',

    chapter:
      'Depreciation',

    question:
      'Which statement best describes depreciation?',

    options: [
      'It is a cash payment every year',
      'It is systematic allocation of depreciable amount over useful life',
      'It is always equal to market value reduction',
      'It is an increase in asset value',
    ],

    answer: 1,

    difficulty:
      'medium',

    explanation:
      'Depreciation is the systematic allocation of the depreciable amount of an asset over its useful life. It is not itself a cash payment.',

    optionExplanations: [
      'Incorrect. Depreciation is a non-cash accounting allocation, not a yearly cash payment.',

      'Correct. Depreciation systematically allocates depreciable amount over useful life.',

      'Incorrect. Depreciation does not necessarily equal the change in market value.',

      'Incorrect. Depreciation represents allocation of cost, not an increase in asset value.',
    ],
  },

  {
    id: 5,

    subject:
      'Advanced Accounting',

    chapter:
      'Introduction to Accounting Standards',

    question:
      'Which of the following is most closely associated with financial reporting standards?',

    options: [
      'Common reporting framework',
      'Employee attendance',
      'Advertising strategy',
      'Office layout',
    ],

    answer: 0,

    difficulty:
      'easy',

    explanation:
      'Financial reporting standards establish a common framework for accounting and reporting financial information.',

    optionExplanations: [
      'Correct. Standards provide a common framework for financial reporting.',

      'Incorrect. Employee attendance is an administrative matter.',

      'Incorrect. Advertising strategy is a marketing function.',

      'Incorrect. Office layout has no direct connection with financial reporting standards.',
    ],
  },

  {
    id: 6,

    subject:
      'Advanced Accounting',

    chapter:
      'Depreciation',

    question:
      'Which factor is most relevant while determining useful life of an asset?',

    options: [
      'Expected usage and technical obsolescence',
      'Colour of the asset',
      'Number of employees in office',
      'Advertisement budget',
    ],

    answer: 0,

    difficulty:
      'medium',

    explanation:
      'Useful life depends on factors such as expected usage, expected physical wear and tear, technical or commercial obsolescence and other relevant considerations.',

    optionExplanations: [
      'Correct. Expected usage and technical obsolescence are relevant factors.',

      'Incorrect. The colour of an asset does not normally determine its useful life.',

      'Incorrect. The number of employees is generally irrelevant to determining asset useful life.',

      'Incorrect. Advertisement budget does not determine the useful life of an asset.',
    ],
  },

  {
    id: 7,

    subject:
      'Advanced Accounting',

    chapter:
      'Depreciation',

    question:
      'If the depreciable amount of an asset is ₹4,80,000 and useful life is 8 years under straight-line method, annual depreciation is:',

    options: [
      '₹48,000',
      '₹60,000',
      '₹72,000',
      '₹80,000',
    ],

    answer: 1,

    difficulty:
      'difficult',

    explanation:
      'Under the straight-line method: Annual Depreciation = Depreciable Amount ÷ Useful Life = ₹4,80,000 ÷ 8 = ₹60,000 per year.',

    optionExplanations: [
      'Incorrect. ₹48,000 would result from dividing by 10 instead of 8.',

      'Correct. ₹4,80,000 ÷ 8 = ₹60,000.',

      'Incorrect. ₹72,000 is not the result of dividing ₹4,80,000 by 8.',

      'Incorrect. ₹80,000 does not match the straight-line calculation.',
    ],
  },

  {
    id: 8,

    subject:
      'Advanced Accounting',

    chapter:
      'Basic Accounting Concepts',

    question:
      'Which of the following normally represents a liability?',

    options: [
      'Cash',
      'Inventory',
      'Trade payable',
      'Furniture',
    ],

    answer: 2,

    difficulty:
      'easy',

    explanation:
      'A trade payable represents an obligation to pay suppliers for goods or services received. Therefore, it is a liability.',

    optionExplanations: [
      'Incorrect. Cash is an asset.',

      'Incorrect. Inventory is an asset.',

      'Correct. Trade payable represents an amount owed to suppliers and is a liability.',

      'Incorrect. Furniture is normally classified as an asset.',
    ],
  },

  {
    id: 9,

    subject:
      'Advanced Accounting',

    chapter:
      'Financial Statements',

    question:
      'What is the main objective of financial statements?',

    options: [
      'To provide useful financial information for decision-making',
      'To guarantee future profits',
      'To eliminate all estimates',
      'To replace management',
    ],

    answer: 0,

    difficulty:
      'medium',

    explanation:
      'Financial statements provide useful information about an entity’s financial position, financial performance and cash flows for users making economic decisions.',

    optionExplanations: [
      'Correct. Providing useful financial information for decision-making is a core objective.',

      'Incorrect. Financial statements cannot guarantee future profits.',

      'Incorrect. Financial reporting often involves estimates and judgement.',

      'Incorrect. Financial statements do not replace management.',
    ],
  },

  {
    id: 10,

    subject:
      'Advanced Accounting',

    chapter:
      'Basic Accounting Concepts',

    question:
      'Which principle generally requires expenses to be recognised in relation to the revenue they help generate, subject to applicable accounting requirements?',

    options: [
      'Matching concept',
      'Going concern',
      'Money measurement',
      'Entity concept',
    ],

    answer: 0,

    difficulty:
      'difficult',

    explanation:
      'The matching concept is associated with recognising expenses in relation to the revenue they help generate, subject to the applicable accounting framework.',

    optionExplanations: [
      'Correct. The matching concept connects relevant expenses with the revenue they help generate.',

      'Incorrect. Going concern relates to the assumption that the entity will continue operating.',

      'Incorrect. Money measurement concerns recording transactions in monetary terms.',

      'Incorrect. Entity concept treats the business as separate from its owners.',
    ],
  },
]

const DIFFICULTIES = [
  {
    id:
      'mix',
    title:
      'Mix',
    description:
      'Balanced exam-style paper',
    icon:
      '✦',
  },

  {
    id:
      'easy',
    title:
      'Easy',
    description:
      'Concept-focused questions',
    icon:
      '◔',
  },

  {
    id:
      'medium',
    title:
      'Medium',
    description:
      'Application-based questions',
    icon:
      '◑',
  },

  {
    id:
      'difficult',
    title:
      'Difficult',
    description:
      'Challenging questions',
    icon:
      '◕',
  },
]

function getHistoryKey(
  currentLevel,
) {
  return `${MOCK_HISTORY_PREFIX}${currentLevel
    .replace(/\s+/g, '_')
    .toLowerCase()}`
}

function readHistory(
  currentLevel,
) {
  try {
    const raw =
      localStorage.getItem(
        getHistoryKey(
          currentLevel,
        ),
      )

    if (!raw) {
      return []
    }

    const parsed =
      JSON.parse(raw)

    return Array.isArray(
      parsed,
    )
      ? parsed
      : []
  } catch (
    error
  ) {
    console.error(
      'MOCK HISTORY READ ERROR:',
      error,
    )

    return []
  }
}

function writeHistory(
  currentLevel,
  history,
) {
  try {
    localStorage.setItem(
      getHistoryKey(
        currentLevel,
      ),
      JSON.stringify(
        history,
      ),
    )
  } catch (
    error
  ) {
    console.error(
      'MOCK HISTORY WRITE ERROR:',
      error,
    )
  }
}

function getQuestions(
  difficulty,
  count,
) {
  let filtered =
    difficulty ===
    'mix'
      ? MOCK_QUESTIONS
      : MOCK_QUESTIONS.filter(
          (
            question,
          ) =>
            question.difficulty ===
            difficulty,
        )

  if (
    filtered.length <
    count
  ) {
    filtered =
      MOCK_QUESTIONS
  }

  const result = []

  for (
    let i = 0;
    i < count;
    i++
  ) {
    result.push(
      {
        ...filtered[
          i %
            filtered.length
        ],
      },
    )
  }

  return result
}

function formatTime(
  seconds,
) {
  const minutes =
    Math.floor(
      seconds / 60,
    )

  const remaining =
    seconds % 60

  return `${String(
    minutes,
  ).padStart(
    2,
    '0',
  )}:${String(
    remaining,
  ).padStart(
    2,
    '0',
  )}`
}

function formatDate(
  value,
) {
  if (!value) {
    return ''
  }

  try {
    return new Date(
      value,
    ).toLocaleString(
      'en-IN',
      {
        day:
          '2-digit',
        month:
          'short',
        year:
          'numeric',
        hour:
          '2-digit',
        minute:
          '2-digit',
      },
    )
  } catch (
    error
  ) {
    return ''
  }
}

function getDifficultyName(
  value,
) {
  return (
    DIFFICULTIES.find(
      (
        item,
      ) =>
        item.id ===
        value,
    )?.title ||
    'Mix'
  )
}

function StatusIcon({
  type,
}) {
  if (
    type ===
    'correct'
  ) {
    return (
      <span
        style={{
          width:
            '30px',
          height:
            '30px',
          borderRadius:
            '50%',
          display:
            'grid',
          placeItems:
            'center',
          background:
            '#e8f8f0',
          color:
            '#147252',
          fontWeight:
            900,
        }}
      >
        ✓
      </span>
    )
  }

  if (
    type ===
    'wrong'
  ) {
    return (
      <span
        style={{
          width:
            '30px',
          height:
            '30px',
          borderRadius:
            '50%',
          display:
            'grid',
          placeItems:
            'center',
          background:
            '#fff0f0',
          color:
            '#b34848',
          fontWeight:
            900,
        }}
      >
        ×
      </span>
    )
  }

  return (
    <span
      style={{
        width:
          '30px',
        height:
          '30px',
        borderRadius:
          '50%',
        display:
          'grid',
        placeItems:
          'center',
        background:
          '#f1f4f7',
        color:
          '#71879b',
        fontWeight:
          900,
      }}
    >
      —
    </span>
  )
}

function AnswerChip({
  label,
  value,
  type,
}) {
  return (
    <div
      style={{
        padding:
          '12px 14px',
        borderRadius:
          '11px',
        background:
          type ===
          'correct'
            ? '#effbf6'
            : type ===
                'wrong'
              ? '#fff3f3'
              : '#f6f8fa',
        border:
          type ===
          'correct'
            ? '1px solid #d5eee2'
            : type ===
                'wrong'
              ? '1px solid #efd8d8'
              : '1px solid #e3e9ee',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#8194a6',
          fontSize:
            '9px',
          fontWeight:
            800,
          marginBottom:
            '5px',
        }}
      >
        {
          label
        }
      </span>

      <strong
        style={{
          display:
            'block',
          color:
            type ===
            'correct'
              ? '#177252'
              : type ===
                  'wrong'
                ? '#a94343'
                : '#526d85',
          fontSize:
            '11px',
          lineHeight:
            1.5,
        }}
      >
        {
          value
        }
      </strong>
    </div>
  )
}

function ResultStat({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '15px',
        borderRadius:
          '12px',
        background:
          'rgba(255,255,255,.09)',
        border:
          '1px solid rgba(255,255,255,.12)',
      }}
    >
      <strong
        style={{
          display:
            'block',
          color:
            '#fff',
          fontSize:
            '22px',
        }}
      >
        {
          value
        }
      </strong>

      <span
        style={{
          display:
            'block',
          marginTop:
            '4px',
          color:
            '#a8bfd3',
          fontSize:
            '9px',
        }}
      >
        {
          label
        }
      </span>
    </div>
  )
}

function ReviewSummaryCard({
  title,
  value,
  description,
  background,
  text,
}) {
  return (
    <div
      style={{
        padding:
          '16px',
        borderRadius:
          '12px',
        background:
          background,
      }}
    >
      <strong
        style={{
          display:
            'block',
          color:
            text,
          fontSize:
            '22px',
        }}
      >
        {
          value
        }
      </strong>

      <span
        style={{
          display:
            'block',
          marginTop:
            '3px',
          color:
            '#527087',
          fontSize:
            '10px',
          fontWeight:
            800,
        }}
      >
        {
          title
        }
      </span>

      <small
        style={{
          display:
            'block',
          marginTop:
            '3px',
          color:
            '#7f93a5',
          fontSize:
            '9px',
        }}
      >
        {
          description
        }
      </small>
    </div>
  )
}

export default function MockTest({
  subjects = [],
  currentLevel =
    'CA Foundation',
}) {
  const [
    view,
    setView,
  ] =
    useState('setup')

  const [
    difficulty,
    setDifficulty,
  ] =
    useState('mix')

  const [
    questionCount,
    setQuestionCount,
  ] =
    useState(10)

  const [
    testQuestions,
    setTestQuestions,
  ] =
    useState([])

  const [
    currentIndex,
    setCurrentIndex,
  ] =
    useState(0)

  const [
    answers,
    setAnswers,
  ] =
    useState({})

  const [
    markedForReview,
    setMarkedForReview,
  ] =
    useState({})

  const [
    timeLeft,
    setTimeLeft,
  ] =
    useState(30 * 60)

  const [
    expandedReview,
    setExpandedReview,
  ] =
    useState(null)

  const [
    history,
    setHistory,
  ] =
    useState(
      () =>
        readHistory(
          currentLevel,
        ),
    )

  const [
    selectedHistory,
    setSelectedHistory,
  ] =
    useState(null)

  useEffect(() => {
    const stored =
      readHistory(
        currentLevel,
      )

    setHistory(
      stored,
    )
  }, [
    currentLevel,
  ])

  const startTest =
    () => {
      const questions =
        getQuestions(
          difficulty,
          questionCount,
        )

      setTestQuestions(
        questions,
      )

      setCurrentIndex(
        0,
      )

      setAnswers(
        {},
      )

      setMarkedForReview(
        {},
      )

      setExpandedReview(
        null,
      )

      setSelectedHistory(
        null,
      )

      setTimeLeft(
        questionCount ===
          10
          ? 30 * 60
          : questionCount *
              3 *
              60,
      )

      setView(
        'test',
      )
    }

  const saveCompletedTest =
    () => {
      const attempted =
        Object.keys(
          answers,
        ).length

      const score =
        testQuestions.reduce(
          (
            total,
            question,
            index,
          ) =>
            total +
            (answers[
              index
            ] ===
            question.answer
              ? 1
              : 0),
          0,
        )

      const wrong =
        attempted -
        score

      const accuracy =
        attempted ===
        0
          ? 0
          : Math.round(
              (score /
                attempted) *
                100,
            )

      const chapters = [
        ...new Set(
          testQuestions.map(
            (
              question,
            ) =>
              question.chapter,
          ),
        ),
      ]

      const subjectsCovered =
        [
          ...new Set(
            testQuestions.map(
              (
                question,
              ) =>
                question.subject,
            ),
          ),
        ]

      const completedAttempt =
        {
          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,

          createdAt:
            new Date().toISOString(),

          level:
            currentLevel,

          difficulty,

          totalQuestions:
            testQuestions.length,

          attempted,

          correct:
            score,

          wrong,

          unattempted:
            testQuestions.length -
            attempted,

          accuracy,

          chapters,

          subjects:
            subjectsCovered,

          questions:
            testQuestions,

          answers,
        }

      const updatedHistory =
        [
          completedAttempt,
          ...history,
        ].slice(
          0,
          50,
        )

      setHistory(
        updatedHistory,
      )

      writeHistory(
        currentLevel,
        updatedHistory,
      )

      setSelectedHistory(
        completedAttempt,
      )
    }

  const submitTest =
    () => {
      saveCompletedTest()

      setExpandedReview(
        0,
      )

      setView(
        'result',
      )
    }

  const openHistoryReview =
    (
      attempt,
    ) => {
      setSelectedHistory(
        attempt,
      )

      setExpandedReview(
        0,
      )

      setView(
        'historyReview',
      )
    }

  const startNewTest =
    () => {
      setSelectedHistory(
        null,
      )

      setExpandedReview(
        null,
      )

      setAnswers(
        {},
      )

      setMarkedForReview(
        {},
      )

      setTestQuestions(
        [],
      )

      setView(
        'setup',
      )
    }

  const clearHistory =
    () => {
      const confirmed =
        window.confirm(
          'Delete all mock test history for this level?',
        )

      if (!confirmed) {
        return
      }

      setHistory(
        [],
      )

      writeHistory(
        currentLevel,
        [],
      )

      setSelectedHistory(
        null,
      )
    }

  useEffect(() => {
    if (
      view !==
        'test' ||
      testQuestions.length ===
        0
    ) {
      return
    }

    if (
      timeLeft <=
      0
    ) {
      submitTest()

      return
    }

    const timer =
      setInterval(
        () => {
          setTimeLeft(
            (
              value,
            ) =>
              value -
              1,
          )
        },
        1000,
      )

    return () =>
      clearInterval(
        timer,
      )
  }, [
    view,
    timeLeft,
    testQuestions.length,
  ])

  const currentQuestion =
    testQuestions[
      currentIndex
    ]

  const score =
    testQuestions.reduce(
      (
        total,
        question,
        index,
      ) =>
        total +
        (answers[
          index
        ] ===
        question.answer
          ? 1
          : 0),
      0,
    )

  const attempted =
    Object.keys(
      answers,
    ).length

  const unattempted =
    testQuestions.length -
    attempted

  const accuracy =
    attempted ===
    0
      ? 0
      : Math.round(
          (score /
            attempted) *
            100,
        )

  /*
  |--------------------------------------------------------------------------
  | HISTORY LIST
  |--------------------------------------------------------------------------
  */

  if (
    view ===
    'history'
  ) {
    return (
      <div className="page mock-test-live-page">
        <div
          className="mock-test-live-header"
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            alignItems:
              'flex-end',
            gap:
              '15px',
            flexWrap:
              'wrap',
            marginBottom:
              '20px',
          }}
        >
          <div>
            <p className="eyebrow">
              PERFORMANCE HISTORY
            </p>

            <h2>
              Mock Test History
            </h2>

            <p
              style={{
                margin:
                  0,
                color:
                  '#7188a0',
                fontSize:
                  '12px',
              }}
            >
              Your completed mock tests are saved on this device.
            </p>
          </div>

          <div
            style={{
              display:
                'flex',
              gap:
                '8px',
            }}
          >
            {history.length >
              0 && (
              <button
                className="filter-button"
                onClick={
                  clearHistory
                }
              >
                Clear History
              </button>
            )}

            <button
              className="primary-button"
              onClick={
                startNewTest
              }
            >
              New Mock Test →
            </button>
          </div>
        </div>

        {history.length ===
        0 ? (
          <div
            style={{
              padding:
                '55px 20px',
              border:
                '1px solid #dce6f0',
              borderRadius:
                '18px',
              background:
                '#fff',
              textAlign:
                'center',
            }}
          >
            <div
              style={{
                width:
                  '54px',
                height:
                  '54px',
                margin:
                  '0 auto 13px',
                display:
                  'grid',
                placeItems:
                  'center',
                borderRadius:
                  '14px',
                background:
                  '#edf5fb',
                color:
                  '#1d4f83',
                fontSize:
                  '22px',
              }}
            >
              ◆
            </div>

            <h3>
              No mock tests yet
            </h3>

            <p
              style={{
                color:
                  '#7d91a4',
                fontSize:
                  '11px',
              }}
            >
              Complete your first mock test and its result will appear here.
            </p>

            <button
              className="primary-button"
              onClick={
                startNewTest
              }
            >
              Start Your First Test →
            </button>
          </div>
        ) : (
          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap:
                '11px',
            }}
          >
            {history.map(
              (
                attempt,
              ) => (
                <div
                  key={
                    attempt.id
                  }
                  style={{
                    padding:
                      '18px',
                    border:
                      '1px solid #dce6f0',
                    borderRadius:
                      '17px',
                    background:
                      '#fff',
                  }}
                >
                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      gap:
                        '12px',
                      flexWrap:
                        'wrap',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display:
                            'block',
                          color:
                            '#8497a8',
                          fontSize:
                            '9px',
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          formatDate(
                            attempt.createdAt,
                          )
                        }
                      </span>

                      <h3
                        style={{
                          margin:
                            '6px 0 4px',
                          color:
                            '#163d61',
                        }}
                      >
                        Mock Test
                      </h3>

                      <p
                        style={{
                          margin:
                            0,
                          color:
                            '#748ba0',
                          fontSize:
                            '10px',
                        }}
                      >
                        {
                          attempt.level
                        }{' '}
                        ·{' '}
                        {getDifficultyName(
                          attempt.difficulty,
                        )}
                      </p>
                    </div>

                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          '7px',
                        alignItems:
                          'center',
                      }}
                    >
                      <span
                        style={{
                          padding:
                            '6px 9px',
                          borderRadius:
                            '999px',
                          background:
                            attempt.accuracy >=
                            70
                              ? '#effbf6'
                              : '#fff6ed',
                          color:
                            attempt.accuracy >=
                            70
                              ? '#147252'
                              : '#a96a22',
                          fontSize:
                            '9px',
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          attempt.accuracy
                        }%
                      </span>

                      <button
                        className="small-action"
                        onClick={() =>
                          openHistoryReview(
                            attempt,
                          )
                        }
                      >
                        View Review →
                      </button>
                    </div>
                  </div>

                  <div
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        'repeat(5,1fr)',
                      gap:
                        '8px',
                      marginTop:
                        '15px',
                    }}
                  >
                    <HistoryStat
                      label="Questions"
                      value={
                        attempt.totalQuestions
                      }
                    />

                    <HistoryStat
                      label="Attempted"
                      value={
                        attempt.attempted
                      }
                    />

                    <HistoryStat
                      label="Correct"
                      value={
                        attempt.correct
                      }
                    />

                    <HistoryStat
                      label="Wrong"
                      value={
                        attempt.wrong
                      }
                    />

                    <HistoryStat
                      label="Score"
                      value={`${attempt.correct}/${attempt.totalQuestions}`}
                    />
                  </div>

                  <div
                    style={{
                      marginTop:
                        '12px',
                      padding:
                        '11px 12px',
                      borderRadius:
                        '10px',
                      background:
                        '#f7faff',
                    }}
                  >
                    <span
                      style={{
                        display:
                          'block',
                        color:
                          '#8799a9',
                        fontSize:
                          '8px',
                        fontWeight:
                          800,
                        marginBottom:
                          '5px',
                      }}
                    >
                      CHAPTERS COVERED
                    </span>

                    <div
                      style={{
                        display:
                          'flex',
                        flexWrap:
                          'wrap',
                        gap:
                          '5px',
                      }}
                    >
                      {attempt.chapters.map(
                        (
                          chapter,
                        ) => (
                          <span
                            key={
                              chapter
                            }
                            style={{
                              padding:
                                '4px 7px',
                              borderRadius:
                                '6px',
                              background:
                                '#fff',
                              border:
                                '1px solid #dce6f0',
                              color:
                                '#5f7890',
                              fontSize:
                                '8px',
                            }}
                          >
                            {
                              chapter
                            }
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | HISTORY REVIEW
  |--------------------------------------------------------------------------
  */

  if (
    view ===
    'historyReview'
  ) {
    const attempt =
      selectedHistory

    if (!attempt) {
      setView(
        'history',
      )

      return null
    }

    const historyQuestions =
      attempt.questions ||
      []

    const savedAnswers =
      attempt.answers ||
      {}

    return (
      <div className="page">
        <div
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            alignItems:
              'flex-end',
            gap:
              '15px',
            flexWrap:
              'wrap',
            marginBottom:
              '18px',
          }}
        >
          <div>
            <p className="eyebrow">
              PAST ATTEMPT REVIEW
            </p>

            <h2>
              Mock Test Review
            </h2>

            <p
              style={{
                margin:
                  0,
                color:
                  '#7188a0',
                fontSize:
                  '11px',
              }}
            >
              {
                formatDate(
                  attempt.createdAt,
                )
              }
            </p>
          </div>

          <button
            className="filter-button"
            onClick={() =>
              setView(
                'history',
              )
            }
          >
            ← Back to History
          </button>
        </div>

        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(4,1fr)',
            gap:
              '10px',
            marginBottom:
              '18px',
          }}
        >
          <ReviewSummaryCard
            title="Score"
            value={`${attempt.correct}/${attempt.totalQuestions}`}
            description={
              getDifficultyName(
                attempt.difficulty,
              )
            }
            background="#edf5fb"
            text="#1d4f83"
          />

          <ReviewSummaryCard
            title="Accuracy"
            value={`${attempt.accuracy}%`}
            description="Overall accuracy"
            background="#effbf6"
            text="#147252"
          />

          <ReviewSummaryCard
            title="Attempted"
            value={
              attempt.attempted
            }
            description="Questions answered"
            background="#f7faff"
            text="#526d85"
          />

          <ReviewSummaryCard
            title="Wrong"
            value={
              attempt.wrong
            }
            description="Needs improvement"
            background="#fff3f3"
            text="#a94343"
          />
        </div>

        <div
          style={{
            marginBottom:
              '14px',
          }}
        >
          <p className="eyebrow">
            CHAPTER COVERAGE
          </p>

          <div
            style={{
              display:
                'flex',
              flexWrap:
                'wrap',
              gap:
                '6px',
              marginTop:
                '7px',
            }}
          >
            {attempt.chapters.map(
              (
                chapter,
              ) => (
                <span
                  key={
                    chapter
                  }
                  style={{
                    padding:
                      '7px 9px',
                    borderRadius:
                      '8px',
                    background:
                      '#fff',
                    border:
                      '1px solid #dce6f0',
                    color:
                      '#5d758d',
                    fontSize:
                      '9px',
                  }}
                >
                  {
                    chapter
                  }
                </span>
              ),
            )}
          </div>
        </div>

        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap:
              '10px',
          }}
        >
          {historyQuestions.map(
            (
              question,
              index,
            ) => {
              const selected =
                savedAnswers[
                  index
                ]

              const isAttempted =
                selected !==
                undefined

              const isCorrect =
                selected ===
                question.answer

              const status =
                !isAttempted
                  ? 'unattempted'
                  : isCorrect
                    ? 'correct'
                    : 'wrong'

              const selectedText =
                isAttempted
                  ? question
                      .options[
                      selected
                    ]
                  : 'Not attempted'

              const correctText =
                question
                  .options[
                  question.answer
                ]

              const expanded =
                expandedReview ===
                index

              return (
                <div
                  key={
                    `${attempt.id}-${question.id}-${index}`
                  }
                  style={{
                    border:
                      '1px solid #dce6f0',
                    borderRadius:
                      '16px',
                    background:
                      '#fff',
                    overflow:
                      'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedReview(
                        expanded
                          ? null
                          : index,
                      )
                    }
                    style={{
                      width:
                        '100%',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap:
                        '12px',
                      padding:
                        '14px 16px',
                      border:
                        0,
                      background:
                        '#fff',
                      textAlign:
                        'left',
                      cursor:
                        'pointer',
                    }}
                  >
                    <StatusIcon
                      type={
                        status ===
                        'correct'
                          ? 'correct'
                          : status ===
                              'wrong'
                            ? 'wrong'
                            : 'neutral'
                      }
                    />

                    <div
                      style={{
                        flex:
                          1,
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          gap:
                            '6px',
                          flexWrap:
                            'wrap',
                        }}
                      >
                        <span
                          style={{
                            color:
                              '#8395a6',
                            fontSize:
                              '8px',
                            fontWeight:
                              800,
                          }}
                        >
                          QUESTION{' '}
                          {index +
                            1}
                        </span>

                        <span
                          style={{
                            padding:
                              '3px 6px',
                            borderRadius:
                              '999px',
                            background:
                              status ===
                              'correct'
                                ? '#effbf6'
                                : status ===
                                    'wrong'
                                  ? '#fff2f2'
                                  : '#f2f5f7',
                            color:
                              status ===
                              'correct'
                                ? '#147252'
                                : status ===
                                    'wrong'
                                  ? '#a94343'
                                  : '#71879b',
                            fontSize:
                              '7px',
                            fontWeight:
                              800,
                          }}
                        >
                          {
                            status ===
                            'correct'
                              ? 'CORRECT'
                              : status ===
                                  'wrong'
                                ? 'INCORRECT'
                                : 'UNATTEMPTED'
                          }
                        </span>
                      </div>

                      <strong
                        style={{
                          display:
                            'block',
                          marginTop:
                            '6px',
                          color:
                            '#163d61',
                          fontSize:
                            '11px',
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          question.question
                        }
                      </strong>
                    </div>

                    <span
                      style={{
                        color:
                          '#72899e',
                        transform:
                          expanded
                            ? 'rotate(180deg)'
                            : 'rotate(0)',
                      }}
                    >
                      ⌄
                    </span>
                  </button>

                  {expanded && (
                    <div
                      style={{
                        padding:
                          '0 16px 17px',
                        borderTop:
                          '1px solid #edf2f6',
                      }}
                    >
                      <div
                        style={{
                          display:
                            'grid',
                          gridTemplateColumns:
                            isAttempted
                              ? 'repeat(2,1fr)'
                              : '1fr',
                          gap:
                            '9px',
                          marginTop:
                            '14px',
                        }}
                      >
                        <AnswerChip
                          label="YOUR ANSWER"
                          value={
                            selectedText
                          }
                          type={
                            status ===
                            'correct'
                              ? 'correct'
                              : status ===
                                  'wrong'
                                ? 'wrong'
                                : 'neutral'
                          }
                        />

                        {isAttempted && (
                          <AnswerChip
                            label="CORRECT ANSWER"
                            value={
                              correctText
                            }
                            type="correct"
                          />
                        )}
                      </div>

                      {isAttempted && (
                        <div
                          style={{
                            marginTop:
                              '9px',
                            padding:
                              '13px',
                            borderRadius:
                              '11px',
                            background:
                              isCorrect
                                ? '#f0fbf6'
                                : '#fff6f6',
                            border:
                              isCorrect
                                ? '1px solid #d8eee3'
                                : '1px solid #efdada',
                          }}
                        >
                          <strong
                            style={{
                              display:
                                'block',
                              color:
                                isCorrect
                                  ? '#147252'
                                  : '#a94343',
                              fontSize:
                                '10px',
                              marginBottom:
                                '5px',
                            }}
                          >
                            {isCorrect
                              ? '✓ Why your answer is correct'
                              : '✕ Why your answer is wrong'}
                          </strong>

                          <p
                            style={{
                              margin:
                                0,
                              color:
                                '#5d7389',
                              fontSize:
                                '11px',
                              lineHeight:
                                1.6,
                            }}
                          >
                            {
                              question
                                .optionExplanations[
                                selected
                              ]
                            }
                          </p>
                        </div>
                      )}

                      <div
                        style={{
                          marginTop:
                            '9px',
                          padding:
                            '13px',
                          borderRadius:
                            '11px',
                          background:
                            '#f7faff',
                          border:
                            '1px solid #e0e9f1',
                        }}
                      >
                        <strong
                          style={{
                            display:
                              'block',
                            color:
                              '#1d4f83',
                            fontSize:
                              '10px',
                            marginBottom:
                              '5px',
                          }}
                        >
                          📘 Correct Answer Explanation
                        </strong>

                        <p
                          style={{
                            margin:
                              0,
                            color:
                              '#5d7389',
                            fontSize:
                              '11px',
                            lineHeight:
                              1.6,
                          }}
                        >
                          {
                            question.explanation
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            },
          )}
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | RESULT
  |--------------------------------------------------------------------------
  */

  if (
    view ===
    'result'
  ) {
    return (
      <div className="page">
        <div
          style={{
            maxWidth:
              '1050px',
            margin:
              '0 auto',
          }}
        >
          <div
            style={{
              padding:
                '34px',
              borderRadius:
                '24px',
              background:
                'linear-gradient(135deg,#071e3a,#123f6c,#1d5d91)',
              color:
                '#fff',
              marginBottom:
                '16px',
            }}
          >
            <span
              style={{
                fontSize:
                  '10px',
                fontWeight:
                  800,
                color:
                  '#9fc2df',
                letterSpacing:
                  '.16em',
              }}
            >
              MOCK TEST COMPLETED
            </span>

            <h2
              style={{
                color:
                  '#fff',
                margin:
                  '10px 0 5px',
              }}
            >
              Your Performance
            </h2>

            <div
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(4,1fr)',
                gap:
                  '10px',
                marginTop:
                  '23px',
              }}
            >
              <ResultStat
                label="Score"
                value={`${score}/${testQuestions.length}`}
              />

              <ResultStat
                label="Accuracy"
                value={`${accuracy}%`}
              />

              <ResultStat
                label="Correct"
                value={
                  score
                }
              />

              <ResultStat
                label="Wrong"
                value={
                  attempted -
                  score
                }
              />
            </div>
          </div>

          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginBottom:
                '15px',
              gap:
                '10px',
              flexWrap:
                'wrap',
            }}
          >
            <div>
              <p className="eyebrow">
                DETAILED REVIEW
              </p>

              <h3
                style={{
                  margin:
                    '5px 0 0',
                }}
              >
                Review Your Answers
              </h3>
            </div>

            <div
              style={{
                display:
                  'flex',
                gap:
                  '8px',
              }}
            >
              <button
                className="filter-button"
                onClick={() =>
                  setView(
                    'history',
                  )
                }
              >
                View History
              </button>

              <button
                className="primary-button"
                onClick={
                  startNewTest
                }
              >
                New Test →
              </button>
            </div>
          </div>

          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap:
                '10px',
            }}
          >
            {testQuestions.map(
              (
                question,
                index,
              ) => {
                const selected =
                  answers[
                    index
                  ]

                const isAttempted =
                  selected !==
                  undefined

                const isCorrect =
                  selected ===
                  question.answer

                const status =
                  !isAttempted
                    ? 'unattempted'
                    : isCorrect
                      ? 'correct'
                      : 'wrong'

                const expanded =
                  expandedReview ===
                  index

                return (
                  <ReviewQuestion
                    key={`${question.id}-${index}`}
                    question={
                      question
                    }
                    index={
                      index
                    }
                    selected={
                      selected
                    }
                    isAttempted={
                      isAttempted
                    }
                    status={
                      status
                    }
                    expanded={
                      expanded
                    }
                    onToggle={() =>
                      setExpandedReview(
                        expanded
                          ? null
                          : index,
                      )
                    }
                  />
                )
              },
            )}
          </div>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | LIVE TEST
  |--------------------------------------------------------------------------
  */

  if (
    view ===
    'test'
  ) {
    const selectedAnswer =
      answers[
        currentIndex
      ]

    const review =
      Boolean(
        markedForReview[
          currentIndex
        ],
      )

    return (
      <div className="page">
        <div
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap:
              '15px',
            flexWrap:
              'wrap',
            marginBottom:
              '15px',
          }}
        >
          <div>
            <p className="eyebrow">
              FULL LENGTH MOCK
            </p>

            <h2
              style={{
                margin:
                  '5px 0',
              }}
            >
              CA Mock Test
            </h2>

            <p
              style={{
                margin:
                  0,
                color:
                  '#7188a0',
                fontSize:
                  '12px',
              }}
            >
              {
                currentLevel
              }{' '}
              ·{' '}
              {
                testQuestions.length
              }{' '}
              questions
            </p>
          </div>

          <div
            style={{
              padding:
                '11px 16px',
              borderRadius:
                '12px',
              background:
                timeLeft <=
                60
                  ? '#fff2f2'
                  : '#edf5ff',
              color:
                timeLeft <=
                60
                  ? '#ae4c4c'
                  : '#1d4f83',
              fontWeight:
                900,
              fontSize:
                '18px',
              minWidth:
                '95px',
              textAlign:
                'center',
            }}
          >
            {
              formatTime(
                timeLeft,
              )
            }
          </div>
        </div>

        <div
          className="mock-test-live-layout"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              '1fr 240px',
            gap:
              '14px',
          }}
        >
          <div
            className="mock-test-question-card"
            style={{
              padding:
                '22px',
              background:
                '#fff',
              border:
                '1px solid #dce6f0',
              borderRadius:
                '18px',
            }}
          >
            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                gap:
                  '10px',
                marginBottom:
                  '18px',
              }}
            >
              <span className="status-pill normal">
                QUESTION{' '}
                {
                  currentIndex +
                  1
                }{' '}
                /{' '}
                {
                  testQuestions.length
                }
              </span>

              <button
                type="button"
                onClick={() =>
                  setMarkedForReview(
                    (
                      previous,
                    ) => ({
                      ...previous,

                      [currentIndex]:
                        !previous[
                          currentIndex
                        ],
                    }),
                  )
                }
                style={{
                  padding:
                    '8px 11px',
                  border:
                    review
                      ? '1px solid #b97820'
                      : '1px solid #dce6f0',
                  borderRadius:
                    '8px',
                  background:
                    review
                      ? '#fff7ea'
                      : '#fff',
                  color:
                    review
                      ? '#a66619'
                      : '#637f97',
                  cursor:
                    'pointer',
                  fontSize:
                    '9px',
                  fontWeight:
                    800,
                }}
              >
                {review
                  ? '★ Marked for review'
                  : '☆ Mark for review'}
              </button>
            </div>

            <div
              style={{
                marginBottom:
                  '7px',
                color:
                  '#8397a8',
                fontSize:
                  '9px',
                fontWeight:
                  800,
              }}
            >
              {
                currentQuestion.chapter
              }
            </div>

            <h2
              style={{
                color:
                  '#0b2e55',
                fontSize:
                  '18px',
                lineHeight:
                  1.55,
                margin:
                  '0 0 22px',
              }}
            >
              {
                currentQuestion.question
              }
            </h2>

            <div
              className="mock-test-answer-options"
              style={{
                display:
                  'flex',
                flexDirection:
                  'column',
                gap:
                  '10px',
              }}
            >
              {
                currentQuestion.options.map(
                  (
                    option,
                    optionIndex,
                  ) => {
                    const active =
                      selectedAnswer ===
                      optionIndex

                    return (
                      <button
                        key={
                          optionIndex
                        }
                        type="button"
                        onClick={() =>
                          setAnswers(
                            (
                              previous,
                            ) => ({
                              ...previous,

                              [currentIndex]:
                                optionIndex,
                            }),
                          )
                        }
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            '12px',
                          minHeight:
                            '58px',
                          padding:
                            '10px 12px',
                          border:
                            active
                              ? '2px solid #1d4f83'
                              : '1px solid #dce6f0',
                          borderRadius:
                            '12px',
                          background:
                            active
                              ? '#edf5ff'
                              : '#fff',
                          textAlign:
                            'left',
                          cursor:
                            'pointer',
                        }}
                      >
                        <span
                          style={{
                            width:
                              '34px',
                            height:
                              '34px',
                            display:
                              'grid',
                            placeItems:
                              'center',
                            borderRadius:
                              '9px',
                            background:
                              active
                                ? '#1d4f83'
                                : '#eef4f8',
                            color:
                              active
                                ? '#fff'
                                : '#45677f',
                            fontWeight:
                              900,
                          }}
                        >
                          {String.fromCharCode(
                            65 +
                              optionIndex,
                          )}
                        </span>

                        <span
                          style={{
                            flex:
                              1,
                            color:
                              '#254a69',
                            fontSize:
                              '12px',
                            fontWeight:
                              active
                                ? 700
                                : 600,
                          }}
                        >
                          {
                            option
                          }
                        </span>
                      </button>
                    )
                  },
                )
              }
            </div>

            <div
              className="mock-test-question-actions"
              style={{
                display:
                  'flex',
                justifyContent:
                  'space-between',
                gap:
                  '10px',
                marginTop:
                  '20px',
              }}
            >
              <button
                className="filter-button"
                disabled={
                  currentIndex ===
                  0
                }
                onClick={() =>
                  setCurrentIndex(
                    (
                      value,
                    ) =>
                      Math.max(
                        0,
                        value -
                          1,
                      ),
                  )
                }
              >
                ← Previous
              </button>

              {currentIndex ===
              testQuestions.length -
                1 ? (
                <button
                  className="primary-button"
                  onClick={
                    submitTest
                  }
                >
                  Submit Test →
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={() =>
                    setCurrentIndex(
                      (
                        value,
                      ) =>
                        Math.min(
                          testQuestions.length -
                            1,
                          value +
                            1,
                        ),
                    )
                  }
                >
                  Next Question →
                </button>
              )}
            </div>
          </div>

          <div
            className="mock-test-question-nav"
            style={{
              padding:
                '17px',
              background:
                '#fff',
              border:
                '1px solid #dce6f0',
              borderRadius:
                '18px',
              height:
                'fit-content',
            }}
          >
            <span className="eyebrow">
              QUESTION NAVIGATION
            </span>

            <div
              className="mock-test-question-grid"
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(4,1fr)',
                gap:
                  '7px',
                marginTop:
                  '12px',
              }}
            >
              {
                testQuestions.map(
                  (
                    _,
                    index,
                  ) => {
                    const answered =
                      answers[
                        index
                      ] !==
                      undefined

                    const review =
                      Boolean(
                        markedForReview[
                          index
                        ],
                      )

                    const active =
                      index ===
                      currentIndex

                    return (
                      <button
                        key={
                          index
                        }
                        type="button"
                        onClick={() =>
                          setCurrentIndex(
                            index,
                          )
                        }
                        style={{
                          position:
                            'relative',
                          height:
                            '36px',
                          border:
                            active
                              ? '2px solid #1d4f83'
                              : review
                                ? '1px solid #c9892d'
                                : answered
                                  ? '1px solid #71af94'
                                  : '1px solid #dce6f0',
                          borderRadius:
                            '8px',
                          background:
                            answered
                              ? '#effbf6'
                              : review
                                ? '#fff7ea'
                                : '#fff',
                          color:
                            '#375875',
                          cursor:
                            'pointer',
                          fontWeight:
                            800,
                          fontSize:
                            '10px',
                        }}
                      >
                        {
                          index +
                          1
                        }

                        {review && (
                          <span
                            style={{
                              position:
                                'absolute',
                              top:
                                '-4px',
                              right:
                                '-3px',
                              width:
                                '9px',
                              height:
                                '9px',
                              borderRadius:
                                '50%',
                              background:
                                '#c9892d',
                            }}
                          />
                        )}
                      </button>
                    )
                  },
                )
              }
            </div>

            <div
              style={{
                display:
                  'flex',
                flexDirection:
                  'column',
                gap:
                  '8px',
                marginTop:
                  '18px',
                fontSize:
                  '9px',
                color:
                  '#6f879d',
              }}
            >
              <span>
                🟢 Answered
              </span>

              <span>
                🟠 Marked for review
              </span>

              <span>
                ⚪ Not answered
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | SETUP
  |--------------------------------------------------------------------------
  */

  return (
    <div className="page mock-test-page">
      <div
        className="page-intro"
        style={{
          display:
            'flex',
          justifyContent:
            'space-between',
          alignItems:
            'flex-end',
          gap:
            '15px',
          flexWrap:
            'wrap',
        }}
      >
        <div>
          <p className="eyebrow">
            FULL SYLLABUS PRACTICE
          </p>

          <h2>
            Mock Test
          </h2>

          <p>
            Simulate an exam environment and test your CA preparation.
          </p>
        </div>

        <button
          className="filter-button"
          onClick={() =>
            setView(
              'history',
            )
          }
        >
          History
        </button>
      </div>

      <div
        className="mock-test-setup-shell"
        style={{
          maxWidth:
            '950px',
          margin:
            '0 auto',
        }}
      >
        <div
          className="mock-test-hero"
          style={{
            padding:
              '28px',
            borderRadius:
              '22px',
            background:
              'linear-gradient(135deg,#071f3d,#123f69,#1d5b8e)',
            color:
              '#fff',
            marginBottom:
              '15px',
          }}
        >
          <span
            style={{
              color:
                '#99bdd9',
              fontSize:
                '10px',
              fontWeight:
                800,
              letterSpacing:
                '.15em',
            }}
          >
            PREPCORE EXAM MODE
          </span>

          <h2
            style={{
              color:
                '#fff',
              margin:
                '8px 0 5px',
            }}
          >
            Test your preparation.
          </h2>

          <p
            style={{
              margin:
                0,
              color:
                '#b5cce0',
              fontSize:
                '12px',
            }}
          >
            {
              currentLevel
            }{' '}
            · Exam-style MCQs · Timed environment
          </p>
        </div>

        <div
          className="mock-test-options-grid"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(2,1fr)',
            gap:
              '14px',
          }}
        >
          <div
            className="mock-test-size-card"
            style={{
              padding:
                '22px',
              background:
                '#fff',
              border:
                '1px solid #dce6f0',
              borderRadius:
                '18px',
            }}
          >
            <p className="eyebrow">
              TEST SIZE
            </p>

            <h3
              style={{
                margin:
                  '6px 0',
              }}
            >
              Number of Questions
            </h3>

            <div
              className="mock-question-count-grid"
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(3,1fr)',
                gap:
                  '9px',
                marginTop:
                  '17px',
              }}
            >
              {[10, 20, 30].map(
                (
                  count,
                ) => (
                  <button
                    key={
                      count
                    }
                    type="button"
                    onClick={() =>
                      setQuestionCount(
                        count,
                      )
                    }
                    style={{
                      minHeight:
                        '52px',
                      border:
                        questionCount ===
                        count
                          ? '2px solid #1d4f83'
                          : '1px solid #dce6f0',
                      borderRadius:
                        '11px',
                      background:
                        questionCount ===
                        count
                          ? '#edf5ff'
                          : '#fff',
                      color:
                        '#244965',
                      cursor:
                        'pointer',
                      fontWeight:
                        800,
                    }}
                  >
                    {
                      count
                    }
                  </button>
                ),
              )}
            </div>
          </div>

          <div
            className="mock-test-difficulty-card"
            style={{
              padding:
                '22px',
              background:
                '#fff',
              border:
                '1px solid #dce6f0',
              borderRadius:
                '18px',
            }}
          >
            <p className="eyebrow">
              DIFFICULTY
            </p>

            <h3
              style={{
                margin:
                  '6px 0',
              }}
            >
              Choose Paper Level
            </h3>

            <div
              className="mock-difficulty-grid"
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(2,1fr)',
                gap:
                  '9px',
                marginTop:
                  '17px',
              }}
            >
              {
                DIFFICULTIES.map(
                  (
                    item,
                  ) => {
                    const active =
                      difficulty ===
                      item.id

                    return (
                      <button
                        key={
                          item.id
                        }
                        type="button"
                        onClick={() =>
                          setDifficulty(
                            item.id,
                          )
                        }
                        style={{
                          minHeight:
                            '76px',
                          padding:
                            '11px',
                          border:
                            active
                              ? '2px solid #1d4f83'
                              : '1px solid #dce6f0',
                          borderRadius:
                            '11px',
                          background:
                            active
                              ? '#edf5ff'
                              : '#fff',
                          textAlign:
                            'left',
                          cursor:
                            'pointer',
                        }}
                      >
                        <span
                          style={{
                            display:
                              'block',
                            color:
                              '#1d4f83',
                            fontSize:
                              '15px',
                          }}
                        >
                          {
                            item.icon
                          }
                        </span>

                        <strong
                          style={{
                            display:
                              'block',
                            marginTop:
                              '4px',
                            color:
                              '#1d4665',
                            fontSize:
                              '11px',
                          }}
                        >
                          {
                            item.title
                          }
                        </strong>

                        <small
                          style={{
                            display:
                              'block',
                            marginTop:
                              '2px',
                            color:
                              '#7d91a5',
                            fontSize:
                              '8px',
                          }}
                        >
                          {
                            item.description
                          }
                        </small>
                      </button>
                    )
                  },
                )
              }
            </div>
          </div>
        </div>

        <div
          className="mock-test-summary"
          style={{
            marginTop:
              '14px',
            padding:
              '18px',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '16px',
            background:
              '#fff',
            display:
              'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap:
              '15px',
            flexWrap:
              'wrap',
          }}
        >
          <div>
            <span className="eyebrow">
              TEST SUMMARY
            </span>

            <p
              style={{
                margin:
                  '5px 0 0',
                color:
                  '#7188a0',
                fontSize:
                  '11px',
              }}
            >
              {
                questionCount
              }{' '}
              questions ·{' '}
              {
                questionCount *
                3
              }{' '}
              minute suggested duration ·{' '}
              {getDifficultyName(
                difficulty,
              )}
            </p>
          </div>

          <button
            className="primary-button"
            onClick={
              startTest
            }
          >
            Start Mock Test →
          </button>
        </div>
      </div>
    </div>
  )
}

function HistoryStat({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '10px 11px',
        borderRadius:
          '10px',
        background:
          '#f7faff',
        border:
          '1px solid #e7edf3',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#8396a7',
          fontSize:
            '8px',
          fontWeight:
            800,
        }}
      >
        {
          label
        }
      </span>

      <strong
        style={{
          display:
            'block',
          marginTop:
            '3px',
          color:
            '#254964',
          fontSize:
            '13px',
        }}
      >
        {
          value
        }
      </strong>
    </div>
  )
}

function ReviewQuestion({
  question,
  index,
  selected,
  isAttempted,
  status,
  expanded,
  onToggle,
}) {
  const selectedText =
    isAttempted
      ? question
          .options[
          selected
        ]
      : 'Not attempted'

  const correctText =
    question
      .options[
      question.answer
    ]

  return (
    <div
      style={{
        border:
          '1px solid #dce6f0',
        borderRadius:
          '16px',
        background:
          '#fff',
        overflow:
          'hidden',
      }}
    >
      <button
        type="button"
        onClick={
          onToggle
        }
        style={{
          width:
            '100%',
          display:
            'flex',
          alignItems:
            'center',
          gap:
            '12px',
          padding:
            '14px 16px',
          border:
            0,
          background:
            '#fff',
          textAlign:
            'left',
          cursor:
            'pointer',
        }}
      >
        <StatusIcon
          type={
            status
          }
        />

        <div
          style={{
            flex:
              1,
          }}
        >
          <span
            style={{
              color:
                '#8395a6',
              fontSize:
                '8px',
              fontWeight:
                800,
            }}
          >
            QUESTION{' '}
            {index +
              1}
          </span>

          <strong
            style={{
              display:
                'block',
              marginTop:
                '6px',
              color:
                '#163d61',
              fontSize:
                '11px',
              lineHeight:
                1.5,
            }}
          >
            {
              question.question
            }
          </strong>
        </div>

        <span
          style={{
            color:
              '#72899e',
            transform:
              expanded
                ? 'rotate(180deg)'
                : 'rotate(0)',
          }}
        >
          ⌄
        </span>
      </button>

      {expanded && (
        <div
          style={{
            padding:
              '0 16px 17px',
            borderTop:
              '1px solid #edf2f6',
          }}
        >
          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                isAttempted
                  ? 'repeat(2,1fr)'
                  : '1fr',
              gap:
                '9px',
              marginTop:
                '14px',
            }}
          >
            <AnswerChip
              label="YOUR ANSWER"
              value={
                selectedText
              }
              type={
                status ===
                'correct'
                  ? 'correct'
                  : status ===
                      'wrong'
                    ? 'wrong'
                    : 'neutral'
              }
            />

            {isAttempted && (
              <AnswerChip
                label="CORRECT ANSWER"
                value={
                  correctText
                }
                type="correct"
              />
            )}
          </div>

          {isAttempted && (
            <div
              style={{
                marginTop:
                  '9px',
                padding:
                  '13px',
                borderRadius:
                  '11px',
                background:
                  status ===
                  'correct'
                    ? '#f0fbf6'
                    : '#fff6f6',
                border:
                  status ===
                  'correct'
                    ? '1px solid #d8eee3'
                    : '1px solid #efdada',
              }}
            >
              <strong
                style={{
                  display:
                    'block',
                  color:
                    status ===
                    'correct'
                      ? '#147252'
                      : '#a94343',
                  fontSize:
                    '10px',
                  marginBottom:
                    '5px',
                }}
              >
                {status ===
                'correct'
                  ? '✓ Why your answer is correct'
                  : '✕ Why your answer is wrong'}
              </strong>

              <p
                style={{
                  margin:
                    0,
                  color:
                    '#5d7389',
                  fontSize:
                    '11px',
                  lineHeight:
                    1.6,
                }}
              >
                {
                  question
                    .optionExplanations[
                    selected
                  ]
                }
              </p>
            </div>
          )}

          <div
            style={{
              marginTop:
                '9px',
              padding:
                '13px',
              borderRadius:
                '11px',
              background:
                '#f7faff',
              border:
                '1px solid #e0e9f1',
            }}
          >
            <strong
              style={{
                display:
                  'block',
                color:
                  '#1d4f83',
                fontSize:
                  '10px',
                marginBottom:
                  '5px',
              }}
            >
              📘 Correct Answer Explanation
            </strong>

            <p
              style={{
                margin:
                  0,
                color:
                  '#5d7389',
                fontSize:
                  '11px',
                lineHeight:
                  1.6,
              }}
            >
              {
                question.explanation
              }
            </p>
          </div>
        </div>
      )}
    </div>
  )
}