const About = () => {
  return (
    <section id="about-section" className="py-4" style={{ backgroundColor: 'var(--color-background)', borderTop: '1px solid #e7e0d7', padding: '4rem 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
        <div>
          <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Our Story</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '1.2rem', lineHeight: '1.8' }}>
            Rootlooms was born from a deep, personal connection to tradition. Founded by Beena Shirur, the brand started from the very roots of her upbringing. Deeply attached to her heritage, she envisioned a way to share the timeless artistry of Indian handlooms with the modern wardrobe.
          </p>
          <p style={{ color: 'var(--color-text-light)', lineHeight: '1.8' }}>
            Through Rootlooms, Beena wants the world to experience the unmatched elegance, tradition, and warmth of what she proudly calls Home. Every weave is a tribute to the master artisans of India, bringing authentic, ethical, and premium craftsmanship directly to you.
          </p>
        </div>
        <div style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--color-border)', padding: '10px', backgroundColor: 'var(--color-surface)', aspectRatio: '3/4' }}>
          <img 
            src="/beena-shirur.jpeg" 
            alt="Beena Shirur - Founder of Rootlooms" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} 
          />
        </div>
      </div>
    </section>
  );
};

export default About;
