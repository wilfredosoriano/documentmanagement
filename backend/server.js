const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');
const documentTitleRoutes = require('./routes/documentTitleRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const claimableDocumentRoutes = require('./routes/claimableDocumentRoutes');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/uniforms')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.use('/api/documents', documentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/titles', documentTitleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/claimableDocuments', claimableDocumentRoutes);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
