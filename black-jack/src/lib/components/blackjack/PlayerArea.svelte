<script lang="ts">
    import type { Card } from '$lib/services/blackjackService';
    import CardDisplay from './CardDisplay.svelte';

    export let playerHand: Card[] = [];
    export let playerScore: number;
</script>

<div class="player-area">
    <h2>Joueur: {playerScore}</h2>
    <div class="card-container">
        {#each playerHand as card, i}
            <CardDisplay image={card.image} code={card.code} index={i} />
        {/each}
    </div>
</div>

<style>
    .player-area {
        position: relative;
        min-height: 150px;
    }

    .card-container {
        position: relative;
        height: 150px;
    }
</style>