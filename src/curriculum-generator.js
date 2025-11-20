const Anthropic = require('@anthropic-ai/sdk');
const { generatePDF } = require('./pdf-generator');
const AGENT_LIBRARY = require('../agents/agent-prompts');

// Initialize Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
});

// Book metadata database
const BOOK_DATABASE = {
    'to-kill-a-mockingbird': { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960, pages: 324 },
    'great-gatsby': { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925, pages: 180 },
    'scarlet-letter': { title: 'The Scarlet Letter', author: 'Nathaniel Hawthorne', year: 1850, pages: 238 },
    'of-mice-and-men': { title: 'Of Mice and Men', author: 'John Steinbeck', year: 1937, pages: 107 },
    'grapes-of-wrath': { title: 'The Grapes of Wrath', author: 'John Steinbeck', year: 1939, pages: 464 },
    'catcher-in-rye': { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951, pages: 277 },
    'adventures-huck-finn': { title: 'Adventures of Huckleberry Finn', author: 'Mark Twain', year: 1884, pages: 366 },
    'romeo-juliet': { title: 'Romeo and Juliet', author: 'William Shakespeare', year: 1597, pages: 150 },
    'hamlet': { title: 'Hamlet', author: 'William Shakespeare', year: 1603, pages: 200 },
    'macbeth': { title: 'Macbeth', author: 'William Shakespeare', year: 1623, pages: 130 },
    'othello': { title: 'Othello', author: 'William Shakespeare', year: 1622, pages: 165 },
    'midsummer-night': { title: "A Midsummer Night's Dream", author: 'William Shakespeare', year: 1600, pages: 120 },
    'julius-caesar': { title: 'Julius Caesar', author: 'William Shakespeare', year: 1623, pages: 140 },
    '1984': { title: '1984', author: 'George Orwell', year: 1949, pages: 328 },
    'animal-farm': { title: 'Animal Farm', author: 'George Orwell', year: 1945, pages: 112 },
    'brave-new-world': { title: 'Brave New World', author: 'Aldous Huxley', year: 1932, pages: 311 },
    'lord-of-flies': { title: 'Lord of the Flies', author: 'William Golding', year: 1954, pages: 224 },
    'pride-prejudice': { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813, pages: 279 },
    'frankenstein': { title: 'Frankenstein', author: 'Mary Shelley', year: 1818, pages: 280 },
    'odyssey': { title: 'The Odyssey', author: 'Homer', year: -800, pages: 541 },
    'iliad': { title: 'The Iliad', author: 'Homer', year: -762, pages: 704 },
    'oedipus-rex': { title: 'Oedipus Rex', author: 'Sophocles', year: -429, pages: 75 },
    'metamorphosis': { title: 'The Metamorphosis', author: 'Franz Kafka', year: 1915, pages: 70 },
    'night': { title: 'Night', author: 'Elie Wiesel', year: 1960, pages: 120 },
    'death-of-salesman': { title: 'Death of a Salesman', author: 'Arthur Miller', year: 1949, pages: 139 },
    'crucible': { title: 'The Crucible', author: 'Arthur Miller', year: 1953, pages: 143 },
    'raisin-in-sun': { title: 'A Raisin in the Sun', author: 'Lorraine Hansberry', year: 1959, pages: 151 },
    'poetry-anthology': { title: 'Poetry Anthology', author: 'Various Poets', year: 2024, pages: 200 }
};

/**
 * Main curriculum generation orchestrator
 */
async function generateCurriculum(formData) {
    console.log('🎓 Starting curriculum generation...');

    // Prepare context for AI agents
    const context = prepareContext(formData);

    // Define generation tasks
    // Foundation agent runs FIRST to establish philosophical framework
    const tasks = [
        { type: 'foundation', agent: AGENT_LIBRARY.foundation },
        { type: 'syllabus', agent: AGENT_LIBRARY.syllabus },
        { type: 'materials', agent: AGENT_LIBRARY.materials },
        { type: 'grading', agent: AGENT_LIBRARY.grading },
        { type: 'tests', agent: AGENT_LIBRARY.tests },
        { type: 'quizzes', agent: AGENT_LIBRARY.quizzes },
        { type: 'discussions', agent: AGENT_LIBRARY.discussions },
        { type: 'homework', agent: AGENT_LIBRARY.homework },
        { type: 'reading', agent: AGENT_LIBRARY.reading },
        { type: 'lessons', agent: AGENT_LIBRARY.lessons }
    ];

    // Generate all content sequentially (can be parallelized later)
    const results = {};

    for (const task of tasks) {
        console.log(`  🤖 Generating ${task.type}...`);

        try {
            // Call AI agent
            const content = await callAIAgent(task.agent, context);

            // If this is the foundation agent, add its output to context for subsequent agents
            if (task.type === 'foundation') {
                context.educationalFoundation = content;
                console.log(`  📚 Educational foundation established - will inform all subsequent components`);
            }

            // Generate PDF
            const pdfInfo = await generatePDF({
                type: task.type,
                content: content,
                context: context
            });

            results[task.type] = {
                content: content,
                filename: pdfInfo.filename,
                pages: pdfInfo.pages,
                path: pdfInfo.path
            };

            console.log(`  ✅ ${task.type} complete (${pdfInfo.pages} pages)`);

        } catch (error) {
            console.error(`  ❌ Failed to generate ${task.type}:`, error.message);
            results[task.type] = {
                error: error.message,
                filename: null,
                pages: 0
            };
        }
    }

    console.log('🎉 Curriculum generation complete!');

    return {
        success: true,
        timestamp: new Date().toISOString(),
        context: {
            book: context.bookTitle,
            grade: context.grade,
            duration: context.duration
        },
        ...results
    };
}

/**
 * Prepare context object for AI agents
 */
function prepareContext(formData) {
    const bookInfo = BOOK_DATABASE[formData.book] || {
        title: 'Selected Literary Work',
        author: 'Various',
        year: 2024,
        pages: 200
    };

    return {
        grade: formData.grade,
        subject: formData.subject,
        state: formData.state,
        zipcode: formData.zipcode,
        book: formData.book,
        bookTitle: `${bookInfo.title} by ${bookInfo.author}`,
        bookInfo: bookInfo,
        duration: formData.duration,
        specialEducation: formData.specialEducation || {},
        learningObjectives: formData.learningObjectives,
        additionalContext: formData.additionalContext || '',
        focusAreas: formData.focusAreas || []
    };
}

/**
 * Call AI agent using Anthropic Claude API
 */
async function callAIAgent(agent, context) {
    const userPrompt = agent.generatePrompt(context);

    console.log(`    📡 Calling ${agent.name}...`);

    const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 8000,
        temperature: 0.7,
        system: agent.systemPrompt,
        messages: [
            {
                role: 'user',
                content: userPrompt
            }
        ]
    });

    const content = message.content[0].text;

    console.log(`    ✅ Received ${content.length} characters from ${agent.name}`);

    return content;
}

module.exports = {
    generateCurriculum
};
