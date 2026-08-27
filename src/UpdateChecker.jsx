import { useEffect, useState } from 'react'

const CURRENT_VERSION_CODE = 4
const CURRENT_VERSION = '4.0.0'
const VERSION_API = 'https://ca-prepcore-ai.onrender.com/api/app-version'

function UpdateChecker() {
  const [update, setUpdate] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function checkForUpdate() {
      try {
        const response = await fetch(
          `${VERSION_API}?t=${Date.now()}`,
          {
            method: 'GET',
            cache: 'no-store',
            headers: {
              Accept: 'application/json',
            },
          }
        )

        if (!response.ok) {
          console.log('Update check failed:', response.status)
          return
        }

        const data = await response.json()

        console.log('Update server response:', data)

        if (cancelled || !data || data.success !== true) {
          return
        }

        const latestCode = Number(data.versionCode)

        if (
          Number.isFinite(latestCode) &&
          latestCode > CURRENT_VERSION_CODE
        ) {
          setUpdate({
            version: data.version || 'New version',
            versionCode: latestCode,
            downloadUrl: data.downloadUrl || '',
            releaseNotes: data.releaseNotes || '',
            forceUpdate: data.forceUpdate === true,
          })
        }
      } catch (error) {
        console.log('Update check skipped:', error)
      }
    }

    checkForUpdate()

    return () => {
      cancelled = true
    }
  }, [])

  if (!update) {
    return null
  }

  const handleUpdate = () => {
    if (!update.downloadUrl) {
      alert('Update download link is not available yet.')
      return
    }

    window.open(
      update.downloadUrl,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(10, 25, 45, 0.65)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '22px',
          padding: '26px',
          boxSizing: 'border-box',
          boxShadow: '0 20px 60px rgba(0,0,0,0.30)',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          color: '#17375f',
        }}
      >
        <div
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#eaf4ff',
            fontSize: '28px',
            marginBottom: '16px',
          }}
        >
          Ã¢â€ Â»
        </div>

        <h2
          style={{
            margin: '0 0 8px',
            fontSize: '24px',
            lineHeight: 1.2,
          }}
        >
          New update available
        </h2>

        <p
          style={{
            margin: '0 0 16px',
            lineHeight: 1.6,
            color: '#52657a',
          }}
        >
          A newer version of PrepCore.AI is available.
        </p>

        <div
          style={{
            padding: '13px 14px',
            borderRadius: '12px',
            background: '#f6f9fc',
            marginBottom: '18px',
            fontSize: '14px',
          }}
        >
          <strong>
            Version {update.version}
          </strong>

          <div
            style={{
              marginTop: '5px',
              color: '#64748b',
            }}
          >
            Current: {CURRENT_VERSION}
            {' Ã‚Â· '}
            Latest: {update.version}
          </div>
        </div>

        {update.releaseNotes && (
          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontWeight: 800,
                marginBottom: '6px',
              }}
            >
              What's new
            </div>

            <div
              style={{
                color: '#52657a',
                lineHeight: 1.55,
              }}
            >
              {update.releaseNotes}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleUpdate}
          style={{
            width: '100%',
            border: 0,
            borderRadius: '13px',
            padding: '13px 16px',
            background: '#17375f',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          Update Now
        </button>

        {!update.forceUpdate && (
          <button
            type="button"
            onClick={() => setUpdate(null)}
            style={{
              width: '100%',
              border: 0,
              background: 'transparent',
              color: '#64748b',
              padding: '12px 16px 2px',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Maybe Later
          </button>
        )}
      </div>
    </div>
  )
}

export default UpdateChecker
