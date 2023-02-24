import { Controller, Post, Query, Session, UseGuards } from '@nestjs/common';
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
    @Session() session: Record<string, any>,
    @Query('phone') phone: string,
  ): Promise<SendSMSOutput> {
    return await this.tfaService.sendSMS(session, phone);
  }

  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'verify user',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('/verify')
  async verifyUser(
    @Session() session: Record<string, any>,
    @Query('code') code: string,
  ): Promise<VerifyUserOutput> {
    return await this.tfaService.verifyUser(session, code);
  }
}
