import UpdateChecker from './UpdateChecker'
import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import './App.css'

import Landing from './pages/Landing'
import Auth from './pages/Auth'
import StudyPlanner from './pages/StudyPlanner'
import ProgressAnalytics from './pages/ProgressAnalytics'
import ExamReadiness from './pages/ExamReadiness'
import Notifications from './pages/Notifications'
import AIDoubtSolver from './pages/AIDoubtSolver'
import MockTest from './pages/MockTest'

import { auth } from './firebase'

import {
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'

import {
  getUserProfile,
  updateUserProfile,
  getSubjectProgress,
  saveSubjectProgress,
} from './userData'

import {
  getSubjectsForLevel,
} from './data/syllabus'

import {
  getChapterMaterial,
} from './data/materials'

const MENU_ITEMS = [
  {
    id: 'dashboard',
    icon: '\u2302',
    label: 'Dashboard',
  },
  {
    id: 'ai',
    icon: '\u2726',
    label: 'AI Doubt Solver',
    badge: 'AI',
  },
  {
    id: 'subjects',
    icon: '\u25A3',
    label: 'My Subjects',
  },
  {
    id: 'planner',
    icon: '\u25F7',
    label: 'Study Planner',
  },
  {
    id: 'revision',
    icon: '\u21BB',
    label: 'Revision',
  },
  {
    id: 'practice',
    icon: '\u2713',
    label: 'Practice & MCQs',
  },
  {
    id: 'mock',
    icon: '\u25C6',
    label: 'Mock Tests',
  },
  {
    id: 'progress',
    icon: '\u25D2',
    label: 'Progress',
  },
  {
    id: 'readiness',
    icon: '\u25CE',
    label: 'Exam Readiness',
  },
]

const MCQ_BANK = {
  'Introduction to Accounting Standards': [
    {
      question:
        'What is the primary purpose of accounting standards?',
      options: [
        'To increase the number of journal entries',
        'To bring uniformity and comparability in financial reporting',
        'To eliminate all business risks',
        'To reduce the number of financial statements',
      ],
      answer: 1,
      difficulty: 'easy',
      explanation:
        'Accounting standards provide a consistent framework for financial reporting and improve comparability and reliability.',
    },
    {
      question:
        'Accounting standards mainly improve the ______ of financial statements.',
      options: [
        'Length',
        'Uniformity',
        'Colour',
        'Printing quality',
      ],
      answer: 1,
      difficulty: 'easy',
      explanation:
        'Uniform application of accounting principles improves consistency in financial reporting.',
    },
    {
      question:
        'Which of the following is a major benefit of applying accounting standards consistently?',
      options: [
        'Better comparability',
        'Guaranteed profits',
        'Lower employee costs',
        'Elimination of taxation',
      ],
      answer: 0,
      difficulty: 'medium',
      explanation:
        'Consistent accounting treatment allows users to compare financial information meaningfully.',
    },
    {
      question:
        'Accounting standards are primarily intended to guide the preparation of:',
      options: [
        'Marketing brochures',
        'Financial statements',
        'Employee attendance sheets',
        'Sales advertisements',
      ],
      answer: 1,
      difficulty: 'medium',
      explanation:
        'Accounting standards establish principles relevant to financial reporting.',
    },
    {
      question:
        'Which quality is strengthened when similar transactions are accounted for consistently?',
      options: [
        'Comparability',
        'Advertising',
        'Inventory quantity',
        'Cash denomination',
      ],
      answer: 0,
      difficulty: 'medium',
      explanation:
        'Consistent accounting treatment improves comparability across periods and entities.',
    },
    {
      question:
        'Why is consistency important in the application of accounting principles?',
      options: [
        'It prevents the use of all estimates',
        'It supports meaningful comparison between reporting periods',
        'It guarantees a positive cash flow',
        'It removes the need for professional judgement',
      ],
      answer: 1,
      difficulty: 'difficult',
      explanation:
        'Consistency allows users to interpret changes in financial information across reporting periods more meaningfully.',
    },
    {
      question:
        'Which statement best describes the role of accounting standards in financial reporting?',
      options: [
        'They prescribe a common reporting framework while allowing appropriate professional judgement where applicable',
        'They guarantee that every entity reports the same profit',
        'They eliminate all accounting estimates',
        'They replace the need for financial statement users',
      ],
      answer: 0,
      difficulty: 'difficult',
      explanation:
        'Accounting standards provide a common framework while professional judgement may still be required.',
    },
    {
      question:
        'Financial reporting standards are primarily useful to:',
      options: [
        'Users of financial information',
        'Only graphic designers',
        'Only office administrators',
        'Only advertisers',
      ],
      answer: 0,
      difficulty: 'easy',
      explanation:
        'Investors, lenders, management and other users rely on financial information for decisions.',
    },
    {
      question:
        'Which of the following would most directly improve comparability?',
      options: [
        'Different accounting treatment every year',
        'Consistent accounting treatment of similar transactions',
        'Avoiding financial statements',
        'Changing reporting formats randomly',
      ],
      answer: 1,
      difficulty: 'medium',
      explanation:
        'Consistency in accounting treatment makes financial information more comparable.',
    },
    {
      question:
        'The broader objective of accounting standardisation is to improve the usefulness of financial information for:',
      options: [
        'Economic decision-making',
        'Office decoration',
        'Employee recreation',
        'Advertising design',
      ],
      answer: 0,
      difficulty: 'difficult',
      explanation:
        'Standardised reporting improves the usefulness of information for economic decisions.',
    },
  ],
}

function getDifficultyLabel(
  value,
) {
  if (value === 'easy') {
    return 'Easy'
  }

  if (value === 'medium') {
    return 'Medium'
  }

  if (value === 'difficult') {
    return 'Difficult'
  }

  return 'Mix'
}

function getDisplayName(
  user,
  profile,
) {
  if (
    profile?.name?.trim()
  ) {
    return profile.name.trim()
  }

  if (
    user?.displayName?.trim()
  ) {
    return user.displayName.trim()
  }

  if (user?.email) {
    return user.email.split('@')[0]
  }

  return 'Student'
}

function getInitials(
  user,
  profile,
) {
  const name =
    profile?.name ||
    user?.displayName ||
    user?.email?.split('@')[0] ||
    'Student'

  const parts =
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)

  if (
    parts.length >= 2
  ) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return name.slice(0, 2).toUpperCase()
}

function getNotificationStorageKey(
  user,
) {
  return `prepcore_notifications_${
    user?.uid || 'guest'
  }`
}

function readUnreadNotificationCount(
  user,
) {
  try {
    const raw =
      localStorage.getItem(
        getNotificationStorageKey(
          user,
        ),
      )

    if (!raw) {
      return 0
    }

    const parsed =
      JSON.parse(raw)

    if (
      !Array.isArray(
        parsed,
      )
    ) {
      return 0
    }

    return parsed.filter(
      (item) =>
        !item.read,
    ).length
  } catch (
    error
  ) {
    return 0
  }
}

function getQuestions(
  chapter,
  difficulty,
) {
  const bank =
    MCQ_BANK[chapter] || []

  let filtered =
    difficulty === 'mix'
      ? bank
      : bank.filter(
          (
            item,
          ) =>
            item.difficulty ===
            difficulty,
        )

  if (
    filtered.length ===
    0
  ) {
    filtered =
      bank
  }

  if (
    filtered.length ===
    0
  ) {
    return Array.from(
      {
        length: 10,
      },
      (
        _,
        index,
      ) => ({
        id: `${chapter}-${index}`,
        question:
          `Which statement is most relevant to "${chapter}"?`,
        options: [
          'Application of accounting principles',
          'Office decoration',
          'Advertising design',
          'Employee recreation',
        ],
        answer: 0,
        difficulty:
          difficulty ===
          'mix'
            ? 'medium'
            : difficulty,
        explanation:
          `This is a temporary practice question for "${chapter}". Actual chapter-wise questions will come from the study material.`,
      }),
    )
  }

  return Array.from(
    {
      length: 10,
    },
    (
      _,
      index,
    ) => {
      const item =
        filtered[
          index %
            filtered.length
        ]

      return {
        ...item,
        id: `${chapter}-${index}`,
      }
    },
  )
}

function App() {
  const [
    authLoading,
    setAuthLoading,
  ] =
    useState(true)

  const [
    user,
    setUser,
  ] =
    useState(null)

  const [
    userProfile,
    setUserProfile,
  ] =
    useState(null)

  const [
    subjectProgress,
    setSubjectProgress,
  ] =
    useState({})

  const [
    publicPage,
    setPublicPage,
  ] =
    useState('landing')

  const [
    authMode,
    setAuthMode,
  ] =
    useState('login')

  const [
    activePage,
    setActivePage,
  ] =
    useState('dashboard')

  const [
    selectedSubjectId,
    setSelectedSubjectId,
  ] =
    useState(null)

  const [
    selectedChapter,
    setSelectedChapter,
  ] =
    useState(null)

  const [
    selectedRevisionItem,
    setSelectedRevisionItem,
  ] =
    useState(null)

  const [
    practiceSubjectId,
    setPracticeSubjectId,
  ] =
    useState(null)

  const [
    practiceChapter,
    setPracticeChapter,
  ] =
    useState(null)

  const [
    quizConfig,
    setQuizConfig,
  ] =
    useState(null)

  const [
    mobileMenu,
    setMobileMenu,
  ] =
    useState(false)

  const [
    notificationsOpen,
    setNotificationsOpen,
  ] =
    useState(false)

  const [
    profileOpen,
    setProfileOpen,
  ] =
    useState(false)

  const [
    unreadNotifications,
    setUnreadNotifications,
  ] =
    useState(0)

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          currentUser,
        ) => {
          setUser(
            currentUser,
          )

          if (
            !currentUser
          ) {
            setUserProfile(
              null,
            )

            setSubjectProgress(
              {},
            )

            setSelectedSubjectId(
              null,
            )

            setSelectedChapter(
              null,
            )

            setSelectedRevisionItem(
              null,
            )

            setPracticeSubjectId(
              null,
            )

            setPracticeChapter(
              null,
            )

            setQuizConfig(
              null,
            )

            setUnreadNotifications(
              0,
            )

            setPublicPage(
              'landing',
            )

            setAuthMode(
              'login',
            )

            setAuthLoading(
              false,
            )

            return
          }

          try {
            const profile =
              await getUserProfile(
                currentUser.uid,
              )

            const progress =
              await getSubjectProgress(
                currentUser.uid,
              )

            setUserProfile(
              profile,
            )

            setSubjectProgress(
              progress ||
                {},
            )

            setUnreadNotifications(
              readUnreadNotificationCount(
                currentUser,
              ),
            )

            setPublicPage(
              'app',
            )
          } catch (
            error
          ) {
            console.error(
              'ACCOUNT LOAD ERROR:',
              error,
            )

            setPublicPage(
              'app',
            )
          } finally {
            setAuthLoading(
              false,
            )
          }
        },
        (
          error,
        ) => {
          console.error(
            'AUTH STATE ERROR:',
            error,
          )

          setUser(
            null,
          )

          setUserProfile(
            null,
          )

          setSubjectProgress(
            {},
          )

          setUnreadNotifications(
            0,
          )

          setAuthLoading(
            false,
          )
        },
      )

    return unsubscribe
  }, [])

  useEffect(() => {
    if (!user) {
      setUnreadNotifications(
        0,
      )

      return
    }

    const refreshCount =
      () => {
        setUnreadNotifications(
          readUnreadNotificationCount(
            user,
          ),
        )
      }

    refreshCount()

    const interval =
      setInterval(
        refreshCount,
        1000,
      )

    return () =>
      clearInterval(
        interval,
      )
  }, [user])

  const currentLevel =
    userProfile?.level ||
    'CA Foundation'

  const currentAttempt =
    userProfile?.attempt ||
    'January 2027'

  const subjects =
    useMemo(
      () => {
        const source =
          getSubjectsForLevel(
            currentLevel,
          )

        return source.map(
          (
            subject,
          ) => {
            const saved =
              subjectProgress[
                subject.id
              ]

            let completed =
              []

            if (
              Array.isArray(
                saved?.completedChapters,
              )
            ) {
              completed =
                saved.completedChapters
            } else if (
              saved?.completedChapters &&
              typeof saved.completedChapters ===
                'object'
            ) {
              completed =
                Object.keys(
                  saved.completedChapters,
                ).filter(
                  (
                    chapter,
                  ) =>
                    saved
                      .completedChapters[
                      chapter
                    ] === true,
                )
            }

            completed =
              completed.filter(
                (
                  chapter,
                ) =>
                  subject.chapters.includes(
                    chapter,
                  ),
              )

            const total =
              subject.chapters.length

            const count =
              completed.length

            const percentage =
              total ===
              0
                ? 0
                : Math.round(
                    (count /
                      total) *
                      100,
                  )

            return {
              ...subject,

              level:
                currentLevel,

              chapterList:
                subject.chapters,

              completedChapters:
                completed,

              progressCount:
                count,

              progress:
                percentage,

              chapters:
                `${count} / ${total} chapters`,
            }
          },
        )
      },
      [
        currentLevel,
        subjectProgress,
      ],
    )

  const selectedSubject =
    subjects.find(
      (
        subject,
      ) =>
        subject.id ===
        selectedSubjectId,
    )

  const revisionItems =
    useMemo(
      () => {
        const items =
          []

        subjects.forEach(
          (
            subject,
          ) => {
            subject.completedChapters.forEach(
              (
                chapter,
              ) => {
                items.push({
                  id:
                    `${subject.id}-${chapter}`,

                  subjectId:
                    subject.id,

                  subject:
                    subject.name,

                  short:
                    subject.short,

                  color:
                    subject.color,

                  topic:
                    chapter,

                  due:
                    'Today',
                })
              },
            )
          },
        )

        return items
      },
      [subjects],
    )

  const totalChapters =
    subjects.reduce(
      (
        sum,
        subject,
      ) =>
        sum +
        subject.chapterList.length,
      0,
    )

  const completedChapters =
    subjects.reduce(
      (
        sum,
        subject,
      ) =>
        sum +
        subject.progressCount,
      0,
    )

  const overallProgress =
    totalChapters ===
    0
      ? 0
      : Math.round(
          (completedChapters /
            totalChapters) *
            100,
        )

  const handleAuthSuccess =
    async () => {
      const currentUser =
        auth.currentUser

      if (
        currentUser
      ) {
        try {
          const profile =
            await getUserProfile(
              currentUser.uid,
            )

          const progress =
            await getSubjectProgress(
              currentUser.uid,
            )

          setUser(
            currentUser,
          )

          setUserProfile(
            profile,
          )

          setSubjectProgress(
            progress ||
              {},
          )

          setUnreadNotifications(
            readUnreadNotificationCount(
              currentUser,
            ),
          )
        } catch (
          error
        ) {
          console.error(
            'AUTH LOAD ERROR:',
            error,
          )
        }
      }

      setPublicPage(
        'app',
      )

      setActivePage(
        'dashboard',
      )
    }

  const handleChapterToggle =
    async (
      subjectId,
      chapter,
    ) => {
      if (
        !user?.uid
      ) {
        return
      }

      const current =
        subjectProgress[
          subjectId
        ]

      const currentCompleted =
        Array.isArray(
          current?.completedChapters,
        )
          ? [
              ...current.completedChapters,
            ]
          : []

      const exists =
        currentCompleted.includes(
          chapter,
        )

      const next =
        exists
          ? currentCompleted.filter(
              (
                item,
              ) =>
                item !==
                chapter,
            )
          : [
              ...currentCompleted,
              chapter,
            ]

      const unique =
        [
          ...new Set(
            next,
          ),
        ]

      setSubjectProgress(
        (
          previous,
        ) => ({
          ...previous,

          [subjectId]:
            {
              completedChapters:
                unique,

              completedCount:
                unique.length,

              updatedAt:
                new Date().toISOString(),
            },
        }),
      )

      try {
        const saved =
          await saveSubjectProgress(
            user.uid,
            subjectId,
            unique,
          )

        if (
          saved?.completedChapters
        ) {
          setSubjectProgress(
            (
              previous,
            ) => ({
              ...previous,

              [subjectId]:
                {
                  ...previous[
                    subjectId
                  ],

                  ...saved,
                },
            }),
          )
        }
      } catch (
        error
      ) {
        console.error(
          'PROGRESS SAVE ERROR:',
          error,
        )
      }
    }

  const navigate =
    (page) => {
      setActivePage(
        page,
      )

      setSelectedSubjectId(
        null,
      )

      setSelectedChapter(
        null,
      )

      setSelectedRevisionItem(
        null,
      )

      setPracticeSubjectId(
        null,
      )

      setPracticeChapter(
        null,
      )

      setQuizConfig(
        null,
      )

      setMobileMenu(
        false,
      )

      setNotificationsOpen(
        false,
      )

      setProfileOpen(
        false,
      )

      setUnreadNotifications(
        readUnreadNotificationCount(
          user,
        ),
      )
    }

  const openSubject =
    (subjectId) => {
      setSelectedSubjectId(
        subjectId,
      )

      setSelectedChapter(
        null,
      )

      setActivePage(
        'subjects',
      )

      setMobileMenu(
        false,
      )
    }

  const openChapter =
    (
      subjectId,
      chapter,
    ) => {
      setSelectedSubjectId(
        subjectId,
      )

      setSelectedChapter(
        chapter,
      )

      setActivePage(
        'subjects',
      )

      setMobileMenu(
        false,
      )
    }

  const openRevision =
    (item) => {
      setSelectedRevisionItem(
        item,
      )

      setActivePage(
        'revision',
      )

      setMobileMenu(
        false,
      )
    }

  const openPracticeSubject =
    (subjectId) => {
      setPracticeSubjectId(
        subjectId,
      )

      setPracticeChapter(
        null,
      )

      setQuizConfig(
        null,
      )

      setActivePage(
        'practice',
      )
    }

  const openPracticeChapter =
    (chapter) => {
      setPracticeChapter(
        chapter,
      )

      setQuizConfig(
        null,
      )
    }

  const startQuiz =
    (
      subject,
      chapter,
      difficulty,
    ) => {
      setQuizConfig({
        subjectId:
          subject.id,

        subjectName:
          subject.name,

        short:
          subject.short,

        color:
          subject.color,

        chapter,

        difficulty,
      })
    }

  const exitQuiz =
    () => {
      setQuizConfig(
        null,
      )

      setPracticeChapter(
        null,
      )
    }

  const handleProfileUpdate =
    async (
      updatedData,
    ) => {
      if (
        !user?.uid
      ) {
        return
      }

      const safeData =
        {
          name:
            updatedData.name?.trim() ||
            getDisplayName(
              user,
              userProfile,
            ),

          level:
            updatedData.level ||
            currentLevel,

          attempt:
            updatedData.attempt ||
            currentAttempt,
        }

      try {
        const updated =
          await updateUserProfile(
            user.uid,
            safeData,
          )

        setUserProfile(
          updated,
        )

        return updated
      } catch (
        error
      ) {
        console.error(
          'PROFILE UPDATE ERROR:',
          error,
        )

        throw error
      }
    }

  const handleLogout =
    async () => {
      try {
        await signOut(
          auth,
        )

        setUser(
          null,
        )

        setUserProfile(
          null,
        )

        setSubjectProgress(
          {},
        )

        setSelectedSubjectId(
          null,
        )

        setSelectedChapter(
          null,
        )

        setSelectedRevisionItem(
          null,
        )

        setPracticeSubjectId(
          null,
        )

        setPracticeChapter(
          null,
        )

        setQuizConfig(
          null,
        )

        setUnreadNotifications(
          0,
        )

        setPublicPage(
          'landing',
        )

        setActivePage(
          'dashboard',
        )
      } catch (
        error
      ) {
        console.error(
          'LOGOUT ERROR:',
          error,
        )
      }
    }

  if (
    authLoading
  ) {
    return (
      <div
        style={{
          minHeight:
            '100vh',
          display:
            'grid',
          placeItems:
            'center',
          background:
            '#f6f9fc',
          color:
            '#17375f',
          fontFamily:
            'Inter, system-ui, sans-serif',
          fontWeight:
            700,
        }}
      >
        Loading PrepCore.AI...
      </div>
    )
  }

  if (
    !user &&
    publicPage ===
      'landing'
  ) {
    return (
      <Landing
        onGetStarted={() => {
          setAuthMode(
            'signup',
          )

          setPublicPage(
            'auth',
          )
        }}
        onLogin={() => {
          setAuthMode(
            'login',
          )

          setPublicPage(
            'auth',
          )
        }}
      />
    )
  }

  if (
    !user &&
    publicPage ===
      'auth'
  ) {
    return (
      <Auth
        initialMode={
          authMode
        }
        onSuccess={
          handleAuthSuccess
        }
        onBack={() =>
          setPublicPage(
            'landing',
          )
        }
      />
    )
  }

  return (
    <div className="app-shell">
      <UpdateChecker />
      <Sidebar
        activePage={
          activePage
        }
        currentLevel={
          currentLevel
        }
        user={
          user
        }
        userProfile={
          userProfile
        }
        mobileMenu={
          mobileMenu
        }
        setMobileMenu={
          setMobileMenu
        }
        navigate={
          navigate
        }
        unreadNotifications={
          unreadNotifications
        }
      />

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileMenu(
                  true,
                )
              }
            >
              ☰
            </button>

            <div>
              <span className="breadcrumb">
                CA PREPCORE.AI
              </span>

              <h1>
                {quizConfig
                  ? 'MCQ Practice'
                  : activePage ===
                        'subjects' &&
                      selectedChapter
                    ? 'Chapter Study Hub'
                    : activePage ===
                        'progress'
                      ? 'Progress Analytics'
                      : activePage ===
                          'readiness'
                        ? 'Exam Readiness'
                        : MENU_ITEMS.find(
                            (
                              item,
                            ) =>
                              item.id ===
                              activePage,
                          )?.label ||
                          'Dashboard'}
              </h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button"
              onClick={() => {
                setNotificationsOpen(
                  !notificationsOpen,
                )

                setProfileOpen(
                  false,
                )

                setUnreadNotifications(
                  readUnreadNotificationCount(
                    user,
                  ),
                )
              }}
              title="Notifications"
            >
              ♢

              {unreadNotifications >
                0 && (
                <span
                  style={{
                    position:
                      'absolute',
                    top:
                      '3px',
                    right:
                      '3px',
                    minWidth:
                      '16px',
                    height:
                      '16px',
                    padding:
                      '0 4px',
                    borderRadius:
                      '999px',
                    display:
                      'grid',
                    placeItems:
                      'center',
                    background:
                      '#d94d4d',
                    color:
                      '#fff',
                    fontSize:
                      '8px',
                    fontWeight:
                      900,
                  }}
                >
                  {unreadNotifications >
                  9
                    ? '9+'
                    : unreadNotifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className="floating-panel"
                style={{
                  right:
                    '78px',
                  width:
                    '285px',
                  padding:
                    '0',
                  overflow:
                    'hidden',
                }}
              >
                <div
                  style={{
                    padding:
                      '15px 16px',
                    borderBottom:
                      '1px solid #edf2f6',
                  }}
                >
                  <strong
                    style={{
                      color:
                        '#153c62',
                      fontSize:
                        '13px',
                    }}
                  >
                    Notifications
                  </strong>

                  <span
                    style={{
                      display:
                        'block',
                      marginTop:
                        '3px',
                      color:
                        '#8195aa',
                      fontSize:
                        '9px',
                    }}
                  >
                    {unreadNotifications >
                    0
                      ? `${unreadNotifications} unread`
                      : 'All caught up'}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setNotificationsOpen(
                      false,
                    )

                    navigate(
                      'notifications',
                    )
                  }}
                  style={{
                    width:
                      '100%',
                    padding:
                      '13px 16px',
                    border:
                      0,
                    background:
                      '#fff',
                    textAlign:
                      'left',
                    color:
                      '#1d4f83',
                    fontSize:
                      '11px',
                    fontWeight:
                      800,
                    cursor:
                      'pointer',
                  }}
                >
                  View all notifications →
                </button>
              </div>
            )}

            <button
              className="profile-button"
              onClick={() => {
                setProfileOpen(
                  !profileOpen,
                )

                setNotificationsOpen(
                  false,
                )
              }}
            >
              <span className="avatar small">
                {getInitials(
                  user,
                  userProfile,
                )}
              </span>

              <span className="profile-name">
                {getDisplayName(
                  user,
                  userProfile,
                )}
              </span>

              <span className="chevron">
                ⌄
              </span>
            </button>

            {profileOpen && (
              <div className="floating-panel profile-panel">
                <button
                  onClick={() =>
                    navigate(
                      'profile',
                    )
                  }
                >
                  My Profile
                </button>

                <button
                  onClick={() =>
                    navigate(
                      'settings',
                    )
                  }
                >
                  Settings
                </button>

                <button
                  onClick={
                    handleLogout
                  }
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="content">
          {/* DASHBOARD */}

          {activePage ===
            'dashboard' && (
            <DashboardPage
              user={
                user
              }
              userProfile={
                userProfile
              }
              currentLevel={
                currentLevel
              }
              subjects={
                subjects
              }
              totalChapters={
                totalChapters
              }
              completedChapters={
                completedChapters
              }
              overallProgress={
                overallProgress
              }
              revisionCount={
                revisionItems.length
              }
              onNavigate={
                navigate
              }
              onSubject={
                openSubject
              }
            />
          )}

          {/* AI */}

          {activePage ===
            'ai' && (
            <AIDoubtSolver
              subjects={
                subjects
              }
            />
          )}

          {/* SUBJECTS */}

          {activePage ===
            'subjects' && (
            <SubjectsPage
              subjects={
                subjects
              }
              selectedSubject={
                selectedSubject
              }
              selectedChapter={
                selectedChapter
              }
              subjectProgress={
                subjectProgress
              }
              onSubject={
                openSubject
              }
              onChapter={
                openChapter
              }
              onToggleComplete={
                handleChapterToggle
              }
              onBackSubject={() =>
                setSelectedChapter(
                  null,
                )
              }
              onBackSubjects={() => {
                setSelectedSubjectId(
                  null,
                )

                setSelectedChapter(
                  null,
                )
              }}
            />
          )}

          {/* REVISION */}

          {activePage ===
            'revision' && (
            selectedRevisionItem ? (
              <RevisionTopicPage
                item={
                  selectedRevisionItem
                }
                onBack={() =>
                  setSelectedRevisionItem(
                    null,
                  )
                }
              />
            ) : (
              <RevisionPage
                items={
                  revisionItems
                }
                onOpen={
                  openRevision
                }
              />
            )
          )}

          {/* PRACTICE */}

          {activePage ===
            'practice' && (
            <PracticePage
              subjects={
                subjects
              }
              subjectId={
                practiceSubjectId
              }
              chapter={
                practiceChapter
              }
              quizConfig={
                quizConfig
              }
              onSubject={
                openPracticeSubject
              }
              onChapter={
                openPracticeChapter
              }
              onStart={
                startQuiz
              }
              onBackSubjects={() => {
                setPracticeSubjectId(
                  null,
                )

                setPracticeChapter(
                  null,
                )
              }}
              onBackChapters={() =>
                setPracticeChapter(
                  null,
                )
              }
              onExitQuiz={
                exitQuiz
              }
            />
          )}

          {/* MOCK TEST */}

          {activePage ===
            'mock' && (
            <MockTest
              subjects={
                subjects
              }
              currentLevel={
                currentLevel
              }
            />
          )}

          {/* PROGRESS */}

          {activePage ===
            'progress' && (
            <ProgressAnalytics
              user={
                user
              }
              subjects={
                subjects
              }
            />
          )}

          {/* READINESS */}

          {activePage ===
            'readiness' && (
            <ExamReadiness
              user={
                user
              }
              subjects={
                subjects
              }
            />
          )}

          {/* PLANNER */}

          {activePage ===
            'planner' && (
            <StudyPlanner
              user={
                user
              }
              subjects={
                subjects
              }
            />
          )}

          {/* NOTIFICATIONS */}

          {activePage ===
            'notifications' && (
            <Notifications
              user={
                user
              }
              subjects={
                subjects
              }
            />
          )}

          {/* PROFILE */}

          {activePage ===
            'profile' && (
            <ProfilePage
              user={
                user
              }
              profile={
                userProfile
              }
              currentLevel={
                currentLevel
              }
              currentAttempt={
                currentAttempt
              }
              onSave={
                handleProfileUpdate
              }
            />
          )}

          {/* SETTINGS */}

          {activePage ===
            'settings' && (
            <SettingsPage
              user={
                user
              }
              profile={
                userProfile
              }
              currentLevel={
                currentLevel
              }
              currentAttempt={
                currentAttempt
              }
              onSave={
                handleProfileUpdate
              }
              onLogout={
                handleLogout
              }
            />
          )}
        </div>
      </main>
    </div>
  )
}

/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar({
  activePage,
  currentLevel,
  user,
  userProfile,
  mobileMenu,
  setMobileMenu,
  navigate,
  unreadNotifications,
}) {
  return (
    <>
      <aside
        className={`sidebar ${
          mobileMenu
            ? 'mobile-open'
            : ''
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            CA
          </div>

          <div className="brand-text">
            <strong>
              PrepCore
            </strong>

            <span>
              .AI
            </span>
          </div>
        </div>

        <div className="student-mini-card">
          <div className="avatar">
            {getInitials(
              user,
              userProfile,
            )}
          </div>

          <div>
            <strong>
              {getDisplayName(
                user,
                userProfile,
              )}
            </strong>

            <span>
              {currentLevel}
            </span>
          </div>

          <button className="more-button">
            •••
          </button>
        </div>

        <div className="sidebar-label">
          MAIN MENU
        </div>

        <nav className="sidebar-nav">
          {MENU_ITEMS.map(
            (
              item,
            ) => (
              <button
                key={
                  item.id
                }
                className={`nav-item ${
                  activePage ===
                  item.id
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  navigate(
                    item.id,
                  )
                }
              >
                <span className="nav-icon">
                  {
                    item.icon
                  }
                </span>

                <span>
                  {
                    item.label
                  }
                </span>

                {item.badge && (
                  <small>
                    {
                      item.badge
                    }
                  </small>
                )}
              </button>
            ),
          )}
        </nav>

        <div className="sidebar-label tools-label">
          TOOLS
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${
              activePage ===
              'notifications'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate(
                'notifications',
              )
            }
          >
            <span className="nav-icon">
              ♢
            </span>

            <span>
              Notifications
            </span>

            {unreadNotifications >
              0 && (
              <small
                style={{
                  marginLeft:
                    'auto',
                  minWidth:
                    '17px',
                  height:
                    '17px',
                  padding:
                    '0 4px',
                  display:
                    'grid',
                  placeItems:
                    'center',
                  borderRadius:
                    '999px',
                  background:
                    '#d94d4d',
                  color:
                    '#fff',
                  fontSize:
                    '8px',
                  fontWeight:
                    900,
                }}
              >
                {unreadNotifications >
                9
                  ? '9+'
                  : unreadNotifications}
              </small>
            )}
          </button>

          <button
            className={`nav-item ${
              activePage ===
              'profile'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate(
                'profile',
              )
            }
          >
            <span className="nav-icon">
              ◯
            </span>

            <span>
              Profile
            </span>
          </button>

          <button
            className={`nav-item ${
              activePage ===
              'settings'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              navigate(
                'settings',
              )
            }
          >
            <span className="nav-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon">
              ✦
            </div>

            <strong>
              PrepCore Plus
            </strong>

            <p>
              Unlock advanced AI features.
            </p>

            <button>
              Explore Plus →
            </button>
          </div>

          <div className="sidebar-footer">
            <span>
              CA PrepCore.AI
            </span>

            <span>
              v1.0
            </span>
          </div>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="mobile-overlay"
          onClick={() =>
            setMobileMenu(
              false,
            )
          }
          aria-label="Close menu"
        />
      )}
    </>
  )
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardPage({
  user,
  userProfile,
  currentLevel,
  subjects,
  totalChapters,
  completedChapters,
  overallProgress,
  revisionCount,
  onNavigate,
  onSubject,
}) {
  return (
    <div className="page">
      <div className="welcome-row">
        <div>
          <p className="eyebrow">
            YOUR CA PREPARATION
          </p>

          <h2>
            Good afternoon,{' '}
            {getDisplayName(
              user,
              userProfile,
            )}{' '}
            👋
          </h2>

          <p className="subheading">
            {currentLevel} · Your progress is saved automatically.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            onNavigate(
              'subjects',
            )
          }
        >
          Continue Studying →
        </button>
      </div>

      <div className="stats-grid">
        <StatBox
          icon="▣"
          label="Subjects"
          value={
            subjects.length
          }
          detail={
            `${currentLevel} syllabus`
          }
        />

        <StatBox
          icon="✓"
          label="Completed Chapters"
          value={
            completedChapters
          }
          detail={
            `of ${totalChapters}`
          }
        />

        <StatBox
          icon="◒"
          label="Overall Progress"
          value={`${overallProgress}%`}
          detail="Live progress"
        />

        <StatBox
          icon="↻"
          label="Revision Topics"
          value={
            revisionCount
          }
          detail="Ready to revise"
        />
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">
            YOUR SUBJECTS
          </p>

          <h3>
            Continue Learning
          </h3>
        </div>

        <button
          className="text-button"
          onClick={() =>
            onNavigate(
              'subjects',
            )
          }
        >
          View all →
        </button>
      </div>

      <div className="subject-grid">
        {subjects.map(
          (
            subject,
          ) => (
            <SubjectCard
              key={
                subject.id
              }
              subject={
                subject
              }
              onClick={() =>
                onSubject(
                  subject.id,
                )
              }
            />
          ),
        )}
      </div>
    </div>
  )
}

function StatBox({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        {
          icon
        }
      </div>

      <p>
        {label}
      </p>

      <strong>
        {value}
      </strong>

      <span className="stat-detail">
        {detail}
      </span>
    </div>
  )
}

function SubjectCard({
  subject,
  onClick,
}) {
  return (
    <div
      className="subject-card"
      onClick={
        onClick
      }
      style={{
        cursor:
          'pointer',
      }}
    >
      <div className="subject-card-top">
        <div
          className={`subject-symbol ${subject.color}`}
        >
          {
            subject.short
          }
        </div>

        <span
          style={{
            color:
              '#9aabba',
          }}
        >
          •••
        </span>
      </div>

      <h4>
        {
          subject.name
        }
      </h4>

      <p>
        {
          subject.chapters
        }
      </p>

      <div className="subject-progress-row">
        <span>
          Progress
        </span>

        <strong>
          {
            subject.progress
          }%
        </strong>
      </div>

      <div className="subject-progress">
        <div
          className={
            subject.color
          }
          style={{
            width:
              `${subject.progress}%`,
          }}
        />
      </div>

      <button
        className="continue-button"
        onClick={(
          event,
        ) => {
          event.stopPropagation()

          onClick()
        }}
      >
        Continue →
      </button>
    </div>
  )
}

/* =========================================================
   SUBJECTS
========================================================= */

function SubjectsPage({
  subjects,
  selectedSubject,
  selectedChapter,
  subjectProgress,
  onSubject,
  onChapter,
  onToggleComplete,
  onBackSubject,
  onBackSubjects,
}) {
  if (
    selectedSubject &&
    selectedChapter
  ) {
    return (
      <ChapterStudyHub
        subject={
          selectedSubject
        }
        chapter={
          selectedChapter
        }
        progress={
          subjectProgress[
            selectedSubject.id
          ]
        }
        onBack={
          onBackSubject
        }
        onToggleComplete={
          onToggleComplete
        }
      />
    )
  }

  if (
    selectedSubject
  ) {
    return (
      <ChapterSelection
        subject={
          selectedSubject
        }
        progress={
          subjectProgress[
            selectedSubject.id
          ]
        }
        onChapter={(
          chapter,
        ) =>
          onChapter(
            selectedSubject.id,
            chapter,
          )
        }
        onBack={
          onBackSubjects
        }
      />
    )
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            CURRENT COURSE
          </p>

          <h2>
            My Subjects
          </h2>

          <p>
            Your current syllabus and chapter tracker.
          </p>
        </div>
      </div>

      <div className="large-subject-grid">
        {subjects.map(
          (
            subject,
          ) => (
            <SubjectCard
              key={
                subject.id
              }
              subject={
                subject
              }
              onClick={() =>
                onSubject(
                  subject.id,
                )
              }
            />
          ),
        )}
      </div>
    </div>
  )
}

function ChapterSelection({
  subject,
  progress,
  onChapter,
  onBack,
}) {
  const completed =
    Array.isArray(
      progress?.completedChapters,
    )
      ? progress.completedChapters
      : []  
  const normalizeSubject = (value) =>
    String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '')

  const normalizedId = normalizeSubject(subject?.id)
  const normalizedName = normalizeSubject(subject?.name)

  const isAdvancedAccounting =
    normalizedId === 'advancedaccounting' ||
    normalizedId === 'interadvancedaccounting' ||
    normalizedName === 'advancedaccounting'

  const isFoundationAccounting =
    normalizedId === 'foundationaccounting' ||
    normalizedName === 'accounting'

  const modules = isFoundationAccounting
    ? [
        {
          id: 'module-1',
          label: 'MODULE 1',
          title: 'Theoretical Framework, Accounting Process & Final Accounts',
          chapters: subject.chapterList.slice(0, 7),
        },
        {
          id: 'module-2',
          label: 'MODULE 2',
          title: 'Other Accounts & Company Accounts',
          chapters: subject.chapterList.slice(7, 11),
        },
      ].filter(
        (module) => module.chapters.length > 0,
      )
    : isAdvancedAccounting
      ? [
          {
            id: 'module-1',
            label: 'MODULE 1',
            title: 'Accounting Standards',
            chapters: subject.chapterList.slice(0, 4),
          },
          {
            id: 'module-2',
            label: 'MODULE 2',
            title: 'Assets, Liabilities & Other Standards',
            chapters: subject.chapterList.slice(4, 10),
          },
          {
            id: 'module-3',
            label: 'MODULE 3',
            title: 'Company Accounts & Other Topics',
            chapters: subject.chapterList.slice(10, 15),
          },
        ].filter(
          (module) => module.chapters.length > 0,
        )
      : []

  const renderChapter =
    (
      chapter,
      chapterNumber,
    ) => {
      const done =
        completed.includes(
          chapter,
        )

      return (
        <button
          key={
            chapter
          }
          type="button"
          onClick={() =>
            onChapter(
              chapter,
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
              '16px',
            padding:
              '16px 18px',
            background:
              '#fff',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '14px',
            textAlign:
              'left',
            cursor:
              'pointer',
          }}
        >
          <span
            style={{
              width:
                '42px',
              height:
                '42px',
              borderRadius:
                '12px',
              display:
                'grid',
              placeItems:
                'center',
              background:
                '#edf4fb',
              color:
                '#1d4f83',
              fontWeight:
                800,
              flexShrink:
                0,
            }}
          >
            {String(
              chapterNumber,
            ).padStart(
              2,
              '0',
            )}
          </span>

          <span
            style={{
              flex:
                1,
              minWidth:
                0,
            }}
          >
            <strong
              style={{
                display:
                  'block',
                color:
                  '#09294f',
                fontSize:
                  '14px',
                lineHeight:
                  '1.35',
              }}
            >
              {
                chapter
              }
            </strong>

            <small
              style={{
                display:
                  'block',
                marginTop:
                  '4px',
                color:
                  '#7890aa',
              }}
            >
              {done
                ? 'Completed · Open study hub'
                : 'Open chapter study hub'}
            </small>
          </span>

          <span
            style={{
              color:
                '#1d4f83',
              fontSize:
                '18px',
              fontWeight:
                800,
              flexShrink:
                0,
            }}
          >
            →
          </span>
        </button>
      )
    }

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
            '20px',
          flexWrap:
            'wrap',
          marginBottom:
            '26px',
        }}
      >
        <div>
          <p className="eyebrow">
            SELECT CHAPTER
          </p>

          <h2
            style={{
              marginTop:
                '8px',
            }}
          >
            {
              subject.name
            }
          </h2>

          <p
            style={{
              color:
                '#7188a0',
              fontSize:
                '13px',
            }}
          >
            {
              subject.chapterList.length
            }{' '}
            chapters
          </p>
        </div>

        <button
          className="filter-button"
          onClick={
            onBack
          }
        >
          ← Back to Subjects
        </button>
      </div>

      {isFoundationAccounting || isAdvancedAccounting ? (
        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap:
              '24px',
          }}
        >
          {modules.map(
            (
              module,
              moduleIndex,
            ) => {
              const startNumber =
                modules
                  .slice(
                    0,
                    moduleIndex,
                  )
                  .reduce(
                    (
                      total,
                      item,
                    ) =>
                      total +
                      item
                        .chapters
                        .length,
                    0,
                  ) + 1

              return (
                <section
                  key={
                    module.id
                  }
                  style={{
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    gap:
                      '10px',
                  }}
                >
                  <div
                    style={{
                      padding:
                        '14px 16px',
                      border:
                        '1px solid #dbe7f1',
                      borderRadius:
                        '14px',
                      background:
                        '#edf5fb',
                    }}
                  >
                    <span
                      style={{
                        display:
                          'block',
                        fontSize:
                          '8px',
                        fontWeight:
                          800,
                        letterSpacing:
                          '1.1px',
                        color:
                          '#7188a0',
                      }}
                    >
                      {
                        module.label
                      }
                    </span>

                    <strong
                      style={{
                        display:
                          'block',
                        marginTop:
                          '4px',
                        color:
                          '#0d3b69',
                        fontSize:
                          '13px',
                      }}
                    >
                      {module.title}
                    </strong>
                  </div>

                  {module.chapters.map(
                    (
                      chapter,
                      index,
                    ) =>
                      renderChapter(
                        chapter,
                        startNumber +
                          index,
                      ),
                  )}
                </section>
              )
            },
          )}
        </div>
      ) : (
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
          {subject.chapterList.map(
            (
              chapter,
              index,
            ) =>
              renderChapter(
                chapter,
                index +
                  1,
              ),
          )}
        </div>
      )}
    </div>
  )
}


const CHAPTER5_UNIT_PDFS = {
  'unit-1': '/materials/advanced-accounting/module-2/chapter-5/unit-1/as-2-valuation-of-inventory.pdf',
  'unit-2': '/materials/advanced-accounting/module-2/chapter-5/unit-2/as-10-property-plant-and-equipment.pdf',
  'unit-3': '/materials/advanced-accounting/module-2/chapter-5/unit-3/as-13-accounting-for-investments.pdf',
  'unit-4': '/materials/advanced-accounting/module-2/chapter-5/unit-4/as-16-borrowing-costs.pdf',
  'unit-5': '/materials/advanced-accounting/module-2/chapter-5/unit-5/as-19-leases.pdf',
  'unit-6': '/materials/advanced-accounting/module-2/chapter-5/unit-6/as-26-intangible-assets.pdf',
  'unit-7': '/materials/advanced-accounting/module-2/chapter-5/unit-7/as-28-impairment-of-assets.pdf',
}

function withChapter5PdfPath(item) {
  if (!item || item.pdfPath) return item
  const path = CHAPTER5_UNIT_PDFS[item.id]
  return path ? { ...item, pdfPath: path } : item
}

function ChapterStudyHub({
  subject,
  chapter,
  progress,
  onBack,
  currentLevel,
  onToggleComplete,
}) {
  const materialSubjectId =
    subject.id === 'foundation-law'
      ? 'foundation-business-law'
      : subject.id

  const material =
    getChapterMaterial(
      currentLevel || subject.level || 'CA Intermediate',
      materialSubjectId,
      chapter,
    )

  const completed = Array.isArray(progress?.completedChapters)
    ? progress.completedChapters
    : []

  const isComplete = completed.includes(chapter)
  const [selectedUnit, setSelectedUnit] = useState(null)
  const safeToggleComplete = typeof onToggleComplete === 'function' ? onToggleComplete : () => {}

  if (!material) {
    return (
      <div className="page">
        <div className="page-intro">
          <div>
            <p className="eyebrow">CHAPTER STUDY HUB</p>
            <h2>{chapter}</h2>
            <p>{subject.name}</p>
          </div>
          <button className="filter-button" onClick={onBack}>
            ← Back to Chapters
          </button>
        </div>
        <div className="information-card">
          <div className="info-icon">!</div>
          <div>
            <h3>Study material not linked</h3>
            <p>Material could not be resolved for this chapter.</p>
          </div>
        </div>
      </div>
    )
  }

  const units = Array.isArray(material.units)
    ? material.units.map((item) =>
        material.id === 'chapter-5' || chapter === 'Assets Based Accounting Standards'
          ? withChapter5PdfPath(item)
          : item,
      )
    : []
  const hasUnits = units.length > 0

  if (hasUnits && selectedUnit) {
    const isEnabledUnit = Boolean(selectedUnit?.pdfPath)

    if (!isEnabledUnit) {
      return (
        <div className="page">
          <div className="page-intro">
            <div>
              <p className="eyebrow">CHAPTER 4 · UNIT</p>
              <h2>{selectedUnit.title}</h2>
              <p>{chapter}</p>
            </div>
            <button className="filter-button" onClick={() => setSelectedUnit(null)}>
              ← Back to Units
            </button>
          </div>

          <div className="information-card">
            <div className="info-icon">▣</div>
            <div>
              <h3>PDF will be added next</h3>
              <p>This unit is kept in the chapter structure. We are connecting units one by one.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="page">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '14px',
          }}
        >
          <div>
            <p className="eyebrow">ICAI STUDY MATERIAL</p>
            <h2 style={{ margin: '6px 0 4px' }}>{selectedUnit.title}</h2>
            <p style={{ margin: 0, color: '#7188a0', fontSize: '11px' }}>{chapter} · {currentLevel}</p>
          </div>
          <button className="filter-button" onClick={() => setSelectedUnit(null)}>
            ← Back to Units
          </button>
        </div>

        <PrepCorePdfViewer
          src={selectedUnit.pdfPath}
          title={selectedUnit.title}
        />
      </div>
    )
  }

  if (hasUnits) {
    return (
      <div className="page">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '20px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <div>
            <p className="eyebrow">CHAPTER 4</p>
            <h2>{material.title || chapter}</h2>
            <p style={{ color: '#7188a0', marginBottom: 0 }}>{units.length} units</p>
          </div>
          <button className="filter-button" onClick={onBack}>
            ← Back to Chapters
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {units.map((item, index) => (
            <button
              key={item.id || index}
              type="button"
              onClick={() => setSelectedUnit(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '15px 17px',
                background: '#fff',
                border: '1px solid #dce6f0',
                borderRadius: '14px',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '11px',
                  display: 'grid',
                  placeItems: 'center',
                  background: '#edf4fb',
                  color: '#1d4f83',
                  fontWeight: 800,
                  flexShrink: 0,
                }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{ flex: 1 }}>
                <strong style={{ display: 'block', color: '#173d60', fontSize: '12px' }}>
                  {item.title}
                </strong>
                <small style={{ display: 'block', marginTop: '4px', color: '#7b91a5', fontSize: '9px' }}>
                  {item.pdfPath ? 'Open PDF' : 'PDF will be added next'}
                </small>
              </span>
              <span style={{ color: '#1d4f83', fontSize: '18px', fontWeight: 800 }}>→</span>
            </button>
          ))}
        </div>

        <StudyHubCard
          title={isComplete ? 'Chapter Completed' : 'Finish This Chapter'}
          description={isComplete ? 'Your chapter progress is already saved.' : 'Mark the chapter complete after finishing the study material.'}
          actionLabel={isComplete ? 'Mark Incomplete' : 'Mark Chapter Complete'}
          onAction={() => safeToggleComplete(subject.id, chapter)}
          completed={isComplete}
        />
      </div>
    )
  }

  if (material.pdfPath) {
    return (
      <div className="page">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: '15px',
            flexWrap: 'wrap',
            marginBottom: '14px',
          }}
        >
          <div>
            <p className="eyebrow">ICAI STUDY MATERIAL</p>
            <h2 style={{ margin: '6px 0 4px' }}>{material.title || chapter}</h2>
            <p style={{ margin: 0, color: '#7188a0', fontSize: '11px' }}>{subject.name} · {currentLevel}</p>
          </div>
          <button className="filter-button" onClick={onBack}>← Back to Chapters</button>
        </div>

        <PrepCorePdfViewer src={material.pdfPath} title={material.title || chapter} />

        <StudyHubCard
          title={isComplete ? 'Chapter Completed' : 'Finish This Chapter'}
          description={isComplete ? 'Your chapter progress is already saved.' : 'Mark the chapter complete after finishing the study material.'}
          actionLabel={isComplete ? 'Mark Incomplete' : 'Mark Chapter Complete'}
          onAction={() => safeToggleComplete(subject.id, chapter)}
          completed={isComplete}
        />
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">CHAPTER STUDY HUB</p>
          <h2>{material.title || chapter}</h2>
          <p>{subject.name}</p>
        </div>
        <button className="filter-button" onClick={onBack}>← Back to Chapters</button>
      </div>
      <div className="information-card">
        <div className="info-icon">!</div>
        <div>
          <h3>Study material not linked</h3>
          <p>No PDF or units are configured for this chapter yet.</p>
        </div>
      </div>
    </div>
  )
}

function PrepCorePdfViewer({
  src,
  title,
}) {
  const [pdfjs, setPdfjs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pageCount, setPageCount] = useState(0)
  const [maximized, setMaximized] = useState(false)

  useEffect(() => {
    let cancelled = false

    const attach = () => {
      if (!window.pdfjsLib || cancelled) return
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
      setPdfjs(window.pdfjsLib)
    }

    if (window.pdfjsLib) {
      attach()
      return () => { cancelled = true }
    }

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.async = true
    script.onload = attach
    script.onerror = () => {
      if (!cancelled) {
        setError('PDF viewer library could not be loaded.')
        setLoading(false)
      }
    }
    document.head.appendChild(script)

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = maximized ? 'hidden' : previous
    return () => { document.body.style.overflow = previous }
  }, [maximized])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && maximized) setMaximized(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [maximized])

  useEffect(() => {
    if (!pdfjs) return
    let cancelled = false

    const render = async () => {
      try {
        setLoading(true)
        setError('')
        const pdf = await pdfjs.getDocument({ url: src }).promise
        if (cancelled) return
        setPageCount(pdf.numPages)

        const container = document.getElementById('prepcore-pdf-pages')
        if (!container) return
        container.innerHTML = ''

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return
          const page = await pdf.getPage(pageNumber)
          const baseViewport = page.getViewport({ scale: 1 })
          const availableWidth = Math.max((container.clientWidth || 900) - 30, 320)
          const scale = Math.min(maximized ? 1.8 : 1.5, Math.max(0.8, availableWidth / baseViewport.width))
          const viewport = page.getViewport({ scale })
          const ratio = window.devicePixelRatio || 1

          const canvas = document.createElement('canvas')
          canvas.width = Math.floor(viewport.width * ratio)
          canvas.height = Math.floor(viewport.height * ratio)
          canvas.style.width = `${Math.floor(viewport.width)}px`
          canvas.style.height = `${Math.floor(viewport.height)}px`
          canvas.style.display = 'block'
          canvas.style.background = '#fff'
          canvas.style.boxShadow = '0 1px 8px rgba(0,0,0,.12)'

          const context = canvas.getContext('2d', { alpha: false })
          if (!context) continue
          context.setTransform(ratio, 0, 0, ratio, 0, 0)
          await page.render({ canvasContext: context, viewport }).promise

          const wrapper = document.createElement('div')
          wrapper.style.display = 'flex'
          wrapper.style.justifyContent = 'center'
          wrapper.style.padding = maximized ? '18px 0' : '12px 0'
          wrapper.style.background = '#e9edf2'
          wrapper.style.width = '100%'
          wrapper.appendChild(canvas)
          container.appendChild(wrapper)
        }
        setLoading(false)
      } catch (renderError) {
        if (cancelled) return
        console.error('PDF RENDER ERROR:', renderError)
        setError('Unable to render the PDF.')
        setLoading(false)
      }
    }

    render()
    return () => { cancelled = true }
  }, [pdfjs, src, maximized])

  const shell = maximized
    ? { position: 'fixed', inset: 0, zIndex: 99999, width: '100vw', height: '100vh', background: '#e9edf2' }
    : { width: '100%', background: '#e9edf2', border: '1px solid #dce6f0', borderRadius: '16px', overflow: 'hidden' }

  return (
    <div style={shell}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: '10px', padding: '10px 13px', background: '#fff', borderBottom: '1px solid #e7eef4'
      }}>
        {maximized ? (
          <button
            type="button"
            onClick={() => setMaximized(false)}
            style={{
              minHeight: '34px', padding: '0 11px', border: '1px solid #dce6f0',
              borderRadius: '9px', background: '#fff', color: '#1d4f83', fontSize: '10px', fontWeight: 800, cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        ) : (
          <span style={{ color: '#48657f', fontSize: '9px', fontWeight: 800 }}>{title}</span>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!maximized && (
            <a
              href={src}
              download
              style={{
                textDecoration: 'none', color: '#1d4f83', fontSize: '9px', fontWeight: 800,
                padding: '8px 10px', border: '1px solid #dce6f0', borderRadius: '9px', background: '#fff'
              }}
            >
              Download PDF
            </a>
          )}

          {!maximized && (
            <span style={{ color: '#8396a8', fontSize: '8px' }}>
              {pageCount ? `${pageCount} pages` : 'Loading PDF...'}
            </span>
          )}

          <button
            type="button"
            onClick={() => setMaximized((value) => !value)}
            title={maximized ? 'Minimize PDF' : 'Maximize PDF'}
            aria-label={maximized ? 'Minimize PDF' : 'Maximize PDF'}
            style={{
              width: '34px', height: '34px', display: 'grid', placeItems: 'center',
              border: '1px solid #dce6f0', borderRadius: '9px', background: '#fff', color: '#1d4f83', fontSize: '15px', cursor: 'pointer'
            }}
          >
            ⛶
          </button>
        </div>
      </div>

      {error && (
        <div style={{ margin: '16px', padding: '14px', borderRadius: '12px', background: '#fff4f4', border: '1px solid #edd7d7', color: '#a94343', fontSize: '10px' }}>
          {error}
        </div>
      )}

      {loading && !error && (
        <div style={{ minHeight: maximized ? 'calc(100vh - 56px)' : '250px', display: 'grid', placeItems: 'center', color: '#6f879b', fontSize: '10px' }}>
          Loading original PDF...
        </div>
      )}

      <div id="prepcore-pdf-pages" style={{ height: maximized ? 'calc(100vh - 56px)' : 'auto', overflowY: 'auto', overflowX: 'hidden' }} />
    </div>
  )
}

function MaterialAccordion({
  title,
  subtitle,
  icon,
  open,
  onClick,
  children,
}) {
  return (
    <div
      style={{
        border: '1px solid #dce6f0',
        borderRadius: '15px',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          padding: '14px 15px',
          border: 0,
          background: '#fff',
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span
          style={{
            width: '34px',
            height: '34px',
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '10px',
            background: open
              ? '#1d4f83'
              : '#edf5fb',
            color: open
              ? '#fff'
              : '#1d4f83',
            fontSize: '12px',
            fontWeight: 900,
          }}
        >
          {icon}
        </span>

        <span
          style={{
            flex: 1,
          }}
        >
          <strong
            style={{
              display: 'block',
              color: '#153d60',
              fontSize: '12px',
            }}
          >
            {title}
          </strong>

          <small
            style={{
              display: 'block',
              marginTop: '3px',
              color: '#8296a8',
              fontSize: '8px',
            }}
          >
            {subtitle}
          </small>
        </span>

        <span
          style={{
            color: '#7790a6',
            transform: open
              ? 'rotate(180deg)'
              : 'rotate(0deg)',
            transition: 'transform .2s ease',
            fontSize: '16px',
          }}
        >
          ⌄
        </span>
      </button>

      {open && (
        <div
          style={{
            padding: '0 15px 15px',
            borderTop: '1px solid #edf2f6',
          }}
        >
          <div style={{ paddingTop: '13px' }}>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

function MiniConceptCard({
  title,
  text,
}) {
  return (
    <div
      style={{
        padding: '11px',
        borderRadius: '10px',
        background: '#f7faff',
        border: '1px solid #e2ebf2',
      }}
    >
      <strong
        style={{
          display: 'block',
          color: '#1e4a6c',
          fontSize: '9px',
          marginBottom: '4px',
        }}
      >
        {title}
      </strong>

      <span
        style={{
          display: 'block',
          color: '#6a8197',
          fontSize: '8px',
          lineHeight: 1.55,
        }}
      >
        {text}
      </span>
    </div>
  )
}

function MiniDarkStat({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding: '9px',
        borderRadius: '9px',
        background: 'rgba(255,255,255,.08)',
        border: '1px solid rgba(255,255,255,.08)',
      }}
    >
      <span
        style={{
          display: 'block',
          color: '#88aac5',
          fontSize: '7px',
          fontWeight: 800,
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display: 'block',
          marginTop: '3px',
          color: '#fff',
          fontSize: '15px',
        }}
      >
        {value}
      </strong>
    </div>
  )
}

function FlowItem({
  number,
  title,
  text,
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        alignItems: 'flex-start',
      }}
    >
      <span
        style={{
          width: '24px',
          height: '24px',
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          borderRadius: '7px',
          background: '#edf5fb',
          color: '#1d4f83',
          fontSize: '7px',
          fontWeight: 900,
        }}
      >
        {number}
      </span>

      <div>
        <strong
          style={{
            display: 'block',
            color: '#274d6c',
            fontSize: '9px',
          }}
        >
          {title}
        </strong>

        <span
          style={{
            display: 'block',
            marginTop: '2px',
            color: '#7c91a5',
            fontSize: '8px',
            lineHeight: 1.45,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  )
}

function StudyHubMiniCard({
  icon,
  title,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '17px',
        border:
          '1px solid #dce6f0',
        borderRadius:
          '15px',
        background:
          '#fff',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#1d4f83',
          fontSize:
            '17px',
          marginBottom:
            '8px',
        }}
      >
        {
          icon
        }
      </span>

      <small>
        {
          title
        }
      </small>

      <strong
        style={{
          display:
            'block',
          marginTop:
            '5px',
          color:
            '#0b2d53',
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

function StudyHubCard({
  icon = '✓',
  title,
  description,
  actionLabel,
  onAction,
  completed = false,
}) {
  return (
    <div
      style={{
        marginTop: '18px',
        padding: '20px',
        border: '1px solid #dce6f0',
        borderRadius: '18px',
        background: completed ? '#effbf6' : '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '18px',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            flex: '0 0 auto',
            borderRadius: '11px',
            display: 'grid',
            placeItems: 'center',
            background: completed ? '#dff5ea' : '#edf4fb',
            color: completed ? '#147252' : '#1d4f83',
            fontWeight: 900,
          }}
        >
          {icon}
        </div>

        <div style={{ minWidth: 0 }}>
          <h3
            style={{
              margin: '0 0 5px',
              color: '#0a2d55',
              fontSize: '15px',
            }}
          >
            {title}
          </h3>

          <p
            style={{
              margin: 0,
              color: '#7389a0',
              fontSize: '11px',
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        </div>
      </div>

      {actionLabel && onAction && (
        <button
          type="button"
          className="primary-button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/* =========================================================
   REVISION
========================================================= */

function RevisionPage({
  items,
  onOpen,
}) {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            SMART REVISION
          </p>

          <h2>
            Revision Center
          </h2>

          <p>
            Completed chapters automatically appear here.
          </p>
        </div>
      </div>

      <div className="revision-table-card">
        {items.length ===
        0 ? (
          <div
            style={{
              padding:
                '50px',
              textAlign:
                'center',
            }}
          >
            <h3>
              No revision topics yet
            </h3>

            <p>
              Complete a chapter from My Subjects first.
            </p>
          </div>
        ) : (
          items.map(
            (
              item,
            ) => (
              <div
                className="revision-row"
                key={
                  item.id
                }
              >
                <strong>
                  {
                    item.topic
                  }
                </strong>

                <span>
                  {
                    item.subject
                  }
                </span>

                <span>
                  <em className="status-pill normal">
                    Ready to revise
                  </em>
                </span>

                <span>
                  Today
                </span>

                <button
                  className="small-action"
                  onClick={() =>
                    onOpen(
                      item,
                    )
                  }
                >
                  Revise →
                </button>
              </div>
            ),
          )
        )}
      </div>
    </div>
  )
}

function RevisionTopicPage({
  item,
  onBack,
}) {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            REVISION TOPIC
          </p>

          <h2>
            {
              item.topic
            }
          </h2>

          <p>
            {
              item.subject
            }
          </p>
        </div>

        <button
          className="filter-button"
          onClick={
            onBack
          }
        >
          ← Back to Revision
        </button>
      </div>

      <div className="information-card">
        <div className="info-icon">
          ↻
        </div>

        <div>
          <h3>
            Revision Focus
          </h3>

          <p>
            Review the concept, important points,
            examples and questions related to this topic.
          </p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PRACTICE
========================================================= */

function PracticePage({
  subjects,
  subjectId,
  chapter,
  quizConfig,
  onSubject,
  onChapter,
  onStart,
  onBackSubjects,
  onBackChapters,
  onExitQuiz,
}) {
  if (
    quizConfig
  ) {
    return (
      <QuizPage
        config={
          quizConfig
        }
        onExit={
          onExitQuiz
        }
      />
    )
  }

  const subject =
    subjects.find(
      (
        item,
      ) =>
        item.id ===
        subjectId,
    )

  if (
    subject &&
    chapter
  ) {
    return (
      <PracticeSetup
        subject={
          subject
        }
        chapter={
          chapter
        }
        onBack={
          onBackChapters
        }
        onStart={
          onStart
        }
      />
    )
  }

  if (
    subject
  ) {
    return (
      <PracticeChapterSelect
        subject={
          subject
        }
        onSelect={
          onChapter
        }
        onBack={
          onBackSubjects
        }
      />
    )
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            TEST YOUR KNOWLEDGE
          </p>

          <h2>
            Practice & MCQs
          </h2>

          <p>
            Select a subject to start your practice session.
          </p>
        </div>
      </div>

      <div className="large-subject-grid">
        {subjects.map(
          (
            item,
          ) => (
            <div
              className="practice-card"
              key={
                item.id
              }
            >
              <div
                className={`practice-icon ${item.color}`}
              >
                {
                  item.short
                }
              </div>

              <h3>
                {
                  item.name
                }
              </h3>

              <p>
                {
                  item.chapterList.length
                }{' '}
                chapters
              </p>

              <button
                onClick={() =>
                  onSubject(
                    item.id,
                  )
                }
              >
                Choose Chapter →
              </button>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function PracticeChapterSelect({
  subject,
  onSelect,
  onBack,
}) {
  const isAdvancedAccounting =
    subject.id === 'inter-advanced-accounting'

  const modules = [
    {
      id: 'module-1',
      title: 'Module 1',
      chapters: subject.chapterList.slice(0, 4),
    },
    {
      id: 'module-2',
      title: 'Module 2',
      chapters: subject.chapterList.slice(4, 10),
    },
    {
      id: 'module-3',
      title: 'Module 3',
      chapters: subject.chapterList.slice(10, 15),
    },
  ]

  if (!isAdvancedAccounting) {
    return (
      <div className="page">
        <div className="page-intro">
          <div>
            <p className="eyebrow">
              SELECT CHAPTER
            </p>

            <h2>
              {subject.name}
            </h2>

            <p>
              Choose the chapter you want to practice.
            </p>
          </div>

          <button
            className="filter-button"
            onClick={onBack}
          >
            ← Back to Subjects
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {subject.chapterList.map(
            (chapter, index) => (
              <button
                key={chapter}
                onClick={() =>
                  onSelect(chapter)
                }
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  padding: '16px 18px',
                  border:
                    '1px solid #dce6f0',
                  borderRadius: '14px',
                  background: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    display: 'grid',
                    placeItems: 'center',
                    background: '#edf4fb',
                    color: '#1d4f83',
                    fontWeight: 800,
                  }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                <span
                  style={{
                    flex: 1,
                  }}
                >
                  <strong
                    style={{
                      display: 'block',
                      color: '#09294f',
                      fontSize: '14px',
                    }}
                  >
                    {chapter}
                  </strong>

                  <small
                    style={{
                      display: 'block',
                      marginTop: '4px',
                      color: '#7890aa',
                    }}
                  >
                    Practice MCQs from this chapter
                  </small>
                </span>

                <span
                  style={{
                    color: '#1d4f83',
                    fontSize: '18px',
                    fontWeight: 800,
                  }}
                >
                  →
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            SELECT CHAPTER
          </p>

          <h2>
            {subject.name}
          </h2>

          <p>
            Choose the module and chapter you want to practice.
          </p>
        </div>

        <button
          className="filter-button"
          onClick={onBack}
        >
          ← Back to Subjects
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        {modules.map((module) => (
          <div
            key={module.id}
            style={{
              border: '1px solid #dce6f0',
              borderRadius: '16px',
              background: '#fff',
              overflow: 'hidden',
              boxShadow:
                '0 5px 18px rgba(20,50,80,.04)',
            }}
          >
            <div
              style={{
                padding: '14px 18px',
                background: '#f5f9fd',
                borderBottom: '1px solid #e3ebf2',
                color: '#173f64',
                fontSize: '13px',
                fontWeight: 800,
              }}
            >
              {module.title}

              <span
                style={{
                  marginLeft: '8px',
                  color: '#8aa0b5',
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              >
                {module.chapters.length} chapters
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                padding: '12px',
              }}
            >
              {module.chapters.map((chapter) => {
                const chapterNumber =
                  subject.chapterList.indexOf(chapter) + 1

                return (
                  <button
                    key={chapter}
                    onClick={() =>
                      onSelect(chapter)
                    }
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px',
                      padding: '16px 18px',
                      border:
                        '1px solid #dce6f0',
                      borderRadius: '14px',
                      background: '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: '42px',
                        height: '42px',
                        flex: '0 0 42px',
                        borderRadius: '12px',
                        display: 'grid',
                        placeItems: 'center',
                        background: '#edf4fb',
                        color: '#1d4f83',
                        fontWeight: 800,
                      }}
                    >
                      {String(
                        chapterNumber,
                      ).padStart(2, '0')}
                    </span>

                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <strong
                        style={{
                          display: 'block',
                          color: '#09294f',
                          fontSize: '14px',
                          lineHeight: '1.35',
                        }}
                      >
                        {chapter}
                      </strong>

                      <small
                        style={{
                          display: 'block',
                          marginTop: '4px',
                          color: '#7890aa',
                        }}
                      >
                        Practice MCQs from this chapter
                      </small>
                    </span>

                    <span
                      style={{
                        color: '#1d4f83',
                        fontSize: '18px',
                        fontWeight: 800,
                      }}
                    >
                      →
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PracticeSetup({
  subject,
  chapter,
  onBack,
  onStart,
}) {
  const [
    difficulty,
    setDifficulty,
  ] =
    useState('mix')

  const options = [
    {
      id:
        'easy',
      icon:
        '◔',
      title:
        'Easy',
      text:
        'Straightforward concepts.',
    },
    {
      id:
        'medium',
      icon:
        '◑',
      title:
        'Medium',
      text:
        'Exam-style application.',
    },
    {
      id:
        'difficult',
      icon:
        '◕',
      title:
        'Difficult',
      text:
        'Challenging questions.',
    },
    {
      id:
        'mix',
      icon:
        '✦',
      title:
        'Mix',
      text:
        'Balanced difficulty.',
    },
  ]

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            PRACTICE SETUP
          </p>

          <h2>
            Start Practice
          </h2>

          <p>
            {
              subject.name
            }{' '}
            · {chapter}
          </p>
        </div>

        <button
          className="filter-button"
          onClick={
            onBack
          }
        >
          ← Back to Chapters
        </button>
      </div>

      <div
        style={{
          maxWidth:
            '900px',
          margin:
            '0 auto',
          background:
            '#fff',
          border:
            '1px solid #dce6f0',
          borderRadius:
            '22px',
          padding:
            '30px',
        }}
      >
        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap:
              '15px',
            marginBottom:
              '28px',
          }}
        >
          <div
            className={`subject-symbol ${subject.color}`}
            style={{
              width:
                '56px',
              height:
                '56px',
            }}
          >
            {
              subject.short
            }
          </div>

          <div>
            <span className="status-pill normal">
              Practice Ready
            </span>

            <h3
              style={{
                margin:
                  '8px 0 3px',
              }}
            >
              {
                chapter
              }
            </h3>

            <p
              style={{
                margin:
                  0,
                color:
                  '#7890aa',
              }}
            >
              {
                subject.name
              }
            </p>
          </div>
        </div>

        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(2,1fr)',
            gap:
              '12px',
            marginBottom:
              '28px',
          }}
        >
          <div
            style={{
              padding:
                '18px',
              borderRadius:
                '14px',
              background:
                '#f7faff',
              border:
                '1px solid #e5edf5',
            }}
          >
            <small>
              QUESTIONS
            </small>

            <strong
              style={{
                display:
                  'block',
                marginTop:
                  '6px',
                fontSize:
                  '25px',
              }}
            >
              10
            </strong>
          </div>

          <div
            style={{
              padding:
                '18px',
              borderRadius:
                '14px',
              background:
                '#f7faff',
              border:
                '1px solid #e5edf5',
            }}
          >
            <small>
              MODE
            </small>

            <strong
              style={{
                display:
                  'block',
                marginTop:
                  '6px',
                fontSize:
                  '25px',
              }}
            >
              MCQ
            </strong>
          </div>
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
              '24px',
          }}
        >
          {options.map(
            (
              item,
            ) => (
              <button
                key={
                  item.id
                }
                onClick={() =>
                  setDifficulty(
                    item.id,
                  )
                }
                style={{
                  minHeight:
                    '115px',
                  padding:
                    '14px',
                  border:
                    difficulty ===
                    item.id
                      ? '2px solid #1d4f83'
                      : '1px solid #dce6f0',
                  borderRadius:
                    '13px',
                  background:
                    difficulty ===
                    item.id
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
                      '16px',
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
                      '8px',
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
                      '4px',
                    color:
                      '#7890aa',
                  }}
                >
                  {
                    item.text
                  }
                </small>
              </button>
            ),
          )}
        </div>

        <button
          className="primary-button"
          style={{
            width:
              '100%',
            justifyContent:
              'center',
          }}
          onClick={() =>
            onStart(
              subject,
              chapter,
              difficulty,
            )
          }
        >
          Start Practice →
        </button>
      </div>
    </div>
  )
}

function QuizPage({
  config,
  onExit,
}) {
  const questions =
    useMemo(
      () =>
        getQuestions(
          config.chapter,
          config.difficulty,
        ),
      [
        config.chapter,
        config.difficulty,
      ],
    )

  const [
    index,
    setIndex,
  ] =
    useState(0)

  const [
    selected,
    setSelected,
  ] =
    useState(null)

  const [
    submitted,
    setSubmitted,
  ] =
    useState(false)

  const [
    score,
    setScore,
  ] =
    useState(0)

  const [
    finished,
    setFinished,
  ] =
    useState(false)

  const current =
    questions[index]

  const submitAnswer =
    () => {
      if (
        selected ===
          null ||
        submitted
      ) {
        return
      }

      if (
        selected ===
        current.answer
      ) {
        setScore(
          (
            value,
          ) =>
            value +
            1,
        )
      }

      setSubmitted(
        true,
      )
    }

  const next =
    () => {
      if (
        !submitted
      ) {
        return
      }

      if (
        index ===
        questions.length -
          1
      ) {
        setFinished(
          true,
        )

        return
      }

      setIndex(
        (
          value,
        ) =>
          value +
          1,
      )

      setSelected(
        null,
      )

      setSubmitted(
        false,
      )
    }

  if (
    finished
  ) {
    const accuracy =
      Math.round(
        (score /
          questions.length) *
          100,
      )

    return (
      <div className="page">
        <div
          style={{
            maxWidth:
              '900px',
            margin:
              '0 auto',
          }}
        >
          <div
            style={{
              padding:
                '40px',
              borderRadius:
                '24px',
              background:
                'linear-gradient(135deg,#061d38,#12416c,#1c5a8f)',
              color:
                '#fff',
              textAlign:
                'center',
            }}
          >
            <span
              style={{
                fontSize:
                  '10px',
                letterSpacing:
                  '.15em',
                fontWeight:
                  800,
              }}
            >
              PRACTICE COMPLETE
            </span>

            <h2
              style={{
                color:
                  '#fff',
                margin:
                  '12px 0 4px',
              }}
            >
              {
                config.chapter
              }
            </h2>

            <p
              style={{
                color:
                  '#b7cde2',
              }}
            >
              {
                config.subjectName
              }
            </p>

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'center',
                gap:
                  '45px',
                marginTop:
                  '28px',
              }}
            >
              <div>
                <strong
                  style={{
                    fontSize:
                      '42px',
                  }}
                >
                  {score}/10
                </strong>

                <small>
                  Score
                </small>
              </div>

              <div>
                <strong
                  style={{
                    fontSize:
                      '42px',
                  }}
                >
                  {
                    accuracy
                  }%
                </strong>

                <small>
                  Accuracy
                </small>
              </div>
            </div>
          </div>

          <button
            className="primary-button"
            style={{
              width:
                '100%',
              justifyContent:
                'center',
              marginTop:
                '18px',
            }}
            onClick={
              onExit
            }
          >
            Back to Practice →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div
        style={{
          background:
            'linear-gradient(135deg,#061d38,#123e6a,#1c588d)',
          borderRadius:
            '22px',
          padding:
            '24px 28px',
          marginBottom:
            '16px',
          color:
            '#fff',
        }}
      >
        <span
          style={{
            color:
              '#91badf',
            fontSize:
              '10px',
            fontWeight:
              800,
            letterSpacing:
              '.16em',
          }}
        >
          LIVE PRACTICE SESSION
        </span>

        <h2
          style={{
            color:
              '#fff',
            margin:
              '8px 0 4px',
          }}
        >
          {
            config.chapter
          }
        </h2>

        <p
          style={{
            margin:
              0,
            color:
              '#abc5df',
          }}
        >
          {
            config.subjectName
          }{' '}
          ·{' '}
          {getDifficultyLabel(
            config.difficulty,
          )}
        </p>
      </div>

      <div
        style={{
          display:
            'flex',
          alignItems:
            'center',
          gap:
            '14px',
          marginBottom:
            '18px',
        }}
      >
        <strong>
          Q{' '}
          {String(
            index +
              1,
          ).padStart(
            2,
            '0',
          )}{' '}
          / 10
        </strong>

        <div
          style={{
            flex:
              1,
            height:
              '7px',
            background:
              '#e7eef5',
            borderRadius:
              '99px',
          }}
        >
          <div
            style={{
              width:
                `${((index + 1) / 10) * 100}%`,
              height:
                '100%',
              background:
                'linear-gradient(90deg,#20598d,#62adff)',
              borderRadius:
                '99px',
            }}
          />
        </div>
      </div>

      <div
        style={{
          maxWidth:
            '900px',
          margin:
            '0 auto',
          background:
            '#fff',
          border:
            '1px solid #dce6f0',
          borderRadius:
            '22px',
          padding:
            '28px',
        }}
      >
        <span className="status-pill normal">
          QUESTION {index + 1}
        </span>

        <h2
          style={{
            color:
              '#071f3d',
            lineHeight:
              1.5,
            margin:
              '18px 0 24px',
          }}
        >
          {
            current.question
          }
        </h2>

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
          {current.options.map(
            (
              option,
              i,
            ) => {
              const active =
                selected ===
                i

              const correct =
                submitted &&
                i ===
                  current.answer

              const wrong =
                submitted &&
                active &&
                i !==
                  current.answer

              return (
                <button
                  key={
                    i
                  }
                  onClick={() =>
                    !submitted &&
                    setSelected(
                      i,
                    )
                  }
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '13px',
                    minHeight:
                      '64px',
                    padding:
                      '10px 14px',
                    border:
                      correct
                        ? '2px solid #42b889'
                        : wrong
                          ? '2px solid #db6868'
                          : active
                            ? '2px solid #28679f'
                            : '1px solid #dce6f0',
                    borderRadius:
                      '14px',
                    background:
                      correct
                        ? '#effbf6'
                        : wrong
                          ? '#fff3f3'
                          : active
                            ? '#edf5ff'
                            : '#fff',
                    textAlign:
                      'left',
                    cursor:
                      submitted
                        ? 'default'
                        : 'pointer',
                  }}
                >
                  <span
                    style={{
                      width:
                        '38px',
                      height:
                        '38px',
                      display:
                        'grid',
                      placeItems:
                        'center',
                      borderRadius:
                        '10px',
                      background:
                        correct
                          ? '#42b889'
                          : wrong
                            ? '#db6868'
                            : active
                              ? '#28679f'
                              : '#f0f5fa',
                      color:
                        correct ||
                        wrong ||
                        active
                          ? '#fff'
                          : '#426887',
                      fontWeight:
                        900,
                    }}
                  >
                    {String.fromCharCode(
                      65 +
                        i,
                    )}
                  </span>

                  <span
                    style={{
                      color:
                        '#173c61',
                      fontSize:
                        '14px',
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
          )}
        </div>

        {submitted && (
          <div
            style={{
              marginTop:
                '18px',
              padding:
                '15px',
              borderRadius:
                '13px',
              background:
                selected ===
                current.answer
                  ? '#effbf6'
                  : '#fff4f4',
              color:
                '#617990',
              fontSize:
                '12px',
            }}
          >
            <strong
              style={{
                display:
                  'block',
                marginBottom:
                  '4px',
              }}
            >
              {selected ===
              current.answer
                ? 'Correct answer'
                : 'Not quite'}
            </strong>

            {
              current.explanation
            }
          </div>
        )}

        <div
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            marginTop:
              '23px',
          }}
        >
          <button
            onClick={
              onExit
            }
            className="filter-button"
          >
            Exit Practice
          </button>

          {!submitted ? (
            <button
              onClick={
                submitAnswer
              }
              className="primary-button"
              disabled={
                selected ===
                null
              }
            >
              Submit Answer →
            </button>
          ) : (
            <button
              onClick={
                next
              }
              className="primary-button"
            >
              {index ===
              questions.length -
                1
                ? 'Finish Quiz →'
                : 'Next Question →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PROFILE
========================================================= */

function ProfilePage({
  user,
  profile,
  currentLevel,
  currentAttempt,
  onSave,
}) {
  const [
    name,
    setName,
  ] =
    useState(
      profile?.name ||
        getDisplayName(
          user,
          profile,
        ),
    )

  const [
    level,
    setLevel,
  ] =
    useState(
      currentLevel,
    )

  const [
    attempt,
    setAttempt,
  ] =
    useState(
      currentAttempt,
    )

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    message,
    setMessage,
  ] =
    useState('')

  useEffect(() => {
    setName(
      profile?.name ||
        getDisplayName(
          user,
          profile,
        ),
    )

    setLevel(
      profile?.level ||
        currentLevel,
    )

    setAttempt(
      profile?.attempt ||
        currentAttempt,
    )
  }, [
    profile,
    user,
    currentLevel,
    currentAttempt,
  ])

  const handleSave =
    async (
      event,
    ) => {
      event.preventDefault()

      setSaving(
        true,
      )

      setMessage(
        '',
      )

      try {
        await onSave({
          name,
          level,
          attempt,
        })

        setMessage(
          'Profile saved successfully.',
        )
      } catch (
        error
      ) {
        setMessage(
          'Unable to save profile. Please try again.',
        )
      } finally {
        setSaving(
          false,
        )
      }
    }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            ACCOUNT
          </p>

          <h2>
            My Profile
          </h2>

          <p>
            Update your personal and CA preparation details.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth:
            '850px',
        }}
      >
        <form
          onSubmit={
            handleSave
          }
          style={{
            background:
              '#fff',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '20px',
            overflow:
              'hidden',
          }}
        >
          <div
            style={{
              padding:
                '25px',
              background:
                'linear-gradient(135deg,#071f3c,#123e69)',
              color:
                '#fff',
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap:
                  '15px',
              }}
            >
              <div className="profile-large-avatar">
                {
                  getInitials(
                    user,
                    profile,
                  )
                }
              </div>

              <div>
                <span
                  style={{
                    display:
                      'block',
                    color:
                      '#8fb4d4',
                    fontSize:
                      '10px',
                    fontWeight:
                      800,
                  }}
                >
                  STUDENT PROFILE
                </span>

                <h3
                  style={{
                    color:
                      '#fff',
                    margin:
                      '6px 0 4px',
                  }}
                >
                  {
                    name ||
                    'Student'
                  }
                </h3>

                <span
                  style={{
                    color:
                      '#b0c7dc',
                    fontSize:
                      '11px',
                  }}
                >
                  {
                    user?.email ||
                    ''
                  }
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              padding:
                '25px',
            }}
          >
            <div
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(2,1fr)',
                gap:
                  '16px',
              }}
            >
              <ProfileField label="Full Name">
                <input
                  value={
                    name
                  }
                  onChange={(
                    event,
                  ) =>
                    setName(
                      event.target
                        .value,
                    )
                  }
                  required
                />
              </ProfileField>

              <ProfileField label="Email">
                <input
                  value={
                    user?.email ||
                    ''
                  }
                  readOnly
                />
              </ProfileField>

              <ProfileField label="CA Level">
                <select
                  value={
                    level
                  }
                  onChange={(
                    event,
                  ) =>
                    setLevel(
                      event.target
                        .value,
                    )
                  }
                >
                  <option>
                    CA Foundation
                  </option>

                  <option>
                    CA Intermediate
                  </option>

                  <option>
                    CA Final
                  </option>
                </select>
              </ProfileField>

              <ProfileField label="Attempt">
                <select
                  value={
                    attempt
                  }
                  onChange={(
                    event,
                  ) =>
                    setAttempt(
                      event.target
                        .value,
                    )
                  }
                >
                  <option>
                    January 2027
                  </option>

                  <option>
                    May 2027
                  </option>

                  <option>
                    September 2027
                  </option>

                  <option>
                    January 2028
                  </option>

                  <option>
                    May 2028
                  </option>

                  <option>
                    September 2028
                  </option>
                </select>
              </ProfileField>
            </div>

            {message && (
              <div
                style={{
                  marginTop:
                    '16px',
                  padding:
                    '12px 14px',
                  borderRadius:
                    '10px',
                  background:
                    '#effbf6',
                  color:
                    '#137254',
                  fontSize:
                    '11px',
                  fontWeight:
                    700,
                }}
              >
                {
                  message
                }
              </div>
            )}
          </div>

          <div
            style={{
              display:
                'flex',
              justifyContent:
                'flex-end',
              padding:
                '18px 25px',
              borderTop:
                '1px solid #edf2f6',
            }}
          >
            <button
              className="primary-button"
              type="submit"
              disabled={
                saving
              }
            >
              {
                saving
                  ? 'Saving...'
                  : 'Save Profile →'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage({
  user,
  profile,
  currentLevel,
  currentAttempt,
  onSave,
  onLogout,
}) {
  const [
    name,
    setName,
  ] =
    useState(
      profile?.name ||
        getDisplayName(
          user,
          profile,
        ),
    )

  const [
    level,
    setLevel,
  ] =
    useState(
      profile?.level ||
        currentLevel,
    )

  const [
    attempt,
    setAttempt,
  ] =
    useState(
      profile?.attempt ||
        currentAttempt,
    )

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    message,
    setMessage,
  ] =
    useState('')

  useEffect(() => {
    setName(
      profile?.name ||
        getDisplayName(
          user,
          profile,
        ),
    )

    setLevel(
      profile?.level ||
        currentLevel,
    )

    setAttempt(
      profile?.attempt ||
        currentAttempt,
    )
  }, [
    profile,
    user,
    currentLevel,
    currentAttempt,
  ])

  const saveSettings =
    async () => {
      setSaving(
        true,
      )

      setMessage(
        '',
      )

      try {
        await onSave({
          name,
          level,
          attempt,
        })

        setMessage(
          'Settings saved successfully.',
        )
      } catch (
        error
      ) {
        setMessage(
          'Unable to save settings.',
        )
      } finally {
        setSaving(
          false,
        )
      }
    }

  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            ACCOUNT SETTINGS
          </p>

          <h2>
            Settings
          </h2>

          <p>
            Manage your PrepCore account and preparation details.
          </p>
        </div>
      </div>

      <div
        style={{
          maxWidth:
            '850px',
        }}
      >
        <div
          style={{
            padding:
              '23px',
            background:
              '#fff',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '18px',
          }}
        >
          <p className="eyebrow">
            PREPARATION PROFILE
          </p>

          <h3
            style={{
              margin:
                '5px 0 18px',
            }}
          >
            CA Preparation
          </h3>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(2,1fr)',
              gap:
                '15px',
            }}
          >
            <ProfileField label="Student Name">
              <input
                value={
                  name
                }
                onChange={(
                  event,
                ) =>
                  setName(
                    event.target
                      .value,
                  )
                }
              />
            </ProfileField>

            <ProfileField label="Email">
              <input
                value={
                  user?.email ||
                  ''
                }
                readOnly
              />
            </ProfileField>

            <ProfileField label="CA Level">
              <select
                value={
                  level
                }
                onChange={(
                  event,
                ) =>
                  setLevel(
                    event.target
                      .value,
                  )
                }
              >
                <option>
                  CA Foundation
                </option>

                <option>
                  CA Intermediate
                </option>

                <option>
                  CA Final
                </option>
              </select>
            </ProfileField>

            <ProfileField label="Attempt">
              <select
                value={
                  attempt
                }
                onChange={(
                  event,
                ) =>
                  setAttempt(
                    event.target
                      .value,
                  )
                }
              >
                <option>
                  January 2027
                </option>

                <option>
                  May 2027
                </option>

                <option>
                  September 2027
                </option>

                <option>
                  January 2028
                </option>

                <option>
                  May 2028
                </option>

                <option>
                  September 2028
                </option>
              </select>
            </ProfileField>
          </div>

          {message && (
            <div
              style={{
                marginTop:
                  '15px',
                padding:
                  '11px 13px',
                borderRadius:
                  '10px',
                background:
                  '#effbf6',
                color:
                  '#137254',
                fontSize:
                  '11px',
                fontWeight:
                  700,
              }}
            >
              {
                message
              }
            </div>
          )}

          <div
            style={{
              display:
                'flex',
              justifyContent:
                'flex-end',
              marginTop:
                '18px',
            }}
          >
            <button
              className="primary-button"
              onClick={
                saveSettings
              }
              disabled={
                saving
              }
            >
              {
                saving
                  ? 'Saving...'
                  : 'Save Settings →'
              }
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop:
              '14px',
            padding:
              '23px',
            background:
              '#fff',
            border:
              '1px solid #eadede',
            borderRadius:
              '18px',
          }}
        >
          <p className="eyebrow">
            ACCOUNT
          </p>

          <h3>
            Sign out
          </h3>

          <p
            style={{
              color:
                '#8094a9',
              fontSize:
                '11px',
            }}
          >
            Sign out from this PrepCore account on this device.
          </p>

          <button
            onClick={
              onLogout
            }
            style={{
              marginTop:
                '10px',
              minHeight:
                '43px',
              padding:
                '0 15px',
              border:
                '1px solid #e3cfcf',
              borderRadius:
                '10px',
              background:
                '#fff8f8',
              color:
                '#a34a4a',
              fontWeight:
                800,
              cursor:
                'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileField({
  label,
  children,
}) {
  return (
    <label>
      <span
        style={{
          display:
            'block',
          marginBottom:
            '7px',
          color:
            '#284a6b',
          fontSize:
            '11px',
          fontWeight:
            800,
        }}
      >
        {
          label
        }
      </span>

      {children}

      <style>
        {`
          label input,
          label select {
            width: 100%;
            min-height: 45px;
            padding: 0 12px;
            box-sizing: border-box;
            border: 1px solid #d9e3ec;
            border-radius: 10px;
            background: #fff;
            color: #173c61;
            font-size: 12px;
            outline: none;
          }

          label input:focus,
          label select:focus {
            border-color: #2d6b9e;
            box-shadow: 0 0 0 3px rgba(45,107,158,.08);
          }

          label input[readonly] {
            background: #f5f8fb;
            color: #7890aa;
            cursor: not-allowed;
          }
        `}
      </style>
    </label>
  )
}

function SimplePage({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">
            {
              eyebrow
            }
          </p>

          <h2>
            {
              title
            }
          </h2>

          <p>
            {
              description
            }
          </p>
        </div>
      </div>

      <div className="information-card">
        <div className="info-icon">
          ✦
        </div>

        <div>
          <h3>
            {
              title
            }
          </h3>

          <p>
            This section is connected to your PrepCore workspace.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App




