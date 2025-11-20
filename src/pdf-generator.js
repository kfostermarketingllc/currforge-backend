const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * PDF Generation Module
 * Creates professional PDF documents for all curriculum outputs
 */

const PDF_OUTPUT_DIR = path.join(__dirname, '../generated-pdfs');

// Ensure output directory exists
if (!fs.existsSync(PDF_OUTPUT_DIR)) {
    fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
}

/**
 * Main PDF generation function
 */
async function generatePDF({ type, content, context }) {
    return new Promise((resolve, reject) => {
        try {
            // Create filename
            const timestamp = Date.now();
            const filename = `${type}_${context.grade}_${timestamp}.pdf`;
            const filepath = path.join(PDF_OUTPUT_DIR, filename);

            // Create PDF document
            const doc = new PDFDocument({
                size: 'LETTER',
                margins: {
                    top: 72,
                    bottom: 72,
                    left: 72,
                    right: 72
                },
                info: {
                    Title: `${getTitleForType(type)} - ${context.bookTitle}`,
                    Author: 'CurrForge',
                    Subject: `${context.grade} Grade ${context.subject}`,
                    Keywords: `${type}, curriculum, ${context.bookTitle}`,
                    CreationDate: new Date()
                }
            });

            // Pipe to file
            const stream = fs.createWriteStream(filepath);
            doc.pipe(stream);

            // Add content based on type
            addHeader(doc, type, context);
            addContent(doc, content, type);
            addFooter(doc, context);

            // Finalize PDF
            doc.end();

            // Wait for file to be written
            stream.on('finish', () => {
                // Get file stats
                const stats = fs.statSync(filepath);
                const pages = doc.bufferedPageRange().count;

                resolve({
                    filename: filename,
                    path: filepath,
                    size: stats.size,
                    pages: pages
                });
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Add PDF header
 */
function addHeader(doc, type, context) {
    // Title
    doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#EA580C')
        .text(getTitleForType(type), { align: 'center' });

    doc.moveDown(0.5);

    // Course Info
    doc.fontSize(14)
        .font('Helvetica')
        .fillColor('#64748b')
        .text(`${context.bookTitle}`, { align: 'center' });

    doc.fontSize(12)
        .text(`Grade ${context.grade} | ${context.state} | ${context.duration}`, { align: 'center' });

    doc.moveDown(1);

    // Separator line
    doc.moveTo(72, doc.y)
        .lineTo(540, doc.y)
        .strokeColor('#e2e8f0')
        .stroke();

    doc.moveDown(1);

    // Reset color
    doc.fillColor('#1e293b');
}

/**
 * Add content to PDF
 */
function addContent(doc, content, type) {
    // Set default font and size
    doc.fontSize(11)
        .font('Helvetica');

    // Split content into paragraphs
    const paragraphs = content.split('\n\n');

    paragraphs.forEach((paragraph, index) => {
        // Check if we need a new page
        if (doc.y > 700) {
            doc.addPage();
        }

        // Handle headings (lines starting with # or numbers followed by .)
        if (paragraph.match(/^#{1,3}\s/)) {
            // Markdown-style heading
            const level = paragraph.match(/^(#{1,3})/)[1].length;
            const text = paragraph.replace(/^#{1,3}\s/, '');

            if (level === 1) {
                doc.fontSize(18).font('Helvetica-Bold').fillColor('#2563eb');
            } else if (level === 2) {
                doc.fontSize(14).font('Helvetica-Bold').fillColor('#1e293b');
            } else {
                doc.fontSize(12).font('Helvetica-Bold').fillColor('#1e293b');
            }

            doc.text(text, { continued: false });
            doc.moveDown(0.5);
            doc.fontSize(11).font('Helvetica').fillColor('#1e293b');

        } else if (paragraph.match(/^\d+\./)) {
            // Numbered list item
            doc.font('Helvetica')
                .text(paragraph, {
                    indent: 20,
                    paragraphGap: 5
                });

        } else if (paragraph.match(/^[-•]\s/)) {
            // Bulleted list item
            doc.font('Helvetica')
                .text(paragraph, {
                    indent: 20,
                    paragraphGap: 5
                });

        } else if (paragraph.match(/^\*\*/)) {
            // Bold text
            const text = paragraph.replace(/\*\*/g, '');
            doc.font('Helvetica-Bold').text(text);
            doc.font('Helvetica');

        } else {
            // Regular paragraph
            doc.font('Helvetica')
                .text(paragraph, {
                    align: 'left',
                    paragraphGap: 10
                });
        }

        doc.moveDown(0.5);
    });
}

/**
 * Add footer to each page
 */
function addFooter(doc, context) {
    const pages = doc.bufferedPageRange();

    for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(pages.start + i);

        // Footer text
        const footerY = 750;

        doc.fontSize(9)
            .font('Helvetica')
            .fillColor('#94a3b8')
            .text(
                `Forged by CurrForge | ${context.bookTitle} | Page ${i + 1} of ${pages.count}`,
                72,
                footerY,
                {
                    align: 'center',
                    width: 468
                }
            );
    }
}

/**
 * Get human-readable title for document type
 */
function getTitleForType(type) {
    const titles = {
        foundation: 'Educational Foundation Document',
        syllabus: 'Course Syllabus',
        materials: 'Materials & Resources List',
        grading: 'Grading Criteria & Rubrics',
        tests: 'Tests & Examinations',
        quizzes: 'Quizzes & Quick Assessments',
        discussions: 'Discussion Questions',
        homework: 'Homework Assignments',
        reading: 'Reading Schedule & Plan',
        lessons: 'Daily Lesson Plans'
    };

    return titles[type] || 'Curriculum Document';
}

module.exports = {
    generatePDF
};

