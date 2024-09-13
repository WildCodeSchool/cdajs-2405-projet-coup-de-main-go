import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { IsDate, Length } from "class-validator";
import { Chat } from "./Chat";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @Length(1, 255, {
    message: "Le message doit contenir entre 1 et 255 caractères.",
  })
  @Column({ length: 255 })
  @Field()
  message: string = "";

  @Column()
  @Field()
  isView: boolean = false;

  @IsDate()
  @Column()
  @Field()
  date?: Date;

  @ManyToOne(() => Chat, (chat) => chat.messages, { eager: true })
  @Field(() => Chat)
  chat?: Chat;

  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  @Field(() => User)
  author?: User;

  @BeforeInsert()
  onBeforeInsert() {
    this.date = new Date();
  }
}