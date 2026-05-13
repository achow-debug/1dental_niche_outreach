import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Free Website Audit for Dental Clinics — Carter Dental'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'linear-gradient(135deg, #F6FAF9 0%, #E6F1EE 60%, #CFE2DD 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#1F2A2F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #6FB1B1 0%, #2F6868 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 700,
              fontSize: 26,
            }}
          >
            CD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, fontWeight: 700, lineHeight: 1 }}>Carter Dental</span>
            <span style={{ fontSize: 12, letterSpacing: 4, color: '#5C6B6E', textTransform: 'uppercase' }}>
              Website Audits
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <span
            style={{
              alignSelf: 'flex-start',
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(47, 104, 104, 0.12)',
              color: '#2F6868',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            Free Website Audit
          </span>
          <span style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            Your dental site is costing you patients.
          </span>
          <span style={{ fontSize: 28, color: '#3F5256', maxWidth: 940, lineHeight: 1.3 }}>
            A 10-minute audit shows exactly why — and how to fix it.
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            color: '#3F5256',
            fontSize: 18,
          }}
        >
          <span>Trusted by 40+ UK private practices</span>
          <span style={{ fontWeight: 700, color: '#2F6868' }}>carterdentalstudio.co.uk</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
