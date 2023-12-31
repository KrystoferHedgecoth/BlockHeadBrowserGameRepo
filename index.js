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
const reserveCards = [];
const mainHand = [];
const garbageDeck = [];

// currentPhase is the phase of the game. (0: Reserve Hand Phase, 1: Play Phase)
let currentPhase = 0 

const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

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
    // DestroyDrawDeck();
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
            if (mainHand.length < 3) {
                mainHand.push(drawDeck.pop()); // Moving the top card from draw deck to center deck
                // Updating displays
                displayDrawDeck();
                displayMainHand();
            } else {
                console.log("own too many cards to draw");
            }
            if (hasPlayableCards(mainHand)) {
                console.log("You have playable cards");
            } else {
                pickUpDeck();
                console.log("picked up centerDeck");
                displayMainHand();
                displayCenterDeck();
            }

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

        isNonFive();

        console.log("I am center deck", centerDeck);
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
// Display hidden cards and allow moving them to the main hand
function displayHiddenCards() {
    const reserveHandElem = document.querySelector('.reserve-hand-container');
    const hiddenCardSlots = [
        reserveHandElem.querySelector('.h-card-slot-one'),
        reserveHandElem.querySelector('.h-card-slot-two'),
        reserveHandElem.querySelector('.h-card-slot-three')
    ];

    hiddenCards.forEach((card, index) => {
        // Append the card to the current slot
        hiddenCardSlots[index].appendChild(card);

        // Add a click event listener to the card
        card.addEventListener('click', () => {
            // Do something when the hidden card is clicked
            console.log(`Hidden Card ${index + 1} clicked!`);

            if (drawDeck.length === 0) {
                if (reserveCards.length === 0 && mainHand.length === 0) {
                    // Clone the clicked card
                    const clickedCardClone = card.cloneNode(true);

                    // Remove the original card from the UI and array
                    hiddenCardSlots[index].removeChild(card);
                    hiddenCards.splice(index, 1);

                    // Push the clone to the mainHand array
                    mainHand.push(clickedCardClone);

                    // Update UI
                    displayMainHand();
                    displayHiddenCards();
                    if (hasPlayableCards(mainHand)) {
                        console.log("you have playable cards");
                    } else {
                        setTimeout(() => {
                            pickUpDeck();
                            console.log("Picked up deck");
                            displayCenterDeck();
                        }, 500);
                    }
                } else {
                    console.log("Can't play this card right now");
                }
            }
        });
    });

    const shownCardSlots = [
        reserveHandElem.querySelector('.shown-slot-one'),
        reserveHandElem.querySelector('.shown-slot-two'),
        reserveHandElem.querySelector('.shown-slot-three')
    ];

    reserveCards.forEach((card, index) => {
        // Append the card to the current slot
        shownCardSlots[index].appendChild(card);

        // Add a click event listener to the card
        if (drawDeck.length === 0 && mainHand.length < 3) {
            if (hasPlayableCards(reserveCards)) {
                console.log("Has playable cards")
            } else {

                setTimeout(() => {
                pickUpDeck();
                console.log("Picked up deck");
                displayCenterDeck();
                }, 1000);

            }
        }
        if (drawDeck.length === 0 && mainHand.length === 0) {
            if (hasPlayableCards(reserveCards)) {
                console.log("Has playable cards")
            } else {
                pickUpDeck();
                console.log("Picked up deck");
            }
        }
        card.addEventListener('click', () => {
            if (drawDeck.length === 0) {
                if (mainHand.length === 0) {
                    // Clone the clicked card
                    const clickedCardClone = card.cloneNode(true);

                    // Remove the original card from the UI and array
                    shownCardSlots[index].removeChild(card);
                    reserveCards.splice(index, 1);

                    // Push the clone to the mainHand array
                    mainHand.push(clickedCardClone);

                    // Update UI
                    displayMainHand();
                    displayHiddenCards();
                } else {
                    console.log("Can't play this card right now");
                }
            }
        });
    });
}

// This function assigns a numerical value to a card based on its ID
function cardValue(card) {
    // Assigning the order of the cards

    // Slicing off the SUIT of the card to get the value
    return values.indexOf(card.id.slice(0, -1));
}

  // Sorting cards least to greatest
  function sortCards(cards) {
    return cards.sort((a, b) => cardValue(a) - cardValue(b));
}

function removeEventListenersFromCard(card) {
    const cardFrontElem = card.querySelector('.card-front');
    const newCard = card.cloneNode(true); // Clone the card to preserve its content

    // Replace the old card with the new card (removing event listeners)
    card.parentNode.replaceChild(newCard, card);

    return newCard; // Return the new card without event listeners
}

//   Displays mainHand array in order from least to greatest, with similar cards grouped
  function displayMainHand() {
    // Sorting Cards
    clearMainHandSlots();
    sortCards(mainHand);

    if (drawDeck.length === 0 && hiddenCards.length !== 0 && mainHand.length < 3 ) {
        if (!hasPlayableCards(mainHand)) {
            setTimeout(() => {
                pickUpDeck();
                console.log("Picked up deck");
                displayCenterDeck();
                }, 200);
        }
    }

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
            if (drawDeck.length === 0) {
                if (cardPlayability(card)) {
                    drawCardFromMainHand(card);
                } else {
                    console.log("card cannot be played");
                }
            } else if(mainHand.length >=3){
                if (cardPlayability(card)) {
                    drawCardFromMainHand(card);
                } else {
                    console.log("card cannot be played");
                }
            } else {
                console.log("Must draw a card to continue");
            }

        });
    });
}

function isNonFive() {
    for (let i = centerDeck.length - 1; i >= 0; i--) {
        if (cardValue(centerDeck[i]) !== 3) {
            console.log("I am non-5", cardValue(centerDeck[i]));
            return cardValue(centerDeck[i]); // Found a non-5 card, return its value
        }
    }
    
    console.log("No non-5 found");
    return 0; // No non-5 card found, return 0
}




function drawCardFromMainHand(cardId) {
    // Find the index of the card with the matching ID in mainHand
    const cardIndex = mainHand.findIndex(card => card === cardId);

    if (cardIndex !== -1) {
        // Remove the card from mainHand using the found index
        const removedCard = mainHand.splice(cardIndex, 1)[0];
         // Splice returns an array, so we take the first (and only) element
        if (currentPhase === 0) {
            if (reserveCards.length <2) {
            // Push the removed card to centerDeck
                const cardFrontElem = cardId.querySelector('.card-front');

                cardFrontElem.style.marginTop = '0'; // Reset margin-top
                cardFrontElem.style.transform = 'rotateY(0deg)'; // Reset rotation

                reserveCards.push(removedCard);
                displayHiddenCards();
            } else {
                const cardFrontElem = cardId.querySelector('.card-front');

                cardFrontElem.style.marginTop = '0'; // Reset margin-top
                cardFrontElem.style.transform = 'rotateY(0deg)'; // Reset rotation
    
                reserveCards.push(removedCard);
                displayHiddenCards();

                currentPhase = 1
            }

        } else {
            centerDeck.push(removedCard);

            if (cardValue(removedCard) === values.indexOf("10")) {
                blowUpDeck();
                displayCenterDeck;
            }
            
        }
        

        // Update the UI
        displayCenterDeck();
        displayMainHand();
    } else {
        console.log("Card not found in mainHand.");
    }
    displayHiddenCards();
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

// Function to check if a card can be played
function cardPlayability(card) {
    const playedCardValue = cardValue(card);

    let lastCardValue = "0";

    if (centerDeck.length > 0) {
        lastCardValue = isNonFive();
    }

    if (currentPhase === 0) {
        // In Reserve Hand Phase, any card can be played
        return true;
    } else if (currentPhase === 1) {
        if (centerDeck.length > 0) {

            // Check if the top card is a 5
            if (playedCardValue === values.indexOf("5")) {
                return true; // A 5 can be played on any card
            }

            if (playedCardValue === values.indexOf("2")) {
                return true;
            }

            if (playedCardValue === values.indexOf("10")) {
                return true;
            }

            if (lastCardValue === values.indexOf("7")) {
                // Check if the new card is below or equal to a 7
                return playedCardValue <= values.indexOf("7");
            }
            // Check if the played card can be played in relation to the last card value
            return playedCardValue >= lastCardValue;
        } else {
            // If centerDeck is empty, any card can be played in the Play Phase
            return true;
        }
    }

    // Default case (shouldn't reach here)
    return false;
}

//Checks if there are any playable cards (returns true or false)
function hasPlayableCards(array) {
    for (let i = 0; i < array.length; i++) {
        if (cardPlayability(array[i])) {
            return true;
        }
    }
    return false;
}

// Move cards from the center deck to the main hand
// Move cards from the center deck to the main hand
function pickUpDeck() {
    while (centerDeck.length > 0) {
        const card = centerDeck.pop(); // Declare card here
        const cardFrontElem = card.querySelector('.card-front');
        cardFrontElem.style.marginTop = '0';
        cardFrontElem.style.transform = 'rotateY(0deg)';
        mainHand.push(card);
        displayMainHand();
    }
}

// Move cards from the center deck to the garbage deck
function blowUpDeck() {
    while (centerDeck.length > 0) {
        const card = centerDeck.pop();
        garbageDeck.push(card);
        displayMainHand();
        displayCenterDeck();
    }
    displayTrashDeck();
}
function DestroyDrawDeck() {
    while (drawDeck.length > 0) {
        const card = drawDeck.pop();
        garbageDeck.push(card);
        displayMainHand();
        displayCenterDeck();
    }
    displayDrawDeck();
    displayTrashDeck();
}

// similar to the displayDrawDeck, shows a backimage for the trashDeck if .length > 0
function displayTrashDeck() {
    const trashDeckElem = document.querySelector('.card-pos-trashDeck'); // Get the draw deck element
    trashDeckElem.innerHTML = ''; // Clear the draw deck element

    if (drawDeck.length > 0) {
        const drawnCard = drawDeck[drawDeck.length - 1].cloneNode(true); // Clone the top card from the draw deck
        const cardInnerElem = drawnCard.querySelector('.card-inner'); // Get the inner element of the cloned card

        cardInnerElem.style.transform = 'rotateY(0deg)'; // Showing the front of the card
        trashDeckElem.appendChild(drawnCard); // Displaying the cloned card in the draw deck element
    }
}

loadGame();
