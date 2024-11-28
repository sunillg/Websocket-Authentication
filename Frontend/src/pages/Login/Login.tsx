import React, { useState } from "react";
import axios from "axios";
import { LogIn, Eye, EyeOff, Mail, Lock, User2Icon } from "lucide-react";
import "./Login.css";
import { useLogin } from "@refinedev/core";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: login } = useLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("hitting");

      const response = await axios.post("http://localhost:3000/api/login", {
        username,
        password,
      
      });
      alert(response.data.message);
      console.log("Login successful:", response.data);
      console.log("Login Mobile:", response.data.user.mobileNumber);
      localStorage.setItem("mobileNumber", response.data.user.mobileNumber);
      localStorage.setItem("roleId", response.data.user.roleId);
      localStorage.setItem("login", response.data.login);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.user.username);

      await login({ username, password });
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Network error or Server Error");
      }
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          className="login-header"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <User2Icon
            className="w-16 h-16 mx-auto text-white"
            data-testid="title-icon"
          />
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your secure account</p>
        </motion.div>
        <motion.form
          onSubmit={handleLogin}
          data-testid="form-test"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        >
          <motion.div
            className="input-group"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.2 }}
          >
            <Mail className="input-icon" data-testid="mail-icon" />
            <input
              type="text"
              className="input-field"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            className="input-group"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.2 }}
          >
            <Lock className="input-icon" data-testid="password-icon" />
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
           
            <button
              type="button"
              className="password-toggle"
              data-testid="toggle-icon"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </motion.div>
          {error && <p className="error-message">{error}</p>}
          <motion.button
            type="submit"
            className="submit-button"
            data-testid="login-btn"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.2 }}
          >
            <LogIn data-testid="login-icon" />
            Login
          </motion.button>
        
          <p
            style={{
              color: "white",
              textDecoration: "none",
              fontWeight: "lighter",
              fontSize: "13px",
            }}
          >
            Don't have an Account?{" "}
            <a
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: "DodgerBlue",
                textDecoration: "underline DodgerBlue",
              }}
              href="/signup"
            >
              Click here
            </a>
            &nbsp;to signup
          </p>
          <br></br>
          <a
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "DodgerBlue",
              textDecoration: "underline DodgerBlue",
            }}
            href="/chat"
          >
            {" "}
            Help Chatbot
          </a>
        </motion.form>
        <motion.div
          className="divider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.2 }}
        >
          <span className="divider-text">Or continue with</span>
        </motion.div>
        <motion.div
          className="social-buttons"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.2 }}
        >
          <button className="social-button">Google Account</button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
