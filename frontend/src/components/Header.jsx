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
import { useState, useRef } from 'react';
import { getInitials } from '../utils/commonFunctions/helpers';
import { removeFromLocalStorage } from '../utils/commonFunctions/helpers';

export default function Header({ user, onMenuClick }) {
  const navigate = useNavigate();
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
    // navigate('/profile');
  };

  const handleLogoutClick = () => {
    handleClose();
    handleLogout();
  };

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
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" component="span" noWrap>
              PAYRUN <span className='italic text-sm'>{currentUser?.role === 'Org_Admin' ? `(Org Admin Panel)` : currentUser?.role === 'User' ? `(Employee Panel)` : `(Admin Panel)`}</span>
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