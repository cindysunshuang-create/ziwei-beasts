export function RefundPolicy({ onBack }: { onBack: () => void }) {
  return (
    <div className="page page-center" style={{ animation: 'fadeIn 0.6s' }}>
      <div className="content-center" style={{ maxWidth: '800px', textAlign: 'left' }}>
        <h1 className="title-lg" style={{ marginBottom: '2rem', textAlign: 'center' }}>Refund Policy</h1>
        <div className="legal-content">
          <h3>1. Digital Goods</h3>
          <p>The product you are purchasing is an instantly delivered digital asset (a comprehensive personality assessment and astrological chart reading).</p>

          <h3>2. No Refund Policy</h3>
          <p>Due to the nature of digital goods and immediate fulfillment, <strong>all sales are final and non-refundable</strong> once the reading is unlocked and delivered to your screen.</p>

          <h3>3. Exceptions</h3>
          <p>Exceptions may only be granted in cases of proven technical failure where the product could not be generated or accessed. If you encounter an error, please contact support within 7 days of purchase with your transaction details.</p>
        </div>
        <button className="btn btn-ghost btn-full" onClick={onBack} style={{ marginTop: '2rem' }}>← Back to App</button>
      </div>
    </div>
  )
}