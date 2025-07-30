import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { trim } from "src/shared/helpers/string/trim";
import { lowerCase } from "src/shared/helpers/string";
import { Transform } from "class-transformer";

export class ForgotPasswordDto {
  @ApiProperty()
  @Transform(({ value }) => trim(lowerCase(value)))
  @IsEmail({}, { message: "Please enter a valid email address" })
  email: string;
}
