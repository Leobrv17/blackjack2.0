<script lang="ts">
    import { register } from '$lib/services/authService';
    import { goto } from '$app/navigation';
    import { browser } from '$app/environment';

    let username = '';
    let email = '';
    let password = '';
    let confirmPassword = '';
    let errorMessage = '';
    let loading = false;

    async function handleSubmit() {
        loading = true;
        errorMessage = '';

        // Validate passwords match
        if (password !== confirmPassword) {
            errorMessage = 'Passwords do not match';
            loading = false;
            return;
        }

        const result = await register(username, email, password);

        if (result.success) {
            // Delay the navigation slightly to ensure cookie is processed
            setTimeout(() => {
                window.location.href = '/game'; // Use direct location change instead of goto
            }, 100);
        } else {
            errorMessage = result.message || 'Registration failed';
            loading = false;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="register-form">
    <h2>Create Account</h2>

    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}

    <div class="form-group">
        <label for="username">Username</label>
        <input
            type="text"
            id="username"
            bind:value={username}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            bind:value={email}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            bind:value={password}
            required
            disabled={loading}
        />
    </div>

    <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input
            type="password"
            id="confirmPassword"
            bind:value={confirmPassword}
            required
            disabled={loading}
        />
    </div>

    <div class="form-actions">
        <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
        </button>
    </div>

    <div class="form-footer">
        <p>Already have an account? <a href="/login">Log In</a></p>
    </div>
</form>

<style>
    .register-form {
        max-width: 400px;
        margin: 0 auto;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        background-color: white;
    }

    h2 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #1c5c2e;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
    }

    .form-actions {
        margin-top: 1.5rem;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background-color: #1c5c2e;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
        background-color: #2a7d43;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .error-message {
        background-color: #ffebee;
        color: #c62828;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .form-footer {
        margin-top: 1.5rem;
        text-align: center;
    }

    a {
        color: #1c5c2e;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }
</style>