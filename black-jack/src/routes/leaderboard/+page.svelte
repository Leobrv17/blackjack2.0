<script lang="ts">
    // Mock leaderboard data
    const leaderboardData = [
        { rank: 1, username: 'cardshark92', gamesWon: 42, winRate: 68.85, totalWinnings: 4250 },
        { rank: 2, username: 'pokerface', gamesWon: 38, winRate: 65.52, totalWinnings: 3750 },
        { rank: 3, username: 'acemaster', gamesWon: 35, winRate: 62.50, totalWinnings: 3200 },
        { rank: 4, username: 'dealerbeater', gamesWon: 32, winRate: 59.26, totalWinnings: 2800 },
        { rank: 5, username: 'blackjackpro', gamesWon: 30, winRate: 57.69, totalWinnings: 2600 },
        { rank: 6, username: 'chipsLover', gamesWon: 28, winRate: 56.00, totalWinnings: 2400 },
        { rank: 7, username: 'luckydraw', gamesWon: 25, winRate: 54.35, totalWinnings: 2200 },
        { rank: 8, username: 'cardswhiz', gamesWon: 22, winRate: 52.38, totalWinnings: 1950 },
        { rank: 9, username: 'blackjack21', gamesWon: 20, winRate: 51.28, totalWinnings: 1750 },
        { rank: 10, username: 'royalflush', gamesWon: 18, winRate: 48.65, totalWinnings: 1550 },
    ];
</script>

<div class="leaderboard-page">
    <h1>Leaderboard</h1>
    <p>Top players ranked by winnings</p>

    <div class="leaderboard-container">
        <table class="leaderboard-table">
            <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Games Won</th>
                <th>Win Rate</th>
                <th>Total Winnings</th>
            </tr>
            </thead>
            <tbody>
            {#each leaderboardData as player}
                <tr class={player.rank <= 3 ? 'top-player' : ''}>
                    <td class="rank">
                        {#if player.rank === 1}
                            <span class="crown gold">👑</span>
                        {:else if player.rank === 2}
                            <span class="crown silver">👑</span>
                        {:else if player.rank === 3}
                            <span class="crown bronze">👑</span>
                        {:else}
                            {player.rank}
                        {/if}
                    </td>
                    <td>{player.username}</td>
                    <td>{player.gamesWon}</td>
                    <td>{player.winRate}%</td>
                    <td>${player.totalWinnings}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</div>

<style>
    .leaderboard-page {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    h1 {
        text-align: center;
        color: #1c5c2e;
        margin-bottom: 0.5rem;
    }

    p {
        text-align: center;
        margin-bottom: 2rem;
        color: #555;
    }

    .leaderboard-container {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .leaderboard-table {
        width: 100%;
        border-collapse: collapse;
    }

    .leaderboard-table th, .leaderboard-table td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    .leaderboard-table th {
        background-color: #f8f9fa;
        font-weight: 500;
    }

    .top-player {
        background-color: #f9f9f9;
    }

    .rank {
        font-weight: bold;
        text-align: center;
    }

    .crown {
        font-size: 1.2rem;
    }

    .gold {
        color: gold;
    }

    .silver {
        color: silver;
    }

    .bronze {
        color: #cd7f32;
    }

    @media (max-width: 600px) {
        .leaderboard-table th, .leaderboard-table td {
            padding: 0.75rem 0.5rem;
            font-size: 0.9rem;
        }
    }
</style>