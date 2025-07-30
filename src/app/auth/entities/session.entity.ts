import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { BaseEntity } from "src/shared/classes";
import { User } from "src/app/auth/entities/user.entity";

@Entity({ name: "sessions" })
export class Session extends BaseEntity {
  @Column({ name: "is_authenticated" })
  isAuthenticated: boolean;

  @ManyToOne(() => User, (user) => user.sessions, {
    onDelete: 'CASCADE',
    nullable: false
  })
  @Index()
  @JoinColumn({ name: "user_id" })
  user: User;
}
