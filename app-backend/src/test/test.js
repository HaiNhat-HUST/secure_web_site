const sequelize = require('./../config/db');
const express = require('express');
const app = express();

async function testDatabaseConnection() {
    try {
        console.log('Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

async function testApplication() {
    try {
        console.log('\nTesting application setup...');
        
        // Test basic express setup
        app.get('/health', (req, res) => {
            res.json({ status: 'ok' });
        });

        const server = app.listen(3000, () => {
            console.log('✅ Application server started successfully!');
        });

        // Test health endpoint
        const response = await fetch('http://localhost:3000/health');
        const data = await response.json();
        
        if (data.status === 'ok') {
            console.log('✅ Health endpoint working correctly!');
        } else {
            console.log('❌ Health endpoint returned unexpected response');
        }

        server.close();
        return true;
    } catch (error) {
        console.error('❌ Application test failed:', error);
        return false;
    }
}

async function runTests() {
    console.log('Starting application tests...\n');
    
    const dbSuccess = await testDatabaseConnection();
    const appSuccess = await testApplication();
    
    console.log('\nTest Summary:');
    console.log('Database Connection:', dbSuccess ? '✅ PASSED' : '❌ FAILED');
    console.log('Application Test:', appSuccess ? '✅ PASSED' : '❌ FAILED');
    
    if (dbSuccess && appSuccess) {
        console.log('\nAll tests passed successfully! 🎉');
        process.exit(0);
    } else {
        console.log('\nSome tests failed. Please check the errors above. ❌');
        process.exit(1);
    }
}

runTests(); 