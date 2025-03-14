import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit() {
    console.log('Initialisation de l\'application...');
    
    // Créer l'utilisateur admin par défaut
    const adminEmail = 'root@root.fr';
    const adminPassword = 'root';
    
    try {
      // Hacher le mot de passe
      const hashedPassword = await this.authService.hashPassword(adminPassword);
      
      // Créer l'admin s'il n'existe pas déjà
      await this.usersService.createAdminIfNotExists(adminEmail, hashedPassword);
      
      console.log('Initialisation terminée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
    }
  }
} 