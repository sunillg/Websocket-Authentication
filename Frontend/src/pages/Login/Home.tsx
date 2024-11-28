import { useNavigate } from 'react-router-dom';
import './Home.css'; 

const Home = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    localStorage.clear()
    navigate('/login'); 
  };
  const handleChat = () => {
    const username = localStorage.getItem("username");
    navigate(`/chatroom?username=${username}`); 
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to Our Platform!</h1>
        <p>
          Our platform offers a wide range of tools and features designed to empower your journey.
          Whether you're here to explore, learn, or grow your business, we are dedicated to providing
          you with an exceptional experience.
        </p>
        <p>
          Browse through our features, connect with like-minded individuals, and unlock endless
          possibilities. We are constantly innovating to bring the best solutions for our users,
          helping you reach new heights of success.
        </p>
        <p>
          Join our community today and discover how we can help you achieve your goals in the most
          efficient and seamless way possible.
        </p>
        <button className="login-button" style={{margin: 15}}  onClick={handleChat}>
          Help!
        </button>
        <button className="login-button" onClick={handleLoginRedirect} data-testid='logout-btn'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;