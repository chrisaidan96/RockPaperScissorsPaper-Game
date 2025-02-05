const elements = {
    rules: document.getElementById("rulesButton"),
    mainContainer: document.getElementById('mainContainer'),
    score: document.getElementById("score"),
    reset: document.getElementById("resetButton"),
    windows: {
        choose: document.getElementById("toChooseWindow"),
        loading: document.getElementById("loadingWindow"),
        loaded: document.getElementById("loadedChoiceWindow"),
        result: document.getElementById("resultWindow")
    },
    choices: {
        paper: document.getElementById("paper"),
        scissors: document.getElementById("scissor"),
        rock: document.getElementById("rock")
    },
    playAgain: {
        mobile: document.getElementById("playAgainButton"),
        desktop: document.getElementById("playAgainButtonMd")
    }
};

// Initialize score
let score = parseInt(localStorage.getItem('score')) || 0;
elements.score.textContent = score;

// Reset score
elements.reset.onclick = () => {
    score = 0;
    localStorage.setItem('score', score);
    elements.score.textContent = score;
};

// Rules modal
elements.rules.onclick = () => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const rulesModal = createRulesModal(isMobile);
    document.querySelector('body').appendChild(rulesModal);
    
    if (isMobile) {
        elements.mainContainer.classList.add("d-none");
        document.querySelector('body').style.backgroundColor = "#ffffff";
    }
};

function createRulesModal(isMobile) {
    const container = document.createElement('div');
    container.classList.add(isMobile ? "rules-container" : "rules-md-container");
    
    const content = `
        <div class="${isMobile ? '' : 'rules-md-main-container'}">
            <div class="${isMobile ? '' : 'rules-heading-close-icon'}">
                <h1 class="rules-heading${isMobile ? '' : '-md'}">Rules</h1>
                <i class="fa-solid fa-xmark cross-button${isMobile ? '' : '-md'}" id="closeButton"></i>
            </div>
            <img src="assets/images/image-rules.svg" class="rules-${isMobile ? '' : 'md-'}image">
        </div>
    `;
    container.innerHTML = content;
    
    container.querySelector('#closeButton').onclick = () => {
        if (isMobile) {
            document.querySelector('body').style.backgroundColor = "#021a3d";
            elements.mainContainer.classList.remove("d-none");
        }
        container.remove();
    };
    
    return container;
}

// Game logic
const outcomes = {
    paper: { beats: 'rock', losesTo: 'scissors' },
    scissors: { beats: 'paper', losesTo: 'rock' },
    rock: { beats: 'scissors', losesTo: 'paper' }
};

function playGame(playerChoice) {
    const choices = ['paper', 'scissors', 'rock'];
    const houseChoice = choices[Math.floor(Math.random() * 3)];
    
    updateGameUI(playerChoice, 'loading');
    
    setTimeout(() => {
        updateGameUI(playerChoice, 'loaded', houseChoice);
        
        setTimeout(() => {
            const result = getGameResult(playerChoice, houseChoice);
            updateGameUI(playerChoice, 'result', houseChoice, result);
            
            if (result === 'You Win') {
                score++;
                localStorage.setItem('score', score);
                elements.score.textContent = score;
            }
        }, 300);
    }, 500);
}

