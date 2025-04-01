<script lang="ts">
    import type { Card, GameStatus } from '$lib/services/blackjackService';
    import CardDisplay from './CardDisplay.svelte';

    export let dealerHand: Card[] = [];
    export let dealerScore: number;
    export let gameStatus: GameStatus;
</script>

<div class="dealer-area">
    <h2>Croupier: {dealerScore}</h2>
    <div class="card-container">
        {#each dealerHand as card, i}
            <CardDisplay 
                image={i === 0 || gameStatus !== 'playing' ? card.image : 'https://deckofcardsapi.com/static/img/back.png'} 
                code={i === 0 || gameStatus !== 'playing' ? card.code : 'Card back'} 
                index={i} 
            />
        {/each}
    </div>
</div>

<style>
    .dealer-area {
        position: relative;
        min-height: 150px;
    }

    .card-container {
        position: relative;
        height: 150px;
    }
</style>