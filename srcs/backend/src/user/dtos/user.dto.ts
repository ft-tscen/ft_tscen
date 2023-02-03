import { BaseOutput } from 'src/common/dtos/base.dto';
import { User } from '../entities/user.entity';

export class UserOutput extends BaseOutput {
  user?: User;
}
