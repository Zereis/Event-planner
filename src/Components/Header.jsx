import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router'; 
import '../styles/header.css';
import Toggle from '../components/Toggle';
import Logo from '/images/logo5.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';


export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);


  // Close menu on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Determine scroll direction
          if (currentScrollY < lastScrollY || currentScrollY <= 0) {
            // Scrolling up or at top
            setIsHeaderVisible(true);
          } else if (currentScrollY > lastScrollY) {
            // Scrolling down
            setIsHeaderVisible(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`header ${isHeaderVisible ? 'visible' : 'hidden'}`}>

        <NavLink to="/">
         <img
          src={Logo}
          alt="Spin main page"
          className="Sping"
          />
        </NavLink>
 
    <Toggle className="header-toggle"/>

      <button className="hamburger" onClick={toggleMenu} aria-expanded={isMenuOpen}
        aria-label="Toggle navigation menu">
        <FontAwesomeIcon icon={faEllipsis} />
      </button>
    


      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
       
        <ul>
    
          <li><NavLink 
          to="/"   
          onClick={() => {
            toggleMenu();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}
        >

            Home
            
            </NavLink></li>
          <li><NavLink 
          to="/Calendar" 
          onClick={() => {
            toggleMenu();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}
            >

            Calendar

            </NavLink></li>
          <li><NavLink 
          to="/Edit"
          onClick={() => {
            toggleMenu();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}
            >

            Edit Task

            </NavLink></li>
          <li><NavLink 
          to="/Add"
          onClick={() => {
            toggleMenu();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}
            >

            Add Task

            </NavLink></li>

          <li><NavLink 
          to="/Spin"
          onClick={() => {
            toggleMenu();
            window.scrollTo(0, 0);
          }}
          className={({ isActive }) => (isActive ? 'burgerbtn active' : 'burgerbtn')}
            >

            Spin

            </NavLink></li>
        </ul>
      </nav>

      <nav className="nav-desktop">
        <ul>
          <li>
            <NavLink
              to="/"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Calendar"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Edit"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Edit Task
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/Add"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              Add Task
            </NavLink>
          </li>

                    <li>
            <NavLink
              to="/Spin"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              spin!
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}