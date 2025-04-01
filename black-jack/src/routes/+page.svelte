<script lang="ts">
    import { authStore } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';

    // Check if user is authenticated
    $: isAuthenticated = $authStore.isAuthenticated;
    $: user = $authStore.user;

    // Handle play button click
    function handlePlay() {
        if (isAuthenticated) {
            goto('/game');
        } else {
            goto('/login');
        }
    }
</script>

<div class="home-page">
    <div class="hero-section">
        <h1>Blackjack Game</h1>

        {#if isAuthenticated && user}
            <p class="subtitle">Welcome back, {user.username}! Ready to play?</p>
        {:else}
            <p class="subtitle">Test your luck and skill in this classic card game</p>
        {/if}

        <div class="cta-buttons">
            <button class="play-button" on:click={handlePlay}>
                {isAuthenticated ? 'Play Now' : 'Log In to Play'}
            </button>

            {#if !isAuthenticated}
                <a href="/register" class="register-button">Create Account</a>
            {/if}
        </div>
    </div>

    <div class="game-info">
        <h2>How to Play Blackjack</h2>

        <div class="rules-section">
            <div class="rule-card">
                <h3>Objective</h3>
                <p>Beat the dealer by getting a hand value as close to 21 as possible without going over.</p>
            </div>

            <div class="rule-card">
                <h3>Card Values</h3>
                <p>Number cards (2-10) are worth their face value. Face cards (J, Q, K) are worth 10. Aces can be worth 1 or 11.</p>
            </div>

            <div class="rule-card">
                <h3>Gameplay</h3>
                <p>Each player and the dealer are dealt 2 cards. Players choose to "hit" for more cards or "stand" to keep their current hand.</p>
            </div>

            <div class="rule-card">
                <h3>Winning</h3>
                <p>If your hand exceeds 21, you "bust" and lose. Otherwise, the higher hand between you and the dealer wins.</p>
            </div>
        </div>
    </div>

    <div class="features-section">
        <h2>Features</h2>

        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🎮</div>
                <h3>Real-time Gameplay</h3>
                <p>Experience authentic blackjack gameplay with smooth card animations.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">📊</div>
                <h3>Track Your Stats</h3>
                <p>View your game history and statistics in your profile.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🏆</div>
                <h3>Leaderboard</h3>
                <p>Compete with other players and climb the ranks on the leaderboard.</p>
            </div>

            <div class="feature-card">
                <div class="feature-icon">🔒</div>
                <h3>Secure Account</h3>
                <p>Create an account to save your progress and secure your winnings.</p>
            </div>
        </div>
    </div>
</div>

<style>
    .home-page {
        max-width: 1000px;
        margin: 0 auto;
    }

    .hero-section {
        text-align: center;
        padding: 2rem 1rem 3rem;
    }

    h1 {
        font-size: 2.5rem;
        color: #1c5c2e;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        font-size: 1.2rem;
        color: #555;
        margin-bottom: 2rem;
    }

    .cta-buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
    }

    .play-button, .register-button {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        border-radius: 4px;
        text-decoration: none;
        transition: background-color 0.3s;
        cursor: pointer;
    }

    .play-button {
        background-color: #1c5c2e;
        color: white;
        border: none;
    }

    .play-button:hover {
        background-color: #2a7d43;
    }

    .register-button {
        background-color: transparent;
        color: #1c5c2e;
        border: 1px solid #1c5c2e;
        display: inline-flex;
        align-items: center;
    }

    .register-button:hover {
        background-color: rgba(28, 92, 46, 0.1);
    }

    .game-info, .features-section {
        padding: 2rem 1rem;
    }

    h2 {
        text-align: center;
        color: #1c5c2e;
        margin-bottom: 2rem;
    }

    .rules-section {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .rule-card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .rule-card h3 {
        color: #1c5c2e;
        margin-bottom: 0.75rem;
    }

    .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1.5rem;
    }

    .feature-card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .feature-icon {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .feature-card h3 {
        color: #1c5c2e;
        margin-bottom: 0.75rem;
    }

    @media (max-width: 600px) {
        .cta-buttons {
            flex-direction: column;
            align-items: center;
        }

        .play-button, .register-button {
            width: 100%;
            max-width: 250px;
            text-align: center;
        }
    }
</style>