const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Send task creation notification
const sendTaskCreationEmail = async (userEmail, username, task) => {
    try {
        const msg = {
            to: userEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: process.env.SENDGRID_FROM_NAME
            },
            subject: '🎯 New Task Created - Todo App',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Arial', sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            margin: 0; 
                            padding: 0; 
                            background-color: #f4f4f4;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            background: white;
                            border-radius: 10px; 
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header { 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                            color: white; 
                            padding: 30px 20px; 
                            text-align: center; 
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 28px;
                        }
                        .content { 
                            padding: 30px; 
                        }
                        .task-details { 
                            background: #f8f9fa; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border-left: 4px solid #667eea;
                        }
                        .task-title { 
                            font-size: 20px; 
                            color: #2d3748; 
                            margin: 0 0 10px 0;
                        }
                        .deadline { 
                            color: #e53e3e; 
                            font-weight: bold; 
                        }
                        .priority-high { color: #e53e3e; }
                        .priority-medium { color: #d69e2e; }
                        .priority-low { color: #38a169; }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            color: #718096; 
                            font-size: 14px;
                            padding: 20px;
                            border-top: 1px solid #e2e8f0;
                        }
                        .btn {
                            display: inline-block;
                            padding: 12px 24px;
                            background: #667eea;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>📝 Todo App</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Task Successfully Created</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #2d3748; margin-bottom: 20px;">Hello, ${username}! 👋</h2>
                            <p style="color: #4a5568;">Your new task has been successfully created and added to your todo list.</p>
                            
                            <div class="task-details">
                                <h3 class="task-title">${task.title}</h3>
                                ${task.description ? `
                                    <p style="color: #4a5568; margin: 15px 0;">
                                        <strong style="color: #2d3748;">Description:</strong><br>
                                        ${task.description}
                                    </p>
                                ` : ''}
                                
                                <p style="margin: 10px 0;">
                                    <strong style="color: #2d3748;">Priority:</strong>
                                    <span class="priority-${task.priority}" style="font-weight: bold;">
                                        ${task.priority.toUpperCase()}
                                    </span>
                                </p>
                                
                                ${task.deadline ? `
                                    <p style="margin: 10px 0;">
                                        <strong style="color: #2d3748;">Deadline:</strong><br>
                                        <span class="deadline">${new Date(task.deadline).toLocaleString()}</span>
                                    </p>
                                    <p style="color: #718096; font-style: italic; margin: 10px 0;">
                                        ⏰ You'll receive a reminder 4 hours before the deadline.
                                    </p>
                                ` : `
                                    <p style="color: #718096; font-style: italic; margin: 10px 0;">
                                        No deadline set for this task.
                                    </p>
                                `}
                            </div>
                            
                            <p style="color: #4a5568; text-align: center;">
                                <a href="http://localhost:3000/todo" class="btn">View Your Tasks</a>
                            </p>
                            
                            <p style="color: #4a5568; text-align: center;">
                                Stay productive and organized! 💪
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated notification from Todo App.</p>
                            <p>If you didn't create this task, please ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const result = await sgMail.send(msg);
        console.log('✅ Task creation email sent to:', userEmail);
        return result;
    } catch (error) {
        console.error('❌ Error sending task creation email:', error);
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        throw error;
    }
};

// Send deadline reminder notification
const sendDeadlineReminderEmail = async (userEmail, username, task) => {
    try {
        const deadline = new Date(task.deadline);
        const timeLeft = Math.ceil((deadline - new Date()) / (1000 * 60 * 60)); // Hours left
        
        const msg = {
            to: userEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: process.env.SENDGRID_FROM_NAME
            },
            subject: '⏰ Task Deadline Approaching - Todo App',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { 
                            font-family: 'Arial', sans-serif; 
                            line-height: 1.6; 
                            color: #333; 
                            margin: 0; 
                            padding: 0; 
                            background-color: #f4f4f4;
                        }
                        .container { 
                            max-width: 600px; 
                            margin: 0 auto; 
                            background: white;
                            border-radius: 10px; 
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        }
                        .header { 
                            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                            color: white; 
                            padding: 30px 20px; 
                            text-align: center; 
                        }
                        .header h1 { 
                            margin: 0; 
                            font-size: 28px;
                        }
                        .content { 
                            padding: 30px; 
                        }
                        .task-details { 
                            background: #fff5f5; 
                            padding: 20px; 
                            border-radius: 8px; 
                            margin: 20px 0; 
                            border-left: 4px solid #ff6b6b;
                        }
                        .task-title { 
                            font-size: 20px; 
                            color: #2d3748; 
                            margin: 0 0 10px 0;
                        }
                        .deadline { 
                            color: #e53e3e; 
                            font-weight: bold; 
                        }
                        .urgent-badge {
                            background: #e53e3e;
                            color: white;
                            padding: 8px 16px;
                            border-radius: 20px;
                            font-weight: bold;
                            display: inline-block;
                            margin: 5px 0;
                        }
                        .footer { 
                            text-align: center; 
                            margin-top: 30px; 
                            color: #718096; 
                            font-size: 14px;
                            padding: 20px;
                            border-top: 1px solid #e2e8f0;
                        }
                        .btn {
                            display: inline-block;
                            padding: 12px 24px;
                            background: #e53e3e;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 10px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>⏰ Todo App</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Deadline Reminder</p>
                        </div>
                        <div class="content">
                            <h2 style="color: #2d3748; margin-bottom: 20px;">Hello, ${username}! 👋</h2>
                            <p style="color: #4a5568;">This is a friendly reminder about your upcoming task deadline:</p>
                            
                            <div class="task-details">
                                <h3 class="task-title">${task.title}</h3>
                                
                                ${task.description ? `
                                    <p style="color: #4a5568; margin: 15px 0;">
                                        <strong style="color: #2d3748;">Description:</strong><br>
                                        ${task.description}
                                    </p>
                                ` : ''}
                                
                                <p style="margin: 10px 0;">
                                    <strong style="color: #2d3748;">Priority:</strong>
                                    <span class="priority-${task.priority}" style="font-weight: bold; color: ${
                                        task.priority === 'high' ? '#e53e3e' : 
                                        task.priority === 'medium' ? '#d69e2e' : '#38a169'
                                    }">
                                        ${task.priority.toUpperCase()}
                                    </span>
                                </p>
                                
                                <p style="margin: 10px 0;">
                                    <strong style="color: #2d3748;">Deadline:</strong><br>
                                    <span class="deadline">${deadline.toLocaleString()}</span>
                                </p>
                                
                                <p style="margin: 15px 0;">
                                    <strong style="color: #2d3748;">Time Remaining:</strong><br>
                                    <span class="urgent-badge">${timeLeft} HOURS</span>
                                </p>
                            </div>
                            
                            <p style="color: #4a5568; text-align: center;">
                                <a href="http://localhost:3000/todo" class="btn">Complete Task Now</a>
                            </p>
                            
                            <p style="color: #4a5568; text-align: center; font-weight: bold;">
                                Don't forget to complete your task on time! 🎯
                            </p>
                        </div>
                        <div class="footer">
                            <p>This is an automated reminder from Todo App.</p>
                            <p>You can manage your notification settings in your account.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const result = await sgMail.send(msg);
        console.log('✅ Deadline reminder email sent to:', userEmail);
        return result;
    } catch (error) {
        console.error('❌ Error sending deadline reminder email:', error);
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        throw error;
    }
};

// Test SendGrid configuration
const testEmailConfig = async () => {
    try {
        const msg = {
            to: process.env.SENDGRID_FROM_EMAIL, // Send test to yourself
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: process.env.SENDGRID_FROM_NAME
            },
            subject: '✅ SendGrid Test - Todo App',
            text: 'SendGrid is properly configured for your Todo App!',
            html: '<strong>SendGrid is properly configured for your Todo App!</strong>'
        };

        await sgMail.send(msg);
        console.log('✅ SendGrid configuration test passed');
        return true;
    } catch (error) {
        console.error('❌ SendGrid configuration test failed:', error);
        if (error.response) {
            console.error('SendGrid error details:', error.response.body);
        }
        return false;
    }
};

module.exports = {
    sendTaskCreationEmail,
    sendDeadlineReminderEmail,
    testEmailConfig
};