import React from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const handleClick = (): void => {
    navigate('/test');
  };

  return (
    <div>
      <Typography variant="h1" component="h2">
        Home Page
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        MUI Button
      </Button>
    </div>
  );
};

export default HomePage;
