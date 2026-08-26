import {
  ref,
  set,
  get,
} from 'firebase/database'

import { database } from './firebase'

const LOCAL_PROGRESS_PREFIX =
  'prepcore_progress_'

function getLocalKey(uid) {
  return `${LOCAL_PROGRESS_PREFIX}${uid}`
}

function getUserRef(uid) {
  if (!uid) {
    throw new Error(
      'User UID is required.',
    )
  }

  return ref(
    database,
    `users/${uid}`,
  )
}

function getProgressRootRef(uid) {
  if (!uid) {
    throw new Error(
      'User UID is required.',
    )
  }

  return ref(
    database,
    `users/${uid}/progress/subjects`,
  )
}

function getSubjectProgressRef(
  uid,
  subjectId,
) {
  if (!uid) {
    throw new Error(
      'User UID is required.',
    )
  }

  if (!subjectId) {
    throw new Error(
      'Subject ID is required.',
    )
  }

  return ref(
    database,
    `users/${uid}/progress/subjects/${subjectId}`,
  )
}

/* =========================================
   LOCAL STORAGE HELPERS
========================================= */

function readLocalProgress(uid) {
  try {
    const raw =
      localStorage.getItem(
        getLocalKey(uid),
      )

    if (!raw) {
      return {}
    }

    const parsed =
      JSON.parse(raw)

    if (
      !parsed ||
      typeof parsed !==
        'object'
    ) {
      return {}
    }

    return parsed
  } catch (error) {
    console.error(
      'LOCAL PROGRESS READ ERROR:',
      error,
    )

    return {}
  }
}

function writeLocalProgress(
  uid,
  progress,
) {
  try {
    localStorage.setItem(
      getLocalKey(uid),
      JSON.stringify(
        progress || {},
      ),
    )
  } catch (error) {
    console.error(
      'LOCAL PROGRESS WRITE ERROR:',
      error,
    )
  }
}

/* =========================================
   NORMALIZE COMPLETED CHAPTERS
========================================= */

function normalizeCompletedChapters(
  value,
) {
  /*
   * New format:
   * {
   *   "Chapter A": true,
   *   "Chapter B": true
   * }
   */

  if (
    value &&
    typeof value ===
      'object' &&
    !Array.isArray(value)
  ) {
    return Object.keys(
      value,
    ).filter(
      (chapter) =>
        value[chapter] ===
        true,
    )
  }

  /*
   * Old format:
   * ["Chapter A", "Chapter B"]
   */

  if (
    Array.isArray(value)
  ) {
    return [
      ...new Set(value),
    ]
  }

  return []
}

/* =========================================
   CONVERT ARRAY -> OBJECT MAP
========================================= */

function chaptersToMap(
  chapters,
) {
  const map = {}

  if (
    !Array.isArray(chapters)
  ) {
    return map
  }

  chapters.forEach(
    (chapter) => {
      if (
        typeof chapter ===
          'string' &&
        chapter.trim()
      ) {
        map[chapter] = true
      }
    },
  )

  return map
}

/* =========================================
   USER PROFILE
========================================= */

export async function createUserProfile(
  user,
  extraData = {},
) {
  if (!user?.uid) {
    throw new Error(
      'User is not authenticated.',
    )
  }

  const profile = {
    uid: user.uid,

    name:
      extraData.name ||
      user.displayName ||
      user.email?.split(
        '@',
      )[0] ||
      'Student',

    email:
      user.email || '',

    level:
      extraData.level ||
      'CA Foundation',

    attempt:
      extraData.attempt ||
      'January 2027',

    createdAt:
      extraData.createdAt ||
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),
  }

  await set(
    getUserRef(user.uid),
    profile,
  )

  return profile
}

/* =========================================
   GET USER PROFILE
========================================= */

export async function getUserProfile(
  uid,
) {
  if (!uid) {
    return null
  }

  try {
    const snapshot =
      await get(
        getUserRef(uid),
      )

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.val()
  } catch (error) {
    console.error(
      'USER PROFILE READ ERROR:',
      error,
    )

    return null
  }
}

/* =========================================
   UPDATE USER PROFILE
========================================= */

export async function updateUserProfile(
  uid,
  data,
) {
  if (!uid) {
    throw new Error(
      'User UID is required.',
    )
  }

  const existing =
    await getUserProfile(uid)

  const updated = {
    ...(existing || {}),
    ...data,
    uid,
    updatedAt:
      new Date().toISOString(),
  }

  await set(
    getUserRef(uid),
    updated,
  )

  return updated
}

/* =========================================
   GET ALL SUBJECT PROGRESS
========================================= */

export async function getSubjectProgress(
  uid,
) {
  if (!uid) {
    return {}
  }

  const localProgress =
    readLocalProgress(uid)

  try {
    const snapshot =
      await get(
        getProgressRootRef(uid),
      )

    if (!snapshot.exists()) {
      return localProgress
    }

    const firebaseData =
      snapshot.val()

    if (
      !firebaseData ||
      typeof firebaseData !==
        'object'
    ) {
      return localProgress
    }

    const normalized = {}

    /*
     * Normalize every subject.
     */
    Object.entries(
      firebaseData,
    ).forEach(
      ([
        subjectId,
        subjectData,
      ]) => {
        const completed =
          normalizeCompletedChapters(
            subjectData?.completedChapters,
          )

        normalized[
          subjectId
        ] = {
          completedChapters:
            completed,

          completedCount:
            completed.length,

          updatedAt:
            subjectData?.updatedAt ||
            null,
        }
      },
    )

    /*
     * IMPORTANT:
     * Local values win when Firebase has
     * stale/empty values.
     */
    const merged = {
      ...normalized,
      ...localProgress,
    }

    /*
     * Keep local storage updated.
     */
    writeLocalProgress(
      uid,
      merged,
    )

    return merged
  } catch (error) {
    console.error(
      'FIREBASE PROGRESS READ ERROR:',
      error,
    )

    /*
     * Never return {} here.
     */
    return localProgress
  }
}

/* =========================================
   SAVE SUBJECT PROGRESS
========================================= */

export async function saveSubjectProgress(
  uid,
  subjectId,
  completedChapters,
) {
  if (!uid) {
    throw new Error(
      'User UID is required.',
    )
  }

  if (!subjectId) {
    throw new Error(
      'Subject ID is required.',
    )
  }

  const safeCompleted =
    Array.isArray(
      completedChapters,
    )
      ? [
          ...new Set(
            completedChapters.filter(
              (chapter) =>
                typeof chapter ===
                  'string' &&
                chapter.trim(),
            ),
          ),
        ]
      : []

  const completedMap =
    chaptersToMap(
      safeCompleted,
    )

  const progressData = {
    completedChapters:
      completedMap,

    completedCount:
      safeCompleted.length,

    updatedAt:
      new Date().toISOString(),
  }

  /* ---------------------------------------
     SAVE TO LOCAL STORAGE FIRST
  --------------------------------------- */

  const localProgress =
    readLocalProgress(uid)

  const updatedLocal = {
    ...localProgress,

    [subjectId]: {
      completedChapters:
        safeCompleted,

      completedCount:
        safeCompleted.length,

      updatedAt:
        progressData.updatedAt,
    },
  }

  writeLocalProgress(
    uid,
    updatedLocal,
  )

  /* ---------------------------------------
     SAVE TO FIREBASE
  --------------------------------------- */

  try {
    await set(
      getSubjectProgressRef(
        uid,
        subjectId,
      ),
      progressData,
    )

    /* Verify immediately */
    const verifySnapshot =
      await get(
        getSubjectProgressRef(
          uid,
          subjectId,
        ),
      )

    if (!verifySnapshot.exists()) {
      throw new Error(
        'Firebase write verification failed.',
      )
    }

    const verified =
      verifySnapshot.val()

    const verifiedCompleted =
      normalizeCompletedChapters(
        verified?.completedChapters,
      )

    /*
     * Keep local storage synchronized
     * with Firebase.
     */
    const verifiedLocal =
      readLocalProgress(uid)

    verifiedLocal[
      subjectId
    ] = {
      completedChapters:
        verifiedCompleted,

      completedCount:
        verifiedCompleted.length,

      updatedAt:
        verified?.updatedAt ||
        new Date().toISOString(),
    }

    writeLocalProgress(
      uid,
      verifiedLocal,
    )

    return {
      completedChapters:
        verifiedCompleted,

      completedCount:
        verifiedCompleted.length,

      updatedAt:
        verified?.updatedAt ||
        null,
    }
  } catch (error) {
    console.error(
      'FIREBASE PROGRESS SAVE ERROR:',
      error,
    )

    /*
     * Local progress remains saved.
     */
    return updatedLocal[
      subjectId
    ]
  }
}