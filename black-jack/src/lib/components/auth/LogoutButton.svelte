<script lang="ts">
    import { logout } from '$lib/services/authService';

    export let className = '';
</script>

<button class={`logout-button ${className}`} on:click={logout}>
    <slot>Logout</slot>
</button>

<style>
    .logout-button {
        padding: 0.5rem 1rem;
        background-color: transparent;
        border: 1px solid white;
        color: white;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    .logout-button:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }
</style>