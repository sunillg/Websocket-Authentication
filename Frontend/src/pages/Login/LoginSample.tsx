import React, { useState } from "react";
import "./LoginSample.css";
import { Link } from "react-router-dom";
import axios from "axios";

const LoginSample = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        mobileNumber,
        password
      });
      alert(response.data.message)
      console.log('Login successful:', response.data);
      localStorage.setItem("login", response.data.login);
      localStorage.setItem("token", response.data.token);

    } catch (error: any) {
     console.log(error);
     
    }
  };


  return (
    <div className="container w-25 mt-4">
      {/* <div className="logo">
                <p>Logo</p>
            </div> */}
      <h1 className="login-h1">Login to your Account</h1>
      <form  onSubmit={handleLogin}>
        <div className="form-group">
          <input
            onChange={(e) => setMobileNumber(e.target.value)}
            type="text"
            placeholder="Username"
            required
            className="form-control form-input"
          />
        </div>
        <div className="form-group">
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            placeholder="Room"
            required
            className="form-control form-input"
          />
        </div>
        <Link
          to={mobileNumber ? `/chatroom?name=${name}` : "*"}
          onClick={(e) => (!mobileNumber ) && e.preventDefault()}
        >
          <button
            className="form-submit btn btn-primary"
            disabled={!mobileNumber}
          >
            Log In
          </button>
        </Link>
      </form>
    </div>
  );
};

export default LoginSample;
function login(arg0: { username: any; password: string; }) {
  throw new Error("Function not implemented.");
}

