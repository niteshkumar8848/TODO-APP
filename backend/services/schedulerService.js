const cron = require('node-cron');
const Task = require('../models/Task');
const User = require('../models/User');
const { sendDeadlineReminderEmail } = require('./emailService');

// Check for tasks with deadlines approaching (4 hours before)
const checkDeadlineReminders = async () => {
    try {
        console.log('🔍 Checking for deadline reminders...');
        
        const now = new Date();
        const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        
        // Find tasks with deadlines in the next 4 hours that are not completed
        const upcomingTasks = await Task.find({
            deadline: {
                $gte: now,
                $lte: fourHoursLater
            },
            completed: false,
            reminderSent: { $ne: true } // Only tasks that haven't received reminder
        }).populate('user');

        console.log(`Found ${upcomingTasks.length} tasks needing reminders`);

        for (const task of upcomingTasks) {
            try {
                if (task.user && task.user.email) {
                    await sendDeadlineReminderEmail(task.user.email, task.user.username, task);
                    
                    // Mark reminder as sent to avoid duplicate emails
                    task.reminderSent = true;
                    await task.save();
                    
                    console.log(`✅ Reminder sent for task: "${task.title}" to ${task.user.email}`);
                }
            } catch (emailError) {
                console.error(`❌ Failed to send reminder for task ${task._id}:`, emailError);
            }
        }
    } catch (error) {
        console.error('Error in deadline reminder check:', error);
    }
};

// Initialize scheduler
const initScheduler = () => {
    // Run every 30 minutes to check for deadlines
    cron.schedule('*/30 * * * *', () => {
        console.log('⏰ Running deadline reminder check...');
        checkDeadlineReminders();
    });

    // Also run immediately on startup
    setTimeout(() => {
        checkDeadlineReminders();
    }, 10000); // Wait 10 seconds after server start

    console.log('✅ Deadline reminder scheduler initialized');
};

module.exports = {
    initScheduler,
    checkDeadlineReminders
};