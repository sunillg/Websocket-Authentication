import Home from "../pages/Login/Home";
import { useNavigate } from "react-router-dom";
import { render, screen } from "@testing-library/react";



jest.mock("react-router-dom", () => ({
    useNavigate: jest.fn(),
}));
describe("Home",()=>{
    beforeEach(() => {
        (useNavigate as jest.Mock).mockReturnValue({ navigate: jest.fn() });
      });
      test("Sign in to your secure account text ", () => {
        render(<Home />);
        const SignupTitle = screen.getByText(/Welcome to Our Platform!/i);
        expect(SignupTitle).toBeInTheDocument();
      });
      test("Home Logout Button", () => {
        render(<Home />);
        expect(screen.getByTestId("logout-btn")).toBeInTheDocument();
      });
})