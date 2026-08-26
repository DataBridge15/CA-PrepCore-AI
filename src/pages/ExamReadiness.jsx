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

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0')

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getReadinessStatus(score) {
  if (score >= 85) {
    return {
      label: 'Exam Ready',
      description:
        'Your preparation is looking strong across the available metrics.',
      tone: 'ready',
    }
  }

  if (score >= 70) {
    return {
      label: 'On Track',
      description:
        'Your preparation is progressing well. Strengthen weaker areas before the exam.',
      tone: 'track',
    }
  }

  if (score >= 50) {
    return {
      label: 'Building',
      description:
        'You have a foundation, but more practice and revision are needed.',
      tone: 'building',
    }
  }

  return {
    label: 'Needs Focus',
    description:
      'Focus on completing the syllabus and building consistent study habits.',
    tone: 'focus',
  }
}

function getSubjectReadiness(progress) {
  if (progress >= 85) {
    return 'Strong'
  }

  if (progress >= 65) {
    return 'On Track'
  }

  if (progress >= 35) {
    return 'Building'
  }

  return 'Needs Focus'
}

function ScoreRing({
  score,
}) {
  const radius =
    82

  const circumference =
    2 *
    Math.PI *
    radius

  const offset =
    circumference -
    (score /
      100) *
      circumference

  return (
    <div
      style={{
        position:
          'relative',
        width:
          '210px',
        height:
          '210px',
      }}
    >
      <svg
        width="210"
        height="210"
        viewBox="0 0 210 210"
        style={{
          transform:
            'rotate(-90deg)',
        }}
      >
        <circle
          cx="105"
          cy="105"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,.10)"
          strokeWidth="15"
        />

        <circle
          cx="105"
          cy="105"
          r={radius}
          fill="none"
          stroke="#69b4ff"
          strokeWidth="15"
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
              color:
                '#ffffff',
              fontSize:
                '49px',
              lineHeight:
                1,
            }}
          >
            {score}
          </strong>

          <span
            style={{
              display:
                'block',
              marginTop:
                '7px',
              color:
                '#9abbd8',
              fontSize:
                '11px',
              fontWeight:
                800,
              letterSpacing:
                '.12em',
            }}
          >
            READINESS
          </span>
        </div>
      </div>
    </div>
  )
}

function FactorCard({
  icon,
  title,
  weight,
  value,
  status,
  available,
}) {
  return (
    <div
      style={{
        padding:
          '18px',
        border:
          '1px solid #dce6f0',
        borderRadius:
          '15px',
        background:
          '#ffffff',
      }}
    >
      <div
        style={{
          display:
            'flex',
          justifyContent:
            'space-between',
          alignItems:
            'flex-start',
          gap:
            '10px',
        }}
      >
        <div
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
              '#edf4fb',
            color:
              '#1d4f83',
            fontSize:
              '16px',
            fontWeight:
              900,
          }}
        >
          {icon}
        </div>

        <span
          style={{
            padding:
              '6px 8px',
            borderRadius:
              '8px',
            background:
              '#f4f7fa',
            color:
              '#7b90a7',
            fontSize:
              '9px',
            fontWeight:
              800,
          }}
        >
          {weight}%
        </span>
      </div>

      <h3
        style={{
          margin:
            '14px 0 4px',
          color:
            '#173c61',
          fontSize:
            '14px',
        }}
      >
        {title}
      </h3>

      {!available ? (
        <div
          style={{
            marginTop:
              '11px',
            padding:
              '10px',
            borderRadius:
              '10px',
            background:
              '#f8fafc',
            color:
              '#8295aa',
            fontSize:
              '10px',
            lineHeight:
              1.5,
          }}
        >
          Data will appear after quiz
          results are connected.
        </div>
      ) : (
        <>
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'center',
              marginTop:
                '11px',
            }}
          >
            <strong
              style={{
                color:
                  '#09294f',
                fontSize:
                  '21px',
              }}
            >
              {value}%
            </strong>

            <span
              style={{
                color:
                  '#66819c',
                fontSize:
                  '10px',
                fontWeight:
                  800,
              }}
            >
              {status}
            </span>
          </div>

          <div
            style={{
              height:
                '6px',
              marginTop:
                '10px',
              borderRadius:
                '999px',
              background:
                '#e9eff5',
              overflow:
                'hidden',
            }}
          >
            <div
              style={{
                width:
                  `${value}%`,
                height:
                  '100%',
                borderRadius:
                  '999px',
                background:
                  value >= 80
                    ? '#45b98a'
                    : value >= 50
                      ? '#438dca'
                      : '#e0a24e',
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

function SubjectReadinessRow({
  subject,
}) {
  const readiness =
    getSubjectReadiness(
      subject.progress,
    )

  return (
    <div
      style={{
        display:
          'flex',
        alignItems:
          'center',
        gap:
          '12px',
        padding:
          '13px',
        border:
          '1px solid #e5edf4',
        borderRadius:
          '12px',
        background:
          '#ffffff',
      }}
    >
      <div
        className={`subject-symbol ${subject.color}`}
        style={{
          width:
            '39px',
          height:
            '39px',
          flexShrink:
            0,
        }}
      >
        {subject.short}
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

        <div
          style={{
            display:
              'flex',
            alignItems:
              'center',
            gap:
              '8px',
            marginTop:
              '6px',
          }}
        >
          <div
            style={{
              flex:
                1,
              height:
                '6px',
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
                  '#2e77aa',
              }}
            />
          </div>

          <span
            style={{
              minWidth:
                '58px',
              color:
                '#8397aa',
              fontSize:
                '9px',
              textAlign:
                'right',
            }}
          >
            {readiness}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ExamReadiness({
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
        setPlannerSessions(
          [],
        )
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
        'READINESS PLANNER LOAD ERROR:',
        error,
      )

      setPlannerSessions(
        [],
      )
    }
  }, [user])

  const totalChapters =
    subjects.reduce(
      (sum, subject) =>
        sum +
        subject.chapterList.length,
      0,
    )

  const completedChapters =
    subjects.reduce(
      (sum, subject) =>
        sum +
        subject.progressCount,
      0,
    )

  const syllabusScore =
    totalChapters === 0
      ? 0
      : Math.round(
          (completedChapters /
            totalChapters) *
            100,
        )

  const today =
    getTodayKey()

  const completedPlanner =
    plannerSessions.filter(
      (session) =>
        session.completed,
    )

  const plannerScore =
    plannerSessions.length ===
    0
      ? 0
      : Math.round(
          (completedPlanner.length /
            plannerSessions.length) *
            100,
        )

  const revisionCount =
    subjects.reduce(
      (sum, subject) =>
        sum +
        subject.completedChapters
          .length,
      0,
    )

  const revisionScore =
    totalChapters === 0
      ? 0
      : Math.round(
          (revisionCount /
            totalChapters) *
            100,
        )

  /*
   * Quiz results are intentionally not invented.
   * They will become real when quiz persistence
   * is connected later.
   */
  const practiceAvailable =
    false

  const practiceScore = 0

  /*
   * Until quiz persistence exists, readiness is
   * calculated from the currently available
   * preparation signals instead of fake data.
   *
   * Available weights are:
   * syllabus 40
   * revision 20
   * consistency 15
   * practice 25 is unavailable
   *
   * We normalise the available score to 100.
   */
  const readinessScore =
    Math.round(
      (
        syllabusScore *
          40 +
        revisionScore *
          20 +
        plannerScore *
          15
      ) /
        75,
    ) || 0

  const status =
    getReadinessStatus(
      readinessScore,
    )

  const remainingChapters =
    Math.max(
      totalChapters -
        completedChapters,
      0,
    )

  const todaySessions =
    plannerSessions.filter(
      (session) =>
        session.date ===
        today,
    )

  const upcomingSessions =
    plannerSessions.filter(
      (session) =>
        !session.completed &&
        session.date > today,
    )

  const prioritySubjects =
    useMemo(
      () =>
        [...subjects]
          .sort(
            (a, b) =>
              a.progress -
              b.progress,
          )
          .slice(
            0,
            3,
          ),
      [subjects],
    )

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
            EXAM PREPARATION INTELLIGENCE
          </p>

          <h2
            style={{
              margin:
                '6px 0 7px',
            }}
          >
            Exam Readiness
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
            See how prepared you are to actually face the exam.
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
          READINESS ENGINE
        </div>
      </div>

      {/* HERO */}
      <div
        style={{
          position:
            'relative',
          overflow:
            'hidden',
          padding:
            '30px',
          borderRadius:
            '24px',
          background:
            'linear-gradient(135deg,#061d38,#123e6a,#1d5b90)',
          color:
            '#ffffff',
          boxShadow:
            '0 20px 50px rgba(7,34,64,.18)',
          marginBottom:
            '16px',
        }}
      >
        <div
          style={{
            position:
              'absolute',
            width:
              '280px',
            height:
              '280px',
            right:
              '-140px',
            top:
              '-140px',
            borderRadius:
              '50%',
            border:
              '1px solid rgba(255,255,255,.10)',
          }}
        />

        <div
          style={{
            position:
              'relative',
            zIndex:
              2,
            display:
              'grid',
            gridTemplateColumns:
              '250px 1fr',
            alignItems:
              'center',
            gap:
              '30px',
          }}
        >
          <div
            style={{
              display:
                'grid',
              placeItems:
                'center',
            }}
          >
            <ScoreRing
              score={
                readinessScore
              }
            />
          </div>

          <div>
            <span
              style={{
                display:
                  'inline-block',
                padding:
                  '7px 10px',
                borderRadius:
                  '999px',
                background:
                  'rgba(255,255,255,.09)',
                border:
                  '1px solid rgba(255,255,255,.12)',
                color:
                  '#c5dcef',
                fontSize:
                  '10px',
                fontWeight:
                  800,
                letterSpacing:
                  '.10em',
              }}
            >
              {status.label.toUpperCase()}
            </span>

            <h3
              style={{
                margin:
                  '13px 0 7px',
                color:
                  '#ffffff',
                fontSize:
                  '25px',
              }}
            >
              {status.label}
            </h3>

            <p
              style={{
                margin:
                  0,
                maxWidth:
                  '590px',
                color:
                  '#abc4dd',
                fontSize:
                  '13px',
                lineHeight:
                  1.7,
              }}
            >
              {status.description}
            </p>

            <div
              style={{
                display:
                  'flex',
                gap:
                  '25px',
                marginTop:
                  '22px',
                flexWrap:
                  'wrap',
              }}
            >
              <HeroStat
                label="Chapters Remaining"
                value={
                  remainingChapters
                }
              />

              <HeroStat
                label="Completed"
                value={
                  completedChapters
                }
              />

              <HeroStat
                label="Today's Sessions"
                value={
                  todaySessions.length
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* READINESS FACTORS */}
      <div
        style={{
          marginBottom:
            '14px',
        }}
      >
        <div
          style={{
            marginBottom:
              '12px',
          }}
        >
          <p className="eyebrow">
            READINESS FACTORS
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
              color:
                '#173c61',
            }}
          >
            What is driving your score?
          </h3>
        </div>

        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(4,1fr)',
            gap:
              '12px',
          }}
        >
          <FactorCard
            icon="▣"
            title="Syllabus"
            weight={40}
            value={
              syllabusScore
            }
            status={
              getSubjectReadiness(
                syllabusScore,
              )
            }
            available
          />

          <FactorCard
            icon="✓"
            title="Practice"
            weight={25}
            value={
              practiceScore
            }
            status="Waiting for data"
            available={
              practiceAvailable
            }
          />

          <FactorCard
            icon="↻"
            title="Revision"
            weight={20}
            value={
              revisionScore
            }
            status={
              getSubjectReadiness(
                revisionScore,
              )
            }
            available
          />

          <FactorCard
            icon="◷"
            title="Consistency"
            weight={15}
            value={
              plannerScore
            }
            status={
              plannerSessions.length ===
              0
                ? 'Not started'
                : getSubjectReadiness(
                    plannerScore,
                  )
            }
            available
          />
        </div>
      </div>

      {/* SUBJECT READINESS + PRIORITY */}
      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1.4fr 1fr',
          gap:
            '14px',
          marginTop:
            '14px',
        }}
      >
        <div
          style={{
            padding:
              '22px',
            background:
              '#ffffff',
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
                'flex-start',
            }}
          >
            <div>
              <p className="eyebrow">
                SUBJECT READINESS
              </p>

              <h3
                style={{
                  margin:
                    '5px 0 0',
                }}
              >
                How prepared is each subject?
              </h3>
            </div>

            <span
              style={{
                color:
                  '#8195aa',
                fontSize:
                  '10px',
              }}
            >
              Based on syllabus completion
            </span>
          </div>

          <div
            style={{
              display:
                'flex',
              flexDirection:
                'column',
              gap:
                '9px',
              marginTop:
                '18px',
            }}
          >
            {subjects.map(
              (
                subject,
              ) => (
                <SubjectReadinessRow
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

        <div
          style={{
            padding:
              '22px',
            background:
              'linear-gradient(180deg,#fff,#fbfcfe)',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '18px',
          }}
        >
          <p className="eyebrow">
            PRIORITY AREAS
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
            }}
          >
            Focus here next
          </h3>

          <p
            style={{
              color:
                '#7b90a7',
              fontSize:
                '11px',
              lineHeight:
                1.6,
              margin:
                '7px 0 18px',
            }}
          >
            These subjects currently have the lowest syllabus completion.
          </p>

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
            {prioritySubjects.map(
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
                      '1px solid #e6edf3',
                    borderRadius:
                      '11px',
                    background:
                      '#ffffff',
                  }}
                >
                  <span
                    style={{
                      width:
                        '24px',
                      height:
                        '24px',
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
                          '#8296aa',
                        fontSize:
                          '9px',
                      }}
                    >
                      {
                        subject.progressCount
                      }{' '}
                      /{' '}
                      {
                        subject.chapterList.length
                      }{' '}
                      chapters
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
                    {
                      subject.progress
                    }%
                  </strong>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      {/* STUDY CONSISTENCY */}
      <div
        style={{
          display:
            'grid',
          gridTemplateColumns:
            '1fr 1fr',
          gap:
            '14px',
          marginTop:
            '14px',
        }}
      >
        <div
          style={{
            padding:
              '22px',
            background:
              '#ffffff',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '18px',
          }}
        >
          <p className="eyebrow">
            STUDY CONSISTENCY
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
            }}
          >
            Planner performance
          </h3>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(3,1fr)',
              gap:
                '10px',
              marginTop:
                '18px',
            }}
          >
            <ReadinessSmallMetric
              label="Today"
              value={
                todaySessions.length
              }
            />

            <ReadinessSmallMetric
              label="Upcoming"
              value={
                upcomingSessions.length
              }
            />

            <ReadinessSmallMetric
              label="Completed"
              value={
                completedPlanner.length
              }
            />
          </div>
        </div>

        <div
          style={{
            padding:
              '22px',
            background:
              '#ffffff',
            border:
              '1px solid #dce6f0',
            borderRadius:
              '18px',
          }}
        >
          <p className="eyebrow">
            NEXT STEP
          </p>

          <h3
            style={{
              margin:
                '5px 0 0',
            }}
          >
            Recommended focus
          </h3>

          <div
            style={{
              marginTop:
                '16px',
              padding:
                '14px',
              borderRadius:
                '12px',
              background:
                '#f7faff',
              border:
                '1px solid #e3ecf5',
            }}
          >
            <strong
              style={{
                display:
                  'block',
                color:
                  '#173d63',
                fontSize:
                  '13px',
              }}
            >
              {remainingChapters >
              0
                ? 'Complete more syllabus chapters'
                : 'Move to intensive revision and practice'}
            </strong>

            <p
              style={{
                margin:
                  '5px 0 0',
                color:
                  '#7890aa',
                fontSize:
                  '10px',
                lineHeight:
                  1.6,
              }}
            >
              {remainingChapters >
              0
                ? `${remainingChapters} chapters are still pending in your current syllabus.`
                : 'Your syllabus is complete. Your next focus should be revision and exam practice.'}
            </p>
          </div>
        </div>
      </div>

      {/* DATA NOTICE */}
      {!practiceAvailable && (
        <div
          style={{
            marginTop:
              '14px',
            padding:
              '14px 16px',
            borderRadius:
              '13px',
            background:
              '#f8fbfd',
            border:
              '1px solid #e0e9f1',
            color:
              '#6e859d',
            fontSize:
              '10px',
            lineHeight:
              1.6,
          }}
        >
          <strong
            style={{
              color:
                '#254c70',
            }}
          >
            Readiness calculation note:
          </strong>{' '}
          MCQ/quiz performance is not included yet because quiz
          results are not being permanently stored. Once that
          persistence is added, Practice will become a live
          part of the readiness score automatically.
        </div>
      )}

      <style>{`
        /* =========================================================
           EXAM READINESS — MOBILE RESPONSIVE
        ========================================================= */

        @media (max-width: 768px) and (orientation: portrait) {
          .page {
            width: 100%;
            min-width: 0;
            overflow-x: hidden;
          }

          /* Header */
          .page > div:first-child {
            align-items: flex-start !important;
            gap: 12px !important;
            margin-bottom: 18px !important;
          }

          .page > div:first-child > div:first-child {
            width: 100%;
            min-width: 0;
          }

          .page > div:first-child h2 {
            font-size: 22px !important;
            line-height: 1.2 !important;
          }

          .page > div:first-child p:last-child {
            font-size: 11px !important;
            line-height: 1.5 !important;
          }

          .page > div:first-child > div:last-child {
            width: 100%;
            box-sizing: border-box;
            text-align: center;
          }

          /* Hero */
          .page > div:nth-child(2) {
            padding: 18px !important;
            border-radius: 18px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:first-child {
            justify-self: center;
          }

          .page > div:nth-child(2) h3 {
            font-size: 21px !important;
          }

          .page > div:nth-child(2) p {
            font-size: 11px !important;
            line-height: 1.6 !important;
          }

          /* Make score ring smaller on mobile */
          .page > div:nth-child(2) svg {
            width: 160px !important;
            height: 160px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:first-child > div {
            width: 160px !important;
            height: 160px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div strong {
            font-size: 38px !important;
          }

          /* Hero stats */
          .page > div:nth-child(2) > div:nth-child(2) > div:last-child > div:last-child {
            gap: 14px !important;
            justify-content: space-between !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:last-child > div:last-child > div {
            min-width: 0;
            flex: 1 1 0;
          }

          /* Readiness factors */
          .page > div:nth-child(3) > div:last-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 9px !important;
          }

          .page > div:nth-child(3) > div:last-child > div {
            min-width: 0;
            padding: 14px !important;
          }

          .page > div:nth-child(3) h3 {
            font-size: 16px !important;
          }

          /* Subject readiness + priority */
          .page > div:nth-child(4) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .page > div:nth-child(4) > div {
            padding: 16px !important;
            border-radius: 15px !important;
          }

          .page > div:nth-child(4) > div:first-child > div:first-child {
            flex-wrap: wrap !important;
            gap: 7px !important;
          }

          .page > div:nth-child(4) > div:first-child > div:first-child > span {
            width: 100%;
          }

          /* Subject rows */
          .page > div:nth-child(4) > div:first-child > div:last-child {
            margin-top: 14px !important;
          }

          /* Study consistency + next step */
          .page > div:nth-child(5) {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .page > div:nth-child(5) > div {
            padding: 16px !important;
            border-radius: 15px !important;
          }

          .page > div:nth-child(5) > div:first-child > div:last-child {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 7px !important;
          }

          .page > div:nth-child(5) > div:first-child > div:last-child > div {
            padding: 10px !important;
          }

          /* Data notice */
          .page > div:last-child {
            font-size: 9px !important;
            line-height: 1.55 !important;
            padding: 12px 13px !important;
          }

          /* Prevent long names / labels from overflowing */
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

          .page > div:nth-child(2) {
            padding: 15px !important;
          }

          .page > div:nth-child(2) svg {
            width: 140px !important;
            height: 140px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:first-child > div {
            width: 140px !important;
            height: 140px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:first-child > div > div strong {
            font-size: 34px !important;
          }

          .page > div:nth-child(2) h3 {
            font-size: 19px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:last-child > div:last-child {
            gap: 8px !important;
          }

          .page > div:nth-child(2) > div:nth-child(2) > div:last-child > div:last-child > div {
            text-align: center;
          }

          .page > div:nth-child(3) > div:last-child {
            grid-template-columns: 1fr !important;
          }

          .page > div:nth-child(5) > div:first-child > div:last-child {
            gap: 5px !important;
          }
        }
      `}</style>
    </div>
  )
}

function HeroStat({
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
            '21px',
        }}
      >
        {value}
      </strong>

      <span
        style={{
          display:
            'block',
          marginTop:
            '3px',
          color:
            '#8eafd0',
          fontSize:
            '9px',
          letterSpacing:
            '.08em',
          textTransform:
            'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function ReadinessSmallMetric({
  label,
  value,
}) {
  return (
    <div
      style={{
        padding:
          '13px',
        border:
          '1px solid #e5edf4',
        borderRadius:
          '11px',
        background:
          '#f8fbfd',
      }}
    >
      <span
        style={{
          display:
            'block',
          color:
            '#8297ab',
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
            '#163c62',
          fontSize:
            '21px',
        }}
      >
        {value}
      </strong>
    </div>
  )
}