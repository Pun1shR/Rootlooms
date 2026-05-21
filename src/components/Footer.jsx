const Footer = () => {
  return (
    <footer id="contact-section" className="footer" style={{ borderTop: '1px solid #443c35' }}>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4 style={{ color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>Rootlooms</h4>
            <p style={{ color: '#ccc', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Tradition With Elegance. Weaving heritage into modern premium aesthetics.
            </p>
          </div>
          
          <div className="footer-col">
            <h4>Heritage & Shop</h4>
            <ul>
              <li><a href="#categories-section" onClick={(e) => { e.preventDefault(); document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Categories</a></li>
              <li><a href="#collections-section" onClick={(e) => { e.preventDefault(); document.getElementById('collections-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Collections</a></li>
              <li><a href="#about-section" onClick={(e) => { e.preventDefault(); document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' }); }}>Our Story</a></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Get in Touch</h4>
            <ul style={{ color: '#ccc', fontSize: '0.9rem' }}>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>WhatsApp:</strong> <br />
                <a href="https://wa.me/919890509663" target="_blank" rel="noreferrer">+91 9890509663</a>
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>Email:</strong> <br />
                <a href="mailto:shirurbeena@gmail.com">shirurbeena@gmail.com</a>
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>Studio Hours:</strong> <br />
                Wednesday to Monday<br />10:00 AM to 10:00 PM
              </li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Follow Us</h4>
            <ul>
              <li><a href="https://www.instagram.com/rootlooms/" target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem', marginTop: '2rem' }}>
          &copy; {new Date().getFullYear()} Rootlooms. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
