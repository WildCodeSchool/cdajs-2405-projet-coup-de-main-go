import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { IsDate } from "class-validator";
import { User } from "./User";
import { Ad } from "./Ad";
import { Message } from "./Message";

@ObjectType()
@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @IsDate()
  @Column()
  @Field()
  date?: Date;

  @ManyToOne(() => User, (user) => user.chatsAsHelper, { eager: true })
  @Field(() => User)
  userHelper?: User;

  @ManyToOne(() => User, (user) => user.chatsAsRequester, { eager: true })
  @Field(() => User)
  userRequester?: User;

  @ManyToOne(() => Ad, (ad) => ad.chats, { eager: true, nullable: true })
  @Field(() => Ad, { nullable: true })
  ad?: Ad;

  @OneToMany(() => Message, (message) => message.chat)
  @Field(() => [Message])
  messages?: Promise<Message[]>;

  @BeforeInsert()
  onBeforeInsert() {
    this.date = new Date();
  }
}
