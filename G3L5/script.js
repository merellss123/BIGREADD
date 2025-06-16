class MultiplicationDivisionGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.currentMode = 'multiplication';
        this.timer = 60;
        this.timerInterval = null;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalTime = 0;
        this.questionStartTime = 0;
        
        // DOM Elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.questionText = document.getElementById('question-text');
        this.visualArea = document.getElementById('visual-area');
        this.answerInput = document.getElementById('answer-input');
        this.submitButton = document.getElementById('submit-btn');
        this.startButton = document.getElementById('start-btn');
        this.nextButton = document.getElementById('next-btn');
        this.tableContainer = document.getElementById('table-container');
        this.correctCountElement = document.getElementById('correct-count');
        this.incorrectCountElement = document.getElementById('incorrect-count');
        this.avgTimeElement = document.getElementById('avg-time');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkAnswer();
        });

        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', () => this.changeMode(btn.dataset.mode));
        });

        // Initialize multiplication table
        this.createMultiplicationTable();
    }

    createMultiplicationTable() {
        // Create header row
        for (let i = 0; i <= 10; i++) {
            const cell = document.createElement('div');
            cell.className = 'table-cell header';
            cell.textContent = i === 0 ? '×' : i;
            this.tableContainer.appendChild(cell);
        }

        // Create table body
        for (let i = 1; i <= 10; i++) {
            // Row header
            const rowHeader = document.createElement('div');
            rowHeader.className = 'table-cell header';
            rowHeader.textContent = i;
            this.tableContainer.appendChild(rowHeader);

            // Row cells
            for (let j = 1; j <= 10; j++) {
                const cell = document.createElement('div');
                cell.className = 'table-cell';
                cell.textContent = i * j;
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.tableContainer.appendChild(cell);
            }
        }
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.totalTime = 0;
        this.updateScore();
        this.startButton.style.display = 'none';
        this.answerInput.style.display = 'block';
        this.submitButton.style.display = 'block';
        this.startTimer();
        this.nextQuestion();
    }

    startTimer() {
        this.timer = 60;
        this.timerElement.textContent = this.timer;
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.timerElement.textContent = this.timer;
            if (this.timer <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.answerInput.style.display = 'none';
        this.submitButton.style.display = 'none';
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
        
        const accuracy = this.correctCount + this.incorrectCount > 0 
            ? Math.round((this.correctCount / (this.correctCount + this.incorrectCount)) * 100) 
            : 0;
        
        this.questionText.textContent = `Game Over! 
            Score: ${this.score} | Accuracy: ${accuracy}% | Average Time: ${this.getAverageTime()}s`;
    }

    changeMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        if (this.timer > 0) {
            this.nextQuestion();
        }
    }

    generateQuestion() {
        const a = Math.floor(Math.random() * 9) + 2; // 2-10
        const b = Math.floor(Math.random() * 9) + 2; // 2-10
        
        if (this.currentMode === 'mixed') {
            this.currentMode = Math.random() < 0.5 ? 'multiplication' : 'division';
        }

        if (this.currentMode === 'multiplication') {
            return {
                num1: a,
                num2: b,
                operation: '×',
                answer: a * b
            };
        } else {
            const product = a * b;
            return {
                num1: product,
                num2: a,
                operation: '÷',
                answer: b
            };
        }
    }

    highlightTableCell(num1, num2) {
        const cells = this.tableContainer.querySelectorAll('.table-cell');
        cells.forEach(cell => cell.classList.remove('highlight'));

        if (this.currentMode === 'multiplication') {
            const targetCell = Array.from(cells).find(cell => 
                cell.dataset.row === num1.toString() && cell.dataset.col === num2.toString() ||
                cell.dataset.row === num2.toString() && cell.dataset.col === num1.toString()
            );
            if (targetCell) targetCell.classList.add('highlight');
        }
    }

    nextQuestion() {
        this.answerInput.value = '';
        this.answerInput.focus();
        const question = this.generateQuestion();
        this.currentQuestion = question;
        this.questionStartTime = Date.now();

        this.questionText.textContent = `What is ${question.num1} ${question.operation} ${question.num2}?`;
        this.highlightTableCell(question.num1, question.num2);
    }

    checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        if (isNaN(userAnswer)) return;

        const timeTaken = (Date.now() - this.questionStartTime) / 1000;
        this.totalTime += timeTaken;

        if (userAnswer === this.currentQuestion.answer) {
            this.correctCount++;
            this.score += Math.max(10 - Math.floor(timeTaken), 1);
            if (this.score % 50 === 0) this.level++;
            this.questionText.textContent = 'Correct! 🎉';
        } else {
            this.incorrectCount++;
            this.questionText.textContent = `Incorrect. The answer is ${this.currentQuestion.answer}`;
        }

        this.updateStats();
        this.updateScore();
        setTimeout(() => this.nextQuestion(), 1500);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
    }

    updateStats() {
        this.correctCountElement.textContent = this.correctCount;
        this.incorrectCountElement.textContent = this.incorrectCount;
        this.avgTimeElement.textContent = this.getAverageTime();
    }

    getAverageTime() {
        const totalQuestions = this.correctCount + this.incorrectCount;
        return totalQuestions > 0 
            ? (this.totalTime / totalQuestions).toFixed(1)
            : '0.0';
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new MultiplicationDivisionGame();
}); 