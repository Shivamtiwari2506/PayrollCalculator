import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { HashLoader } from "react-spinners";

export default function Loader({
  message = 'Loading...',
  fullScreen = false,
  height = '60vh',
  delay = 300,
  minDuration = 500,
}) {
  const [visible, setVisible] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let delayTimer = setTimeout(() => {
      setVisible(true);
      setStartTime(Date.now());
    }, delay);

    return () => clearTimeout(delayTimer);
  }, [delay]);

  // Handle minimum display time
  useEffect(() => {
    return () => {
      if (startTime) {
        const elapsed = Date.now() - startTime;
        if (elapsed < minDuration) {
          setTimeout(() => {}, minDuration - elapsed);
        }
      }
    };
  }, [startTime, minDuration]);

  if (!visible) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: fullScreen ? '100vh' : height,
        }}
      />
    );
  }

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <HashLoader color="#6366f1" />

      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : height,
        width: '100%',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {content}
    </Box>
  );
}