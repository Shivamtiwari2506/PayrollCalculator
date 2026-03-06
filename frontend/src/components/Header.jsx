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
  ListItemText,
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
  const avatarRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem('user')) || user;
  const currentOrg = JSON.parse(localStorage.getItem('org'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPadding, setLogoPadding] = useState(0.5);

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
    // navigate('/profile');
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

useEffect(() => {
  const logo = JSON.parse(localStorage.getItem("org"))?.profile?.logo;

  if (!logo) return;

  setCompanyLogo(logo);

  const img = new Image();
  img.src = logo;

  img.onload = () => {
    const ratio = img.width / img.height;

    if (ratio > 2) {
      // very wide logos
      setLogoPadding(1.2);
    } 
    else if (ratio < 0.7) {
      // very tall logos
      setLogoPadding(1);
    } 
    else {
      // normal logos
      setLogoPadding(0.5);
    }
  };
}, []);

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>

        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {companyLogo && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 48,
                width: 48,
                overflow: "hidden",
                mr: 2,
                borderRadius: 2,
                bgcolor: "white",
                boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
                p: logoPadding
              }}
            >
              <Box
                component="img"
                src={companyLogo}
                alt="Company Logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component="span" noWrap>
              {currentOrg?.name} <span className='italic text-sm'>{currentUser?.role === 'Org_Admin' ? `(Org Admin Panel)` : currentUser?.role === 'User' ? `(Employee Panel)` : `(Admin Panel)`}</span>
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{ fontSize: '0.75rem', lineHeight: 1 }}
            >
              Payroll Management System
            </Typography>
          </Box>
        </Box>

        {/* Right section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>

          {/* Avatar */}
          <Avatar
            ref={avatarRef}
            sx={{ cursor: 'pointer' }}
            onClick={handleAvatarClick}
          >
            {getInitials(currentUser)}
          </Avatar>

          {/* Dropdown menu */}
          <Menu
            anchorEl={avatarRef.current}
            open={menuOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1,
                minWidth: 190,
                borderRadius: 1,
              },
            }}
          >
            <MenuItem onClick={handleProfile}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>My Profile</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}