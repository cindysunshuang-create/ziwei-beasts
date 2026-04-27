export function TermsOfService({ onBack }: { onBack: () => void }) {
  return (
    <div className="page page-center" style={{ animation: 'fadeIn 0.6s' }}>
      <div className="content-center" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 className="title-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>Terms of Service</h1>
        <div className="legal-content">
          <h3>1. Acceptance of Terms</h3>
          <p>By accessing and using Eastern Mystical (the "Service"), you accept and agree to be bound by the terms and provision of this agreement.</p>
          
          <h3>2. Entertainment Purposes Only (Disclaimer)</h3>
          <p><strong>IMPORTANT:</strong> All readings, charts, and digital assessments provided by Eastern Mystical are for <strong>entertainment purposes only</strong>. They do not constitute and should not be construed as psychological, medical, legal, or financial advice. The Service is an exploration of ancient cultural archetypes and personality assessment, not a scientific prediction of the future.</p>

          <h3>3. Digital Content Delivery</h3>
          <p>Upon successful payment, digital content (such as your Guardian Profile) is delivered immediately to your screen and bound to your account (if applicable).</p>

          <h3>4. User Conduct</h3>
          <p>You agree not to use the Service for any unlawful purpose or in any way that might harm, damage, or disparage any other party.</p>
        </div>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop: '2rem' }}>← Back to App</button>
      </div>
    </div>
  )
}
