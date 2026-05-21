import { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      // Smooth scroll to the target section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="/" className="logo-text">ROOT LOOMS</a>
        <nav className="nav-links">
          <a href="#categories-section" onClick={(e) => handleNavClick(e, 'categories-section')}>Shop</a>
          <a href="#collections-section" onClick={(e) => handleNavClick(e, 'collections-section')}>Collections</a>
          <a href="#about-section" onClick={(e) => handleNavClick(e, 'about-section')}>About Us</a>
          <a href="#contact-section" onClick={(e) => handleNavClick(e, 'contact-section')}>Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
