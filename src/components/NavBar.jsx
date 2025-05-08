import React, {useState } from 'react'
import '../styles/NavBar.css'

export default function NavBar() {
  const [menuOpen, setMenuOpen] =useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <section className='NavBar-section'>
      <img src="/images/logo2.png" alt="logo2.png" />

      <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </button>
        <nav>
          <ul className={`nav-links ${menuOpen ? "show" :""}`}>
            <li>
              <a href=""
              onClick={toggleMenu}
              >
                Dark/Light Mode
              </a>
            </li>
            <li>
              <a href=""
              onClick={toggleMenu}
              >
                Log In
              </a>
            </li>
          </ul>
        </nav>
    </section>
  )
}
