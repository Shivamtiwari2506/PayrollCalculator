import { Suspense, useEffect, useState } from "react";
import { Box, Toolbar, useTheme, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../redux/actions/userActions";
import Loader from "../utils/Loader";
import { getOrgData } from "../redux/actions/orgActions";

const DRAWER_WIDTH = 260;
const MINI_DRAWER_WIDTH = 72;

export default function AppLayout() {
  const dispatch = useDispatch();
  const {user, loading: userLoading} = useSelector((state) => state.userState) || {};
  const {org, loading: orgLoading } = useSelector((state) => state.orgState);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setDrawerOpen(!drawerOpen);
    }
  };
  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getOrgData());
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <Header user={user} onMenuClick={handleDrawerToggle} />

      <SideNav
        user={user}
        mobileOpen={mobileOpen}
        drawerOpen={drawerOpen}
        onDrawerToggle={handleDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          backgroundColor: (theme) => theme.palette.grey[100],

          ml: {
            xs: 0,
            sm: drawerOpen
              ? `${DRAWER_WIDTH}px`
              : `${MINI_DRAWER_WIDTH}px`,
          },

          width: {
            xs: "100%",
            sm: drawerOpen
              ? `calc(100% - ${DRAWER_WIDTH}px)`
              : `calc(100% - ${MINI_DRAWER_WIDTH}px)`,
          },

          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar />
        <Suspense fallback={<Loader delay={200} />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
}