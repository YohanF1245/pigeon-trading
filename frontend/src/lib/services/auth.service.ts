import { writable } from 'svelte/store';

// Store pour l'état d'authentification
export const authStore = writable({
  isAuthenticated: false,
  user: null,
  token: null,
});

// Base URL de l'API
const API_URL = 'http://localhost:3000/api';

/**
 * Service d'authentification
 */
class AuthService {
  /**
   * Enregistrer un nouvel utilisateur
   */
  async register(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connecter un utilisateur
   */
  async login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Identifiants invalides');
      }

      const data = await response.json();
      
      // Mettre à jour le store
      authStore.update(() => ({
        isAuthenticated: true,
        user: data.user,
        token: data.access_token,
      }));

      // Sauvegarder dans le localStorage
      localStorage.setItem('auth_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnecter l'utilisateur
   */
  logout() {
    // Mettre à jour le store
    authStore.update(() => ({
      isAuthenticated: false,
      user: null,
      token: null,
    }));

    // Supprimer du localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  checkAuth() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');

    if (token && user) {
      authStore.update(() => ({
        isAuthenticated: true,
        user: JSON.parse(user),
        token: token,
      }));
      return true;
    }

    return false;
  }

  /**
   * Obtenir le profil de l'utilisateur
   */
  async getProfile() {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Non authentifié');
      }

      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur de profil:', error);
      throw error;
    }
  }
}

export const authService = new AuthService(); 