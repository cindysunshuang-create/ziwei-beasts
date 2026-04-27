import './Footer.css'

export function Footer({
  onTerms,
  onPrivacy,
  onRefund,
  onContact,
}: {
  onTerms: () => void
  onPrivacy: () => void
  onRefund: () => void
  onContact: () => void
}) {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <button className="footer-link" onClick={onTerms}>Terms of Service</button>
        <span className="footer-dot">·</span>
        <button className="footer-link" onClick={onPrivacy}>Privacy Policy</button>
        <span className="footer-dot">·</span>
        <button className="footer-link" onClick={onRefund}>Refund Policy</button>
        <span className="footer-dot">·</span>
        <button className="footer-link" onClick={onContact}>Contact Us</button>
      </div>
      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Eastern Mystical. All rights reserved. <br/>
        <span className="footer-disclaimer">For entertainment purposes only.</span>
      </div>
    </footer>
  )
}
