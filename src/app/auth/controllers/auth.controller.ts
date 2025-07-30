import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";

import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthenticatedRequestPayload } from "src/shared/decorators/authenticated-request.decorator";
import { Public } from "src/shared/decorators/is-public.decorator";
import { IAuthenticatedRequest } from "src/shared/interfaces/authenticated-request.interface";
import {
  LoginDto,
  RegisterDto,
  GoogleLoginDto,
} from "../dtos";
import { AuthService } from "../services";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Public()
  @ApiOperation({
    summary: "Get yourself registered to access the system.",
  })
  @Post("register")
  @HttpCode(HttpStatus.OK)
  async register(@Body() body: RegisterDto) {
    console.log("🚀 ~ AuthController ~ body:", body)

    return await this.authService.register(body);
  }


  @Public()
  @ApiOperation({
    summary: "Get yourself authenticated to access system.",
  })
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return await this.authService.login(body);
  }

  @Public()
  @ApiOperation({ summary: "Google login." })
  @Post("login-via-google")
  async loginViaGoogle(@Body() body: LoginViaGoogleRequestDto) {
    return await this.authService.loginViaGoogle(body);
  }

  @ApiOperation({
    summary: "Logout from current device.",
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@AuthenticatedRequestPayload() req: IAuthenticatedRequest) {
    await this.authService.logout({
      sessionId: req.user.session.id,
      userId: req.user.id,
    });
    return {
      message: "Logout successfully.",
    };
  }

}
