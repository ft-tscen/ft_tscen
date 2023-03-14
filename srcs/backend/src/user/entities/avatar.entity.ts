import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { IsString } from 'class-validator';

@Entity()
class Avatar extends BaseEntity {
  @Column()
  @IsString()
  filename: string;

  @Column({ type: 'bytea' })
  data: Uint8Array;
}

export default Avatar;
