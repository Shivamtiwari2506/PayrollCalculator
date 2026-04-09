import { Box, Typography } from '@mui/material';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Loader from '../utils/Loader';

export default function AuthLayout() {
  return (
    <Box className="min-h-screen flex">
      {/* Left Side - Common Graphics */}
      <Box className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 items-center justify-center p-12">
        <Box className="text-white text-center max-w-lg">
          <Typography variant="h2" className="font-bold mb-6">
            Welcome to Our Platform
          </Typography>
          <Typography variant="h6" className="mb-8 opacity-90">
            Manage your organization, collaborate with your team, and achieve more together
          </Typography>
          
          {/* Graphic Illustration */}
          <Box className="flex justify-center items-center mt-12">
            <svg className="w-80 h-80" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Central Hub */}
              <circle cx="150" cy="150" r="30" fill="white" opacity="0.9"/>
              
              {/* Connecting Lines */}
              <line x1="150" y1="150" x2="80" y2="80" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="220" y2="80" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="80" y2="220" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="220" y2="220" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="150" y2="50" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="150" y2="250" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="50" y2="150" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="150" y1="150" x2="250" y2="150" stroke="white" strokeWidth="2" opacity="0.5"/>
              
              {/* Outer Nodes */}
              <circle cx="80" cy="80" r="20" fill="white" opacity="0.7"/>
              <circle cx="220" cy="80" r="20" fill="white" opacity="0.7"/>
              <circle cx="80" cy="220" r="20" fill="white" opacity="0.7"/>
              <circle cx="220" cy="220" r="20" fill="white" opacity="0.7"/>
              <circle cx="150" cy="50" r="20" fill="white" opacity="0.7"/>
              <circle cx="150" cy="250" r="20" fill="white" opacity="0.7"/>
              <circle cx="50" cy="150" r="20" fill="white" opacity="0.7"/>
              <circle cx="250" cy="150" r="20" fill="white" opacity="0.7"/>
              
              {/* Decorative Rings */}
              <circle cx="150" cy="150" r="100" stroke="white" strokeWidth="1" opacity="0.2"/>
              <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="1" opacity="0.15"/>
            </svg>
          </Box>
          
          <Typography variant="body1" className="mt-12 opacity-80">
            Secure • Reliable • Collaborative
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Auth Forms (Outlet) */}
      <Box className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Box className="w-full max-w-md">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
}
