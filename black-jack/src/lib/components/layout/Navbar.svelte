<script lang="ts">
    import { authStore } from '$lib/stores/authStore';
    import { logout } from '$lib/services/authService';
    import { page } from '$app/stores';
    
    // Get current path for active link highlighting
    $: path = $page.url.pathname;
</script>

<nav class="navbar">
    <div class="navbar-brand">
        <a href="/">Blackjack Game</a>
    </div>
    
    <div class="navbar-menu">
        <ul class="navbar-nav">
            <li class="nav-item">
                <a href="/" class:active={path === '/'}>Home</a>
            </li>
            
            {#if $authStore.isAuthenticated}
                <li class="nav-item">
                    <a href="/game" class:active={path === '/game'}>Play Game</a>
                </li>
                <li class="nav-item">
                    <a href="/profile" class:active={path === '/profile'}>Profile</a>
                </li>
            {/if}
            
            <li class="nav-item">
                <a href="/leaderboard" class:active={path === '/leaderboard'}>Leaderboard</a>
            </li>
        </ul>
        
        <div class="navbar-auth">
            {#if $authStore.isAuthenticated}
                <span class="username">Hi, {$authStore.user?.username}</span>
                <button on:click={logout} class="logout-btn">Logout</button>
            {:else}
                <a href="/login" class="login-btn">Login</a>
                <a href="/register" class="register-btn">Register</a>
            {/if}
        </div>
    </div>
</nav>

<style>
    .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 2rem;
        background-color: #1c5c2e;
        color: white;
    }
    
    .navbar-brand a {
        font-size: 1.5rem;
        font-weight: bold;
        color: white;
        text-decoration: none;
    }
    
    .navbar-menu {
        display: flex;
        align-items: center;
    }
    
    .navbar-nav {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    
    .nav-item {
        margin-right: 1.5rem;
    }
    
    .nav-item a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 0;
        transition: color 0.3s;
    }
    
    .nav-item a:hover,
    .nav-item a.active {
        color: #aaffaa;
    }
    
    .navbar-auth {
        display: flex;
        align-items: center;
    }
    
    .username {
        margin-right: 1rem;
    }
    
    .logout-btn,
    .login-btn,
    .register-btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }
    
    .logout-btn {
        background-color: transparent;
        border: 1px solid white;
        color: white;
    }
    
    .logout-btn:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
    
    .login-btn,
    .register-btn {
        color: #1c5c2e;
        background-color: white;
        text-decoration: none;
        margin-left: 0.5rem;
    }
    
    .login-btn:hover,
    .register-btn:hover {
        background-color: #f0f0f0;
    }
    
    @media (max-width: 768px) {
        .navbar {
            flex-direction: column;
            padding: 1rem;
        }
        
        .navbar-menu {
            flex-direction: column;
            width: 100%;
            margin-top: 1rem;
        }
        
        .navbar-nav {
            flex-direction: column;
            width: 100%;
            margin-bottom: 1rem;
        }
        
        .nav-item {
            margin-right: 0;
            margin-bottom: 0.5rem;
        }
        
        .navbar-auth {
            width: 100%;
            justify-content: center;
        }
    }
</style>