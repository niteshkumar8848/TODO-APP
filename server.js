const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Route for serving HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'signup.html'));
});

app.get('/todo', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'todo.html'));
});

// API proxy to backend (for development)
app.use('/api', (req, res) => {
    // This would typically proxy to your backend server
    res.status(404).json({ message: 'Backend server not running' });
});

app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
    console.log('Make sure backend server is running on http://localhost:5000');
});