<script lang="ts">
  import { authService } from '../services/auth.service';
  
  let email: string = '';
  let password: string = '';
  let error: string = '';
  let loading: boolean = false;

  async function handleSubmit() {
    error = '';
    loading = true;
    
    try {
      await authService.login(email, password);
      // Rediriger vers le dashboard ou la page d'accueil
      window.location.href = '/dashboard';
    } catch (err) {
      error = err.message || 'Erreur de connexion';
    } finally {
      loading = false;
    }
  }
</script>

<div class="w-full max-w-md mx-auto">
  <h2 class="text-2xl font-bold mb-6 text-center">Connexion</h2>
  
  {#if error}
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <span class="block sm:inline">{error}</span>
    </div>
  {/if}
  
  <form on:submit|preventDefault={handleSubmit} class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input 
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
        id="email" 
        type="email" 
        placeholder="Email" 
        bind:value={email}
        required
      />
    </div>
    
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        Mot de passe
      </label>
      <input 
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
        id="password" 
        type="password" 
        placeholder="******************" 
        bind:value={password}
        required
      />
    </div>
    
    <div class="flex items-center justify-between">
      <button 
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
        type="submit"
        disabled={loading}
      >
        {loading ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </div>
  </form>
  
  <p class="text-center text-gray-500 text-xs">
    Vous n'avez pas de compte ? <a href="/register" class="text-blue-500 hover:text-blue-800">Inscrivez-vous</a>
  </p>
</div> 