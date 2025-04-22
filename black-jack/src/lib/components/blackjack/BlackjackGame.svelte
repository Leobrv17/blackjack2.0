
<script lang="ts">
    import { onMount } from 'svelte';
    import { getNewDeck, drawCards, calculateScore } from '$lib/services/blackjackService';
    import type { Card, GameStatus } from '$lib/services/blackjackService';
    import DealerArea from './DealerArea.svelte';
    import PlayerArea from './PlayerArea.svelte';
    import GameControls from './GameControls.svelte';
    import StatusMessage from './StatusMessage.svelte';

    // Game state
    let deckId = '';
    let playerHand: Card[] = [];
    let dealerHand: Card[] = [];
    let playerScore = 0;
    let dealerScore = 0;
    let gameStatus: GameStatus = 'initializing';
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
            deckId = await getNewDeck();

            // Deal initial cards
            await dealInitialCards();
            gameStatus = 'playing';

            // Check for blackjack
            checkForBlackjack(playerScore);
        } catch (error) {
            console.error('Error initializing game:', error);
        } finally {
            loading = false;
        }
    }

    // Deal the initial cards (2 to player, 2 to dealer)
    async function dealInitialCards() {
        // Deal 2 cards to player
        await drawCardsForPlayer(2);

        // Deal 2 cards to dealer
        await drawCardsForDealer(2);
    }

    // Draw cards for player
    async function drawCardsForPlayer(count: number) {
        try {
            const cards = await drawCards(deckId, count);
            playerHand = [...playerHand, ...cards];
            playerScore = calculateScore(playerHand);
        } catch (error) {
            console.error('Error drawing cards for player:', error);
        }
    }

    // Draw cards for dealer
    async function drawCardsForDealer(count: number) {
        try {
            const cards = await drawCards(deckId, count);
            dealerHand = [...dealerHand, ...cards];
            dealerScore = calculateScore(dealerHand);
        } catch (error) {
            console.error('Error drawing cards for dealer:', error);
        }
    }

    // Check for blackjack in the initial deal
    function checkForBlackjack(playerScore : number) {
        if (playerScore === 21) {
            gameStatus = 'playerBlackjack';
        }
    }

    // Player hits
    async function hit() {
        if (gameStatus !== 'playing') return;

        loading = true;
        await drawCardsForPlayer(1);

        if (playerScore > 21) {
            gameStatus = 'playerBust';
        }
        loading = false;
    }

    // Player stands
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
            await drawCardsForDealer(1);
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
</script>

<div class="blackjack">
    <h1>Blackjack</h1>

    <StatusMessage {gameStatus} />

    <div class="game-area">
        <DealerArea {dealerHand} {dealerScore} {gameStatus} />
        <PlayerArea {playerHand} {playerScore} />
    </div>

    <GameControls {gameStatus} {loading} {hit} {stand} {initializeGame} />
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

    .game-area {
        display: flex;
        flex-direction: column;
        gap: 40px;
    }
</style>