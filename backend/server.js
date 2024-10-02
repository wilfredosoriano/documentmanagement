const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const documentTitleRoutes = require('./routes/documentTitleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const claimableDocumentRoutes = require('./routes/claimableDocumentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
require('dotenv').config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'https://documentmanagementsystem.onrender.com'],
    credentials: true 
}));

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

//routes
app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/titles', documentTitleRoutes);
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/claimableDocuments', claimableDocumentRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
