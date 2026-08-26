import {
  useEffect,
  useMemo,
  useState,
} from 'react'

function getStorageKey(user) {
  return `prepcore_study_planner_${
    user?.uid || 'guest'
  }`
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`
}

function formatDate(dateString) {
  if (!dateString) {
    return ''
  }

  const date =
    new Date(
      `${dateString}T00:00:00`,
    )

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}

function isToday(dateString) {
  if (!dateString) {
    return false
  }

  const today =
    new Date()

  const local =
    new Date(
      `${dateString}T00:00:00`,
    )

  return (
    today.getFullYear() ===
      local.getFullYear() &&
    today.getMonth() ===
      local.getMonth() &&
    today.getDate() ===
      local.getDate()
  )
}

function isUpcoming(dateString) {
  if (!dateString) {
    return false
  }

  const today =
    new Date()

  const selected =
    new Date(
      `${dateString}T00:00:00`,
    )

  today.setHours(
    0,
    0,
    0,
    0,
  )

  return selected > today
}

function getTodayInputValue() {
  const today =
    new Date()

  const year =
    today.getFullYear()

  const month =
    String(
      today.getMonth() +
        1,
    ).padStart(2, '0')

  const day =
    String(
      today.getDate(),
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export default function StudyPlanner({
  user,
  subjects,
}) {
  const storageKey =
    getStorageKey(user)

  const [
    sessions,
    setSessions,
  ] = useState([])

  const [
    showForm,
    setShowForm,
  ] = useState(false)

  const [
    activeFilter,
    setActiveFilter,
  ] = useState('today')

  const [
    form,
    setForm,
  ] = useState({
    title: '',
    subjectId: '',
    chapter: '',
    date:
      getTodayInputValue(),
    duration: '60',
  })

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          storageKey,
        )

      if (saved) {
        const parsed =
          JSON.parse(
            saved,
          )

        if (
          Array.isArray(
            parsed,
          )
        ) {
          setSessions(parsed)
        }
      }
    } catch (error) {
      console.error(
        'PLANNER LOAD ERROR:',
        error,
      )

      setSessions([])
    }
  }, [
    storageKey,
  ])

  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify(
          sessions,
        ),
      )
    } catch (error) {
      console.error(
        'PLANNER SAVE ERROR:',
        error,
      )
    }
  }, [
    sessions,
    storageKey,
  ])

  const selectedSubject =
    subjects.find(
      (subject) =>
        subject.id ===
        form.subjectId,
    )

  const availableChapters =
    selectedSubject
      ?.chapterList ||
    selectedSubject
      ?.chapters
      ?.split(' / ')
      .filter(Boolean) ||
    []

  const filteredSessions =
    useMemo(() => {
      if (
        activeFilter ===
        'completed'
      ) {
        return sessions.filter(
          (session) =>
            session.completed,
        )
      }

      if (
        activeFilter ===
        'upcoming'
      ) {
        return sessions
          .filter(
            (session) =>
              !session.completed &&
              isUpcoming(
                session.date,
              ),
          )
          .sort(
            (a, b) =>
              a.date.localeCompare(
                b.date,
              ),
          )
      }

      if (
        activeFilter ===
        'all'
      ) {
        return [
          ...sessions,
        ].sort(
          (a, b) => {
            if (
              a.completed !==
              b.completed
            ) {
              return a.completed
                ? 1
                : -1
            }

            return a.date.localeCompare(
              b.date,
            )
          },
        )
      }

      return sessions
        .filter(
          (session) =>
            !session.completed &&
            isToday(
              session.date,
            ),
        )
        .sort(
          (a, b) =>
            a.createdAt -
            b.createdAt,
        )
    }, [
      sessions,
      activeFilter,
    ])

  const todayCount =
    sessions.filter(
      (session) =>
        !session.completed &&
        isToday(
          session.date,
        ),
    ).length

  const upcomingCount =
    sessions.filter(
      (session) =>
        !session.completed &&
        isUpcoming(
          session.date,
        ),
    ).length

  const completedCount =
    sessions.filter(
      (session) =>
        session.completed,
    ).length

  const resetForm =
    () => {
      setForm({
        title: '',
        subjectId: '',
        chapter: '',
        date:
          getTodayInputValue(),
        duration: '60',
      })
    }

  const handleSubjectChange =
    (subjectId) => {
      setForm(
        (previous) => ({
          ...previous,
          subjectId,
          chapter:
            '',
        }),
      )
    }

  const handleAddSession =
    (event) => {
      event.preventDefault()

      const cleanTitle =
        form.title.trim()

      if (
        !cleanTitle ||
        !form.subjectId ||
        !form.chapter ||
        !form.date
      ) {
        return
      }

      const subject =
        subjects.find(
          (item) =>
            item.id ===
            form.subjectId,
        )

      const newSession =
        {
          id:
            createId(),

          title:
            cleanTitle,

          subjectId:
            form.subjectId,

          subjectName:
            subject?.name ||
            'Subject',

          subjectShort:
            subject?.short ||
            'CA',

          subjectColor:
            subject?.color ||
            '',

          chapter:
            form.chapter,

          date:
            form.date,

          duration:
            Number(
              form.duration,
            ) || 60,

          completed:
            false,

          createdAt:
            Date.now(),
        }

      setSessions(
        (previous) => [
          ...previous,
          newSession,
        ],
      )

      resetForm()
      setShowForm(false)
      setActiveFilter(
        isToday(
          form.date,
        )
          ? 'today'
          : 'upcoming',
      )
    }

  const toggleComplete =
    (id) => {
      setSessions(
        (previous) =>
          previous.map(
            (session) =>
              session.id ===
              id
                ? {
                    ...session,
                    completed:
                      !session.completed,
                  }
                : session,
          ),
      )
    }

  const deleteSession =
    (id) => {
      setSessions(
        (previous) =>
          previous.filter(
            (session) =>
              session.id !==
              id,
          ),
      )
    }

  return (
    <div className="page">
      {/* HEADER */}
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
            '24px',
        }}
      >
        <div>
          <p className="eyebrow">
            SMART PLANNING
          </p>

          <h2
            style={{
              margin:
                '6px 0 7px',
            }}
          >
            Study Planner
          </h2>

          <p
            style={{
              margin:
                0,
              color:
                '#7087a0',
              fontSize:
                '14px',
            }}
          >
            Organise your CA preparation into focused study sessions.
          </p>
        </div>

        <button
          className="primary-button"
          type="button"
          onClick={() =>
            setShowForm(true)
          }
        >
          + Add Study Session
        </button>
      </div>

      {/* HERO SUMMARY */}
      <div
        style={{
          position:
            'relative',
          overflow:
            'hidden',
          padding:
            '24px 26px',
          marginBottom:
            '18px',
          borderRadius:
            '20px',
          background:
            'linear-gradient(135deg,#071f3c,#123f6b,#1d5a8f)',
          color:
            '#fff',
          boxShadow:
            '0 16px 40px rgba(8,35,64,.14)',
        }}
      >
        <div
          style={{
            position:
              'absolute',
            width:
              '190px',
            height:
              '190px',
            right:
              '-80px',
            top:
              '-95px',
            borderRadius:
              '50%',
            border:
              '1px solid rgba(255,255,255,.12)',
          }}
        />

        <div
          style={{
            position:
              'relative',
            zIndex:
              1,
            display:
              'grid',
            gridTemplateColumns:
              '1.4fr repeat(3,1fr)',
            gap:
              '14px',
            alignItems:
              'center',
          }}
        >
          <div>
            <span
              style={{
                color:
                  '#95b9da',
                fontSize:
                  '10px',
                fontWeight:
                  800,
                letterSpacing:
                  '.15em',
              }}
            >
              YOUR STUDY COMMAND CENTER
            </span>

            <h3
              style={{
                margin:
                  '8px 0 5px',
                color:
                  '#fff',
                fontSize:
                  '21px',
              }}
            >
              Stay consistent. Stay exam-ready.
            </h3>

            <p
              style={{
                margin:
                  0,
                color:
                  '#abc3da',
                fontSize:
                  '12px',
              }}
            >
              Plan focused sessions and track what you complete.
            </p>
          </div>

          <PlannerStat
            label="Today"
            value={
              todayCount
            }
          />

          <PlannerStat
            label="Upcoming"
            value={
              upcomingCount
            }
          />

          <PlannerStat
            label="Completed"
            value={
              completedCount
            }
          />
        </div>
      </div>

      {/* FILTER TABS */}
      <div
        style={{
          display:
            'flex',
          alignItems:
            'center',
          justifyContent:
            'space-between',
          gap:
            '12px',
          marginBottom:
            '15px',
          flexWrap:
            'wrap',
        }}
      >
        <div
          style={{
            display:
              'flex',
            gap:
              '8px',
            flexWrap:
              'wrap',
          }}
        >
          <PlannerFilter
            label={`Today ${todayCount}`}
            active={
              activeFilter ===
              'today'
            }
            onClick={() =>
              setActiveFilter(
                'today',
              )
            }
          />

          <PlannerFilter
            label={`Upcoming ${upcomingCount}`}
            active={
              activeFilter ===
              'upcoming'
            }
            onClick={() =>
              setActiveFilter(
                'upcoming',
              )
            }
          />

          <PlannerFilter
            label={`Completed ${completedCount}`}
            active={
              activeFilter ===
              'completed'
            }
            onClick={() =>
              setActiveFilter(
                'completed',
              )
            }
          />

          <PlannerFilter
            label={`All ${sessions.length}`}
            active={
              activeFilter ===
              'all'
            }
            onClick={() =>
              setActiveFilter(
                'all',
              )
            }
          />
        </div>

        <span
          style={{
            color:
              '#8195aa',
            fontSize:
              '11px',
          }}
        >
          Saved automatically on this device
        </span>
      </div>

      {/* SESSION LIST */}
      {filteredSessions.length ===
      0 ? (
        <EmptyPlanner
          filter={
            activeFilter
          }
          onAdd={() =>
            setShowForm(
              true,
            )
          }
        />
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
          {filteredSessions.map(
            (session) => (
              <PlannerSessionCard
                key={
                  session.id
                }
                session={
                  session
                }
                onToggle={
                  toggleComplete
                }
                onDelete={
                  deleteSession
                }
              />
            ),
          )}
        </div>
      )}

      {/* ADD SESSION MODAL */}
      {showForm && (
        <div
          style={{
            position:
              'fixed',
            inset:
              0,
            zIndex:
              1000,
            display:
              'grid',
            placeItems:
              'center',
            padding:
              '20px',
            background:
              'rgba(5,24,45,.45)',
            backdropFilter:
              'blur(6px)',
          }}
        >
          <div
            style={{
              width:
                'min(700px, 100%)',
              maxHeight:
                '90vh',
              overflowY:
                'auto',
              background:
                '#fff',
              borderRadius:
                '22px',
              border:
                '1px solid #dbe5ef',
              boxShadow:
                '0 30px 80px rgba(5,29,54,.25)',
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
                padding:
                  '22px 24px',
                borderBottom:
                  '1px solid #edf2f6',
              }}
            >
              <div>
                <span
                  style={{
                    display:
                      'block',
                    color:
                      '#7d92a8',
                    fontSize:
                      '10px',
                    fontWeight:
                      800,
                    letterSpacing:
                      '.13em',
                  }}
                >
                  NEW SESSION
                </span>

                <h3
                  style={{
                    margin:
                      '6px 0 0',
                    color:
                      '#09294f',
                  }}
                >
                  Add Study Session
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  resetForm()
                  setShowForm(
                    false,
                  )
                }}
                style={{
                  width:
                    '36px',
                  height:
                    '36px',
                  border:
                    '1px solid #dce5ed',
                  borderRadius:
                    '9px',
                  background:
                    '#fff',
                  color:
                    '#667f98',
                  cursor:
                    'pointer',
                  fontSize:
                    '18px',
                }}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={
                handleAddSession
              }
            >
              <div
                style={{
                  padding:
                    '24px',
                }}
              >
                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      '15px',
                  }}
                >
                  <PlannerField
                    label="Session Title"
                    full
                  >
                    <input
                      value={
                        form.title
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            title:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      placeholder="e.g. Accounting Standards Revision"
                      required
                    />
                  </PlannerField>

                  <PlannerField label="Subject">
                    <select
                      value={
                        form.subjectId
                      }
                      onChange={(
                        event,
                      ) =>
                        handleSubjectChange(
                          event
                            .target
                            .value,
                        )
                      }
                      required
                    >
                      <option value="">
                        Select subject
                      </option>

                      {subjects.map(
                        (
                          subject,
                        ) => (
                          <option
                            key={
                              subject.id
                            }
                            value={
                              subject.id
                            }
                          >
                            {
                              subject.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </PlannerField>

                  <PlannerField label="Chapter">
                    <select
                      value={
                        form.chapter
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            chapter:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      disabled={
                        !form.subjectId
                      }
                      required
                    >
                      <option value="">
                        {form.subjectId
                          ? 'Select chapter'
                          : 'Select subject first'}
                      </option>

                      {availableChapters.map(
                        (
                          chapter,
                        ) => (
                          <option
                            key={
                              chapter
                            }
                            value={
                              chapter
                            }
                          >
                            {
                              chapter
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </PlannerField>

                  <PlannerField label="Date">
                    <input
                      type="date"
                      value={
                        form.date
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            date:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                      required
                    />
                  </PlannerField>

                  <PlannerField label="Duration">
                    <select
                      value={
                        form.duration
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm(
                          (
                            previous,
                          ) => ({
                            ...previous,
                            duration:
                              event
                                .target
                                .value,
                          }),
                        )
                      }
                    >
                      <option value="30">
                        30 minutes
                      </option>

                      <option value="45">
                        45 minutes
                      </option>

                      <option value="60">
                        1 hour
                      </option>

                      <option value="90">
                        1.5 hours
                      </option>

                      <option value="120">
                        2 hours
                      </option>

                      <option value="180">
                        3 hours
                      </option>
                    </select>
                  </PlannerField>
                </div>

                {selectedSubject && (
                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap:
                        '10px',
                      marginTop:
                        '18px',
                      padding:
                        '13px 15px',
                      borderRadius:
                        '12px',
                      background:
                        '#f6faff',
                      border:
                        '1px solid #e3edf6',
                    }}
                  >
                    <div
                      className={`subject-symbol ${selectedSubject.color}`}
                      style={{
                        width:
                          '36px',
                        height:
                          '36px',
                      }}
                    >
                      {
                        selectedSubject.short
                      }
                    </div>

                    <div>
                      <strong
                        style={{
                          display:
                            'block',
                          color:
                            '#153d64',
                          fontSize:
                            '12px',
                        }}
                      >
                        {
                          selectedSubject.name
                        }
                      </strong>

                      <span
                        style={{
                          color:
                            '#7c91a7',
                          fontSize:
                            '11px',
                        }}
                      >
                        {
                          form.chapter ||
                          'Select a chapter'
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display:
                    'flex',
                  justifyContent:
                    'flex-end',
                  gap:
                    '9px',
                  padding:
                    '18px 24px',
                  borderTop:
                    '1px solid #edf2f6',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    setShowForm(
                      false,
                    )
                  }}
                  className="filter-button"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Save Session →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function PlannerStat({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '15px',
        border:
          '1px solid rgba(255,255,255,.10)',
        borderRadius:
          '13px',
        background:
          'rgba(255,255,255,.06)',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#88afd3',
          fontSize:
            '10px',
          fontWeight:
            800,
          letterSpacing:
            '.1em',
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display:
            'block',
          marginTop:
            '6px',
          color:
            '#fff',
          fontSize:
            '26px',
        }}
      >
        {value}
      </strong>
    </div>
  )
}

function PlannerFilter({
  label,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      style={{
        padding:
          '9px 13px',
        border:
          active
            ? '1px solid #1e568b'
            : '1px solid #dbe4ec',
        borderRadius:
          '9px',
        background:
          active
            ? '#edf5ff'
            : '#fff',
        color:
          active
            ? '#1d4f83'
            : '#667e97',
        fontSize:
          '11px',
        fontWeight:
          800,
        cursor:
          'pointer',
      }}
    >
      {label}
    </button>
  )
}

function PlannerSessionCard({
  session,
  onToggle,
  onDelete,
}) {
  return (
    <div
      style={{
        display:
          'flex',
        alignItems:
          'center',
        gap:
          '15px',
        padding:
          '17px 18px',
        background:
          '#fff',
        border:
          '1px solid #dce6f0',
        borderRadius:
          '15px',
        boxShadow:
          '0 5px 18px rgba(21,54,91,.04)',
        opacity:
          session.completed
            ? 0.72
            : 1,
      }}
    >
      <div
        style={{
          width:
            '43px',
          height:
            '43px',
          flexShrink:
            0,
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
          fontSize:
            '13px',
          fontWeight:
            800,
        }}
      >
        {session.subjectShort}
      </div>

      <div
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
            textDecoration:
              session.completed
                ? 'line-through'
                : 'none',
          }}
        >
          {session.title}
        </strong>

        <span
          style={{
            display:
              'block',
            marginTop:
              '4px',
            color:
              '#7890aa',
            fontSize:
              '11px',
          }}
        >
          {session.subjectName}
          {' · '}
          {session.chapter}
        </span>
      </div>

      <div
        style={{
          minWidth:
            '110px',
          textAlign:
            'right',
        }}
      >
        <strong
          style={{
            display:
              'block',
            color:
              '#173d64',
            fontSize:
              '11px',
          }}
        >
          {formatDate(
            session.date,
          )}
        </strong>

        <span
          style={{
            display:
              'block',
            marginTop:
              '4px',
            color:
              '#8195aa',
            fontSize:
              '10px',
          }}
        >
          {session.duration} min
        </span>
      </div>

      <button
        type="button"
        onClick={() =>
          onToggle(
            session.id,
          )
        }
        title={
          session.completed
            ? 'Mark as pending'
            : 'Mark as completed'
        }
        style={{
          width:
            '34px',
          height:
            '34px',
          borderRadius:
            '9px',
          border:
            session.completed
              ? '1px solid #45b98a'
              : '1px solid #dce5ed',
          background:
            session.completed
              ? '#effbf6'
              : '#fff',
          color:
            session.completed
              ? '#16805a'
              : '#6e879f',
          cursor:
            'pointer',
          fontWeight:
            900,
        }}
      >
        {session.completed
          ? '✓'
          : '○'}
      </button>

      <button
        type="button"
        onClick={() =>
          onDelete(
            session.id,
          )
        }
        title="Delete session"
        style={{
          width:
            '34px',
          height:
            '34px',
          borderRadius:
            '9px',
          border:
            '1px solid #ead8d8',
          background:
            '#fffafa',
          color:
            '#a25b5b',
          cursor:
            'pointer',
          fontSize:
            '15px',
        }}
      >
        ×
      </button>
    </div>
  )
}

function EmptyPlanner({
  filter,
  onAdd,
}) {
  const messages = {
    today:
      'No study sessions planned for today.',
    upcoming:
      'No upcoming study sessions.',
    completed:
      'No completed sessions yet.',
    all:
      'Your study planner is empty.',
  }

  return (
    <div
      style={{
        padding:
          '58px 25px',
        background:
          '#fff',
        border:
          '1px solid #dce6f0',
        borderRadius:
          '18px',
        textAlign:
          'center',
      }}
    >
      <div
        style={{
          width:
            '58px',
          height:
            '58px',
          margin:
            '0 auto 14px',
          display:
            'grid',
          placeItems:
            'center',
          borderRadius:
            '16px',
          background:
            '#edf4fb',
          color:
            '#1d4f83',
          fontSize:
            '24px',
        }}
      >
        ◷
      </div>

      <h3
        style={{
          margin:
            '0 0 7px',
          color:
            '#0a2d55',
        }}
      >
        {messages[
          filter
        ]}
      </h3>

      <p
        style={{
          margin:
            '0 auto 18px',
          maxWidth:
            '420px',
          color:
            '#7890aa',
          fontSize:
            '12px',
          lineHeight:
            1.6,
        }}
      >
        Add focused study sessions and turn your preparation into a clear daily plan.
      </p>

      <button
        className="primary-button"
        type="button"
        onClick={
          onAdd
        }
      >
        + Add Study Session
      </button>
    </div>
  )
}

function PlannerField({
  label,
  children,
  full,
}) {
  return (
    <label
      style={{
        gridColumn:
          full
            ? '1 / -1'
            : undefined,
      }}
    >
      <span
        style={{
          display:
            'block',
          marginBottom:
            '7px',
          color:
            '#274a6d',
          fontSize:
            '11px',
          fontWeight:
            800,
        }}
      >
        {label}
      </span>

      {children}

      <style>
        {`
          label input,
          label select {
            width: 100%;
            min-height: 45px;
            padding: 0 12px;
            border: 1px solid #d9e3ec;
            border-radius: 10px;
            background: #fff;
            color: #173c61;
            font-size: 12px;
            outline: none;
            box-sizing: border-box;
          }

          label input:focus,
          label select:focus {
            border-color: #2c689e;
            box-shadow: 0 0 0 3px rgba(44,104,158,.08);
          }

          label select:disabled {
            background: #f5f8fb;
            cursor: not-allowed;
          }
        `}
      </style>
    </label>
  )
}