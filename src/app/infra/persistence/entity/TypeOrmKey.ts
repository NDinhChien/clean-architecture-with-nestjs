import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('keys')
export class TypeOrmKey {
  @PrimaryColumn()
  public user_id: string;

  @Column()
  public email: string;

  @Column()
  public accessKey: string;

  @Column()
  public refreshKey: string;
}
