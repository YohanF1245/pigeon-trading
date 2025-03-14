import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(user_uuid: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { user_uuid } });
    if (!user) {
      throw new NotFoundException(`Utilisateur avec UUID ${user_uuid} non trouvé`);
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`Un utilisateur avec l'email ${createUserDto.email} existe déjà`);
    }

    // Générer un UUID blockchain si non fourni
    if (!createUserDto.uuid_blockchain) {
      createUserDto.uuid_blockchain = uuidv4();
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async createAdminIfNotExists(email: string, password: string): Promise<void> {
    const existingAdmin = await this.findOneByEmail(email);
    
    if (!existingAdmin) {
      const admin = this.usersRepository.create({
        email,
        password,
        role: 'admin',
        uuid_blockchain: uuidv4(),
      });
      
      await this.usersRepository.save(admin);
      console.log(`Compte administrateur créé avec l'email: ${email}`);
    } else {
      console.log(`Le compte administrateur avec l'email ${email} existe déjà`);
    }
  }

  async remove(user_uuid: string): Promise<void> {
    const result = await this.usersRepository.delete(user_uuid);
    if (result.affected === 0) {
      throw new NotFoundException(`Utilisateur avec UUID ${user_uuid} non trouvé`);
    }
  }
} 