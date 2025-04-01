<script lang="ts">
    import RegisterForm from '$lib/components/auth/RegisterForm.svelte';
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

<div class="register-page">
    <h1>Create an Account</h1>
    <p>Register to play Blackjack and track your scores</p>

    <RegisterForm />
</div>

<style>
    .register-page {
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