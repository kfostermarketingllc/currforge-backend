const mailchimp = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_API_KEY);

/**
 * Mailchimp Email Service
 * Sends curriculum PDFs to users via Mailchimp Transactional API
 */

const API_BASE_URL = process.env.API_BASE_URL || 'https://currforge-backend.onrender.com';

/**
 * Send curriculum email with PDF download links
 */
async function sendCurriculumEmail({ email, context, results }) {
    try {
        console.log(`📧 Preparing to send curriculum email to: ${email}`);

        // Build list of generated PDFs
        const pdfLinks = buildPDFLinks(results);

        // Create email content
        const message = {
            from_email: 'noreply@currforge.com',
            from_name: 'CurrForge',
            subject: `🔥 Your ${context.book} Curriculum is Ready!`,
            to: [
                {
                    email: email,
                    type: 'to'
                }
            ],
            html: buildEmailHTML(context, pdfLinks),
            text: buildEmailText(context, pdfLinks),
            track_opens: true,
            track_clicks: true,
            tags: ['curriculum-delivery'],
            merge_language: 'handlebars'
        };

        // Send via Mailchimp Transactional API
        const response = await mailchimp.messages.send({
            message: message
        });

        console.log(`✅ Email sent successfully to ${email}`);
        console.log('Mailchimp response:', JSON.stringify(response, null, 2));

        return {
            success: true,
            messageId: response[0]._id,
            status: response[0].status
        };

    } catch (error) {
        console.error('❌ Error sending email:', error);
        throw error;
    }
}

/**
 * Build PDF download links from results
 */
function buildPDFLinks(results) {
    const links = [];
    const documentTypes = [
        { key: 'foundation', title: 'Educational Foundation', icon: '🎓' },
        { key: 'specialEducation', title: 'Special Education Adaptations', icon: '♿' },
        { key: 'syllabus', title: 'Course Syllabus', icon: '📋' },
        { key: 'materials', title: 'Materials & Resources List', icon: '📚' },
        { key: 'grading', title: 'Grading Criteria & Rubrics', icon: '📊' },
        { key: 'tests', title: 'Tests & Examinations', icon: '📝' },
        { key: 'quizzes', title: 'Quizzes & Quick Assessments', icon: '✏️' },
        { key: 'discussions', title: 'Discussion Questions', icon: '💬' },
        { key: 'homework', title: 'Homework Assignments', icon: '📖' },
        { key: 'reading', title: 'Reading Schedule & Plan', icon: '📅' },
        { key: 'lessons', title: 'Daily Lesson Plans', icon: '🎯' }
    ];

    documentTypes.forEach(doc => {
        if (results[doc.key] && results[doc.key].filename) {
            links.push({
                icon: doc.icon,
                title: doc.title,
                url: `${API_BASE_URL}/api/download/${results[doc.key].filename}`,
                filename: results[doc.key].filename,
                pages: results[doc.key].pages || 0
            });
        }
    });

    return links;
}

/**
 * Build HTML email content
 */
function buildEmailHTML(context, pdfLinks) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your CurrForge Curriculum is Ready!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b;">

    <!-- Email Container -->
    <table role="presentation" style="width: 100%; max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">

        <!-- Header -->
        <tr>
            <td style="background: linear-gradient(135deg, #EA580C 0%, #DC2626 100%); padding: 40px 30px; text-align: center;">
                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                    🔥 Your Curriculum is Forged!
                </h1>
                <p style="margin: 10px 0 0 0; color: #fed7aa; font-size: 16px;">
                    ${context.book} - Grade ${context.grade}
                </p>
            </td>
        </tr>

        <!-- Success Message -->
        <tr>
            <td style="padding: 30px;">
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    Great news! Your complete curriculum for <strong>${context.book}</strong> has been successfully generated and is ready to download.
                </p>
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #475569;">
                    We've created ${pdfLinks.length} professional PDF documents covering everything you need for ${context.duration} of instruction:
                </p>
            </td>
        </tr>

        <!-- PDF Download Links -->
        <tr>
            <td style="padding: 0 30px 30px 30px;">
                ${pdfLinks.map(pdf => `
                <table role="presentation" style="width: 100%; margin-bottom: 15px; border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                    <tr>
                        <td style="padding: 20px; background-color: #f8fafc;">
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="width: 40px; font-size: 24px; vertical-align: middle;">
                                        ${pdf.icon}
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <div style="font-weight: 600; font-size: 16px; color: #1e293b; margin-bottom: 4px;">
                                            ${pdf.title}
                                        </div>
                                        <div style="font-size: 13px; color: #64748b;">
                                            ${pdf.filename}
                                        </div>
                                    </td>
                                    <td style="text-align: right; vertical-align: middle;">
                                        <a href="${pdf.url}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #EA580C 0%, #DC2626 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                                            Download PDF
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                `).join('')}
            </td>
        </tr>

        <!-- Tips Section -->
        <tr>
            <td style="padding: 0 30px 30px 30px; border-top: 2px solid #e2e8f0;">
                <h3 style="margin: 30px 0 15px 0; color: #1e293b; font-size: 18px;">
                    📚 What's Next?
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #475569; line-height: 1.8;">
                    <li>Review each document and customize as needed</li>
                    <li>Share relevant PDFs with your school administration</li>
                    <li>Print or distribute materials to students</li>
                    <li>Start teaching with confidence!</li>
                </ul>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="padding: 30px; background-color: #f8fafc; border-top: 2px solid #e2e8f0; text-align: center;">
                <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                    Forged with ❤️ by <strong style="color: #EA580C;">CurrForge</strong>
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                    Need help? Visit <a href="https://currforge.com/support" style="color: #EA580C; text-decoration: none;">currforge.com/support</a>
                </p>
            </td>
        </tr>

    </table>

</body>
</html>
    `.trim();
}

/**
 * Build plain text email content (fallback)
 */
function buildEmailText(context, pdfLinks) {
    return `
🔥 YOUR CURRICULUM IS READY!

${context.book} - Grade ${context.grade}

Your complete curriculum for ${context.duration} has been successfully generated!

DOWNLOAD YOUR PDFs:
${pdfLinks.map(pdf => `${pdf.icon} ${pdf.title}\n   ${pdf.url}\n`).join('\n')}

WHAT'S NEXT?
- Review each document and customize as needed
- Share relevant PDFs with your school administration
- Print or distribute materials to students
- Start teaching with confidence!

Forged with love by CurrForge
Need help? Visit https://currforge.com/support
    `.trim();
}

module.exports = {
    sendCurriculumEmail
};
