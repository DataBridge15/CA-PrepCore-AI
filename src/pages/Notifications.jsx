import {
  useEffect,
  useMemo,
  useState,
} from 'react'

function getStorageKey(user) {
  return `prepcore_notifications_${
    user?.uid || 'guest'
  }`
}

function getPlannerKey(user) {
  return `prepcore_study_planner_${
    user?.uid || 'guest'
  }`
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`
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

function formatTime(timestamp) {
  if (!timestamp) {
    return ''
  }

  return new Date(
    timestamp,
  ).toLocaleTimeString(
    'en-IN',
    {
      hour: '2-digit',
      minute: '2-digit',
    },
  )
}

function getTypeIcon(type) {
  if (type === 'study') return '◷'
  if (type === 'chapter') return '✓'
  if (type === 'revision') return '↻'
  if (type === 'milestone') return '◆'

  return '●'
}

function getTypeColor(type) {
  if (type === 'study') {
    return {
      background: '#edf5ff',
      color: '#1d4f83',
    }
  }

  if (type === 'chapter') {
    return {
      background: '#effbf6',
      color: '#167254',
    }
  }

  if (type === 'revision') {
    return {
      background: '#fff8ed',
      color: '#ad6c1d',
    }
  }

  return {
    background: '#fff5ea',
    color: '#b16b22',
  }
}

function readNotifications(user) {
  try {
    const raw =
      localStorage.getItem(
        getStorageKey(user),
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
  } catch (error) {
    console.error(
      'NOTIFICATION READ ERROR:',
      error,
    )

    return []
  }
}

function writeNotifications(
  user,
  notifications,
) {
  try {
    localStorage.setItem(
      getStorageKey(user),
      JSON.stringify(
        notifications,
      ),
    )
  } catch (error) {
    console.error(
      'NOTIFICATION WRITE ERROR:',
      error,
    )
  }
}

function getPlannerSessions(user) {
  try {
    const raw =
      localStorage.getItem(
        getPlannerKey(user),
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
  } catch (error) {
    return []
  }
}

function buildNotifications({
  user,
  subjects,
}) {
  const existing =
    readNotifications(user)

  const today =
    getTodayKey()

  const plannerSessions =
    getPlannerSessions(user)

  const generated = []

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

  /* STUDY REMINDER */
  const todaySessions =
    plannerSessions.filter(
      (session) =>
        session.date ===
          today &&
        !session.completed,
    )

  if (
    todaySessions.length >
    0
  ) {
    generated.push({
      id:
        `study-${today}`,
      type:
        'study',
      title:
        'Study session pending',
      message:
        `You have ${todaySessions.length} study session${
          todaySessions.length ===
          1
            ? ''
            : 's'
        } planned for today.`,
      createdAt:
        Date.now(),
      read:
        false,
    })
  }

  /* MILESTONE */
  const milestones = [
    25,
    50,
    75,
    100,
  ]

  milestones.forEach(
    (milestone) => {
      const reached =
        totalChapters >
          0 &&
        completedChapters >=
          Math.ceil(
            (totalChapters *
              milestone) /
              100,
          )

      const milestoneId =
        `milestone-${milestone}`

      const alreadyExists =
        existing.some(
          (item) =>
            item.id ===
            milestoneId,
        )

      if (
        reached &&
        !alreadyExists
      ) {
        generated.push({
          id:
            milestoneId,
          type:
            'milestone',
          title:
            `${milestone}% syllabus completed`,
          message:
            `Great progress. You have completed ${
              milestone
            }% of your current syllabus.`,
          createdAt:
            Date.now(),
          read:
            false,
        })
      }
    },
  )

  return generated
}

export default function Notifications({
  user,
  subjects,
}) {
  const [
    notifications,
    setNotifications,
  ] = useState([])

  useEffect(() => {
    const stored =
      readNotifications(user)

    const generated =
      buildNotifications({
        user,
        subjects,
      })

    const existingIds =
      new Set(
        stored.map(
          (item) =>
            item.id,
        ),
      )

    const fresh =
      generated.filter(
        (item) =>
          !existingIds.has(
            item.id,
          ),
      )

    const merged = [
      ...fresh,
      ...stored,
    ]
      .sort(
        (a, b) =>
          b.createdAt -
          a.createdAt,
      )
      .slice(0, 30)

    setNotifications(
      merged,
    )

    writeNotifications(
      user,
      merged,
    )
  }, [
    user,
    subjects,
  ])

  const unread =
    notifications.filter(
      (item) =>
        !item.read,
    ).length

  const markRead =
    (id) => {
      setNotifications(
        (previous) => {
          const updated =
            previous.map(
              (item) =>
                item.id ===
                id
                  ? {
                      ...item,
                      read:
                        true,
                    }
                  : item,
            )

          writeNotifications(
            user,
            updated,
          )

          return updated
        },
      )
    }

  const markAllRead =
    () => {
      setNotifications(
        (previous) => {
          const updated =
            previous.map(
              (item) => ({
                ...item,
                read:
                  true,
              }),
            )

          writeNotifications(
            user,
            updated,
          )

          return updated
        },
      )
    }

  const deleteNotification =
    (id) => {
      setNotifications(
        (previous) => {
          const updated =
            previous.filter(
              (item) =>
                item.id !==
                id,
            )

          writeNotifications(
            user,
            updated,
          )

          return updated
        },
      )
    }

  const sorted =
    useMemo(
      () =>
        [...notifications].sort(
          (a, b) =>
            b.createdAt -
            a.createdAt,
        ),
      [notifications],
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
            'flex-end',
          gap:
            '18px',
          flexWrap:
            'wrap',
          marginBottom:
            '22px',
        }}
      >
        <div>
          <p className="eyebrow">
            UPDATES
          </p>

          <h2
            style={{
              margin:
                '6px 0',
            }}
          >
            Notifications
          </h2>

          <p
            style={{
              margin:
                0,
              color:
                '#7087a0',
              fontSize:
                '13px',
            }}
          >
            Only important study updates appear here.
          </p>
        </div>

        {unread > 0 && (
          <button
            className="filter-button"
            onClick={
              markAllRead
            }
          >
            ✓ Mark all read
          </button>
        )}
      </div>

      {sorted.length ===
      0 ? (
        <div
          style={{
            padding:
              '55px 20px',
            textAlign:
              'center',
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
            ♢
          </div>

          <h3
            style={{
              margin:
                '0 0 6px',
              color:
                '#0b2e55',
            }}
          >
            You're all caught up
          </h3>

          <p
            style={{
              margin:
                0,
              color:
                '#7a90a6',
              fontSize:
                '11px',
            }}
          >
            New important study updates will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            display:
              'flex',
            flexDirection:
              'column',
            gap:
              '9px',
          }}
        >
          {sorted.map(
            (notification) => {
              const tone =
                getTypeColor(
                  notification.type,
                )

              return (
                <div
                  key={
                    notification.id
                  }
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'flex-start',
                    gap:
                      '13px',
                    padding:
                      '15px 16px',
                    border:
                      notification.read
                        ? '1px solid #e3eaf1'
                        : '1px solid #cbddec',
                    borderRadius:
                      '14px',
                    background:
                      notification.read
                        ? '#fff'
                        : '#f8fbff',
                  }}
                >
                  <div
                    style={{
                      width:
                        '40px',
                      height:
                        '40px',
                      flexShrink:
                        0,
                      display:
                        'grid',
                      placeItems:
                        'center',
                      borderRadius:
                        '11px',
                      background:
                        tone.background,
                      color:
                        tone.color,
                      fontWeight:
                        900,
                    }}
                  >
                    {getTypeIcon(
                      notification.type,
                    )}
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
                        alignItems:
                          'center',
                        gap:
                          '7px',
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
                        {
                          notification.title
                        }
                      </strong>

                      {!notification.read && (
                        <span
                          style={{
                            width:
                              '7px',
                            height:
                              '7px',
                            borderRadius:
                              '50%',
                            background:
                              '#2674ad',
                          }}
                        />
                      )}
                    </div>

                    <p
                      style={{
                        margin:
                          '5px 0 6px',
                        color:
                          '#738aa1',
                        fontSize:
                          '11px',
                        lineHeight:
                          1.55,
                      }}
                    >
                      {
                        notification.message
                      }
                    </p>

                    <span
                      style={{
                        color:
                          '#9aabba',
                        fontSize:
                          '9px',
                      }}
                    >
                      {formatTime(
                        notification.createdAt,
                      )}
                    </span>
                  </div>

                  <div
                    style={{
                      display:
                        'flex',
                      gap:
                        '5px',
                    }}
                  >
                    {!notification.read && (
                      <button
                        type="button"
                        title="Mark as read"
                        onClick={() =>
                          markRead(
                            notification.id,
                          )
                        }
                        style={{
                          width:
                            '30px',
                          height:
                            '30px',
                          border:
                            '1px solid #dce5ed',
                          borderRadius:
                            '8px',
                          background:
                            '#fff',
                          color:
                            '#56758f',
                          cursor:
                            'pointer',
                        }}
                      >
                        ✓
                      </button>
                    )}

                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        deleteNotification(
                          notification.id,
                        )
                      }
                      style={{
                        width:
                          '30px',
                        height:
                          '30px',
                        border:
                          '1px solid #eadede',
                        borderRadius:
                          '8px',
                        background:
                          '#fffafa',
                        color:
                          '#a25d5d',
                        cursor:
                          'pointer',
                        fontSize:
                          '14px',
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            },
          )}
        </div>
      )}
    </div>
  )
}