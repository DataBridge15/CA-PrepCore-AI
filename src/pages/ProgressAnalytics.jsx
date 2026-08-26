import {
  useEffect,
  useMemo,
  useState,
} from 'react'

function getPlannerKey(user) {
  return `prepcore_study_planner_${
    user?.uid || 'guest'
  }`
}

function getTodayKey() {
  const date = new Date()

  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')
  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(dateString) {
  if (!dateString) {
    return ''
  }

  const date = new Date(
    `${dateString}T00:00:00`,
  )

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
    },
  )
}

function getProgressTone(progress) {
  if (progress >= 80) {
    return 'excellent'
  }

  if (progress >= 50) {
    return 'good'
  }

  if (progress > 0) {
    return 'building'
  }

  return 'not-started'
}

export default function ProgressAnalytics({
  user,
  subjects,
}) {
  const [
    plannerSessions,
    setPlannerSessions,
  ] = useState([])

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          getPlannerKey(user),
        )

      if (!saved) {
        setPlannerSessions([])
        return
      }

      const parsed =
        JSON.parse(saved)

      setPlannerSessions(
        Array.isArray(parsed)
          ? parsed
          : [],
      )
    } catch (error) {
      console.error(
        'ANALYTICS PLANNER LOAD ERROR:',
        error,
      )

      setPlannerSessions([])
    }
  }, [user])

  const totalChapters =
    subjects.reduce(
      (total, subject) =>
        total +
        subject.chapterList.length,
      0,
    )

  const completedChapters =
    subjects.reduce(
      (total, subject) =>
        total +
        subject.progressCount,
      0,
    )

  const overallProgress =
    totalChapters === 0
      ? 0
      : Math.round(
          (completedChapters /
            totalChapters) *
            100,
        )

  const today =
    getTodayKey()

  const todaySessions =
    plannerSessions.filter(
      (session) =>
        session.date ===
        today,
    )

  const completedPlanner =
    plannerSessions.filter(
      (session) =>
        session.completed,
    )

  const upcomingPlanner =
    plannerSessions.filter(
      (session) =>
        !session.completed &&
        session.date > today,
    )

  const totalStudyMinutes =
    plannerSessions.reduce(
      (total, session) =>
        total +
        (Number(
          session.duration,
        ) || 0),
      0,
    )

  const completedStudyMinutes =
    completedPlanner.reduce(
      (total, session) =>
        total +
        (Number(
          session.duration,
        ) || 0),
      0,
    )

  const studyHours =
    Math.round(
      (totalStudyMinutes /
        60) *
        10,
    ) / 10

  const completedStudyHours =
    Math.round(
      (completedStudyMinutes /
        60) *
        10,
    ) / 10

  const strongestSubject =
    [...subjects].sort(
      (a, b) =>
        b.progress -
        a.progress,
    )[0] || null

  const weakestSubjects =
    [...subjects]
      .sort(
        (a, b) =>
          a.progress -
          b.progress,
      )
      .slice(
        0,
        3,
      )

  const recentCompleted =
    useMemo(() => {
      const result = []

      subjects.forEach(
        (subject) => {
          subject.completedChapters.forEach(
            (chapter) => {
              result.push({
                subject:
                  subject.name,
                short:
                  subject.short,
                color:
                  subject.color,
                chapter,
              })
            },
          )
        },
      )

      return result.slice(
        -6,
      ).reverse()
    }, [subjects])

  return (
    <div className="page">
      {/* PAGE HEADER */}
      <div
        style={{
          display:
            'flex',
          justifyContent:
            'space-between',
          alignItems:
            'flex-end',
          gap:
            '24px',
          flexWrap:
            'wrap',
          marginBottom:
            '24px',
        }}
      >
        <div>
          <p className="eyebrow">
            PERFORMANCE INTELLIGENCE
          </p>

          <h2
            style={{
              margin:
                '6px 0 7px',
            }}
          >
            Progress Analytics
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
            A complete view of your CA preparation performance.
          </p>
        </div>

        <div
          style={{
            padding:
              '10px 13px',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '10px',
            background:
              '#ffffff',
            color:
              '#58738f',
            fontSize:
              '11px',
            fontWeight:
              800,
          }}
        >
          LIVE ANALYTICS
        </div>
      </div>

      {/* TOP ANALYTICS */}
      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1.15fr 1fr 1fr',
          gap:
            '14px',
          marginBottom:
            '14px',
        }}
      >
        <OverallProgressCard
          progress={
            overallProgress
          }
          completed={
            completedChapters
          }
          total={
            totalChapters
          }
        />

        <MetricCard
          icon="◷"
          eyebrow="STUDY PLANNER"
          title="Study Time Planned"
          value={`${studyHours}h`}
          detail={`${plannerSessions.length} sessions created`}
        />

        <MetricCard
          icon="✓"
          eyebrow="SESSION COMPLETION"
          title="Completed Study Time"
          value={`${completedStudyHours}h`}
          detail={`${completedPlanner.length} sessions completed`}
        />
      </div>

      {/* SUBJECT PERFORMANCE */}
      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1.55fr 1fr',
          gap:
            '14px',
          marginBottom:
            '14px',
        }}
      >
        <div
          style={cardStyle}
        >
          <div
            style={
              sectionHeaderStyle
            }
          >
            <div>
              <p className="eyebrow">
                SUBJECT PERFORMANCE
              </p>

              <h3
                style={{
                  margin:
                    '5px 0 0',
                }}
              >
                Syllabus Progress
              </h3>
            </div>

            {strongestSubject && (
              <span
                style={{
                  padding:
                    '7px 10px',
                  borderRadius:
                    '999px',
                  background:
                    '#eef8f4',
                  color:
                    '#167254',
                  fontSize:
                    '10px',
                  fontWeight:
                    800,
                }}
              >
                Strongest: {strongestSubject.short}
              </span>
            )}
          </div>

          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap:
                '14px',
              marginTop:
                '20px',
            }}
          >
            {subjects.map(
              (subject) => (
                <SubjectAnalyticsRow
                  key={
                    subject.id
                  }
                  subject={
                    subject
                  }
                />
              ),
            )}
          </div>
        </div>

        <WeakAreasCard
          subjects={
            subjects
          }
          weakestSubjects={
            weakestSubjects
          }
        />
      </div>

      {/* LOWER ANALYTICS */}
      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap:
            '14px',
        }}
      >
        <div
          style={
            cardStyle
          }
        >
          <div
            style={
              sectionHeaderStyle
            }
          >
            <div>
              <p className="eyebrow">
                PRACTICE PERFORMANCE
              </p>

              <h3
                style={{
                  margin:
                    '5px 0 0',
                }}
              >
                MCQ Analytics
              </h3>
            </div>

            <span
              style={{
                padding:
                  '6px 9px',
                borderRadius:
                  '8px',
                background:
                  '#f5f8fb',
                color:
                  '#7890aa',
                fontSize:
                  '10px',
                fontWeight:
                  800,
              }}
            >
              QUIZ DATA
            </span>
          </div>

          <div
            style={{
              marginTop:
                '20px',
              padding:
                '20px',
              borderRadius:
                '15px',
              background:
                'linear-gradient(135deg,#f7faff,#eef5fc)',
              border:
                '1px solid #e2ebf4',
              textAlign:
                'center',
            }}
          >
            <div
              style={{
                width:
                  '74px',
                height:
                  '74px',
                margin:
                  '0 auto 12px',
                display:
                  'grid',
                placeItems:
                  'center',
                borderRadius:
                  '50%',
                background:
                  '#ffffff',
                border:
                  '6px solid #dce9f6',
                color:
                  '#1d4f83',
                fontSize:
                  '20px',
                fontWeight:
                  900,
              }}
            >
              —
            </div>

            <strong
              style={{
                display:
                  'block',
                color:
                  '#153c63',
                fontSize:
                  '15px',
              }}
            >
              No quiz data yet
            </strong>

            <p
              style={{
                margin:
                  '7px auto 0',
                maxWidth:
                  '320px',
                color:
                  '#7890aa',
                fontSize:
                  '11px',
                lineHeight:
                  1.6,
              }}
            >
              Quiz scores and accuracy will appear here once
              practice results are connected to analytics.
            </p>
          </div>
        </div>

        <div
          style={
            cardStyle
          }
        >
          <div
            style={
              sectionHeaderStyle
            }
          >
            <div>
              <p className="eyebrow">
                STUDY PLANNER
              </p>

              <h3
                style={{
                  margin:
                    '5px 0 0',
                }}
              >
                Planning Snapshot
              </h3>
            </div>
          </div>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(3,1fr)',
              gap:
                '10px',
              marginTop:
                '20px',
            }}
          >
            <SmallPlannerMetric
              label="Today"
              value={
                todaySessions.length
              }
            />

            <SmallPlannerMetric
              label="Upcoming"
              value={
                upcomingPlanner.length
              }
            />

            <SmallPlannerMetric
              label="Done"
              value={
                completedPlanner.length
              }
            />
          </div>

          <div
            style={{
              marginTop:
                '18px',
              height:
                '8px',
              borderRadius:
                '999px',
              background:
                '#e8eef5',
              overflow:
                'hidden',
            }}
          >
            <div
              style={{
                width:
                  plannerSessions.length ===
                  0
                    ? '0%'
                    : `${
                        Math.round(
                          (completedPlanner.length /
                            plannerSessions.length) *
                            100,
                        )
                      }%`,
                height:
                  '100%',
                borderRadius:
                  '999px',
                background:
                  'linear-gradient(90deg,#1d4f83,#57a4ef)',
              }}
            />
          </div>

          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              marginTop:
                '9px',
              color:
                '#8195aa',
              fontSize:
                '10px',
            }}
          >
            <span>
              Session completion
            </span>

            <strong
              style={{
                color:
                  '#1d4f83',
              }}
            >
              {plannerSessions.length ===
              0
                ? 0
                : Math.round(
                    (completedPlanner.length /
                      plannerSessions.length) *
                      100,
                  )}
              %
            </strong>
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        style={{
          ...cardStyle,
          marginTop:
            '14px',
        }}
      >
        <div
          style={
            sectionHeaderStyle
          }
        >
          <div>
            <p className="eyebrow">
              RECENT ACTIVITY
            </p>

            <h3
              style={{
                margin:
                  '5px 0 0',
              }}
            >
              Completed Chapters
            </h3>
          </div>

          <span
            style={{
              color:
                '#7890aa',
              fontSize:
                '11px',
            }}
          >
            Latest 6
          </span>
        </div>

        {recentCompleted.length ===
        0 ? (
          <div
            style={{
              marginTop:
                '18px',
              padding:
                '28px 15px',
              borderRadius:
                '13px',
              background:
                '#f8fbfd',
              textAlign:
                'center',
              color:
                '#7c91a8',
              fontSize:
                '12px',
            }}
          >
            No completed chapters yet.
          </div>
        ) : (
          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(2,1fr)',
              gap:
                '9px',
                marginTop:
                '18px',
            }}
          >
            {recentCompleted.map(
              (
                item,
                index,
              ) => (
                <div
                  key={`${item.subject}-${item.chapter}-${index}`}
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      '12px',
                    padding:
                      '12px',
                    border:
                      '1px solid #e5edf4',
                    borderRadius:
                      '12px',
                    background:
                      '#ffffff',
                  }}
                >
                  <div
                    className={`subject-symbol ${item.color}`}
                    style={{
                      width:
                        '38px',
                      height:
                        '38px',
                      flexShrink:
                        0,
                    }}
                  >
                    {
                      item.short
                    }
                  </div>

                  <div
                    style={{
                      minWidth:
                        0,
                    }}
                  >
                    <strong
                      style={{
                        display:
                          'block',
                        color:
                          '#173d63',
                        fontSize:
                          '12px',
                      }}
                    >
                      {
                        item.chapter
                      }
                    </strong>

                    <span
                      style={{
                        display:
                          'block',
                        marginTop:
                          '3px',
                        color:
                          '#8095aa',
                        fontSize:
                          '10px',
                      }}
                    >
                      {
                        item.subject
                      }
                    </span>
                  </div>

                  <span
                    style={{
                      marginLeft:
                        'auto',
                      width:
                        '23px',
                      height:
                        '23px',
                      borderRadius:
                        '50%',
                      display:
                        'grid',
                      placeItems:
                        'center',
                      background:
                        '#e8f7f0',
                      color:
                        '#16805a',
                      fontSize:
                        '11px',
                      fontWeight:
                        900,
                    }}
                  >
                    ✓
                  </span>
                </div>
              ),
            )}
          </div>
        )}
      </div>

      <style>{`
        /* =========================================================
           PROGRESS ANALYTICS — MOBILE RESPONSIVE
        ========================================================= */

        @media (max-width: 768px) and (orientation: portrait) {
          .page {
            width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }

          /* Page heading */
          .page > div:first-child {
            gap: 12px !important;
            margin-bottom: 18px !important;
            align-items: flex-start !important;
          }

          .page > div:first-child > div:first-child {
            min-width: 0;
            width: 100%;
          }

          .page > div:first-child h2 {
            font-size: 22px !important;
            line-height: 1.2 !important;
          }

          .page > div:first-child p:last-child {
            font-size: 11px !important;
            line-height: 1.5 !important;
          }

          /* Top analytics: stack all cards */
          .page > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          /* Subject performance + weak areas */
          .page > div:nth-child(3) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          /* Lower analytics */
          .page > div:nth-child(4) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          /* Cards */
          .page [style*="padding: 22px"] {
            padding: 16px !important;
            border-radius: 15px !important;
          }

          /* Overall readiness card */
          .page > div:nth-child(2) > div:first-child {
            padding: 18px !important;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 14px !important;
          }

          .page > div:nth-child(2) > div:first-child svg {
            max-width: 132px !important;
            max-height: 132px !important;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) > div:first-child {
            width: 132px !important;
            height: 132px !important;
          }

          .page > div:nth-child(2) > div:first-child h3 {
            font-size: 17px !important;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) > div:last-child {
            width: 100%;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) > div:last-child > div {
            justify-content: center !important;
          }

          /* Metric cards */
          .page > div:nth-child(2) > div:not(:first-child) {
            min-height: 0 !important;
          }

          /* Section headers */
          .page [style*="justify-content: space-between"] {
            flex-wrap: wrap !important;
          }

          /* Planner metrics */
          .page > div:nth-child(4) > div:last-child > div:nth-child(2) {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 7px !important;
          }

          .page > div:nth-child(4) > div:last-child > div:nth-child(2) > div {
            padding: 11px !important;
          }

          /* Recent activity: one column on narrow screens */
          .page > div:nth-child(5) > div:last-child {
            grid-template-columns: 1fr !important;
          }

          /* Long chapter / subject names */
          .page strong,
          .page span,
          .page p {
            overflow-wrap: anywhere;
            word-break: break-word;
          }
        }

        @media (max-width: 420px) and (orientation: portrait) {
          .page > div:first-child h2 {
            font-size: 20px !important;
          }

          .page > div:first-child > div:last-child {
            width: 100%;
            text-align: center;
          }

          .page > div:first-child > div:last-child {
            padding: 9px 11px !important;
          }

          .page [style*="padding: 22px"] {
            padding: 14px !important;
          }

          .page > div:nth-child(2) > div:first-child {
            padding: 15px !important;
          }

          .page > div:nth-child(2) > div:first-child svg {
            max-width: 118px !important;
            max-height: 118px !important;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) > div:first-child {
            width: 118px !important;
            height: 118px !important;
          }

          .page > div:nth-child(2) > div:first-child > div:nth-child(2) > div:last-child h3 {
            font-size: 16px !important;
          }

          .page > div:nth-child(4) > div:last-child > div:nth-child(2) {
            gap: 5px !important;
          }

          .page > div:nth-child(4) > div:last-child > div:nth-child(2) > div {
            padding: 9px !important;
          }

          .page > div:nth-child(4) > div:last-child > div:nth-child(2) strong {
            font-size: 18px !important;
          }
        }
      `}</style>
    </div>
  )
}

function OverallProgressCard({
  progress,
  completed,
  total,
}) {
  const radius = 66
  const circumference =
    2 *
    Math.PI *
    radius

  const offset =
    circumference -
    (progress /
      100) *
      circumference

  return (
    <div
      style={{
        ...cardStyle,
        background:
          'linear-gradient(135deg,#071f3c,#123e6a)',
        color:
          '#ffffff',
        overflow:
          'hidden',
        position:
          'relative',
      }}
    >
      <div
        style={{
          position:
            'absolute',
          width:
            '180px',
          height:
            '180px',
          borderRadius:
            '50%',
          right:
            '-95px',
          top:
            '-90px',
          border:
            '1px solid rgba(255,255,255,.10)',
        }}
      />

      <div
        style={{
          position:
            'relative',
          zIndex:
            1,
        }}
      >
        <p
          style={{
            margin:
              0,
            color:
              '#91b8d9',
            fontSize:
              '10px',
            fontWeight:
              800,
            letterSpacing:
              '.14em',
          }}
        >
          OVERALL READINESS
        </p>

        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap:
              '22px',
            marginTop:
              '18px',
          }}
        >
          <div
            style={{
              position:
                'relative',
              width:
                '156px',
              height:
                '156px',
              flexShrink:
                0,
            }}
          >
            <svg
              width="156"
              height="156"
              viewBox="0 0 156 156"
              style={{
                transform:
                  'rotate(-90deg)',
              }}
            >
              <circle
                cx="78"
                cy="78"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,.10)"
                strokeWidth="12"
              />

              <circle
                cx="78"
                cy="78"
                r={radius}
                fill="none"
                stroke="#69b4ff"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={
                  circumference
                }
                strokeDashoffset={
                  offset
                }
              />
            </svg>

            <div
              style={{
                position:
                  'absolute',
                inset:
                  0,
                display:
                  'grid',
                placeItems:
                  'center',
                textAlign:
                  'center',
              }}
            >
              <div>
                <strong
                  style={{
                    display:
                      'block',
                    fontSize:
                      '34px',
                    lineHeight:
                      1,
                    color:
                      '#ffffff',
                  }}
                >
                  {progress}%
                </strong>

                <span
                  style={{
                    display:
                      'block',
                    marginTop:
                      '6px',
                    color:
                      '#93b5d3',
                    fontSize:
                      '10px',
                  }}
                >
                  COMPLETE
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3
              style={{
                margin:
                  '0 0 6px',
                color:
                  '#ffffff',
                fontSize:
                  '20px',
              }}
            >
              Keep building momentum.
            </h3>

            <p
              style={{
                margin:
                  0,
                color:
                  '#aac4dc',
                fontSize:
                  '11px',
                lineHeight:
                  1.6,
              }}
            >
              {completed} of {total}{' '}
              syllabus chapters completed.
            </p>

            <div
              style={{
                display:
                  'flex',
                gap:
                  '18px',
                marginTop:
                  '17px',
              }}
            >
              <MiniDarkStat
                label="Completed"
                value={
                  completed
                }
              />

              <MiniDarkStat
                label="Remaining"
                value={
                  Math.max(
                    total -
                      completed,
                    0,
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniDarkStat({
  label,
  value,
}) {
  return (
    <div>
      <strong
        style={{
          display:
            'block',
          color:
            '#ffffff',
          fontSize:
            '20px',
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color:
            '#8eafcd',
          fontSize:
            '9px',
          textTransform:
            'uppercase',
          letterSpacing:
            '.08em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function MetricCard({
  icon,
  eyebrow,
  title,
  value,
  detail,
}) {
  return (
    <div
      style={
        cardStyle
      }
    >
      <div
        style={{
          display:
            'flex',
          justifyContent:
            'space-between',
          alignItems:
            'flex-start',
        }}
      >
        <div>
          <p className="eyebrow">
            {eyebrow}
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
              fontSize:
                '15px',
              color:
                '#163d63',
            }}
          >
            {title}
          </h3>
        </div>

        <div
          style={{
            width:
              '37px',
            height:
              '37px',
            display:
              'grid',
            placeItems:
              'center',
            borderRadius:
              '10px',
            background:
              '#edf4fb',
            color:
              '#1d4f83',
            fontWeight:
              900,
          }}
        >
          {icon}
        </div>
      </div>

      <strong
        style={{
          display:
            'block',
          marginTop:
            '24px',
          fontSize:
            '31px',
          color:
            '#09294f',
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display:
            'block',
          marginTop:
            '5px',
          color:
            '#7e93a8',
          fontSize:
            '10px',
        }}
      >
        {detail}
      </span>
    </div>
  )
}

function SubjectAnalyticsRow({
  subject,
}) {
  const tone =
    getProgressTone(
      subject.progress,
    )

  const toneLabel =
    tone ===
    'excellent'
      ? 'Strong'
      : tone ===
          'good'
        ? 'On Track'
        : tone ===
            'building'
          ? 'Building'
          : 'Not Started'

  return (
    <div>
      <div
        style={{
          display:
            'flex',
          alignItems:
            'center',
          gap:
            '11px',
          marginBottom:
            '8px',
        }}
      >
        <div
          className={`subject-symbol ${subject.color}`}
          style={{
            width:
              '37px',
            height:
              '37px',
            flexShrink:
              0,
          }}
        >
          {
            subject.short
          }
        </div>

        <div
          style={{
            flex:
              1,
            minWidth:
              0,
          }}
        >
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              gap:
                '10px',
            }}
          >
            <strong
              style={{
                color:
                  '#173c61',
                fontSize:
                  '12px',
              }}
            >
              {subject.name}
            </strong>

            <strong
              style={{
                color:
                  '#1d4f83',
                fontSize:
                  '12px',
              }}
            >
              {subject.progress}%
            </strong>
          </div>

          <span
            style={{
              display:
                'block',
              marginTop:
                '3px',
              color:
                '#8296aa',
              fontSize:
                '10px',
            }}
          >
            {subject.progressCount} /{' '}
            {
              subject.chapterList
                .length
            }{' '}
            chapters · {toneLabel}
          </span>
        </div>
      </div>

      <div
        style={{
          height:
            '7px',
          borderRadius:
            '999px',
          background:
            '#edf2f6',
          overflow:
            'hidden',
        }}
      >
        <div
          style={{
            width:
              `${subject.progress}%`,
            height:
              '100%',
            borderRadius:
              '999px',
            background:
              subject.progress >=
              80
                ? '#45b98a'
                : subject.progress >=
                    50
                  ? '#3d8bca'
                  : subject.progress >
                      0
                    ? '#e0a14a'
                    : '#d7e0e8',
          }}
        />
      </div>
    </div>
  )
}

function WeakAreasCard({
  subjects,
  weakestSubjects,
}) {
  return (
    <div
      style={{
        ...cardStyle,
        background:
          'linear-gradient(180deg,#ffffff,#fbfcfe)',
      }}
    >
      <div
        style={
          sectionHeaderStyle
        }
      >
        <div>
          <p className="eyebrow">
            FOCUS AREAS
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
            }}
          >
            Areas to Improve
          </h3>
        </div>

        <span
          style={{
            fontSize:
              '18px',
            color:
              '#d49345',
          }}
        >
          ◆
        </span>
      </div>

      <div
        style={{
          marginTop:
            '18px',
          display:
            'flex',
          flexDirection:
            'column',
          gap:
            '11px',
        }}
      >
        {weakestSubjects.map(
          (
            subject,
            index,
          ) => (
            <div
              key={
                subject.id
              }
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap:
                  '10px',
                padding:
                  '11px',
                border:
                  '1px solid #e7edf3',
                borderRadius:
                  '11px',
                background:
                  '#ffffff',
              }}
            >
              <span
                style={{
                  width:
                    '23px',
                  height:
                    '23px',
                  display:
                    'grid',
                  placeItems:
                    'center',
                  borderRadius:
                    '7px',
                  background:
                    '#f8f0e7',
                  color:
                    '#b8752b',
                  fontSize:
                    '9px',
                  fontWeight:
                    900,
                }}
              >
                0{index + 1}
              </span>

              <div
                className={`subject-symbol ${subject.color}`}
                style={{
                  width:
                    '34px',
                  height:
                    '34px',
                }}
              >
                {
                  subject.short
                }
              </div>

              <div
                style={{
                  flex:
                    1,
                }}
              >
                <strong
                  style={{
                    display:
                      'block',
                    color:
                      '#173c61',
                    fontSize:
                      '11px',
                  }}
                >
                  {
                    subject.name
                  }
                </strong>

                <span
                  style={{
                    display:
                      'block',
                    marginTop:
                      '3px',
                    color:
                      '#8598ab',
                    fontSize:
                      '9px',
                  }}
                >
                  {
                    subject.progressCount
                  }{' '}
                  of{' '}
                  {
                    subject.chapterList
                      .length
                  }{' '}
                  chapters completed
                </span>
              </div>

              <strong
                style={{
                  color:
                    '#b8752b',
                  fontSize:
                    '12px',
                }}
              >
                {subject.progress}%
              </strong>
            </div>
          ),
        )}

        {subjects.length ===
          0 && (
          <p
            style={{
              color:
                '#7f93a8',
              fontSize:
                '11px',
            }}
          >
            No subject data available.
          </p>
        )}
      </div>

      <div
        style={{
          marginTop:
            '15px',
          padding:
            '11px',
          borderRadius:
            '10px',
          background:
            '#fff9f1',
          border:
            '1px solid #f0dfc9',
          color:
            '#9a692f',
          fontSize:
            '10px',
          lineHeight:
            1.5,
        }}
      >
        These areas are automatically ranked using current
        syllabus completion.
      </div>
    </div>
  )
}

function SmallPlannerMetric({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '14px',
        border:
          '1px solid #e5edf4',
        borderRadius:
          '12px',
        background:
          '#f8fbfd',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#8296aa',
          fontSize:
            '9px',
          fontWeight:
            800,
          letterSpacing:
            '.08em',
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display:
            'block',
          marginTop:
            '5px',
          color:
            '#153c62',
          fontSize:
            '21px',
        }}
      >
        {value}
      </strong>
    </div>
  )
}

const cardStyle = {
  padding:
    '22px',
  background:
    '#ffffff',
  border:
    '1px solid #dce6f0',
  borderRadius:
    '18px',
  boxShadow:
    '0 8px 25px rgba(20,50,80,.045)',
}

const sectionHeaderStyle = {
  display:
    'flex',
  justifyContent:
    'space-between',
  alignItems:
    'flex-start',
  gap:
    '12px',
}
