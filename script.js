const questions = [
  {
    question: "What does HTML stand for?",
    answers: [
      "Hyper Text Markup Language",
      "Hyper Tool Markup Language",
      "High Transfer Markup Language",
      "Hyperlink Text Markdown Language",
    ],
    correct: 0,
  },
  {
    question: "Which tag is used to link CSS in HTML?",
    answers: ["<style>", "<css>", "<link>", "<script>"],
    correct: 2,
  },
  {
    question: "What is the default display value of a <div>?",
    answers: ["inline", "block", "flex", "inline-block"],
    correct: 1,
  },
  {
    question: "Which property is used to change text color in CSS?",
    answers: ["font-color", "text-color", "color", "text-style"],
    correct: 2,
  },
  {
    question: "JavaScript is a ___ language?",
    answers: ["Compiled", "Markup", "Styling", "Scripting"],
    correct: 3,
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    answers: ["//", "<!--", "#", "/* */"],
    correct: 0,
  },
  {
    question: "How do you declare a JS variable?",
    answers: ["variable myVar;", "let myVar;", "v myVar;", "var = myVar;"],
    correct: 1,
  },
  {
    question: "Which company developed JavaScript?",
    answers: ["Google", "Netscape", "Microsoft", "Mozilla"],
    correct: 1,
  },
  {
    question: "How do you write 'Hello' in an alert box?",
    answers: [
      "msg('Hello')",
      "alertBox('Hello')",
      "alert('Hello')",
      "msgBox('Hello')",
    ],
    correct: 2,
  },
  {
    question: "Which is used to fetch data from an API?",
    answers: ["connect()", "getData()", "fetch()", "request()"],
    correct: 2,
  },
];

let current = 0;
let score = 0;
let player = "";

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next");
const scoreEl = document.getElementById("score");
const toggle = document.getElementById("modeToggle");
const modeIcon = document.getElementById("mode-icon");
const leaderboardEl = document.getElementById("leaderboard-list");
const confettiCanvas = document.getElementById("confetti-canvas");

const startScreen = document.getElementById("startScreen");
const quizContainer = document.getElementById("quizContainer");
const startBtn = document.getElementById("startBtn");
const playerInput = document.getElementById("playerName");

startBtn.addEventListener("click", () => {
  const name = playerInput.value.trim();
  if (name === "") {
    alert("Please enter your name.");
    return;
  }
  player = name;
  startScreen.style.display = "none";
  quizContainer.style.display = "block";
  showQuestion();
});

function showQuestion() {
  const q = questions[current];
  questionEl.textContent = `Q${current + 1}: ${q.question}`;
  answersEl.innerHTML = "";
  scoreEl.textContent = "";

  q.answers.forEach((answer, i) => {
    const btn = document.createElement("button");
    btn.textContent = answer;
    btn.onclick = () => selectAnswer(i, btn);
    answersEl.appendChild(btn);
  });
}

function selectAnswer(index, btn) {
  const correct = questions[current].correct;
  const allBtns = document.querySelectorAll("#answers button");
  allBtns.forEach((b) => (b.disabled = true));

  if (index === correct) {
    btn.style.backgroundColor = "#4CAF50";
    score++;
    fireConfetti();
  } else {
    btn.style.backgroundColor = "#f44336";
    allBtns[correct].style.backgroundColor = "#4CAF50";
  }

  nextBtn.style.display = "inline-block";
}

nextBtn.onclick = () => {
  current++;
  nextBtn.style.display = "none";
  if (current < questions.length) {
    showQuestion();
  } else {
    questionEl.textContent = "✅ Quiz Finished!";
    answersEl.innerHTML = "";
    scoreEl.textContent = `Final Score: ${score} / ${questions.length}`;
    saveScore(player, score);
    updateLeaderboard();
  }
};

function fireConfetti() {
  confetti.create(confettiCanvas, {
    resize: true,
    useWorker: true,
  })({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
  });
}

toggle.addEventListener("change", () => {
  const isDark = toggle.checked;
  document.body.classList.toggle("dark", isDark);
  modeIcon.textContent = isDark ? "🌙" : "🌞";
});

// Score persistence
function saveScore(name, s) {
  let scores = JSON.parse(localStorage.getItem("quiz-scores")) || [];
  const previousBest = scores[0]?.score || 0;
  scores.push({ name, score: s, date: new Date().toLocaleString() });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("quiz-scores", JSON.stringify(scores.slice(0, 5)));

  if (s > previousBest) {
    document.querySelector(".leaderboard-card").classList.add("beat-highscore");
    setTimeout(() => {
      document
        .querySelector(".leaderboard-card")
        .classList.remove("beat-highscore");
    }, 1500);
  }
}

function updateLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("quiz-scores")) || [];
  leaderboardEl.innerHTML = scores
    .map(
      (s) =>
        `<li><strong>${s.name}</strong>: ${s.score} pts — <small>${s.date}</small></li>`
    )
    .join("");
}

updateLeaderboard();
