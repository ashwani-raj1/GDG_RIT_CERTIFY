import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="site-header">
      <div className="main">
        <div className="logo">
          <Link to="/" onClick={closeMenu}>
            <img src="./image.png" alt="rit-logo" />
          </Link>
        </div>

        <button
          className="menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="links-head">
          <div
            id="primary-navigation"
            className={`links ${isMenuOpen ? "links--open" : ""}`}
          >
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/verify" onClick={closeMenu}>Verify</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
