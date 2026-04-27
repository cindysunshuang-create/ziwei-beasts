export function ContactUs({ onBack }: { onBack: () => void }) {
  return (
    <div className="page page-center" style={{ animation: 'fadeIn 0.6s' }}>
      <div className="content-center" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 className="title-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>Contact Us</h1>
        <div className="legal-content">
          <p>We are here to assist you with any questions about your reading, your account, or our services.</p>
          
          <h3>Email Support</h3>
          <p>For general inquiries or technical support, please reach out to us at: <br/>
             <strong>support@easternmystical.com</strong>
          </p>

          <h3>Business Hours</h3>
          <p>We aim to respond to all inquiries within 24-48 business hours.</p>
          
          <p style={{ marginTop: '2rem', opacity: 0.7, fontSize: '0.85rem' }}>
            Eastern Mystical <br/>
            (A digital product entity)
          </p>
        </div>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop: '2rem' }}>← Back to App</button>
      </div>
    </div>
  )
}