const STAR = 'star';
const BOMB = 'bomb';
const container = document.getElementById("container");
let gameOn = false;
let numberOfClosedCards = 25;
let numberOfCards = 25;
let numberOfBombs = 3;
let numberOfStars = numberOfCards - numberOfBombs;
let arrayOfCards = [];
let indexesOfBombs = [];
let allMoney = 3000;
let multi = 0.97;
const allMoneyDiv = document.querySelector(".all-money");
allMoneyDiv.innerHTML = allMoney + " USD";

function mainGame() {
    makeArrOfCards();
    makeBombsIndexes();
    changeSomeStarsToBomb();

    resetHtml();
    createFrontCards();
    createBackCards();

    addStarsAndBombsClasses();
    addStarsAndBombsImages();
    addAfterClickEffects();

    toggleStateOfElements();
}

mainGame();

function makeBombsIndexes() {
    indexesOfBombs = [];
    let count = 0;
    while (count != numberOfBombs) {
        let randomNumber = Math.floor(Math.random() * numberOfCards);
        if (indexesOfBombs.indexOf(randomNumber) === -1) {
            indexesOfBombs.push(randomNumber);
            count++;
        }
    }
}

function makeArrOfCards() {
    arrayOfCards = [];
    for (let i = 0; i < numberOfCards; i++) {
        arrayOfCards.push(STAR);
    }
}

function changeSomeStarsToBomb() {
    for (let i = 0; i < numberOfBombs; i++) {
        arrayOfCards[indexesOfBombs[i]] = BOMB;
    }
}

function resetHtml() {
    container.innerHTML = '';
}

function createFrontCards() {
    for (let i = 0; i < numberOfCards; i++) {
        // append this in main container
        const theCardContainer = document.createElement("div");
        theCardContainer.setAttribute("id", i);
        theCardContainer.classList.add('theCardContainer', 'non-checked');

    
        // append this in theCardContainer
        const theCard = document.createElement("div");
        theCard.setAttribute("id", "C" + i);
        theCard.setAttribute("class", "theCard");
        
        //append this in theCard
        const theFront = document.createElement("div");
        theFront.setAttribute("class", "theFront");
        theFront.setAttribute("id", "F" + i);
    
        //append this in theFront
        const square = document.createElement("div");
        square.setAttribute("class", "square");
    
    
        //append this in square
        const circle = document.createElement("div");
        circle.setAttribute("class", "circle");
    
       
        theCardContainer.appendChild(theCard);
        theCard.appendChild(theFront);
        theFront.appendChild(square);
        square.appendChild(circle);
        
        container.appendChild(theCardContainer);

    }
}

function createBackCards() {
    for (let i = 0; i < numberOfCards; i++) {
        const theBack = document.createElement("div");
        theBack.setAttribute("class", "theBack");
        theBack.setAttribute("id", "B" + i);

        const theCard = document.getElementById("C" + i);

        theCard.appendChild(theBack);
    }
}

function addStarsAndBombsClasses() {
    for (let i = 0; i < numberOfCards; i++) {
        const backCard = document.getElementById("B" + i);
        backCard.classList.add(arrayOfCards[i]);
    }
}

function addStarsAndBombsImages() {
    for (let i = 0; i < numberOfCards; i++) {
        const theBack = document.getElementById("B" + i);

        if (theBack.classList.contains(STAR)) {
            const theStarLi = document.createElement("i");
            theStarLi.setAttribute("class", "fa-solid fa-star fa-3x");
            theBack.appendChild(theStarLi);
        }

        if (theBack.classList.contains(BOMB)) {
            const theBombLi = document.createElement("i");
            theBombLi.setAttribute("class", "fa-solid fa-bomb fa-3x");
            theBack.appendChild(theBombLi);
        }
    }
}

function afterClickEffect() {
    if (!gameOn) {
        return;
    }
    document.querySelector('.cash-out').removeAttribute('disabled');

    const currentCardBack = this.querySelector(".theBack");
    numberOfClosedCards--;


    if (currentCardBack.classList.contains(STAR)) {
        if (this.parentElement.classList.contains("non-checked")) {
            currentCardBack.style.background = "yellow";
            currentCardBack.style.opacity = "1";
            cashOutUp();
            starSound();
            this.parentElement.classList.replace("non-checked", "checked"); 
        }
    }

    if (currentCardBack.classList.contains(BOMB)) {
        if (this.parentElement.classList.contains("non-checked")) {
            currentCardBack.style.background = "green";
            currentCardBack.removeChild(currentCardBack.firstElementChild);
            const explosionLi = document.createElement("i");
            explosionLi.setAttribute("class", "fa-sharp fa-solid fa-burst fa-3x");
            currentCardBack.appendChild(explosionLi);
            explosionSound();
            revealAllUncheckedCards();
        }
        this.parentElement.classList.replace("non-checked", "checked");
        gameOn = false;
        toggleStateOfElements();
    }

    this.style.transform = "rotateY(180deg)";
}

function addAfterClickEffects() {
    for (let i = 0; i < numberOfCards; i++) {
        const currentCard = document.querySelectorAll(".theCard")[i];
        currentCard.addEventListener("click", afterClickEffect);
    }
}

//sounds
function starSound() {
    const starClickSound = new Audio("sounds/star.wav");
    starClickSound.play();
}

function explosionSound() {
    const bombClickedSound = new Audio("sounds/bomb.wav");
    bombClickedSound.play();
}

//revealing rest of cards after wrongs answer
function revealAllUncheckedCards() {
    for (let i = 0; i < numberOfCards; i++) {
        const currentContainer = document.getElementById(i);
        const currentCard = document.getElementById("C" + i);
        if (currentContainer.classList.contains("non-checked")) {
            currentCard.style.transform = "rotateY(180deg)"
            currentContainer.classList.replace("non-checked", "checked");
        }
    }
}

function getBetValue() {
    if (gameOn == false) {
        const inputMoney = document.querySelector(".beted-money");

        let inputMoneyValue = +inputMoney.value;

        if(inputMoneyValue > 100){
            inputMoneyValue = 100;
        }

        if(inputMoneyValue < 1){
            inputMoneyValue = 1;
        }

        const cashOutMoney = document.querySelector(".cash-out-money");

        cashOutMoney.innerHTML = inputMoneyValue;

    }
}

function setCashOutMoney() {
    let multiNumber = +document.querySelector('.beted-money').value;

    if(multiNumber > 100){
        multiNumber = 100;
    }

    if(multiNumber < 1){
        multiNumber = 1;
    }

    multiNumber *= multi;
    multiNumber *= 100;
    multiNumber = Math.floor(multiNumber);
    multiNumber /= 100;
    document.querySelector(".cash-out-money").innerHTML = multiNumber;
    multi = getMulti();
}

function setNextMoney() {
    let betedValue = +document.querySelector('.beted-money').value;

    if(betedValue > 100){
        betedValue = 100;
    }

    if(betedValue < 1){
        betedValue = 1;
    }

    let nextNumber = multi * betedValue;
    nextNumber *= 100;
    nextNumber = Math.floor(nextNumber);
    nextNumber /= 100;
    document.querySelector(".next").innerHTML = "Next: " + nextNumber;
}

function cashOutUp() {
    setCashOutMoney();
    setNextMoney();
}

function getMinesValue() {
    if (gameOn == false) {
        const inputMines = document.querySelector("#mines-value");
        numberOfBombs = +inputMines.value;

        if(numberOfBombs > 20){
            numberOfBombs = 20;
        }

        if(numberOfBombs < 1){
            numberOfBombs = 1;
        }

        mainGame();
    }
}

function gameOnAndOff() {
    gameOn = !gameOn;
    mainGame();
}

function disabledCards() {
    for (let i = 0; i < numberOfCards; i++) {
        document.querySelector("#B" + i).classList.add("disabled");
        document.querySelector("#F" + i).classList.add("disabled");
    }
}

function enabledCards() {
    for (let i = 0; i < numberOfCards; i++) {
        document.querySelector("#B" + i).classList.remove("disabled");
        document.querySelector("#F" + i).classList.remove("disabled");
    }
}

function toggleStateOfElements() {
    if (gameOn) {
        enabledCards();
        document.querySelector('.BET').classList.add('game-on');
        document.querySelector('.BET').classList.remove('game-off');
        document.querySelector('.beted-money').setAttribute('disabled', '1');
        document.querySelector('#mines-value').setAttribute('disabled', '1');
    } else {
        disabledCards();
        document.querySelector('.BET').classList.add('game-off');
        document.querySelector('.BET').classList.remove('game-on');
        document.querySelector('.beted-money').removeAttribute('disabled');
        document.querySelector('#mines-value').removeAttribute('disabled');
    }
}

function getMulti() {
    const numStars = numberOfClosedCards - numberOfBombs;
    return multi * numberOfClosedCards / numStars;
}

function cashIn() {
    let betMoney = +document.querySelector(".beted-money").value;

    if(betMoney > 100){
        betMoney = 100;
    }

    if(betMoney < 1){
        betMoney = 1;
    }

    allMoney -= betMoney;

    allMoney *= 100;
    allMoney = Math.floor(allMoney);
    allMoney /= 100;

    document.querySelector('.cash-out-money').innerHTML = betMoney;
    document.querySelector('.all-money').innerHTML = allMoney + " USD";
    document.querySelector('.cash-out').setAttribute('disabled', '1');
    numberOfClosedCards = 25;
    multi = 0.97;
    multi = getMulti();
    setNextMoney(betMoney);
    gameOn = true;
    mainGame();
}

function cashOut() {
    allMoney += +document.querySelector(".cash-out-money").innerHTML;
    document.querySelector('.all-money').innerHTML = allMoney + " USD";
    gameOn = false;
    revealAllUncheckedCards();
    toggleStateOfElements();
}
