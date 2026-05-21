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

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a href="/" className="logo-text">ROOT LOOMS</a>
        <nav className="nav-links">
          <a href="#">Shop</a>
          <a href="#">Collections</a>
          <a href="#">About Us</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
