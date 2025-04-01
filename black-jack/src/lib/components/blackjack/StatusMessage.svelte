<script lang="ts">
    import { getStatusMessage } from '$lib/services/blackjackService';
    import type { GameStatus } from '$lib/services/blackjackService';

    export let gameStatus: GameStatus;
</script>

<div class="status-message">
    <p>{getStatusMessage(gameStatus)}</p>
</div>

<style>
    .status-message {
        text-align: center;
        font-size: 1.2rem;
        margin: 20px 0;
        min-height: 30px;
    }
</style>