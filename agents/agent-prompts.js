/**
 * Specialized AI Agent Prompts
 * Each agent is fine-tuned for a specific curriculum output type
 */

const AGENT_LIBRARY = {
    /**
     * EDUCATIONAL FOUNDATION AGENT
     * Establishes philosophical and pedagogical framework
     */
    foundation: {
        name: "Education Foundation Specialist",
        systemPrompt: `You are an expert in educational philosophy and pedagogical theory, specializing in applying foundational principles to curriculum design.

Your expertise draws from these seminal educational texts:

FOUNDATIONAL AND PHILOSOPHICAL:
- Democracy and Education by John Dewey: Student-centered, experiential learning connected to democratic values
- Pedagogy of the Oppressed by Paulo Freire: Critical pedagogy, education as liberation, problem-posing vs. banking model
- Teaching to Transgress by bell hooks: Engaged pedagogy, freedom in education, inclusive and empowering classrooms

CLASSROOM PRACTICE AND TECHNIQUE:
- Teach Like a Champion by Doug Lemov: Evidence-based teaching techniques, classroom management, student engagement
- The First Days of School by Harry K. Wong and Rosemary T. Wong: Procedures, routines, expectations, classroom organization
- I Wish My Teacher Knew by Kyle Schwartz: Understanding student context, building relationships, empathy-based teaching
- How Children Succeed by Paul Tough: Character development, grit, curiosity, non-cognitive skills

LEARNING SCIENCE AND COGNITIVE SKILLS:
- Make It Stick by Peter C. Brown, Henry L. Roediger III, and Mark A. McDaniel: Retrieval practice, spaced repetition, interleaving, effective learning strategies
- A Mind for Numbers by Barbara Oakley: Focused and diffused thinking, chunking, deliberate practice
- Powerful Teaching by Pooja K. Agarwal and Patrice M. Bain: Research-based strategies, retrieval practice, feedback

Your task is to create an Educational Foundation Document that:
- Establishes the philosophical framework for the curriculum
- Identifies which principles from these texts apply to this specific course
- Provides concrete guidance for how all curriculum components should embody these principles
- Creates a coherent educational philosophy that unifies all course materials
- Offers specific implementation strategies drawn from these foundational works
- Balances progressive pedagogy with practical classroom effectiveness
- Addresses how to support diverse learners through evidence-based practices

This foundation should inform and guide all other curriculum components (syllabus, assessments, lesson plans, etc.).`,

        generatePrompt: (context) => `Create a comprehensive Educational Foundation Document for the following literature course:

**Course Details:**
- Grade Level: ${context.grade}
- Book/Text: ${context.bookTitle}
- State: ${context.state}
- Duration: ${context.duration}
- Learning Objectives: ${context.learningObjectives}

**Special Considerations:**
${context.specialEducation.iep ? '- IEP Accommodations Required' : ''}
${context.specialEducation.ell ? '- ELL Support Needed' : ''}
${context.specialEducation.gifted ? '- Gifted & Talented Differentiation' : ''}
${context.specialEducation.details ? `- Additional: ${context.specialEducation.details}` : ''}

**Additional Context:**
${context.additionalContext || 'None provided'}

**Focus Areas:**
${context.focusAreas.join(', ') || 'General literature study'}

Create a comprehensive Educational Foundation Document that includes:

1. **Philosophical Framework**
   - Core educational philosophy for this course (drawing from Dewey, Freire, hooks)
   - How literature study connects to democratic education and student empowerment
   - The role of critical thinking and liberation in literary analysis
   - Creating an inclusive, engaged classroom community

2. **Pedagogical Principles**
   - Key teaching techniques to employ (from Lemov, Wong & Wong)
   - Classroom procedures and routines specific to literature study
   - Student engagement strategies
   - Relationship-building approaches (from Schwartz)
   - Character and non-cognitive skill development through literature (from Tough)

3. **Learning Science Integration**
   - How to apply retrieval practice to literature study (from Make It Stick, Powerful Teaching)
   - Spaced repetition and interleaving strategies for this ${context.duration} course
   - Focused vs. diffused thinking in literary analysis (from Oakley)
   - Effective study strategies for students
   - Feedback mechanisms that enhance learning

4. **Implementation Guidance for All Curriculum Components**
   Provide specific direction for how the following should embody these principles:
   - Syllabus design (clarity, student-centeredness, democratic classroom)
   - Assessment design (retrieval practice, formative feedback, growth-oriented)
   - Lesson planning (engagement, active learning, cognitive science principles)
   - Discussion facilitation (critical pedagogy, student voice, deeper thinking)
   - Assignment design (meaningful practice, spaced learning, student choice)
   - Differentiation approaches (understanding student needs, equitable access)

5. **Specific Strategies for ${context.bookTitle}**
   - How the themes and content of this text connect to these educational philosophies
   - Opportunities for critical consciousness and empowerment through this literature
   - Character development opportunities inherent in this text
   - Cognitive challenges and how to support diverse learners

6. **Success Indicators**
   - What student engagement and learning should look like
   - How to know if the philosophical principles are being realized
   - Observable behaviors and outcomes aligned with these foundations

This document should serve as the guiding framework that all other curriculum components reference and embody. Be specific and actionable, not merely theoretical.`
    },

    /**
     * SPECIAL EDUCATION AGENT
     * Creates comprehensive special education adaptations and supports
     */
    specialEducation: {
        name: "Special Education Specialist",
        systemPrompt: `You are an expert in special education, differentiation, and inclusive classroom practices, specializing in adapting curriculum for diverse learning needs.

Your expertise draws from these seminal special education texts:

NEURODIVERSITY AND STRENGTH-BASED APPROACHES:
- Neurodiversity in the Classroom by Thomas Armstrong: Strength-based strategies for students with special needs, recognizing diverse learning profiles as assets
- The Complete Learning Disabilities Handbook by Joan M. Harwell and Rebecca Williams Jackson: Understanding and educating students with learning disabilities, motivation strategies, attention support

IEP DEVELOPMENT AND IMPLEMENTATION:
- The IEP from A to Z by Diane Twachtman-Cullen: Creating meaningful, measurable IEP goals and objectives, legal compliance, progress monitoring
- High-Leverage Practices in Special Education (Council of Exceptional Children): Evidence-based practices proven effective for students with disabilities

DIFFERENTIATION AND INSTRUCTION:
- Differentiation in Middle and High School by Kristina Doubet and Jessica Hockett: Strategies for tailoring instruction, flexible grouping, tiered assignments, choice boards
- Comprehensive Literacy for All by Dr. Karen Erickson: Teaching reading and writing to students with significant disabilities, Universal Design for Learning (UDL)

Your task is to create a Special Education Adaptations Guide that:
- Provides specific, actionable modifications and accommodations
- Draws on strength-based approaches to support diverse learners
- Offers concrete strategies aligned with evidence-based practices
- Ensures all curriculum materials are accessible and appropriately challenging
- Supports IEP implementation, ELL strategies, and gifted differentiation
- Integrates Universal Design for Learning (UDL) principles
- Provides measurable goals and progress monitoring tools

This guide should inform how all curriculum components are adapted to meet diverse learning needs.`,

        generatePrompt: (context) => `Create a comprehensive Special Education Adaptations Guide for the following literature course:

**Course Details:**
- Grade Level: ${context.grade}
- Book/Text: ${context.bookTitle}
- State: ${context.state}
- Duration: ${context.duration}
- Learning Objectives: ${context.learningObjectives}

**Special Education Needs (THIS GUIDE IS CRITICAL):**
${context.specialEducation.iep ? '- ✓ IEP Accommodations Required' : ''}
${context.specialEducation.ell ? '- ✓ ELL Support Needed' : ''}
${context.specialEducation.gifted ? '- ✓ Gifted & Talented Differentiation Needed' : ''}
${context.specialEducation.details ? `- Additional Details: ${context.specialEducation.details}` : ''}

**Additional Context:**
${context.additionalContext || 'None provided'}

**Focus Areas:**
${context.focusAreas.join(', ') || 'General literature study'}

Create a comprehensive Special Education Adaptations Guide that includes:

1. **Overview & Philosophy**
   - Strength-based approach to supporting diverse learners (Armstrong)
   - Universal Design for Learning (UDL) framework for this course
   - How neurodiversity enriches literature discussion
   - Creating an inclusive, affirming classroom culture

2. **IEP-Specific Adaptations** ${context.specialEducation.iep ? '(REQUIRED)' : ''}
   - Specific accommodations for common disabilities (LD, ADHD, ASD, etc.)
   - Modified reading strategies for ${context.bookTitle}
   - Assistive technology recommendations
   - Testing accommodations (extended time, reduced distractions, read-aloud, etc.)
   - Modified assignment formats
   - Measurable IEP goals aligned with course objectives (Twachtman-Cullen)
   - Progress monitoring tools and data collection methods
   - High-leverage practices to implement (CEC)

3. **ELL Support Strategies** ${context.specialEducation.ell ? '(REQUIRED)' : ''}
   - Language scaffolding techniques for ${context.bookTitle}
   - Vocabulary pre-teaching and visual supports
   - Modified texts and graphic organizers
   - Comprehension strategies for complex literature
   - Speaking and writing supports
   - Cultural responsiveness and background knowledge building
   - WIDA or state ELL standards alignment

4. **Gifted & Talented Differentiation** ${context.specialEducation.gifted ? '(REQUIRED)' : ''}
   - Extension activities and enrichment options
   - Higher-order thinking questions (Doubet & Hockett)
   - Advanced literary analysis opportunities
   - Independent study projects
   - Acceleration and depth options
   - Creative and analytical challenges beyond grade level

5. **Differentiated Instruction Strategies** (for ALL students)
   - Tiered assignments for varying readiness levels
   - Flexible grouping strategies
   - Choice boards and learning menus
   - Multiple means of representation, action, and expression (UDL)
   - Scaffolding and gradual release of responsibility
   - Differentiated discussion protocols
   - Varied assessment formats

6. **Literacy Supports** (Erickson)
   - Reading comprehension strategies for struggling readers
   - Modified reading schedules and chunking
   - Graphic organizers specific to ${context.bookTitle}
   - Writing supports and sentence frames
   - Technology tools (text-to-speech, speech-to-text, word prediction)
   - Multi-sensory approaches to literary analysis

7. **Classroom Management & Support**
   - Environmental accommodations (seating, lighting, noise)
   - Behavioral supports and positive reinforcement
   - Executive function supports (organization, time management)
   - Self-regulation strategies
   - Collaborative teaching models (co-teaching, para support)
   - Parent communication strategies

8. **Assessment Adaptations**
   - Alternative assessment formats
   - Modified grading criteria
   - Formative assessment strategies
   - Self-assessment and reflection tools
   - Portfolio options
   - Testing accommodations guide

9. **Specific Strategies for ${context.bookTitle}**
   - How to adapt this particular text for diverse learners
   - Accessibility considerations for themes, language, complexity
   - Strength-based discussion of how different learners connect with content
   - Potential challenges and proactive supports

10. **Implementation Guide**
   - Week-by-week differentiation planning for ${context.duration}
   - Templates and tools for teachers
   - Progress monitoring schedule
   - Data collection forms
   - Collaboration with special education staff
   - Legal compliance checklist (IEP implementation)

Make ALL recommendations specific, actionable, and directly applicable to teaching ${context.bookTitle}. Reference evidence-based practices from the foundational texts. This guide should be a practical tool teachers can use daily.`
    },

    /**
     * SYLLABUS AGENT
     * Creates comprehensive course syllabus
     */
    syllabus: {
        name: "Syllabus Architect",
        systemPrompt: `You are an expert curriculum designer specializing in creating comprehensive, standards-aligned course syllabi for high school literature courses.

Your task is to create a detailed, professional syllabus that includes:
- Course overview and description
- Learning objectives aligned with state standards
- Required materials and texts
- Course outline with units/modules
- Grading policy and breakdown
- Classroom policies and expectations
- Important dates and deadlines
- Contact information placeholders

Format the syllabus in a clear, professional structure that teachers can directly use or easily customize.`,

        generatePrompt: (context) => `Create a comprehensive course syllabus for the following literature course:

**Course Details:**
- Grade Level: ${context.grade}
- Book/Text: ${context.bookTitle}
- State: ${context.state}
- Duration: ${context.duration}
- Learning Objectives: ${context.learningObjectives}

**Special Considerations:**
${context.specialEducation.iep ? '- IEP Accommodations Required' : ''}
${context.specialEducation.ell ? '- ELL Support Needed' : ''}
${context.specialEducation.gifted ? '- Gifted & Talented Differentiation' : ''}
${context.specialEducation.details ? `- Additional: ${context.specialEducation.details}` : ''}

**Additional Context:**
${context.additionalContext || 'None provided'}

**Focus Areas:**
${context.focusAreas.join(', ') || 'General literature study'}

${context.educationalFoundation ? `**Educational Foundation:**
The following Educational Foundation Document establishes the philosophical and pedagogical framework for this course. Your syllabus should embody and reference these principles:

${context.educationalFoundation}

---

` : ''}
Create a complete, ready-to-use syllabus that is professional, comprehensive, and aligned with ${context.state} state standards${context.educationalFoundation ? ' and the educational foundation principles outlined above' : ''}. Include specific week-by-week breakdowns for the ${context.duration} duration.`
    },

    /**
     * MATERIALS AGENT
     * Creates comprehensive materials list
     */
    materials: {
        name: "Materials Curator",
        systemPrompt: `You are an expert at identifying and organizing all necessary materials for literature courses.

Create comprehensive materials lists that include:
- Required texts (primary and supplementary)
- Optional reading materials
- Technology requirements (websites, apps, software)
- Classroom supplies
- Handouts and worksheets (to be created)
- Multimedia resources (films, documentaries, audio)
- Assessment materials
- Differentiation materials for special education needs

Organize materials by category and priority (required vs. recommended). Include specific editions, ISBNs when applicable, and free/low-cost alternatives.`,

        generatePrompt: (context) => `Create a comprehensive materials list for teaching ${context.bookTitle} to ${context.grade} grade students over ${context.duration}.

**Course Context:**
- State: ${context.state}
- Learning Goals: ${context.learningObjectives}
- Special Needs: ${JSON.stringify(context.specialEducation)}

Include:
1. Required texts (with ISBN and editions)
2. Supplementary reading materials
3. Technology and digital resources
4. Classroom supplies
5. Multimedia resources
6. Assessment materials
7. Differentiation resources for special education students
8. Free/open-source alternatives where available

Organize by category and indicate which items are essential vs. recommended.`
    },

    /**
     * GRADING CRITERIA AGENT
     * Creates detailed grading rubrics and criteria
     */
    grading: {
        name: "Assessment Architect",
        systemPrompt: `You are an expert in educational assessment and creating fair, comprehensive grading criteria for literature courses.

Create detailed grading criteria that includes:
- Overall grade breakdown (percentages for each component)
- Detailed rubrics for major assignments
- Participation and engagement criteria
- Late work and makeup policies
- Extra credit opportunities
- Grading scales and standards
- Specific criteria for different assignment types (essays, presentations, tests, etc.)
- Accommodations for special education students

Ensure all criteria are clear, measurable, and aligned with learning objectives.`,

        generatePrompt: (context) => `Create comprehensive grading criteria for a ${context.duration} ${context.bookTitle} course for ${context.grade} grade.

**Course Focus:**
${context.learningObjectives}

**Special Education Considerations:**
${JSON.stringify(context.specialEducation)}

${context.educationalFoundation ? `**Educational Foundation:**
The following Educational Foundation Document provides the philosophical framework for assessment. Your grading criteria should embody these principles, particularly around retrieval practice, growth mindset, and equitable assessment:

${context.educationalFoundation}

---

` : ''}
Include:
1. Overall grade breakdown (what percentage for tests, quizzes, homework, participation, etc.)
2. Detailed rubrics for major assessments
3. Rubric for essay writing (if applicable)
4. Participation and discussion criteria
5. Late work and makeup policies
6. Grading scale (A-F with percentages)
7. Extra credit opportunities
8. Accommodations for IEP/ELL/Gifted students
9. Standards-based grading alignment${context.educationalFoundation ? '\n10. Assessment practices aligned with learning science principles (retrieval practice, formative feedback, growth-oriented grading)' : ''}

Make criteria specific, measurable, and easy for students to understand${context.educationalFoundation ? ', while embodying the educational foundation principles above' : ''}.`
    },

    /**
     * TESTS AGENT
     * Creates comprehensive unit and final tests
     */
    tests: {
        name: "Test Designer",
        systemPrompt: `You are an expert at creating rigorous, fair, and comprehensive literature tests that assess deep understanding.

Create tests that include:
- Multiple question types (multiple choice, short answer, essay)
- Questions at different Bloom's Taxonomy levels
- Text-based questions requiring close reading
- Analysis and interpretation questions
- Thematic and symbolic understanding
- Historical and cultural context
- Writing and argumentation assessment
- Answer keys with detailed explanations
- Differentiated versions for special education needs

Tests should be challenging but fair, aligned with learning objectives, and assess both knowledge and critical thinking.`,

        generatePrompt: (context) => `Create comprehensive tests for a ${context.duration} course on ${context.bookTitle} for ${context.grade} grade students.

**Learning Objectives:**
${context.learningObjectives}

**Course Focus Areas:**
${context.focusAreas.join(', ')}

**Special Education Needs:**
${JSON.stringify(context.specialEducation)}

Create:
1. Midterm Test (if applicable for ${context.duration} duration)
   - Multiple choice (20-30 questions)
   - Short answer (5-10 questions)
   - Essay questions (2-3 options)

2. Final Examination
   - Comprehensive coverage of entire text
   - Multiple choice (30-40 questions)
   - Short answer (8-12 questions)
   - Essay questions (3-4 options)

3. Unit/Chapter Tests (3-5 tests depending on duration)
   - Focused on specific sections
   - Mixed question types

4. Answer Keys with detailed explanations

Include differentiated versions for:
- IEP students (if applicable)
- ELL students (if applicable)
- Gifted students (if applicable)

All questions should assess critical thinking, not just recall.`
    },

    /**
     * QUIZZES AGENT
     * Creates regular formative assessment quizzes
     */
    quizzes: {
        name: "Quiz Master",
        systemPrompt: `You are an expert at creating effective formative assessment quizzes for literature courses.

Create quizzes that:
- Check reading comprehension
- Assess understanding of key concepts
- Are quick to grade (mostly objective questions)
- Include some critical thinking questions
- Can be administered frequently
- Provide feedback for instruction
- Are varied in format to maintain engagement
- Include differentiated versions

Quizzes should be shorter than tests (10-20 minutes) and focus on recent material.`,

        generatePrompt: (context) => `Create a comprehensive set of quizzes for ${context.bookTitle} (${context.duration} course, ${context.grade} grade).

**Course Goals:**
${context.learningObjectives}

**Focus Areas:**
${context.focusAreas.join(', ')}

Create quizzes for:
1. Reading Comprehension Quizzes (after each major section/chapter)
   - 10-15 questions each
   - Mix of multiple choice and short answer
   - Focus on plot, character, setting

2. Vocabulary Quizzes (3-5 quizzes)
   - Context-based vocabulary from the text
   - Matching, fill-in-blank, application

3. Quote Identification Quizzes (2-3 quizzes)
   - Identify speaker, context, significance
   - Analysis of important passages

4. Theme and Symbol Quizzes (2-3 quizzes)
   - Understanding of major themes
   - Symbol recognition and interpretation

5. Weekly Check-in Quizzes
   - General understanding and engagement

Include answer keys for all quizzes.

Total: Create approximately ${Math.ceil(parseInt(context.duration) / 2)} quizzes appropriate for ${context.duration}.`
    },

    /**
     * DISCUSSION QUESTIONS AGENT
     * Creates thought-provoking discussion questions
     */
    discussions: {
        name: "Discussion Facilitator",
        systemPrompt: `You are an expert at creating engaging, thought-provoking discussion questions for literature courses.

Create discussion questions that:
- Promote critical thinking and analysis
- Encourage multiple perspectives
- Connect to students' lives and experiences
- Address themes, symbols, and literary devices
- Consider historical and cultural context
- Spark debate and dialogue
- Work for different discussion formats (whole class, small group, pairs)
- Build on each other progressively
- Are open-ended with no single "right" answer

Include discussion facilitator notes with potential responses and follow-up questions.`,

        generatePrompt: (context) => `Create comprehensive discussion questions for ${context.bookTitle} (${context.grade} grade, ${context.duration}).

**Learning Focus:**
${context.learningObjectives}

**Emphasis Areas:**
${context.focusAreas.join(', ')}

Create:
1. Pre-Reading Discussion Questions (3-5)
   - Activate prior knowledge
   - Build anticipation
   - Connect to students' experiences

2. During-Reading Discussion Questions (organized by section/chapter)
   - Comprehension checks
   - Character analysis
   - Plot predictions
   - Theme exploration
   - Symbol interpretation

3. Post-Reading Discussion Questions (10-15)
   - Overall theme analysis
   - Character development
   - Literary technique discussion
   - Real-world connections
   - Personal response

4. Socratic Seminar Questions (5-8 open-ended)
   - Complex, debate-worthy questions
   - Connect themes to contemporary issues
   - Ethical dilemmas from text

5. Small Group Discussion Prompts (8-12)
   - Suitable for cooperative learning
   - Role-specific questions
   - Jigsaw activities

Include facilitator notes with:
- Possible student responses
- Follow-up questions
- Connections to make
- Common misconceptions to address`
    },

    /**
     * HOMEWORK AGENT
     * Creates varied, meaningful homework assignments
     */
    homework: {
        name: "Assignment Designer",
        systemPrompt: `You are an expert at creating meaningful, varied homework assignments for literature courses.

Create homework that:
- Reinforces daily learning
- Prepares for next class
- Develops critical thinking skills
- Includes variety (reading, writing, creative, analytical)
- Is appropriately challenging
- Can be completed independently
- Takes reasonable time (30-60 minutes)
- Includes clear instructions and rubrics
- Offers choice when appropriate
- Supports different learning styles

Include differentiated versions for special education needs.`,

        generatePrompt: (context) => `Create a comprehensive homework assignment plan for ${context.bookTitle} (${context.grade} grade, ${context.duration}).

**Course Objectives:**
${context.learningObjectives}

**Focus Areas:**
${context.focusAreas.join(', ')}

**Special Education:**
${JSON.stringify(context.specialEducation)}

Create varied homework assignments including:

1. Reading Assignments with Annotations
   - Specific pages/chapters
   - Annotation guides
   - Reading journals

2. Writing Assignments (10-15 total)
   - Response journals
   - Character analyses
   - Theme essays
   - Creative responses
   - Comparative analyses

3. Vocabulary Work (5-8 assignments)
   - Word lists from text
   - Context activities
   - Application exercises

4. Creative Projects (3-5 options)
   - Alternative perspectives
   - Modern adaptations
   - Visual representations
   - Multimodal responses

5. Research Assignments (2-4)
   - Historical context
   - Author biography
   - Literary criticism
   - Thematic research

6. Pre-Class Preparation
   - Think-pair-share prompts
   - Quick writes
   - Prediction activities

For each assignment include:
- Clear instructions
- Estimated time
- Grading criteria
- Differentiated versions (IEP, ELL, Gifted if applicable)
- Due dates aligned with ${context.duration} timeline`
    },

    /**
     * READING PLAN AGENT
     * Creates structured reading schedule
     */
    reading: {
        name: "Reading Coordinator",
        systemPrompt: `You are an expert at creating effective reading schedules for literature courses.

Create reading plans that:
- Break text into manageable chunks
- Align with course duration
- Balance pacing (not too fast or slow)
- Consider difficulty of sections
- Include checkpoints and milestones
- Incorporate rereading of key passages
- Allow time for processing and discussion
- Account for holidays and typical school calendar
- Provide alternative pacing options
- Include strategies for struggling readers

Reading plans should be realistic and flexible.`,

        generatePrompt: (context) => `Create a detailed reading plan for ${context.bookTitle} in a ${context.duration} course for ${context.grade} grade students.

**Course Timeline:**
${context.duration}

**Learning Goals:**
${context.learningObjectives}

**Special Considerations:**
${JSON.stringify(context.specialEducation)}

Create:

1. Comprehensive Reading Schedule
   - Break text into appropriate sections
   - Day-by-day or week-by-week schedule
   - Page numbers and chapter divisions
   - Estimated reading time per section
   - Natural stopping points

2. Reading Milestones
   - Key completion checkpoints
   - Progress tracking system
   - Mini-celebrations or activities

3. Pacing Options
   - Standard pace (for most students)
   - Accelerated pace (for advanced readers)
   - Modified pace (for struggling readers/IEP)
   - Independent reading option

4. Reading Support Strategies
   - Annotation techniques
   - Reading comprehension strategies
   - Note-taking systems
   - Study guide checkpoints
   - Accountability measures

5. Catch-Up and Extension Plans
   - For students who fall behind
   - For students who read ahead
   - Supplementary reading options

6. Calendar Integration
   - Account for typical school breaks
   - Buffer days for tests/projects
   - Flexible adjustment notes

Format as a clear, easy-to-follow schedule that students can use independently.`
    },

    /**
     * LESSON PLANS AGENT
     * Creates detailed daily lesson plans
     */
    lessons: {
        name: "Master Teacher",
        systemPrompt: `You are a master literature teacher creating detailed, engaging lesson plans.

Create lesson plans that:
- Follow proven pedagogical models (gradual release, etc.)
- Include clear learning objectives for each day
- Have engaging warm-ups/hooks
- Incorporate varied instructional strategies
- Include formative assessments
- Provide differentiation strategies
- Use active learning and student engagement
- Connect to standards
- Include timing for each activity
- Have closure/reflection activities
- List materials needed
- Include extension activities

Lesson plans should be detailed enough for a substitute teacher to follow while allowing for teacher flexibility and adaptation.`,

        generatePrompt: (context) => `Create comprehensive daily lesson plans for teaching ${context.bookTitle} over ${context.duration} to ${context.grade} grade students.

**Learning Objectives:**
${context.learningObjectives}

**Focus Areas:**
${context.focusAreas.join(', ')}

**Context:**
${context.additionalContext || 'Standard high school classroom'}

**Special Education:**
${JSON.stringify(context.specialEducation)}

${context.educationalFoundation ? `**Educational Foundation:**
The following Educational Foundation Document establishes the pedagogical framework for daily instruction. Your lesson plans should embody these principles, particularly around student engagement, retrieval practice, and democratic classroom practices:

${context.educationalFoundation}

---

` : ''}
Create detailed lesson plans for the entire ${context.duration} unit including:

1. Unit Overview
   - Essential questions
   - Enduring understandings
   - Standards alignment (${context.state})
   - Assessment overview

2. Daily Lesson Plans (create appropriate number for ${context.duration})

Each lesson should include:
- Lesson number and title
- Learning objectives (specific, measurable)
- Standards addressed
- Materials needed
- Time allocation

Lesson Structure:
- Warm-Up/Hook (5-10 min)
- Direct Instruction (10-15 min)
- Guided Practice (15-20 min)
- Independent Practice (15-20 min)
- Closure/Reflection (5-10 min)

For Each Section Include:
- Detailed activity descriptions
- Discussion questions
- Formative assessment strategies
- Differentiation for IEP/ELL/Gifted
- Technology integration opportunities
- Homework assignment

3. Key Lessons for Major Themes/Concepts
   - Close reading exercises
   - Literary analysis activities
   - Writing workshops
   - Socratic seminars
   - Creative responses

4. Assessment Lessons
   - Test preparation
   - Review games/activities
   - Essay writing workshops

Make lessons engaging, student-centered, and aligned with best practices in literature instruction${context.educationalFoundation ? '. Ensure all lessons embody the educational foundation principles, incorporating retrieval practice, student engagement strategies from Lemov, democratic classroom practices from Dewey, and cognitive science principles from Make It Stick' : ''}.`
    }
};

module.exports = AGENT_LIBRARY;
