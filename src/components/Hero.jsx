import { useState, useEffect, useRef } from 'react';

const Hero = () => {
  const videoRef = useRef(null);
  const [videoOpacity, setVideoOpacity] = useState(0); // Start at 0 so it fades in cleanly from white

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId;

    const updateOpacity = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;
      const maxOpacity = 0.75;
      const fadeDuration = 2; // fade first and last 2 seconds

      let opacity = maxOpacity;

      if (duration && duration > 0) {
        if (currentTime < fadeDuration) {
          // Fade in from white (0 to maxOpacity)
          opacity = (currentTime / fadeDuration) * maxOpacity;
        } else if (currentTime > duration - fadeDuration) {
          // Fade out to white (maxOpacity to 0)
          const timeRemaining = duration - currentTime;
          opacity = Math.max(0, (timeRemaining / fadeDuration) * maxOpacity);
        }
      }

      setVideoOpacity(opacity);
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    const startAnimation = () => {
      animationFrameId = requestAnimationFrame(updateOpacity);
    };

    video.addEventListener('loadedmetadata', startAnimation);
    video.addEventListener('play', startAnimation);

    // If metadata or play is already active
    if (video.readyState >= 1 || !video.paused) {
      startAnimation();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadedmetadata', startAnimation);
      video.removeEventListener('play', startAnimation);
    };
  }, []);

  return (
    <section className="hero">
      <video 
        ref={videoRef}
        autoPlay 
        loop 
        muted 
        playsInline 
        className="hero-video"
        style={{ opacity: videoOpacity, transition: 'opacity 0.1s ease-out' }}
      >
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
