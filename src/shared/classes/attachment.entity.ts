import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export abstract class Attachment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  url: string;

  @Column({ select: false })
  key: string;
}
