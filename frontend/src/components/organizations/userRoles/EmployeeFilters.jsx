import { Paper, Grid, TextField, MenuItem, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const EmployeeFilters = ({ search, setSearch, designationFilter, setDesignationFilter, designations, handleOpenAdd }) => {
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
            fullWidth={true}
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
            fullWidth={true}
            size="small"
            label="Filter by Designation"
            value={designationFilter}
            onChange={(e) => setDesignationFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            {designations.map((r) => (
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
            fullWidth={false}
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              height: 40,
              width: { xs: '100%', sm: 'auto' }
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
