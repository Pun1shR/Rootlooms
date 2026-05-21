const Hero = () => {
  return (
    <section className="hero">
      <video autoPlay loop muted playsInline className="hero-video">
        <source src="/bg_vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="hero-content animate-fade-in">
        <img src="/logo.png" alt="Rootlooms Logo" className="hero-logo" />
        <h1 className="hero-title">Tradition With Elegance</h1>
        <p className="hero-subtitle">Discover our hand-picked collection of timeless ethnic wear, woven with heritage and styled for the modern era.</p>
        <button className="btn">Shop the Collection</button>
      </div>
    </section>
  );
};

export default Hero;
