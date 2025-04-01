<script lang="ts">
    import LoginForm from '$lib/components/auth/LoginForm.svelte';
    import { authStore } from '$lib/stores/authStore';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    onMount(() => {
        // Redirect to game if already logged in
        if ($authStore.isAuthenticated) {
            goto('/game');
        }
    });
</script>

<div class="login-page">
    <h1>Welcome Back</h1>
    <p>Please login to continue to the game</p>

    <LoginForm />
</div>

<style>
    .login-page {
        max-width: 500px;
        margin: 2rem auto;
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
</style>