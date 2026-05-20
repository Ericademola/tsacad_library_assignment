require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const { scheduleOverdueCheck, runOverdueCheck } = require('./middleware/overdueCheck');

const authortRoute = require('./routes/authorRoute');
const bookRoute = require('./routes/bookRoute');
const studentRoute = require('./routes/studentRoute');
const attendantRoute = require('./routes/attendantRoute');
const authRoute = require('./routes/authRoute');

const app = express();

app.use(express.json());

// DB
connectDB();

// Run once on startup to catch any existing overdue books
runOverdueCheck();

// Schedule daily check
scheduleOverdueCheck();


// Routes
app.use('/api', authortRoute);
app.use('/api', bookRoute);
app.use('/api', studentRoute);
app.use('/api', attendantRoute);
app.use('/api', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});