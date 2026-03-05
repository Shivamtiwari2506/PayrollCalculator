import { Grid } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StatCard from '../../StatCard';

const statConfig = [
  {
    label: 'Total Employees',
    key: 'total',
    color: 'primary.main',
    Icon: PeopleIcon,
  },
  {
    label: 'Active Employees',
    key: 'active',
    color: 'success.main',
    Icon: CheckCircleIcon,
  },
  {
    label: 'Admins',
    key: 'admins',
    color: 'warning.main',
    Icon: AdminPanelSettingsIcon,
  },
  {
    label: 'New This Month',
    key: 'newThisMonth',
    color: 'info.main',
    Icon: PersonAddIcon,
  },
];

const EmployeeStatsCards = ({ stats }) => {
  return (
    <Grid container spacing={2} alignItems="center" >
      {statConfig.map(({ label, key, color, Icon }) => (
        <Grid item xs={12} sm={6} md={3} key={key}>
          <StatCard
            title={label}
            value={stats?.[key] ?? 0}
            icon={<Icon />}
            color={color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EmployeeStatsCards;