import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/authUser.decorator';
import { User } from 'src/user/entities/user.entity';
import { SendSMSOutput, VerifyUserOutput } from './dtos/tfa.dto';
import { TfaService } from './tfa.service';

@ApiTags('tfa')
@Controller('tfa')
export class TfaController {
  constructor(private readonly tfaService: TfaService) {}

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'send SMS to verify phone number',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('send')
  async sendSMS(
    @AuthUser() user: User,
    @Query('phone') phone: string,
  ): Promise<SendSMSOutput> {
    return await this.tfaService.sendSMS(user, phone);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'verify user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/verify')
  async verifyUser(
    @AuthUser() user: User,
    @Query('code') code: string,
  ): Promise<VerifyUserOutput> {
    return await this.tfaService.verifyUser(user, code);
  }
}
