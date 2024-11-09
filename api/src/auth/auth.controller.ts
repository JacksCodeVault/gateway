import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CanModifyApiKey } from './guards/can-modify-api-key.guard';
import { LoginInputDTO, RegisterInputDTO } from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register' })
  @Post('/register')
  async register(@Body() input: RegisterInputDTO) {
    const data = await this.authService.register(input);
    return { data };
  }

  @ApiOperation({ summary: 'Login' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() input: LoginInputDTO) {
    const data = await this.authService.login(input);
    return { data };
  }

  @ApiOperation({ summary: 'Generate Api Key' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/api-keys')
  async generateApiKey(@Request() req) {
    const data = await this.authService.generateApiKey(req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Get current logged in user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/who-am-i')
  async whoAmI(@Request() req) {
    return { data: req.user };
  }
}
