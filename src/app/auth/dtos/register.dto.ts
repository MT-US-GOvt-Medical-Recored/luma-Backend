import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;
  
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
