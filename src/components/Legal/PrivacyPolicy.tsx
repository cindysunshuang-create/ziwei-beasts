export function PrivacyPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="page page-center" style={{ animation: 'fadeIn 0.6s' }}>
      <div className="content-center" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 className="title-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>Privacy Policy</h1>
        <div className="legal-content">
          <h3>1. Information We Collect</h3>
          <p>To generate your unique chart, we collect birth details (date, time) and an optional display name. For account creation, we collect your email address.</p>
          
          <h3>2. How We Use Your Information</h3>
          <p>Your birth details are used strictly to calculate your astrological chart using the Ziwei Doushu algorithm. We do not sell your personal data to third parties.</p>

          <h3>3. Data Storage and Security</h3>
          <p>We use industry-standard security measures (including Firebase Authentication) to protect your data. Your payment information is processed securely by our payment gateway partners; we do not store your credit card details.</p>

          <h3>4. Your Rights</h3>
          <p>You have the right to request deletion of your account and associated data at any time by contacting our support team.</p>
        </div>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop: '2rem' }}>← Back to App</button>
      </div>
    </div>
  )
}