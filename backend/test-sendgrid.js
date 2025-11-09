require('dotenv').config();
const { testEmailConfig, sendTaskCreationEmail } = require('./services/emailService');

async function testSendGrid() {
    console.log('🧪 Testing SendGrid configuration...\n');
    
    // Test 1: Basic configuration
    console.log('1. Testing SendGrid API configuration...');
    const configTest = await testEmailConfig();
    
    if (!configTest) {
        console.log('❌ SendGrid configuration failed');
        return;
    }
    
    console.log('✅ SendGrid configuration successful\n');
    
    // Test 2: Send sample task email
    console.log('2. Testing task creation email...');
    const testTask = {
        title: 'Test Task with SendGrid',
        description: 'This is a test task to verify SendGrid email functionality',
        priority: 'high',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };
    
    try {
        await sendTaskCreationEmail(process.env.SENDGRID_FROM_EMAIL, 'Test User', testTask);
        console.log('✅ Task creation email test passed\n');
    } catch (error) {
        console.log('❌ Task creation email test failed:', error.message);
    }
    
    console.log('🎉 SendGrid testing completed!');
}

testSendGrid();