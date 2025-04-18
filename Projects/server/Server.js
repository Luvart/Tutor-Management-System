const express = require('express');
const cors = require('cors');
const scheduleRoutes = require('./routes/scheduleRoutes');
const packageRoutes = require('./routes/packageRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const packageBookingRoutes = require('./routes/packageBookingRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes')
const sessionRoutes = require('./routes/sessionRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Allow specific origin
const corsOptions = {
  origin: ['http://localhost:3000', 'http://192.168.254.124:3000'], // Add your network IP here
  methods: '*', // Specify allowed methods
  optionsSuccessStatus: 200,
  credentials: true, // Enable this if you are sending cookies or authorization headers
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/package', packageRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/packageBooking', packageBookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/payments', paymentsRoutes);


// Serve static files from the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Global handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Optionally, you could close your server or take any recovery action here
  process.exit(1);  // Exit with failure
});