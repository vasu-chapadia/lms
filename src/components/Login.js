import React from 'react';
import { Navigate } from "react-router-dom";

export default function Login() {
    const handleClick = () => {
        <Navigate to="/dashboard" replace={true} /> 
    }
  return(
    <form>
      <label>
        <p>Username</p>
        <input type="text" />
      </label>
      <label>
        <p>Password</p>
        <input type="password" />
      </label>
      <div>
        <button type="submit" onClick={handleClick}>Submit</button>
      </div>
    </form>
  )
}
