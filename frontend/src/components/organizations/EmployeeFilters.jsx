import { Paper, Grid, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const EmployeeFilters = ({ search, setSearch, roleFilter, setRoleFilter, roleOptions, handleOpenAdd }) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        my: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Grid container spacing={2} alignItems="center">

        {/* 🔍 Search */}
        <Grid item xs={12} md={5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* 🎭 Role Filter */}
        <Grid item xs={12} md={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Filter by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {roleOptions.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* ➕ Add Button */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            justifyContent: { xs: 'stretch', md: 'flex-end' },
          }}
        >
          <Button
            fullWidth={{ xs: true, md: false }}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              height: 40,
              px: 3,
            }}
          >
            Add Employee
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default EmployeeFilters;
