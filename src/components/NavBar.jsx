import React, { useState } from 'react';
import { Link } from 'react-router'; // Import Link for routing
import '../styles/NavBar.css';
import Toggle from '../components/Toggle';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <section className='NavBar-section'>
      <Link to="/">
        <img src="/images/logo5.png" alt="logo2.png" />
      </Link>

      <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav>
        <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
          <li>
            <a href="" onClick={toggleMenu}>
              <Toggle />
            </a>
          </li>
          <li>
            <a href="" onClick={toggleMenu}>
              Log In
            </a>
          </li>
        </ul>
      </nav>
    </section>
  );
}