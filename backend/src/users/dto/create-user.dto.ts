import { IsEmail, IsNotEmpty, IsString, IsUUID, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsIn(['admin', 'user'])
  role: string;

  @IsString()
  uuid_blockchain?: string;
} 