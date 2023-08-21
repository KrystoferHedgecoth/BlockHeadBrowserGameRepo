// Function to create a new HTML element of the requested type
function createElement(elemType) {
    return document.createElement(elemType);
}

// Function to create image element
function createImageElement() {
    return document.createElement('img');
}

// Function to add a CSS class to said HTML element
function addClassToElement(elem, className) {
    elem.classList.add(className);
}

// Function to add an id attribute to an HTML element
function addIdToElement(elem, id) {
    elem.id = id;
}

// Function to set the src attribute of an image element
function addSrcToImageElem(imgElem, src) {
    imgElem.src = src;
}

// Function to append a child element to a parent element
function addChildElement(parentElem, childElem) {
    parentElem.appendChild(childElem);
}

const cardBackImgPath = '/images/cardBack/greyback.png';

// Selecting the card container
const cardContainerElem = document.querySelector('.card-container');

let cards = [];
const drawDeck = [];

// Selecting the Play Game Button element
const playGameButtomElem = document.getElementById('playGame');

// Load game definitions and set up the Play Game button event
function loadGame() {
    fetch('cardDefinitions.json')
        .then(response => response.json())
        .then(data => {
            createCards(data);
            populateDrawDeck();
            populateDrawDeck();
        })
        .catch(error => console.error('Error loading card definitions:', error));
    
    displayDrawDeck();

    playGameButtomElem.addEventListener('click', () => startGame());
    
    const centerDeckElem = document.querySelector('.card-pos-centerDeck');
    
    centerDeckElem.addEventListener('click', () => drawCard());


}

function initializeNewGame() {
    // Implement game initialization logic here
}

// Placing any collected cards into a cell
function collectCards() {
    // Implement logic to collect cards here
}

// Updating the card container grid
function transformGridArea(areas) {
    cardContainerElem.style.gridTemplateAreas = areas;
}

// Adding cards to a specific cell
function addCardsToGridAreaCell(cellPositionClassName) {
    const cellPositionElem = document.querySelector(cellPositionClassName);

    cards.forEach((card, index) => {
        addChildElement(cellPositionElem, card);
    });
}

function startGame() {
    initializeNewGame();
    startRound();
}

function startRound() {
    console.log("Round hit");
    displayDrawDeck();
}

// Creating cards based on card definitions
function createCards(cardDefinitions) {
    // Shuffle card definitions using Fisher-Yates algorithm
    for (let i = cardDefinitions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardDefinitions[i], cardDefinitions[j]] = [cardDefinitions[j], cardDefinitions[i]];
    }

    // Create card elements from shuffled card definitions
    cards = cardDefinitions.map((cardItem) => createCard(cardItem));
    console.log("shuffled cards");
}

// Function to create an individual card element based on card item data
function createCard(cardItem) {
    // Create the main card container element
    const cardElem = createElement('div');

    // Create inner container element for 3D effect
    const cardInnerElem = createElement('div');

    // Create elements for the front and back faces of the card
    const cardFrontElem = createElement('div');
    const cardBackElem = createElement('div');

    // Create image elements for the front and back card images
    const cardFrontImg = createImageElement();
    const cardBackImg = createImageElement();

    // Add CSS classes and ID to the main card element
    addClassToElement(cardElem, 'card');
    addIdToElement(cardElem, cardItem.id);

    // Add CSS classes to the inner container element for 3D effect
    addClassToElement(cardInnerElem, 'card-inner');

    // Add CSS classes to the front and back face elements
    addClassToElement(cardFrontElem, 'card-front');
    addClassToElement(cardBackElem, 'card-back');

    // Set the 'src' attribute for the card back image
    addSrcToImageElem(cardBackImg, cardBackImgPath);

    // Set the 'src' attribute for the card front image based on card item data
    addSrcToImageElem(cardFrontImg, cardItem.imagePath);

    // Add CSS classes to the card image elements
    addClassToElement(cardFrontImg, 'card-img');
    addClassToElement(cardBackImg, 'card-img');

    // Append the card front and back images to their respective face elements
    addChildElement(cardFrontElem, cardFrontImg);
    addChildElement(cardBackElem, cardBackImg);

    // Append the front and back face elements to the inner container element
    addChildElement(cardInnerElem, cardFrontElem);
    addChildElement(cardInnerElem, cardBackElem);

    // Append the inner container element to the main card element
    addChildElement(cardElem, cardInnerElem);

    return cardElem;
}

function populateDrawDeck() {
    drawDeck.length = 0;
    cards.forEach((card) => {
        const cardClone = card.cloneNode(true);
        const cardInnerElem = cardClone.querySelector('.card-inner');
        cardInnerElem.classList.add('back'); // Ensure this class is properly defined in your CSS
        drawDeck.push(cardClone);
    });
    console.log("Populated draw Deck");
}


function displayDrawDeck() {
    const drawDeckElem = document.querySelector('.card-pos-drawDeck');
    
    // Clear the draw deck area
    drawDeckElem.innerHTML = '';

    // Log all the cards in the drawDeck array
    drawDeck.forEach((drawnCard, index) => {
        console.log(`Card ${index + 1}:`, drawnCard);
        drawDeckElem.appendChild(drawnCard);
    });

    if (drawDeck.length > 0) {
        // Draw the top card from the draw deck
        const drawnCard = drawDeck[drawDeck.length - 1].cloneNode(true);
        const cardInnerElem = drawnCard.querySelector('.card-inner');

        // Set the card to show its front face
        cardInnerElem.style.transform = 'rotateY(0deg)'; // Show the front face

        // Add a click event to the card back image
        const cardBackImg = cardInnerElem.querySelector('.card-back');
        cardBackImg.addEventListener('click', () => {
            // Move the drawn card from the draw deck to the center deck
            const centerDeckElem = document.querySelector('.card-pos-centerDeck');
            centerDeckElem.innerHTML = '';
            centerDeckElem.appendChild(drawDeck.pop());
        });

        // Add the drawn card to the draw deck area
        drawDeckElem.appendChild(drawnCard);
    }
}


function drawCard() {
    displayDrawDeck();

    const centerDeckElem = document.querySelector('.card-pos-centerDeck');

    if (centerDeckElem.children.length > 0) {
        const drawnCard = centerDeckElem.children[0];
        const cardInnerElem = drawnCard.querySelector('.card-inner');

        // Set the card to show its front face
        cardInnerElem.style.transform = 'rotateY(0deg)'; // Rotate to front face

        // Remove the click event listener after flipping (if needed)
        const cardBackImg = cardInnerElem.querySelector('.card-back');
        cardBackImg.removeEventListener('click', flipCard);

        // Add a new click event listener to handle further interactions with the drawn card
        drawnCard.addEventListener('click', () => {
            // Your logic to handle interactions with the drawn card goes here
            console.log("Interacting with drawn card");
        });
    }
    console.log("Card Drawn");
    console.log(drawDeck)
}

function flipCard() {
    const cardInnerElem = this.querySelector('.card-inner');
    cardInnerElem.classList.add('flipped');
}

loadGame();
