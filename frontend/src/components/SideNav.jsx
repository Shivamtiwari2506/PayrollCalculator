import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Collapse,
  Typography,
  Divider,
} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PaidIcon from '@mui/icons-material/Paid';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const drawerWidth = 260;
const collapsedWidth = 72;

const menuItems = [
  {
    text: "Dashboard",
    icon: <HomeIcon />,
    path: "/dashboard",
    roles: ["Admin", "Org_Admin", "User"],
  },
  {
    text: "Users",
    icon: <PeopleIcon />,
    path: "/users",
    roles: ["Admin"],
  },
  {
    text: "Payslip",
    icon: <DescriptionIcon />,
    path: "/org-settings/payslip",
    roles: ["User"],
  },
];

const settingsItems = [
  {
    text: "Income Tax Slabs",
    icon: <PaidIcon />,
    path: "/settings/income-tax",
  },
];


const orgSettingsItems = [
  {
    text: "Profile",
    icon: <BusinessIcon />,
    path: "/org-settings/profile",
  },
  {
    text: "Payroll",
    icon: <ReceiptLongIcon />,
    path: "/org-settings/payroll",
  },
  {
    text: "Leave & Attendance",
    icon: <EventAvailableIcon />,
    path: "/org-settings/leave",
  },
  {
    text: "Employees & Roles",
    icon: <PeopleIcon />,
    path: "/org-settings/employees",
  },
  {
    text: "Payslip",
    icon: <DescriptionIcon />,
    path: "/org-settings/payslip",
  },
  {
    text: "Notifications",
    icon: <NotificationsIcon />,
    path: "/org-settings/notifications",
  },
];

export default function SideNav({
  user,
  mobileOpen,
  drawerOpen,
  onDrawerToggle,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const role = JSON.parse(localStorage.getItem("user"))?.role || user?.role;
  const currentOrg = JSON.parse(localStorage.getItem('org'));

  const isOrgRoute = location.pathname.startsWith("/org-settings");
  const isSettingsRoute = location.pathname.startsWith("/settings");

  const [orgOpen, setOrgOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPadding, setLogoPadding] = useState(0.5);

  useEffect(() => {
    setOrgOpen(isOrgRoute);
    setSettingsOpen(isSettingsRoute);
  }, [isOrgRoute, isSettingsRoute]);

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

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const renderMenu = (items) =>
    items.map((item) => (
      <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          selected={location.pathname === item.path}
          onClick={() => {
            mobileOpen ? onDrawerToggle() : null;
            navigate(item.path)}}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? 'initial' : 'center',
            color: location.pathname === item.path ? 'primary.main' : '',
            px: 1.5,
            mx: 2,
            borderRadius: 1,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 2 : 'auto',
              justifyContent: 'center',
              color: location.pathname === item.path ? 'primary.main' : '',
            }}
          >
            {item.icon}
          </ListItemIcon>

          <ListItemText
            primary={item.text}
            sx={{
              opacity: drawerOpen ? 1 : 0,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s',
            }}
          />
        </ListItemButton>
      </ListItem>
    ));

  const drawer = (
    <Box>
      <Toolbar />

      {/* COMPANY SECTION */}
      {currentOrg && (
        <Box sx={{ px: 2, py: 1.5,}}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: drawerOpen ? 'flex-start' : 'center',
              gap: drawerOpen ? 1.5 : 0,
            }}
          >
            {/* Company Logo */}
            {companyLogo && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: drawerOpen ? 48 : 40,
                  width: drawerOpen ? 48 : 40,
                  overflow: "hidden",
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: "divider",
                  p: logoPadding,
                  flexShrink: 0,
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
            
            {/* Company Info */}
            {drawerOpen && (
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    padding: 0,
                    margin: 0,
                    color: 'text.primary',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    // lineHeight: 1.2,
                  }}
                >
                  {currentOrg?.name}
                </Typography>
            )}
          </Box>
        </Box>
      )}

      {currentOrg && <Divider/>}

      {/* MAIN MENU */}
      <List>{renderMenu(filteredMenu)}</List>

      {/* SETTINGS GROUP */}
      {role === "Admin" && (
        <>
          <ListItem disablePadding>
            <ListItemButton
              selected={isSettingsRoute}
              onClick={() => setSettingsOpen((prev) => !prev)}
              sx={{
                px: 2.5,
                justifyContent: drawerOpen ? 'initial' : 'center',
                color: isSettingsRoute ? 'primary.main' : '',
                mx: 1.5, 
                my: 0.5,
                borderRadius: 1
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isSettingsRoute ? 'primary.main' : '',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>

              <ListItemText
                primary="Settings"
                sx={{ opacity: drawerOpen ? 1 : 0 }}
              />

              {drawerOpen &&
                (settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map((item) => (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: 'block' }}
                >
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      mobileOpen ? onDrawerToggle() : null;
                      navigate(item.path)}}
                    sx={{
                      pl: drawerOpen ? 4 : 2.5,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      color: location.pathname === item.path ? 'primary.main' : '',
                      mx: 1.5,
                      my: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path ? 'primary.main' : '',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{ display: drawerOpen ? 'block' : 'none' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      )}

      {/* ORG SETTINGS GROUP */}
      {role === "Org_Admin" && (
        <>

          <ListItem disablePadding>
            <ListItemButton
              selected={isOrgRoute}
              onClick={() => setOrgOpen((prev) => !prev)}
              sx={{
                px: 2.5,
                justifyContent: drawerOpen ? 'initial' : 'center',
                color: isOrgRoute ? 'primary.main' : '',
                mx: 1.5, 
                my: 0.5,
                borderRadius: 1
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: drawerOpen ? 2 : 'auto',
                  justifyContent: 'center',
                  color: isOrgRoute ? 'primary.main' : '',
                }}
              >
                <SettingsIcon />
              </ListItemIcon>

              <ListItemText
                primary="Organization Settings"
                sx={{ opacity: drawerOpen ? 1 : 0}}
              />

              {drawerOpen &&
                (orgOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
            </ListItemButton>
          </ListItem>

          <Collapse in={orgOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {orgSettingsItems.map((item) => (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={{ display: 'block' }}
                >
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      mobileOpen ? onDrawerToggle() : null; navigate(item.path)}}
                    sx={{
                      px: drawerOpen ? 4 : 2.5,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      color: location.pathname === item.path ? 'primary.main' : '',
                      mx: 1.5,
                      my: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: drawerOpen ? 2 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname === item.path ? 'primary.main' : '',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.text}
                      sx={{ display: drawerOpen ? 'block' : 'none' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      )}
    </Box>
  );

  return (
    <Box component="nav" sx={{ flexShrink: { sm: 0 } }}>
      {/* MOBILE */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* DESKTOP */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            overflowX: 'hidden',
            boxSizing: 'border-box',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}