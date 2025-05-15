import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router'; 
import '../styles/header.css';
import Toggle from '../components/Toggle';
import Logo from '/images/logo5.png';
import TitleName from '/images/logoname1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faArrowRightToBracket, faUser, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { LoginPopup } from '../components/PopupConfigs'; // <-- Import the login pop-up trigger -->



export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate(); 
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  const { Component: LoginPopupComponent, trigger: triggerLogin } = LoginPopup(); // <-- This is the login pop-up trigger -->

    // Fetch logged in user from sessionStorage
  useEffect (() => {
    const updateUser = () => {
      const user = sessionStorage.getItem("user")
          ? JSON.parse(sessionStorage.getItem("user")).username
          : null;
      setLoggedInUser(user)
    };

    updateUser();

    const interval = setInterval(updateUser, 500);
      return () => clearInterval(interval); 
  }, []);

    const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
    sessionStorage.removeItem("user");
    setLoggedInUser(null);
    navigate("/");
    }
  };


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
        className="SpinLogo"
        title='Home'
        />
        <img 
        src={TitleName}
        alt="Spin main page"
        className="TitleName"
        title='Home'
        />
      </NavLink>
    <div className='header-user'>
      <div
        title={!loggedInUser ? 'Log in' : ""}
        onClick={triggerLogin}  // <-- This is the login pop-up trigger -->
        className={({ isActive }) => (isActive ? 'login-btn-active' : 'login-btn')}
        onMouseEnter={() => setIsLoginHovered(true)}
        onMouseLeave={() => setIsLoginHovered(false)}
      >
        {loggedInUser ? loggedInUser : <FontAwesomeIcon icon={isLoginHovered ? faArrowRightToBracket : faUser} />}
      </div>
      <LoginPopupComponent />
      {loggedInUser && (
        <button className="logout-btn"
        title='Log out' 
        onClick={handleLogout}
        onMouseEnter={() => setIsLogoutHovered(true)}
        onMouseLeave={() => setIsLogoutHovered(false)}>
          <FontAwesomeIcon icon={isLogoutHovered ? faArrowRightFromBracket : faUser} />
        </button>
      )}
      </div>

      <Toggle className="header-toggle"/>

      <button className="hamburger" title='Navigation Links' 
      onClick={toggleMenu} 
      aria-expanded={isMenuOpen}
      aria-label="Toggle navigation menu"
      >
        <FontAwesomeIcon icon={faEllipsis} />
      </button>

    


      <nav className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
       
        <ul>

          <li className="right-align">
            <button className="hamburger-close" onClick={toggleMenu} aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu">
            <FontAwesomeIcon icon={faX} />
            </button>
          </li>
    
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

                    <li>
            <NavLink
              to="/Login"
              onClick={() => {
                window.scrollTo(0, 0);
              }}
              className={({ isActive }) => (isActive ? 'headerbtn active' : 'headerbtn')}
            >
              {loggedInUser ? loggedInUser : "Log In"}
            </NavLink>
          </li>
          {loggedInUser && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Log Out
            </button>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
}