import { UserRole } from '@core/enums/UserEnums';
import { Nullable } from '@core/common/CommonTypes';
import { Column, Entity, PrimaryColumn, PrimaryColumnOptions } from 'typeorm';

@Entity('users')
export class TypeOrmUser {
  @PrimaryColumn()
  public id: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  public role: UserRole;

  @Column({ type: 'datetime', nullable: true })
  public birthday: Nullable<Date>;

  @Column({ type: 'nvarchar', nullable: true })
  public firstName: Nullable<string>;

  @Column({ type: 'nvarchar', nullable: true })
  public lastName: Nullable<string>;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  public intro: Nullable<string>;

  @Column()
  public createdAt: Date;

  @Column()
  public editedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  public removedAt: Nullable<Date>;
}
