import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { AlertPopupConfig } from '../components/PopupConfigs';
import { ConfirmPopupConfig } from '../components/PopupConfigs';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("user") !== null);
  const navigate = useNavigate();
  const { Component: AlertPopupComponent, trigger: triggerAlertPopup } = AlertPopupConfig();
  const { Component: ConfirmPopupComponent, trigger: triggerConfirmPopup} = ConfirmPopupConfig();

   // Ensure the default user exists when the component loads
  useEffect(() => {
    if (!sessionStorage.getItem("test")) {
      sessionStorage.setItem("test", JSON.stringify({ username: "test", password: "test" }));
    }
  }, []);

  const handleRegister = () => {
      if (username.trim() === "" || password.trim() === "") {
        triggerAlertPopup({message:"Username and password are required!"})
        return;
      }
      
      if (sessionStorage.getItem(username)) {
        triggerAlertPopup({message:"User already exists!"})
      }  else {
         sessionStorage.setItem(username, JSON.stringify({ username, password })); 
         sessionStorage.setItem("user", JSON.stringify({ username }));
         setIsLoggedIn(true);
        triggerAlertPopup({message:"Registration successful! You are now logged in."});
      } 
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(sessionStorage.getItem(username));
    if (storedUser && storedUser.password === password) {
      sessionStorage.setItem("user", JSON.stringify({ username }));
      setIsLoggedIn(true);
    } else {
      triggerAlertPopup({message:"Incorrect username or password!"})
    }
  };

    const handleLogout = () => {
    triggerConfirmPopup({
      message: "Are you sure you want to log out?",
      onConfirm: () => {
        sessionStorage.removeItem("user");
        setUsername("");
        setPassword("");
        setIsLoggedIn(false);
        navigate("/");
      }
    });
  };


  return (
    <div>
        <AlertPopupComponent />
        <ConfirmPopupComponent />
    {isLoggedIn ? (
      <div>
        <h2>Welcome, {JSON.parse(sessionStorage.getItem("user")).username}!</h2>
        <button onClick={handleLogout} className="button">Log out</button>
      </div>
    ) : (
      <div>
        <h2>Log in</h2>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="button">Log in</button>
        <p>New user? Please enter a username and password above, then press register:</p>
        <button onClick={handleRegister} className="button">Register</button>
      </div>
    )}
  </div>
  )
}
