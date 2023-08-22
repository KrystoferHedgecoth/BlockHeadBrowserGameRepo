// Function to create a new HTML element of the requested type
function createElement(elemType) {
    return document.createElement(elemType);
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
const centerDeck = [];

const playerTable = document.querySelector('player-table-container');

// Selecting the Play Game Button element
const playGameButtonElem = document.getElementById('playGame');

// Creating arrays for player hands
const hiddenCards = [];
const mainHand = [];
const testArray = [];

// Load game definitions and set up the Play Game button event
function loadGame() {
    fetch('cardDefinitions.json')
        .then(response => response.json())
        .then(data => {
            createCards(data);
            populateDrawDeck();
        })
        .catch(error => console.error('Error loading card definitions:', error));
    displayDrawDeck();
    displayCenterDeck();

    playGameButtonElem.addEventListener('click', () => startGame());
}

function startGame() {
    // initializeNewGame();
    startRound();
}

function startRound() {
    console.log("Round hit");
    displayDrawDeck();
    drawCards();
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

    // Create inner container element for 3D effect (3d disabled for now)
    const cardInnerElem = createElement('div');

    // Create elements for the front and back faces of the card
    const cardFrontElem = createElement('div');
    const cardBackElem = createElement('div');

    // Create image elements for the front and back card images
    const cardFrontImg = createElement('img');
    const cardBackImg = createElement('img');

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
// Populating draw deck with cloned cards
function populateDrawDeck() {
    drawDeck.length = 0;
    cards.forEach((card) => {
        const cardClone = card.cloneNode(true);
        const cardInnerElem = cardClone.querySelector('.card-inner');
        cardInnerElem.classList.add('back');
        drawDeck.push(cardClone);
    });
    console.log("Populated draw Deck");
    console.log(drawDeck)
}
// Populate the draw deck with cloned cards and set them to the 'back' side
function populateDrawDeck() {
    drawDeck.length = 0; // Clearing the draw deck
    cards.forEach((card) => {
        const cardClone = card.cloneNode(true); // Clone the card
        const cardInnerElem = cardClone.querySelector('.card-inner'); // Grabbing the inner element of the card
        cardInnerElem.classList.add('back'); // Set the 'back' class to the inner element
        drawDeck.push(cardClone); // Adding the cloned card to the draw deck
    });
    console.log("Populated draw Deck");
    console.log(drawDeck);
}

// Display the top card from the draw deck
function displayDrawDeck() {
    const drawDeckElem = document.querySelector('.card-pos-drawDeck'); // Get the draw deck element
    drawDeckElem.innerHTML = ''; // Clear the draw deck element

    if (drawDeck.length > 0) {
        const drawnCard = drawDeck[drawDeck.length - 1].cloneNode(true); // Clone the top card from the draw deck
        const cardInnerElem = drawnCard.querySelector('.card-inner'); // Get the inner element of the cloned card

        cardInnerElem.style.transform = 'rotateY(0deg)'; // Showing the front of the card

        const cardBackImg = cardInnerElem.querySelector('.card-back'); // Grabbing the back image element
        cardBackImg.addEventListener('click', () => {
            mainHand.push(drawDeck.pop()); // Moving the top card from draw deck to center deck
            // Updating displays
            displayDrawDeck();
            displayMainHand();
        });

        drawDeckElem.appendChild(drawnCard); // Displaying the cloned card in the draw deck element
    }
}

// Display the top card from the center deck
function displayCenterDeck() {
    const centerDeckElem = document.querySelector('.card-pos-centerDeck');
    centerDeckElem.innerHTML = '';

    if (centerDeck.length > 0) {
        const displayedCard = centerDeck[centerDeck.length - 1].cloneNode(true);
        
        // Reset margin and positioning for displayed card
        const cardFrontElem = displayedCard.querySelector('.card-front');
        cardFrontElem.style.marginTop = '0'; // Reset margin-top
        cardFrontElem.style.transform = 'rotateY(0deg)'; // Reset rotation

        centerDeckElem.appendChild(displayedCard);
    }
}


// Draw a card from the draw deck and display it
function drawCards() {

    // Draws three cards and assigns them to reserve hand (hiddenCards)
    for (let i = 0; i < 3; i++) {
        const card = drawDeck.pop();
        if (card) {
            hiddenCards.push(card);
        } else {
            console.log("Not enough cards to pop from drawDeck.");
            break;
        }
    }
    // Draws six cards and assigns them to the mainHand
    for (let i = 0; i < 6; i++) {
        const card = drawDeck.pop();
        if (card) {
            mainHand.push(card);
        } else {
            console.log("Not enough cards to pop from drawDeck.");
            break;
        }
    }

    // Calls display functions
    console.log("Cards drawn and distributed.");
    displayHiddenCards();
    displayMainHand();
}

// Displays a backImage for every hidden card in the array 
function displayHiddenCards() {
    const reserveHandElem = document.querySelector('.reserve-hand-container');

    // Iterate through hiddenCards array and append each card to the container
    hiddenCards.forEach((card) => {
        reserveHandElem.appendChild(card);
    });
}

// This function assigns a numerical value to a card based on its ID
function cardValue(card) {
    // Assigning the order of the cards
    const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

    // Slicing off the SUIT of the card to get the value
    return values.indexOf(card.id.slice(0, -1));
}

  // Sorting cards least to greatest
  function sortCards(cards) {
    return cards.sort((a, b) => cardValue(a) - cardValue(b));
}

//   Displays mainHand array in order from least to greatest, with similar cards grouped
  function displayMainHand() {
    // Sorting Cards
    clearMainHandSlots();
    sortCards(mainHand);

    const mainHandElem = document.querySelector('.main-hand-container');

    // Array of card slot elements in the main hand container
    const cardSlots = [
        mainHandElem.querySelector('.card-slot-one'),
        mainHandElem.querySelector('.card-slot-two'),
        mainHandElem.querySelector('.card-slot-three'),
        mainHandElem.querySelector('.card-slot-four'),
        mainHandElem.querySelector('.card-slot-five'),
        mainHandElem.querySelector('.card-slot-six')
    ];

    let currentSlotIndex = 0;

    // Iterate through the mainHand array
    mainHand.forEach((card) => {
        const cardValue = card.id.slice(0, -1);

        // Check if the current card slot is occupied
        if (cardSlots[currentSlotIndex].childElementCount > 0) {
            const lastCardInSlot = cardSlots[currentSlotIndex].lastElementChild;
            const lastCardValue = lastCardInSlot.id.slice(0, -1);

            // If the current card's value is different from the last card's value in the slot, switch to the next slot
            if (cardValue !== lastCardValue) {
                currentSlotIndex = (currentSlotIndex + 1) % cardSlots.length;
            }
        }

        const cardBackElem = card.querySelector('.card-back');
        cardBackElem.style.display = 'none';

        const cardFrontElem = card.querySelector(".card-front");
        // Calculate the margin top for the card's position within the slot
        const marginTopIncrement = -182;
        const marginTop = cardSlots[currentSlotIndex].childElementCount * marginTopIncrement;
        
        // Apply the calculated margin top to the card elem
        cardFrontElem.style.marginTop = `${marginTop}px`;

        // Append the card to the current slot
        cardSlots[currentSlotIndex].appendChild(card);
    });

    mainHand.forEach((card) => {
        const cardFrontElem = card.querySelector('.card-front');
    
        // Add a click event listener to the front card image
        cardFrontElem.addEventListener('click', () => {
            drawCardFromMainHand(card);
        });
    });
    

    console.log("Display Updated, current array:", mainHand);

}

function drawCardFromMainHand(cardId) {
    // Find the index of the card with the matching ID in mainHand
    const cardIndex = mainHand.findIndex(card => card === cardId);

    if (cardIndex !== -1) {
        // Remove the card from mainHand using the found index
        const removedCard = mainHand.splice(cardIndex, 1)[0]; // Splice returns an array, so we take the first (and only) element

        // Push the removed card to centerDeck
        centerDeck.push(removedCard);

        // Update the UI
        displayCenterDeck();
        displayMainHand();
    } else {
        console.log("Card not found in mainHand.");
    }
}


function clearMainHandSlots() {
    const mainHandElem = document.querySelector('.main-hand-container');

    // clear all card slots before proceeding
    const cardSlots = [
        mainHandElem.querySelector('.card-slot-one'),
        mainHandElem.querySelector('.card-slot-two'),
        mainHandElem.querySelector('.card-slot-three'),
        mainHandElem.querySelector('.card-slot-four'),
        mainHandElem.querySelector('.card-slot-five'),
        mainHandElem.querySelector('.card-slot-six')
    ];

    cardSlots.forEach(slot => {
        while (slot.firstChild){
            slot.removeChild(slot.firstChild);
        }
    })
}

// Test issue pushing







loadGame();
