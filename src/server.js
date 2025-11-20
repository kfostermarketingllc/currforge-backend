const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { generateCurriculum } = require('./curriculum-generator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Store generation status
const generationStatus = new Map();

// API Routes

/**
 * POST /api/generate
 * Generate complete curriculum based on form data
 */
app.post('/api/generate', async (req, res) => {
    try {
        console.log('📝 Received curriculum generation request');
        console.log('Form Data:', JSON.stringify(req.body, null, 2));

        const formData = req.body;

        // Validate required fields
        if (!formData.grade || !formData.subject || !formData.learningObjectives) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['grade', 'subject', 'learningObjectives']
            });
        }

        // Generate curriculum (this will take 2-3 minutes)
        console.log('🤖 Starting AI generation...');
        const result = await generateCurriculum(formData);

        console.log('✅ Generation complete!');
        res.json(result);

    } catch (error) {
        console.error('❌ Error generating curriculum:', error);
        res.status(500).json({
            error: 'Failed to generate curriculum',
            message: error.message
        });
    }
});

/**
 * GET /api/download/:filename
 * Download generated PDF
 */
app.get('/api/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../generated-pdfs', filename);

    console.log(`📥 Download request for: ${filename}`);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(404).json({ error: 'File not found' });
        }
    });
});

/**
 * GET /api/status/:id
 * Check generation status (for future async implementation)
 */
app.get('/api/status/:id', (req, res) => {
    const id = req.params.id;
    const status = generationStatus.get(id) || { status: 'not_found' };
    res.json(status);
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        anthropicConfigured: !!process.env.ANTHROPIC_API_KEY
    });
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
🔥 CurrForge Server Started!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Server running on: http://localhost:${PORT}
🌐 Open in browser:   http://localhost:${PORT}

🔑 Anthropic API:     ${process.env.ANTHROPIC_API_KEY ? '✅ Configured (Claude Haiku)' : '❌ Not configured'}

⚒️  Ready to forge curriculum!
Press Ctrl+C to stop
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

module.exports = app;
