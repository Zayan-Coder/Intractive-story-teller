// Get elements from the DOM
const storyContent = document.getElementById('story-content');
const storyInput = document.getElementById('story-input');
const questionArea = document.getElementById('question-area');
const feedbackArea = document.getElementById('feedback-area');
const submitBtn = document.getElementById('submit-btn');
const readBtn = document.getElementById('read-btn');
const voiceAnswerBtn = document.getElementById('voice-answer-btn');

// Questions related to the story
const questions = [
    "What do you think happens next?",
    "Can you describe the main character?",
    "Why do you think the character made that decision?",
    "How would you change the ending?"
];

// Function to add text to the story
submitBtn.addEventListener('click', () => {
    const newStoryPart = storyInput.value.trim();
    if (newStoryPart) {
        storyContent.textContent += " " + newStoryPart;
        storyInput.value = ''; // Clear the input field
    }
});

// Function to read the story aloud
readBtn.addEventListener('click', () => {
    const speech = new SpeechSynthesisUtterance(storyContent.textContent);
    speechSynthesis.speak(speech);

    // After the story is read aloud, ask a question
    speech.onend = () => {
        askQuestion();
    };
});

// Function to ask a random question
function askQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];
    questionArea.textContent = randomQuestion;
    feedbackArea.textContent = ''; // Clear previous feedback
    startVoiceRecognition(); // Start voice recognition after asking a question
}

// Function to start voice recognition
function startVoiceRecognition() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language to English
    recognition.interimResults = false; // We want only final results
    recognition.maxAlternatives = 1; // Get only one best result

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript; // Get the spoken answer
        questionArea.textContent += ` (You said: "${transcript}")`; // Show the spoken answer
        provideFeedback(transcript); // Provide feedback based on the answer
    };

    recognition.onerror = (event) => {
        questionArea.textContent = 'Error occurred in recognition: ' + event.error; // Handle errors
    };

    recognition.onend = () => {
        questionArea.textContent += " (Recognition ended.)";
    };

    // Start listening for the user's voice
    recognition.start();
}

// Function to provide feedback based on the answer
function provideFeedback(answer) {
    // Simple feedback based on keywords
    if (answer.includes("happy")) {
        feedbackArea.textContent = "That's a positive outlook! Keep it up!";
    } else if (answer.includes("sad")) {
        feedbackArea.textContent = "It seems there might be some conflict. Let's explore that!";
    } else {
        feedbackArea.textContent = "Great thoughts! Keep sharing your ideas!";
    }
}
