import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
class Avatar extends BaseEntity {
  @Column()
  filename: string;

  @Column({ type: 'bytea' })
  data: Uint8Array;
}

export default Avatar;
