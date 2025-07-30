import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class GoogleLoginDto {
  @ApiProperty({
    description: 'User\'s Google ID',
    example: '123456789012345678901'
  })
  @IsString()
  @IsNotEmpty()
  googleId: string;

  @ApiProperty({
    description: 'User\'s email from Google',
    example: 'user@example.com'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User\'s full name from Google',
    example: 'John Doe'
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'Google access token',
    example: 'ya29.a0ARrdaM...'
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
