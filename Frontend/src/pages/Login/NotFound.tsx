import { Button } from '@mui/material';
import './NotFound.css'; 

const NotFound = () => {
  return (
    <div className='fullpage'>
      <footer><Button 
          variant="contained" 
          color="primary" 
          href="/login" 
          className="button"
        >
          Go Back
        </Button></footer>  
    </div>
  );
};

export default NotFound;