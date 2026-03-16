import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Badge,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { getInitials } from '../utils/commonFunctions/helpers';
import { removeFromLocalStorage } from '../utils/commonFunctions/helpers';

export default function Header({ user, onMenuClick }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const avatarRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user')) || user;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    removeFromLocalStorage();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  const handleProfile = () => {
    handleClose();
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: { xs: 1, sm: 2 },
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Application Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: { xs: 1, sm: 2 },
            }}
          >
            <Box
              component="img"
              src="/PayPilotLogo.png"
              alt="PayPilot Logo"
              sx={{
                height: { xs: 32, sm: 40 },
                width: 'auto',
                maxWidth: { xs: 120, sm: 150 },
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          {/* Notification */}
          <IconButton
            sx={{
              bgcolor: "background.paper",
              color: 'text.primary',
              "&:hover": { bgcolor: "background.paper" },
              width: { xs: 40, sm: 44 },
              height: { xs: 40, sm: 44 },
            }}
          >
            <Badge 
              badgeContent={3} 
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  minWidth: 16,
                  height: 16,
                }
              }}
            >
              <NotificationsIcon fontSize={isMobile ? 'small' : 'medium'} />
            </Badge>
          </IconButton>

          {!isSmallScreen && (
            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ mx: 1, borderColor: 'divider' }}
            />
          )}

          {/* User Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 1.5 },
              py: 0.5,
              borderRadius: 2,
              cursor: "pointer",
              transition: "all 0.2s ease",
              bgcolor: 'action.hover',
              "&:hover": { 
                bgcolor: "action.selected",
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }
            }}
            onClick={handleAvatarClick}
            ref={avatarRef}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                bgcolor: "primary.main",
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 600,
                color: "primary.contrastText",
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              {getInitials(currentUser)}
            </Avatar>

            {/* User Info - Hidden on small screens */}
            {!isSmallScreen && (
              <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
                <Typography 
                  sx={{ 
                    fontSize: "0.9rem", 
                    fontWeight: 600,
                    color: 'text.primary',
                    maxWidth: 120,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {currentUser?.name}
                </Typography>

                <Chip
                  label={`${currentUser?.role === 'Admin' ? 'Platform Admin' : currentUser?.role === 'Org_Admin' ? 'Organization Admin' : 'User' }`}
                  size="small"
                  variant="filled"
                  sx={{
                    height: 18,
                    fontSize: "0.7rem",
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    alignSelf: 'flex-start',
                    mt: 0.5
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={avatarRef.current}
            open={menuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            slotProps={{
              paper: {
                elevation: 8,
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                },
              }
            }}
          >
            <MenuItem 
              onClick={handleProfile}
              sx={{
                py: 1.5,
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <Typography variant="body2">My Profile</Typography>
            </MenuItem>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem 
              onClick={handleLogoutClick}
              sx={{
                py: 1.5,
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" color="inherit" />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}