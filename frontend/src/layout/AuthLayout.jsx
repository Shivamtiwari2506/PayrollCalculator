import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Loader from '../utils/Loader';

export default function AuthLayout() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", position: "relative" }}>

      {/* Left Banner — always full background on mobile, half on desktop */}
      <Box
        sx={{
          position: { xs: "fixed", lg: "relative" },
          top: 0,
          left: 0,
          width: { xs: "100%", lg: "50%" },
          height: { xs: "100%", lg: "auto" },
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)",
          opacity: { xs: 0.8, lg: 1 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 4, lg: 6 },
          zIndex: 0,
        }}
      >
        <Box sx={{ display: { xs: "none", lg: "block" }, color: "white", textAlign: "center", maxWidth: 480 }}>
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, fontSize: { xs: "1.75rem", lg: "2.5rem" } }}>
            Welcome to Our Platform
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400, fontSize: { xs: "1rem", lg: "1.25rem" } }}>
            Manage your organization, collaborate with your team, and achieve more together
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <svg width="240" height="240" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="150" cy="150" r="30" fill="white" opacity="0.9" />
              <line x1="150" y1="150" x2="80" y2="80" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="220" y2="80" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="80" y2="220" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="220" y2="220" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="150" y2="50" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="150" y2="250" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="50" y2="150" stroke="white" strokeWidth="2" opacity="0.5" />
              <line x1="150" y1="150" x2="250" y2="150" stroke="white" strokeWidth="2" opacity="0.5" />
              <circle cx="80" cy="80" r="20" fill="white" opacity="0.7" />
              <circle cx="220" cy="80" r="20" fill="white" opacity="0.7" />
              <circle cx="80" cy="220" r="20" fill="white" opacity="0.7" />
              <circle cx="220" cy="220" r="20" fill="white" opacity="0.7" />
              <circle cx="150" cy="50" r="20" fill="white" opacity="0.7" />
              <circle cx="150" cy="250" r="20" fill="white" opacity="0.7" />
              <circle cx="50" cy="150" r="20" fill="white" opacity="0.7" />
              <circle cx="250" cy="150" r="20" fill="white" opacity="0.7" />
              <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="1" opacity="0.2" />
              <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="1" opacity="0.15" />
            </svg>
          </Box>

          <Typography variant="body1" sx={{ mt: 4, opacity: 0.8 }}>
            Secure • Reliable • Collaborative
          </Typography>
        </Box>
      </Box>

      {/* Right Side — form floats as a card over the banner on mobile */}
      <Box
        sx={{
          width: { xs: "100%", lg: "50%" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, lg: 4 },
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 440,
            bgcolor: { xs: "background.paper", lg: "transparent" },
            borderRadius: { xs: 2, lg: 2 },
            boxShadow: { xs: "0 8px 40px rgba(0,0,0,0.18)", lg: "none" },
            px: { xs: 3, sm: 4, lg: 0 },
            py: { xs: 2, sm: 4, lg: 0 },
          }}
        >
          {/* Logo — only on mobile */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: "center",
              my: 1,
            }}
          >
            <img
              src="./PayPilotLogo.png"
              alt="PayPilot"
              style={{ height: 48, width: "auto", objectFit: "contain" }}
            />
          </Box>

          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}