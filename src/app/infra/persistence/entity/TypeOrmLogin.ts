import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('logins')
export class TypeOrmLogin {
  @PrimaryColumn()
  public email: string;

  @Column()
  public triedTimes: number;

  @Column()
  public lastTryAt: Date;
}
