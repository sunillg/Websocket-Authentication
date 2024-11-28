import { useNavigate } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Signup from "../pages/Login/SignUp";
import axios from 'axios';
import '@testing-library/jest-dom';


jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));
jest.mock('axios');


describe("Signup Component", () => {
  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue({ navigate: jest.fn() });
  });
  test("Form render", () => {
    render(<Signup />);
    expect(screen.getByTestId("form-test")).toBeInTheDocument();
  });

  test("Top icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("title-icon")).toBeInTheDocument();
  });
  
  test("Welcome Back Title", () => {
    render(<Signup />);
    const SignupTitle = screen.getByText(/Create Account/i);
    expect(SignupTitle).toBeInTheDocument();
  });
  test("Sign in to your secure account text ", () => {
    render(<Signup />);
    const SignupTitle = screen.getByText(/Sign up for a new account/i);
    expect(SignupTitle).toBeInTheDocument();
  });

  test("Username Input field", () => {
    render(<Signup />);
    const inputElement = screen.getByPlaceholderText(/Enter the Username/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Mail Input field", () => {
    render(<Signup />);
    const inputElement = screen.getByPlaceholderText(/Enter the Email/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Password Input field", () => {
    render(<Signup />);
    const inputElement = screen.getByPlaceholderText(/Enter the Password/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Confirm Password Input field", () => {
    render(<Signup />);
    const inputElement = screen.getByPlaceholderText(/Confirm Password/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Username icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("username-icon")).toBeInTheDocument();
  });
  test("Mail icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });
  test("Password icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("password-icon")).toBeInTheDocument();
  });
  test("Confirm Password icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("con-password-icon")).toBeInTheDocument();
  });
  test("Password Toggle icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("password-toggle-icon")).toBeInTheDocument();
  });
  test("Confirm Password Toggle icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("con-toggle-icon")).toBeInTheDocument();
  });
  test("Signup icon text", () => {
    render(<Signup />);
    expect(screen.getByTestId("Signup-icon")).toBeInTheDocument();
  });
  test("Signup btn", () => {
    render(<Signup />);
    expect(screen.getByTestId("signup-btn")).toBeInTheDocument();
  });
  test("Signup button  Text", () => {
    render(<Signup />);
    const loginTitle = screen.getByText("Sign up");
    expect(loginTitle).toBeInTheDocument();
  });
  test("Navigation Text", () => {
    render(<Signup />);
    const SignupTitle = screen.getByText(/You have an Account ?/i);
    expect(SignupTitle).toBeInTheDocument();
    const linkElement = screen.getByText(/Click here/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/login');
    expect(screen.getByText(/to LogIn/i)).toBeInTheDocument();
  });
  test("Or continue with  Text", () => {
    render(<Signup />);
    const SignupTitle = screen.getByText(/Or continue with/i);
    expect(SignupTitle).toBeInTheDocument();
  });
  test("Google Account  Text", () => {
    render(<Signup />);
    const SignupTitle = screen.getByText(/Google Account/i);
    expect(SignupTitle).toBeInTheDocument();
  });
  test("Google btn", () => {
    render(<Signup />);
    expect(screen.getByTestId("google-btn")).toBeInTheDocument();
  });
  test("Google btn", () => {
    render(<Signup />);
    const onClick = jest.fn();
    const btn = screen.getByTestId("google-btn")
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(0)
  });

  // test('Passwords do not match Error', async () => {
  //   render(<Signup />);
  
  //   const password = screen.getByPlaceholderText('Enter the Password');
  //   const confirmPassword = screen.getByPlaceholderText('Confirm Password');
  //   const signupButton = screen.getByRole('button',{name: /Sign up/i});
  
  //   fireEvent.change(password, { target: { value: 'admin' } });
  //   fireEvent.change(confirmPassword, { target: { value: '123' } });
  
  //   fireEvent.click(signupButton);
  //   expect(screen.getByText("Passwords doesn't match.")).toBeInTheDocument();
  // });

  test('Toggle password visibility', () => {
    render(<Signup />);
    const passwordInput = screen.getByPlaceholderText('Enter the Password');
    const togglePasswordButton = screen.getByTestId('password-toggle-icon');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');  
  });

  test('Confirm Toggle password visibility', () => {
    render(<Signup />);
    const passwordInput = screen.getByPlaceholderText('Confirm Password');
    const togglePasswordButton = screen.getByTestId('con-toggle-icon');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(togglePasswordButton);
    expect(passwordInput).toHaveAttribute('type', 'password');  
  });
  


  test('should submit form with valid data',  () => {
    render(<Signup />);
  
    const usernameInput = screen.getByPlaceholderText('Enter the Username');
    const emailInput = screen.getByPlaceholderText('Enter the Email');
    const passwordInput = screen.getByPlaceholderText('Enter the Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    const signupButton = screen.getByRole('button',{name : /Sign up/i});
  
    fireEvent.change(usernameInput, { target: { value: 'admin' } });
    fireEvent.change(emailInput, { target: { value: 'admin@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'admin' } });
      fireEvent.click(signupButton);
       waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
       expect(axios.post).toHaveBeenCalled();
      });
  
  
});
