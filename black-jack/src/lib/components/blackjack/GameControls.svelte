<script lang="ts">
    import type { GameStatus } from '$lib/services/blackjackService';

    export let gameStatus: GameStatus;
    export let loading: boolean;
    export let hit: () => Promise<void>;
    export let stand: () => Promise<void>;
    export let initializeGame: () => Promise<void>;
</script>

<div class="controls">
    <button on:click={hit} disabled={gameStatus !== 'playing' || loading}>Tirer</button>
    <button on:click={stand} disabled={gameStatus !== 'playing' || loading}>Rester</button>
    <button on:click={initializeGame} disabled={loading}>Nouvelle partie</button>
</div>

<style>
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