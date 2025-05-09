import React from 'react'
import { useState } from 'react'

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem("user") !== null);

  const handleRegister = () => {
    // if (username && password) {
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
    // } else {
    //     alert("Username and password are required!");
    //   }
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
    sessionStorage.removeItem("user");
    setUsername("");
    setPassword("");
    setIsLoggedIn(false);
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
