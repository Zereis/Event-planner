import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("user") !== null);
  const navigate = useNavigate();

   // Ensure the default user exists when the component loads
  useEffect(() => {
    if (!sessionStorage.getItem("test")) {
      sessionStorage.setItem("test", JSON.stringify({ username: "test", password: "test" }));
    }
  }, []);

  const handleRegister = () => {
      if (username.trim() === "" || password.trim() === "") {
        alert("Username and password are required!");
        return;
      }
      
      if (sessionStorage.getItem(username)) {
        alert("User already exists!");
      }  else {
         sessionStorage.setItem(username, JSON.stringify({ username, password })); 
         sessionStorage.setItem("user", JSON.stringify({ username }));
         setIsLoggedIn(true);
         alert("Registration successful! You are now logged in.");
      } 
  };

  const handleLogin = () => {
    const storedUser = JSON.parse(sessionStorage.getItem(username));
    if (storedUser && storedUser.password === password) {
      sessionStorage.setItem("user", JSON.stringify({ username }));
      setIsLoggedIn(true);
    } else {
      alert("Incorrect username or password!");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
    sessionStorage.removeItem("user");
    setUsername("");
    setPassword("");
    setIsLoggedIn(false);
    navigate("/");
    }
  };


  return (
    <div>
    {isLoggedIn ? (
      <div>
        <h2>Welcome, {JSON.parse(sessionStorage.getItem("user")).username}!</h2>
        <button onClick={handleLogout}>Log out</button>
      </div>
    ) : (
      <div>
        <h2>Log in</h2>
        <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Log in</button>
        <p>New user? Please enter a username and password above, then press register:</p>
        <button onClick={handleRegister}>Register</button>
      </div>
    )}
  </div>
  )
}
