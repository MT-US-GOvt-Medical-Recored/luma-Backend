import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export class BaseEntity {
  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamptz", select: false, name: "deleted_at" })
  deletedAt: Date;

  @Column({ nullable: true, select: false, name: "created_by" })
  createdBy: string;

  @Column({ nullable: true, select: false, name: "updated_by" })
  updatedBy: string;

  @Column({ nullable: true, select: false, name: "deleted_by" })
  deletedBy: string;
}
