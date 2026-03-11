import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import orgRoutes from './routes/orgRoutes.js'
import empRoutes from './routes/employeeRoutes.js'
import incomeTaxRoutes from './routes/incomeTaxSlabRoutes.js'
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/org', orgRoutes);
app.use('/api/employees', empRoutes);
app.use('/api/tax-slab', incomeTaxRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
