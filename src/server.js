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
// Note: Frontend is hosted separately on Hostinger, not served from backend

// Store generation status
const generationStatus = new Map();

// API Routes

/**
 * POST /api/generate
 * Generate complete curriculum based on form data (ASYNC)
 * Returns immediately, generation happens in background, email sent when complete
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

        // Validate email is provided
        if (!formData.email) {
            return res.status(400).json({
                error: 'Email address is required',
                message: 'Please provide your email address to receive the curriculum'
            });
        }

        // Generate unique request ID
        const requestId = `curr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store initial status
        generationStatus.set(requestId, {
            status: 'processing',
            email: formData.email,
            startedAt: new Date().toISOString(),
            progress: 'Starting curriculum generation...'
        });

        // Return immediately - generation will continue in background
        console.log('✅ Request accepted - generation starting in background');
        res.json({
            success: true,
            message: 'Curriculum generation started! You will receive an email when complete.',
            requestId: requestId,
            email: formData.email,
            estimatedTime: '2-3 minutes',
            status: 'processing'
        });

        // Generate curriculum in background (don't await)
        console.log('🤖 Starting AI generation in background...');
        generateCurriculum(formData)
            .then(result => {
                console.log('✅ Background generation complete!');
                generationStatus.set(requestId, {
                    status: 'completed',
                    email: formData.email,
                    completedAt: new Date().toISOString(),
                    result: result
                });
            })
            .catch(error => {
                console.error('❌ Background generation failed:', error);
                generationStatus.set(requestId, {
                    status: 'failed',
                    email: formData.email,
                    error: error.message,
                    failedAt: new Date().toISOString()
                });
            });

    } catch (error) {
        console.error('❌ Error processing request:', error);
        res.status(500).json({
            error: 'Failed to start curriculum generation',
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

// Root endpoint - just returns API info
app.get('/', (req, res) => {
    res.json({
        name: 'CurrForge API',
        version: '2.0',
        status: 'running',
        agents: 10,
        endpoints: {
            health: '/api/health',
            generate: 'POST /api/generate',
            download: 'GET /api/download/:filename'
        }
    });
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
