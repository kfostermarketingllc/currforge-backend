const mailchimp = require('@mailchimp/mailchimp_marketing');

/**
 * Mailchimp Audience Service
 * Adds submitted emails to Mailchimp marketing audience/list
 */

// Initialize Mailchimp Marketing client
mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_MARKETING_API_KEY,
    server: process.env.MAILCHIMP_MARKETING_API_KEY ? process.env.MAILCHIMP_MARKETING_API_KEY.split('-')[1] : 'us11'
});

const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID;

/**
 * Add contact to Mailchimp audience
 */
async function addToAudience({ email, firstName = '', lastName = '', tags = [] }) {
    try {
        console.log(`📋 Adding contact to Mailchimp audience: ${email}`);

        if (!AUDIENCE_ID) {
            console.error('⚠️ MAILCHIMP_AUDIENCE_ID not configured - skipping audience sync');
            return { success: false, error: 'Audience ID not configured' };
        }

        // Add or update member in audience
        const response = await mailchimp.lists.setListMember(
            AUDIENCE_ID,
            email.toLowerCase(),
            {
                email_address: email,
                status_if_new: 'subscribed', // Auto-subscribe new members
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                },
                tags: tags.length > 0 ? tags : ['currforge-user']
            }
        );

        console.log(`✅ Contact added to audience: ${response.email_address} (${response.status})`);

        return {
            success: true,
            status: response.status,
            email: response.email_address,
            id: response.id
        };

    } catch (error) {
        console.error('❌ Error adding contact to Mailchimp audience:', error.message);

        // Check if error is due to invalid email
        if (error.status === 400 && error.response?.body?.title === 'Member Exists') {
            console.log('ℹ️ Contact already exists in audience - updating...');
            return {
                success: true,
                status: 'existing',
                email: email
            };
        }

        // Log detailed error but don't throw - audience sync failure shouldn't break curriculum generation
        if (error.response?.body) {
            console.error('Mailchimp API Error:', error.response.body);
        }

        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Add curriculum generation event to contact
 * (Optional: Track what curriculum they generated)
 */
async function addCurriculumEvent({ email, book, grade, subject }) {
    try {
        console.log(`📊 Adding curriculum event for: ${email}`);

        if (!AUDIENCE_ID) {
            return { success: false, error: 'Audience ID not configured' };
        }

        // Add event to member
        await mailchimp.lists.createListMemberEvent(
            AUDIENCE_ID,
            email.toLowerCase(),
            {
                name: 'curriculum_generated',
                properties: {
                    book: book,
                    grade: grade,
                    subject: subject,
                    timestamp: new Date().toISOString()
                }
            }
        );

        console.log(`✅ Event tracked for ${email}`);

        return { success: true };

    } catch (error) {
        console.error('⚠️ Error adding event (non-critical):', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Bulk add contacts to audience
 */
async function bulkAddToAudience(contacts) {
    try {
        console.log(`📋 Bulk adding ${contacts.length} contacts to audience...`);

        if (!AUDIENCE_ID) {
            return { success: false, error: 'Audience ID not configured' };
        }

        const operations = contacts.map(contact => ({
            method: 'PUT',
            path: `/lists/${AUDIENCE_ID}/members/${emailToMD5(contact.email)}`,
            body: JSON.stringify({
                email_address: contact.email,
                status_if_new: 'subscribed',
                merge_fields: {
                    FNAME: contact.firstName || '',
                    LNAME: contact.lastName || ''
                },
                tags: contact.tags || ['currforge-user']
            })
        }));

        const response = await mailchimp.batches.start({
            operations: operations
        });

        console.log(`✅ Batch operation started: ${response.id}`);

        return {
            success: true,
            batchId: response.id,
            count: contacts.length
        };

    } catch (error) {
        console.error('❌ Error with bulk add:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Convert email to MD5 hash (required for Mailchimp API)
 */
function emailToMD5(email) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
}

module.exports = {
    addToAudience,
    addCurriculumEvent,
    bulkAddToAudience
};
