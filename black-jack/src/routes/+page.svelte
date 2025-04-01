<script>
    import { onMount } from 'svelte';

    // Game state
    let deckId = '';
    let playerHand = [];
    let dealerHand = [];
    let playerScore = 0;
    let dealerScore = 0;
    let gameStatus = 'initializing'; // initializing, playing, playerBust, dealerBust, playerBlackjack, dealerBlackjack, playerWin, dealerWin, push
    let loading = false;

    // Initialize the game
    onMount(async () => {
        await initializeGame();
    });

    // Initialize a new game
    async function initializeGame() {
        loading = true;
        gameStatus = 'initializing';
        playerHand = [];
        dealerHand = [];
        playerScore = 0;
        dealerScore = 0;

        try {
            // Get a new shuffled deck
            const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            const data = await response.json();

            if (data.success) {
                deckId = data.deck_id;

                // Deal initial cards
                await dealInitialCards();
                gameStatus = 'playing';

                // Check for blackjack
                checkForBlackjack();
            }
        } catch (error) {
            console.error('Error initializing game:', error);
        } finally {
            loading = false;
        }
    }

    // Deal the initial cards (2 to player, 2 to dealer)
    async function dealInitialCards() {
        // Deal 2 cards to player
        await drawCards(2, 'player');

        // Deal 2 cards to dealer
        await drawCards(2, 'dealer');
    }

    // Draw cards for either player or dealer
    async function drawCards(count, recipient) {
        try {
            const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${count}`);
            const data = await response.json();

            if (data.success) {
                if (recipient === 'player') {
                    playerHand = [...playerHand, ...data.cards];
                    playerScore = calculateScore(playerHand);
                } else {
                    dealerHand = [...dealerHand, ...data.cards];
                    dealerScore = calculateScore(dealerHand);
                }
            }
        } catch (error) {
            console.error(`Error drawing cards for ${recipient}:`, error);
        }
    }

    // Calculate the score of a hand
    function calculateScore(hand) {
        let score = 0;
        let aces = 0;

        for (const card of hand) {
            if (card.value === 'ACE') {
                aces += 1;
                score += 11;
            } else if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }

        // Adjust for aces if the score is over 21
        while (score > 21 && aces > 0) {
            score -= 10; // Count an ace as 1 instead of 11
            aces -= 1;
        }

        return score;
    }

    // Check for blackjack in the initial deal
    function checkForBlackjack() {
        if (playerScore === 21) {
            gameStatus = 'playerBlackjack';
        } else if (dealerScore === 21) {
            gameStatus = 'dealerBlackjack';
        }
    }

    // Player actions
    async function hit() {
        if (gameStatus !== 'playing') return;

        loading = true;
        await drawCards(1, 'player');

        if (playerScore > 21) {
            gameStatus = 'playerBust';
        }
        loading = false;
    }

    async function stand() {
        if (gameStatus !== 'playing') return;

        loading = true;
        await dealerPlay();
        determineWinner();
        loading = false;
    }

    // Dealer's turn
    async function dealerPlay() {
        // Dealer hits until they have at least 17
        while (dealerScore < 17) {
            await drawCards(1, 'dealer');
        }
    }

    // Determine the winner
    function determineWinner() {
        if (dealerScore > 21) {
            gameStatus = 'dealerBust';
        } else if (dealerScore > playerScore) {
            gameStatus = 'dealerWin';
        } else if (playerScore > dealerScore) {
            gameStatus = 'playerWin';
        } else {
            gameStatus = 'push'; // Tie
        }
    }

    // Get status message
    function getStatusMessage() {
        switch (gameStatus) {
            case 'initializing':
                return 'Préparation du jeu...';
            case 'playing':
                return 'Votre tour - Tirer ou rester?';
            case 'playerBust':
                return 'Vous avez dépassé 21. Vous perdez!';
            case 'dealerBust':
                return 'Le croupier a dépassé 21. Vous gagnez!';
            case 'playerBlackjack':
                return 'Blackjack! Vous gagnez!';
            case 'dealerBlackjack':
                return 'Le croupier a un Blackjack. Vous perdez!';
            case 'playerWin':
                return 'Vous gagnez!';
            case 'dealerWin':
                return 'Le croupier gagne!';
            case 'push':
                return 'Égalité!';
            default:
                return '';
        }
    }
</script>

<div class="blackjack">
    <h1>Blackjack</h1>

    <div class="status-message">
        <p>{getStatusMessage()}</p>
    </div>

    <div class="game-area">
        <div class="dealer-area">
            <h2>Croupier: {dealerScore}</h2>
            <div class="card-container">
                {#each dealerHand as card, i}
                    <div class="card" style="left: {i * 30}px">
                        <img
                                src={i === 0 || gameStatus !== 'playing' ? card.image : 'https://deckofcardsapi.com/static/img/back.png'}
                                alt={i === 0 || gameStatus !== 'playing' ? card.code : 'Card back'}
                        />
                    </div>
                {/each}
            </div>
        </div>

        <div class="player-area">
            <h2>Joueur: {playerScore}</h2>
            <div class="card-container">
                {#each playerHand as card, i}
                    <div class="card" style="left: {i * 30}px">
                        <img src={card.image} alt={card.code} />
                    </div>
                {/each}
            </div>
        </div>
    </div>

    <div class="controls">
        <button on:click={hit} disabled={gameStatus !== 'playing' || loading}>Tirer</button>
        <button on:click={stand} disabled={gameStatus !== 'playing' || loading}>Rester</button>
        <button on:click={initializeGame} disabled={loading}>Nouvelle partie</button>
    </div>
</div>

<style>
    .blackjack {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        font-family: sans-serif;
    }

    h1 {
        text-align: center;
        color: #1c5c2e;
    }

    .status-message {
        text-align: center;
        font-size: 1.2rem;
        margin: 20px 0;
        min-height: 30px;
    }

    .game-area {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }

    .dealer-area, .player-area {
        position: relative;
        min-height: 150px;
    }

    .card-container {
        position: relative;
        height: 150px;
    }

    .card {
        position: absolute;
        transition: left 0.3s ease;
    }

    .card img {
        width: 100px;
        height: auto;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .controls {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
    }

    button {
        padding: 10px 20px;
        font-size: 1rem;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        background-color: #1c5c2e;
        color: white;
        transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
        background-color: #2a7d43;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }
</style>