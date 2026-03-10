import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
  Collapse,
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

const drawerWidth = 240;
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
    text: "Settings",
    icon: <SettingsIcon />,
    path: "/settings",
    roles: ["Admin"],
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
    text: "Income Tax Slabs",
    icon: <PaidIcon />,
    path: "/org-settings/income-tax",
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

  const isOrgRoute = location.pathname.startsWith("/org-settings");

  const [orgOpen, setOrgOpen] = useState(false);

  useEffect(() => {
    setOrgOpen(isOrgRoute);
  }, [isOrgRoute]);

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(role)
  );

  const renderMenu = (items) =>
    items.map((item) => (
      <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
        <ListItemButton
          selected={location.pathname === item.path}
          onClick={() => navigate(item.path)}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? 'initial' : 'center',
            color: location.pathname === item.path ? 'primary.main' : '',
            px: 2.5,
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

      {/* MAIN MENU */}
      <List>{renderMenu(filteredMenu)}</List>

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
                sx={{ opacity: drawerOpen ? 1 : 0 }}
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
                    onClick={() => navigate(item.path)}
                    sx={{
                      pl: drawerOpen ? 4 : 2.5,
                      justifyContent: drawerOpen ? 'initial' : 'center',
                      color: location.pathname === item.path ? 'primary.main' : '',
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