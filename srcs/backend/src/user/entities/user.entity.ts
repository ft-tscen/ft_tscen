import { InternalServerErrorException } from '@nestjs/common';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User extends BaseEntity{
	@Column()
	intra_id: string;

	@Column()
	nickname: string;

	@Column()
	email: string;

	@Column()
	password: string;

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword(): Promise<void> {
	try {
		this.password = await bcrypt.hash(this.password, 10);
	} catch (e) {
		throw new InternalServerErrorException();
	}
	}

	async checkPassword(aPassword: string): Promise<boolean> {
	try {
		const ok = await bcrypt.compare(aPassword, this.password);
		return ok;
	} catch (e) {
	}
	}
}
