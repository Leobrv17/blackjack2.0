<script lang="ts">
    import { login } from '$lib/services/authService';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    let email = '';
    let password = '';
    let errorMessage = '';
    let loading = false;

    // Get the redirect URL from the query parameter if it exists
    $: redirectTo = $page.url.searchParams.get('redirectTo') || '/game';

    async function handleSubmit() {
        loading = true;
        errorMessage = '';
        
        try {
            const result = await login(email, password);
            
            if (result.success) {
                goto(redirectTo);
            } else {
                errorMessage = result.message || 'Login failed';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorMessage = 'An unexpected error occurred';
        } finally {
            loading = false;
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="login-form">
    <h2>Log In</h2>
    
    {#if errorMessage}
        <div class="error-message">{errorMessage}</div>
    {/if}
    
    <div class="form-group">
        <label for="email">Email</label>
        <input 
            type="email" 
            id="email" 
            bind:value={email} 
            required 
            disabled={loading}
            autocomplete="email"
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
            autocomplete="current-password"
        />
    </div>
    
    <div class="form-actions">
        <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
        </button>
    </div>
    
    <div class="form-footer">
        <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
</form>

<style>
    .login-form {
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