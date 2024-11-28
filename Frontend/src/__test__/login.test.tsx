import { useLogin } from "@refinedev/core";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "../pages/Login/Login";
import axios from 'axios';


jest.mock("@refinedev/core", () => ({
  useLogin: jest.fn(),
}));
jest.mock('axios');


describe("Login Component", () => {
  beforeEach(() => {
    (useLogin as jest.Mock).mockReturnValue({ mutate: jest.fn() });
  });
  test("Form render", () => {
    render(<Login />);
    expect(screen.getByTestId("form-test")).toBeInTheDocument();
  });

  test("Top icon text", () => {
    render(<Login />);
    expect(screen.getByTestId("title-icon")).toBeInTheDocument();
  });
  test("Welcome Back Title", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/Welcome Back/i);
    expect(loginTitle).toBeInTheDocument();
  });
  test("Sign in to your secure account text ", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/Sign in to your secure account/i);
    expect(loginTitle).toBeInTheDocument();
  });

  test("Username Input field", () => {
    render(<Login />);
    const inputElement = screen.getByPlaceholderText(/Username/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Password Input field", () => {
    render(<Login />);
    const inputElement = screen.getByPlaceholderText(/Password/i);
    expect(inputElement).toBeInTheDocument();
  });
  test("Mail icon text", () => {
    render(<Login />);
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });
  test("Password icon text", () => {
    render(<Login />);
    expect(screen.getByTestId("password-icon")).toBeInTheDocument();
  });
  test("Toggle icon text", () => {
    render(<Login />);
    expect(screen.getByTestId("toggle-icon")).toBeInTheDocument();
  });
  test("Login icon text", () => {
    render(<Login />);
    expect(screen.getByTestId("login-icon")).toBeInTheDocument();
  });
  test("Login btn", () => {
    render(<Login />);
    expect(screen.getByTestId("login-btn")).toBeInTheDocument();
  });
  test("Login button  Text", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/login/i);
    expect(loginTitle).toBeInTheDocument();
  });
  test("Navigation Text", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/Don't have an Account?/i);
    expect(loginTitle).toBeInTheDocument();
    const linkElement = screen.getByText(/Click here/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/signup');
    expect(screen.getByText(/to signup/i)).toBeInTheDocument();
  });
  test("Or continue with  Text", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/Or continue with/i);
    expect(loginTitle).toBeInTheDocument();
  });
  test("Google Account  Text", () => {
    render(<Login />);
    const loginTitle = screen.getByText(/Google Account/i);
    expect(loginTitle).toBeInTheDocument();
  });
  test("Google btn", () => {
    render(<Login />);
    const onClick = jest.fn();
    const btn = screen.getByRole('button', {name: /Google Account/i});
    fireEvent.click(btn)
    expect(onClick).toHaveBeenCalledTimes(0)
  });

 
});
