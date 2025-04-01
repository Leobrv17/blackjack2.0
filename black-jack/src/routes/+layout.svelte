<script lang="ts">
    import { navigating } from '$app/stores';
    import Navbar from '$lib/components/layout/Navbar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    
    // Add loading indicator
    $: isNavigating = !!$navigating;
</script>

<div class="app">
    <Navbar />
    
    <main class="main-content">
        {#if isNavigating}
            <div class="loading-indicator">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        {:else}
            <slot />
        {/if}
    </main>
    
    <Footer />
</div>

<style>
    :global(body) {
        margin: 0;
        font-family: sans-serif;
        background-color: #f9f9f9;
        min-height: 100vh;
    }
    
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }
    
    .main-content {
        flex: 1;
        padding: 2rem;
        max-width: 1200px;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
    
    .loading-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 300px;
    }
    
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        border-top-color: #1c5c2e;
        animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>