import { BaseEntity } from "src/shared/classes";
import { Column, Entity, Index, OneToMany } from "typeorm";
import { Session } from ".";
@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({ name: "full_name" })
  fullName: string;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'google_id', nullable: true, unique: true })
  @Index()
  googleId?: string;

  @Column({ name: 'is_email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ select: false, nullable: true })
  password: string;

  @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
    eager: false,
  })
  sessions: Session[];

}
