const express = require('express');
const bodyParser = require('body-parser');
const { authenticate } = require("@cloudflare/pages-plugin-turnstile");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        // Authenticate the request using Turnstile
        const { user, error } = await authenticate(req);

        if (error) {
            return res.status(error.status).json({ error: error.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // If the request is authenticated, return a success response
        return res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
        console.error('Error during authentication:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
