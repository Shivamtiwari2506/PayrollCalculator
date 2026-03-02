import { Typography, Paper } from '@mui/material';
import { useDispatch ,useSelector} from 'react-redux';
import Loader from '../utils/Loader';
import { getCurrentUser } from '../redux/actions/userActions';
import { getOrgData } from '../redux/actions/orgActions';
import { useEffect } from 'react';

export default function Dashboard() {

  const dispatch = useDispatch();
  const { org, loading: orgLoading } = useSelector((state) => state.orgState);
  const { user, loading: userLoading } =useSelector((state) => state.userState);
  console.log(user, "...........", org);


  useEffect(()=> {
    dispatch(getCurrentUser());
    dispatch(getOrgData());
  }, [])

  if(orgLoading || userLoading) return (
    <Loader fullScreen={true} />
  );
  return (
    <Paper elevation={3} className="p-8">
      <Typography variant="h4" className="mb-6">Dashboard</Typography>
      <Typography>Welcome to your dashboard!</Typography>
    </Paper>
  );
}
