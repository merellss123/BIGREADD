class MultiplicationGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.currentQuestion = null;
        this.questionTypes = ['commutative', 'associative', 'distributive'];
        
        // DOM Elements
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.questionText = document.getElementById('question-text');
        this.visualArea = document.getElementById('visual-area');
        this.optionsContainer = document.getElementById('options-container');
        this.startButton = document.getElementById('start-btn');
        this.nextButton = document.getElementById('next-btn');

        // Event Listeners
        this.startButton.addEventListener('click', () => this.startGame());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.updateScore();
        this.startButton.style.display = 'none';
        this.nextButton.style.display = 'block';
        this.nextQuestion();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.levelElement.textContent = this.level;
    }

    createArrayVisual(rows, cols) {
        const container = document.createElement('div');
        container.className = 'array-container';
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'array-row';
            for (let j = 0; j < cols; j++) {
                const cell = document.createElement('div');
                cell.className = 'array-cell';
                cell.textContent = '•';
                row.appendChild(cell);
            }
            container.appendChild(row);
        }
        return container;
    }

    generateCommutativeQuestion() {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        
        this.questionText.textContent = `Show that ${a} × ${b} = ${b} × ${a}`;
        this.visualArea.innerHTML = '';
        
        // Create two array visualizations
        const array1 = this.createArrayVisual(a, b);
        const array2 = this.createArrayVisual(b, a);
        
        this.visualArea.appendChild(array1);
        const equalsSign = document.createElement('div');
        equalsSign.textContent = '=';
        equalsSign.style.fontSize = '2rem';
        equalsSign.style.margin = '0 1rem';
        this.visualArea.appendChild(equalsSign);
        this.visualArea.appendChild(array2);

        const options = [
            { text: `Yes, ${a} × ${b} = ${b} × ${a} = ${a * b}`, correct: true },
            { text: `No, ${a} × ${b} ≠ ${b} × ${a}`, correct: false },
            { text: `${a} × ${b} = ${a * b + 1}`, correct: false }
        ];
        return options;
    }

    generateAssociativeQuestion() {
        const a = Math.floor(Math.random() * 3) + 2;
        const b = Math.floor(Math.random() * 3) + 2;
        const c = Math.floor(Math.random() * 3) + 2;
        
        this.questionText.textContent = `Which is correct about (${a} × ${b}) × ${c} and ${a} × (${b} × ${c})?`;
        
        const options = [
            { text: `They are equal: ${(a * b) * c}`, correct: true },
            { text: `Left grouping is larger`, correct: false },
            { text: `Right grouping is larger`, correct: false }
        ];
        return options;
    }

    generateDistributiveQuestion() {
        const a = Math.floor(Math.random() * 5) + 2;
        const b = Math.floor(Math.random() * 5) + 2;
        const c = Math.floor(Math.random() * 5) + 2;
        
        this.questionText.textContent = `Solve ${a} × (${b} + ${c}) using the distributive property`;
        
        const options = [
            { text: `${a} × ${b} + ${a} × ${c} = ${a * b + a * c}`, correct: true },
            { text: `${a} × ${b} × ${c} = ${a * b * c}`, correct: false },
            { text: `${a} + ${b} × ${c} = ${a + b * c}`, correct: false }
        ];
        return options;
    }

    createOptions(options) {
        this.optionsContainer.innerHTML = '';
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option.text;
            button.addEventListener('click', () => this.checkAnswer(button, option.correct));
            this.optionsContainer.appendChild(button);
        });
    }

    checkAnswer(button, isCorrect) {
        const buttons = this.optionsContainer.querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            button.classList.add('correct');
            this.score += 10;
            if (this.score % 30 === 0) {
                this.level++;
            }
            this.updateScore();
        } else {
            button.classList.add('incorrect');
            const correctButton = Array.from(buttons).find(btn => 
                btn.textContent === options.find(opt => opt.correct).text
            );
            correctButton.classList.add('correct');
        }
    }

    nextQuestion() {
        this.visualArea.innerHTML = '';
        const questionType = this.questionTypes[Math.floor(Math.random() * this.questionTypes.length)];
        let options;
        
        switch (questionType) {
            case 'commutative':
                options = this.generateCommutativeQuestion();
                break;
            case 'associative':
                options = this.generateAssociativeQuestion();
                break;
            case 'distributive':
                options = this.generateDistributiveQuestion();
                break;
        }
        
        this.createOptions(options);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new MultiplicationGame();
}); 