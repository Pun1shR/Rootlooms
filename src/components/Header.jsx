import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = ({ onLoginClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (location.pathname !== '/') {
      navigate('/#' + targetId);
      // Let the browser handle jump after navigation
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const isAdmin = user && user.email === 'karanshirur22@gmail.com';

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="logo-text">ROOT LOOMS</Link>
        <nav className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#categories-section" onClick={(e) => handleNavClick(e, 'categories-section')}>Shop</a>
          <a href="#collections-section" onClick={(e) => handleNavClick(e, 'collections-section')}>Collections</a>
          <a href="#about-section" onClick={(e) => handleNavClick(e, 'about-section')}>About Us</a>
          <a href="#contact-section" onClick={(e) => handleNavClick(e, 'contact-section')}>Contact</a>
          
          {isAdmin && (
            <Link to="/admin" style={{ fontWeight: 'bold', color: '#c62828', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>
              Admin Panel
            </Link>
          )}

          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              background: 'none', border: 'none', cursor: 'pointer', position: 'relative', 
              display: 'flex', alignItems: 'center', padding: '5px' 
            }}
            aria-label="Cart"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartItemCount > 0 && (
              <span style={{
                position: 'absolute', top: '-5px', right: '-8px', background: 'var(--color-primary)', 
                color: 'white', borderRadius: '50%', width: '20px', height: '20px', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.75rem', fontWeight: 'bold'
              }}>
                {cartItemCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="auth-menu">
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
                {user.email}
              </span>
              <button 
                onClick={logout} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '1px', marginLeft: '1rem', color: 'var(--color-primary)' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 500, letterSpacing: '1px', color: 'var(--color-primary)' }}
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
