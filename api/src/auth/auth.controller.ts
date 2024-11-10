import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { 
  ApiKeyResponseDTO, 
  ChangePasswordDTO, 
  DeleteAccountDTO, 
  LoginInputDTO, 
  RegisterInputDTO, 
  ResetPasswordDTO 
} from './auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @Post('/register')
  async register(@Body() input: RegisterInputDTO) {
    const data = await this.authService.register(input);
    return { data };
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() input: LoginInputDTO) {
    const data = await this.authService.login(input);
    return { data };
  }

  @ApiOperation({ summary: 'Change user password' })
  @ApiResponse({ status: 200, description: 'Password successfully changed' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/change-password')
  async changePassword(@Body() input: ChangePasswordDTO, @Request() req) {
    const data = await this.authService.changePassword(input, req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Reset password via email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @Post('/reset-password')
  async resetPassword(@Body() input: ResetPasswordDTO) {
    const data = await this.authService.resetPassword(input);
    return { data };
  }

  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'Account successfully deleted' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/account')
  async deleteAccount(@Body() input: DeleteAccountDTO, @Request() req) {
    const data = await this.authService.deleteAccount(input, req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Generate new API key' })
  @ApiResponse({ status: 201, description: 'API key generated' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('/api-keys')
  async generateApiKey(@Request() req) {
    const data = await this.authService.generateApiKey(req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Get all API keys' })
  @ApiResponse({ status: 200, type: [ApiKeyResponseDTO] })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/api-keys')
  async getApiKeys(@Request() req) {
    const data = await this.authService.getApiKeys(req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Revoke API key' })
  @ApiResponse({ status: 200, description: 'API key revoked' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/api-keys/:id')
  async revokeApiKey(@Param('id') keyId: string, @Request() req) {
    const data = await this.authService.revokeApiKey(keyId, req.user.id);
    return { data };
  }

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/who-am-i')
  async whoAmI(@Request() req) {
    return { data: req.user };
  }
}
