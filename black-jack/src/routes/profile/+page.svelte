<script lang="ts">
    import { authStore } from '$lib/stores/authStore';

    // Get user information from the store
    $: user = $authStore.user;

    // Mock game statistics
    const gameStats = {
        gamesPlayed: 23,
        gamesWon: 12,
        totalWinnings: 1250,
        winRate: 52.17
    };
</script>

<div class="profile-page">
    <div class="profile-header">
        <h1>Profile</h1>
        <div class="profile-avatar">
            <div class="avatar-placeholder">
                {#if user?.username}
                    {user.username.charAt(0).toUpperCase()}
                {/if}
            </div>
        </div>
        <h2>{user?.username}</h2>
        <p>{user?.email}</p>
    </div>

    <div class="stats-section">
        <h3>Game Statistics</h3>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">{gameStats.gamesPlayed}</div>
                <div class="stat-label">Games Played</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">{gameStats.gamesWon}</div>
                <div class="stat-label">Games Won</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">${gameStats.totalWinnings}</div>
                <div class="stat-label">Total Winnings</div>
            </div>

            <div class="stat-card">
                <div class="stat-value">{gameStats.winRate}%</div>
                <div class="stat-label">Win Rate</div>
            </div>
        </div>
    </div>

    <div class="recent-games">
        <h3>Recent Games</h3>

        <table class="games-table">
            <thead>
            <tr>
                <th>Date</th>
                <th>Result</th>
                <th>Winnings</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>April 1, 2025</td>
                <td class="win">Win</td>
                <td>$100</td>
            </tr>
            <tr>
                <td>March 30, 2025</td>
                <td class="loss">Loss</td>
                <td>-$50</td>
            </tr>
            <tr>
                <td>March 29, 2025</td>
                <td class="win">Win</td>
                <td>$75</td>
            </tr>
            <tr>
                <td>March 29, 2025</td>
                <td class="win">Win</td>
                <td>$125</td>
            </tr>
            <tr>
                <td>March 28, 2025</td>
                <td class="loss">Loss</td>
                <td>-$50</td>
            </tr>
            </tbody>
        </table>
    </div>
</div>

<style>
    .profile-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .profile-header {
        text-align: center;
        margin-bottom: 2rem;
    }

    .profile-avatar {
        display: flex;
        justify-content: center;
        margin: 1rem 0;
    }

    .avatar-placeholder {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #1c5c2e;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3rem;
        font-weight: bold;
    }

    h1 {
        color: #1c5c2e;
        margin-bottom: 1rem;
    }

    h2 {
        margin: 0.5rem 0;
    }

    h3 {
        color: #1c5c2e;
        margin-bottom: 1rem;
    }

    .stats-section {
        margin-bottom: 2rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }

    .stat-card {
        background-color: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .stat-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #1c5c2e;
        margin-bottom: 0.5rem;
    }

    .stat-label {
        color: #555;
        font-size: 0.9rem;
    }

    .recent-games {
        margin-top: 2rem;
    }

    .games-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .games-table th, .games-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    .games-table th {
        background-color: #f8f9fa;
        font-weight: 500;
    }

    .win {
        color: #4caf50;
        font-weight: 500;
    }

    .loss {
        color: #f44336;
        font-weight: 500;
    }

    @media (max-width: 600px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .games-table th, .games-table td {
            padding: 0.75rem;
        }
    }
</style>