import React from "react";
import {
  Refine,
  AuthProvider,
  AuthActionResponse,
} from "@refinedev/core";
import "@refinedev/antd/dist/reset.css";
import Login from "./pages/Login/Login";
import { BrowserRouter, redirect, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Login/Home";
import routerProvider from "@refinedev/react-router-v6";
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from "./pages/Login/SignUp";
import NotFound from "./pages/Login/NotFound";
import CourseList from "./pages/Login/CourseList";
import Practice from "./components/Practice/Practice";
import Employee from "./pages/Login/Employee";
import Spring from "./pages/Login/Spring";
import AwesomeReveal from './pages/Login/Practice/AwesomeReveal'
import ChatRoom from "./pages/Login/ChatRoom";
import LoginSample from "./pages/Login/LoginSample";
import Chat from "./pages/Login/Chat";



const authProvider: AuthProvider = {
  login: async ({ username, password }: any): Promise<AuthActionResponse> => {
    if (localStorage.getItem("login")) {
      return {
        success: true,
        redirectTo: `/home`,
        // redirectTo: `/chatroom?username=${username}`,
      };
    }
    
    alert("Login failed");
    return {
      success: false,
      error: {
        message: "Login failed",
        name: "Invalid username or password",
      },
    };
  },

  logout: async (): Promise<AuthActionResponse> => {
    localStorage.clear();
    // localStorage.removeItem("login");
    // localStorage.removeItem("token"); 
    return Promise.resolve({ success: true });
  },

  getPermissions: async () => Promise.resolve(),
  
  check: async () => {
    if (!localStorage.getItem("login")) {
      return { authenticated: false };
    }
    return { authenticated: true };
  },

  onError: function (error: any): Promise<any> {
    console.error(error);
    return Promise.resolve();
  },
};

const App: React.FC = () => {
  
  return (
    <BrowserRouter>
      <Refine authProvider={authProvider} routerProvider={routerProvider}>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace={true} />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/course" element={<CourseList/>}/>
          <Route path="/spring" element={<Spring/>}/>
          <Route path="/employee" element={<Employee/>}/>
          <Route path="/practice" element={<Practice />} />
          <Route path="/awesomeReveal" element={<AwesomeReveal />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/loginsample" element={<LoginSample />} />
          <Route path='/chat' element={<Chat/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
};

export default App;
