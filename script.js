let balance = 50000; // Starting balance

const balanceElement = document.getElementById('balanceAmount');

// Slot Machine Elements
const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const slotBetInput = document.getElementById('slotBetAmount');
const rollButton = document.getElementById('rollButton');
const slotResultElement = document.getElementById('slotResult');

// Blackjack Elements
const blackjackBetInput = document.getElementById('blackjackBetAmount');
const blackjackStartButton = document.getElementById('blackjackStartButton');
const blackjackHitButton = document.getElementById('blackjackHitButton');
const blackjackStandButton = document.getElementById('blackjackStandButton');
const blackjackResultElement = document.getElementById('blackjackResult');
const playerCardsElement = document.getElementById('playerCards');
const playerTotalElement = document.getElementById('playerTotal');
const dealerCardsElement = document.getElementById('dealerCards');
const dealerTotalElement = document.getElementById('dealerTotal');

let deck = [];
let playerHand = [];
let dealerHand = [];

// Utility Functions
function updateBalance() {
    balanceElement.textContent = balance;
}

// Create a standard deck of cards
function createDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = [
        { value: '2', points: 2 },
        { value: '3', points: 3 },
        { value: '4', points: 4 },
        { value: '5', points: 5 },
        { value: '6', points: 6 },
        { value: '7', points: 7 },
        { value: '8', points: 8 },
        { value: '9', points: 9 },
        { value: '10', points: 10 },
        { value: 'J', points: 10 },
        { value: 'Q', points: 10 },
        { value: 'K', points: 10 },
        { value: 'A', points: 11 }, // Ace starts as 11, adjusted later
    ];

    const deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({ value: value.value, points: value.points, suit });
        }
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Calculate the hand value
function calculateHandValue(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        total += card.points;
        if (card.value === 'A') aces++;
    }

    while (total > 21 && aces > 0) {
        total -= 10; // Downgrade Ace from 11 to 1
        aces--;
    }

    return total;
}

// Blackjack Logic
function startBlackjackGame() {
    const betAmount = parseInt(blackjackBetInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        blackjackResultElement.textContent = 'Invalid or insufficient balance for the bet!';
        return;
    }

    balance -= betAmount;
    updateBalance();

    deck = createDeck();
    shuffleDeck(deck);

    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    blackjackHitButton.disabled = false;
    blackjackStandButton.disabled = false;
    blackjackStartButton.disabled = true;

    blackjackResultElement.textContent = '';
    updateBlackjackDisplay();

    // Check for Blackjack
    const playerValue = calculateHandValue(playerHand);
    if (playerValue === 21) {
        blackjackResultElement.textContent = 'Blackjack! You win 1.5x your bet!';
        balance += betAmount * 2.5; // Return bet + 1.5x winnings
        endBlackjackGame();
    }
}

function updateBlackjackDisplay() {
    const playerValue = calculateHandValue(playerHand);
    const dealerFirstCard = dealerHand[0];

    playerCardsElement.textContent = `Cards: ${playerHand.map(card => card.value + card.suit).join(', ')}`;
    playerTotalElement.textContent = `Total: ${playerValue}`;
    dealerCardsElement.textContent = `Cards: ${dealerFirstCard.value + dealerFirstCard.suit}, ?`;
    dealerTotalElement.textContent = `Total: ${dealerFirstCard.points}`;
}

function hitBlackjack() {
    playerHand.push(deck.pop());
    updateBlackjackDisplay();

    const playerValue = calculateHandValue(playerHand);

    if (playerValue > 21) {
        blackjackResultElement.textContent = 'You busted! You lost your bet.';
        endBlackjackGame();
    }
}

function standBlackjack() {
    blackjackHitButton.disabled = true;

    let dealerValue = calculateHandValue(dealerHand);
    while (dealerValue < 17) {
        dealerHand.push(deck.pop());
        dealerValue = calculateHandValue(dealerHand);
    }

    const playerValue = calculateHandValue(playerHand);
    updateBlackjackDisplay(true);

    if (dealerValue > 21 || playerValue > dealerValue) {
        blackjackResultElement.textContent = 'You win! You double your bet!';
        const betAmount = parseInt(blackjackBetInput.value);
        balance += betAmount * 2;
    } else if (playerValue === dealerValue) {
        blackjackResultElement.textContent = 'It\'s a tie! You get your bet back.';
        const betAmount = parseInt(blackjackBetInput.value);
        balance += betAmount; // Return the bet
    } else {
        blackjackResultElement.textContent = 'Dealer wins! You lost your bet.';
    }

    endBlackjackGame();
}

function endBlackjackGame() {
    blackjackHitButton.disabled = true;
    blackjackStandButton.disabled = true;
    blackjackStartButton.disabled = false;

    dealerCardsElement.textContent = `Cards: ${dealerHand.map(card => card.value + card.suit).join(', ')}`;
    dealerTotalElement.textContent = `Total: ${calculateHandValue(dealerHand)}`;

    updateBalance();
}

// Slot Machine Logic
function rollSlots() {
    const betAmount = parseInt(slotBetInput.value);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        slotResultElement.textContent = 'Invalid or insufficient balance for the bet!';
        return;
    }

    balance -= betAmount;
    updateBalance();

    const symbols = ['🍒', '🍋', '🍀', '⭐', '🔔'];
    const results = [
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
    ];

    slot1.textContent = results[0];
    slot2.textContent = results[1];
    slot3.textContent = results[2];

    if (results[0] === results[1] && results[1] === results[2]) {
        const winnings = betAmount * 10;
        slotResultElement.textContent = `Jackpot! You win $${winnings}!`;
        balance += winnings;
    } else {
        slotResultElement.textContent = 'You lose. Try again!';
    }

    updateBalance();
}

// Event Listeners
rollButton.addEventListener('click', rollSlots);
blackjackStartButton.addEventListener('click', startBlackjackGame);
blackjackHitButton.addEventListener('click', hitBlackjack);
blackjackStandButton.addEventListener('click', standBlackjack);

// Initialize balance
updateBalance();
