import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsStrongPassword,
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { PASSWORD_MIN_LENGTH } from "src/constants";

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword(
    { minLength: PASSWORD_MIN_LENGTH },
    { message: "New Password must be atleast 8 characters longer." }
  )
  newPassword: string;
}
