import { Controller, Get, UseGuards, Request, Body, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsersService } from './users.service';
import { UserRole } from './user-roles.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return { data: req.user };
  }

  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() updateData: any) {
    const data = await this.usersService.update(req.user.id, updateData);
    return { data };
  }

  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async getAllUsers(@Request() req) {
    if (req.user.role !== UserRole.ADMIN) {
      return { data: [] };
    }
    const data = await this.usersService.findAll();
    return { data };
  }
}
