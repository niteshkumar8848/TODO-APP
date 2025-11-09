const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const { initScheduler } = require('./services/schedulerService');
const { testEmailConfig } = require('./services/emailService');

dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Test SendGrid configuration on startup
testEmailConfig().then(success => {
    if (success) {
        console.log('✅ SendGrid email service is ready');
    } else {
        console.log('❌ SendGrid email service configuration failed');
        console.log('💡 Make sure you have:');
        console.log('   - Verified sender identity in SendGrid');
        console.log('   - Set correct SENDGRID_API_KEY in .env');
        console.log('   - Verified SENDGRID_FROM_EMAIL is correct');
    }
});

// Initialize deadline reminder scheduler
initScheduler();

app.get('/', (req, res) => {
    res.json({ 
        message: 'Todo API is running...',
        features: ['User Authentication', 'Task Management', 'SendGrid Email Notifications', 'Deadline Reminders'],
        emailProvider: 'SendGrid'
    });
});

// Test email endpoint
app.get('/api/test-email', async (req, res) => {
    try {
        const result = await testEmailConfig();
        res.json({ 
            success: result, 
            message: result ? 'SendGrid is properly configured' : 'SendGrid configuration failed',
            provider: 'SendGrid'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📧 Email provider: SendGrid`);
    console.log(`📨 From email: ${process.env.SENDGRID_FROM_EMAIL}`);
});