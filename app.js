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

function updateGameUI(playerChoice, stage, houseChoice = null, result = null) {
    const windows = elements.windows;
    const getImagePath = (choice) => `assets/images/icon-${choice}.svg`;
    
    Object.values(windows).forEach(window => window.classList.add('d-none'));
    windows[stage].classList.remove('d-none');
    
    if (stage === 'loading') {
        setChoiceUI('myLoadingChoice', playerChoice);
    } else if (stage === 'loaded') {
        setChoiceUI('myLoadedChoice', playerChoice);
        setChoiceUI('houseChoice', houseChoice);
    } else if (stage === 'result') {
        // Reset all special effect classes
        const resultElements = ['myResultChoice', 'houseResultChoice'].map(id => 
            document.getElementById(id).parentElement
        );
        resultElements.forEach(el => {
            el.classList.remove('winner-effect-1', 'winner-effect-2', 'winner-effect-3');
        });

        setChoiceUI('myResultChoice', playerChoice);
        setChoiceUI('houseResultChoice', houseChoice);
        document.getElementById('result').textContent = result;
        elements.playAgain.mobile.style.color = result === 'You Lose' ? '#ed0937' : '#021a3d';

        // Add winner effects
        if (result !== 'Draw') {
            const winnerElement = result === 'You Win' ? 
                document.getElementById('myResultChoice').parentElement :
                document.getElementById('houseResultChoice').parentElement;
            
            winnerElement.classList.add('winner-effect-1', 'winner-effect-2', 'winner-effect-3');
        }
    }
}

function setChoiceUI(elementId, choice) {
    const element = document.getElementById(elementId);
    const imageElement = document.getElementById(`${elementId}Image`);
    
    // Remove all possible choice classes first
    element.classList.remove('paper-image-container', 'scissors-image-container', 'rock-image-container');
    element.classList.add(`${choice}-image-container`);
    imageElement.src = `assets/images/icon-${choice}.svg`;
}

function getGameResult(playerChoice, houseChoice) {
    if (playerChoice === houseChoice) return 'Draw';
    return outcomes[playerChoice].beats === houseChoice ? 'You Win' : 'You Lose';
}

// Event listeners
Object.entries(elements.choices).forEach(([choice, element]) => {
    element.addEventListener('click', () => playGame(choice));
});

Object.values(elements.playAgain).forEach(button => {
    button.onclick = () => {
        elements.windows.result.classList.add('d-none');
        elements.windows.choose.classList.remove('d-none');
    };
});