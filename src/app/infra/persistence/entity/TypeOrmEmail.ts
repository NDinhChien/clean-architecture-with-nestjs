import { Nullable } from '@core/common/CommonTypes';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('emails')
export class TypeOrmEmail {
  @PrimaryColumn({ unique: true })
  public email: string;

  @Column()
  public code: string;

  @Column()
  public issuedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  public lastTryAt: Nullable<Date>;

  @Column({ default: false })
  public verified: boolean;

  @Column({ default: 0 })
  public triedTimes: number;

  @Column({ default: 0 })
  public refreshedTimes: number;
}
