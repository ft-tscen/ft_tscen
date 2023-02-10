import { User } from 'src/user/entities/user.entity';
import { BaseOutput } from 'src/common/dtos/base.dto';

export class getMeOutput extends BaseOutput {
  user?: User;
}

export class CreateUserOutput extends BaseOutput {
  user?: User;
}

export class getUserByNickNameOutput extends BaseOutput {
  user?: User;
}

export class CheckNickNameOutput extends BaseOutput {}

export class UpdateUserOutput extends BaseOutput {}

export class UpdateUserDto {
  nickname?: string;
  verified?: boolean;
  phone?: string;
  code?: string;
}
