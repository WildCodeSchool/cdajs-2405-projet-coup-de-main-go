import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { IsDate } from "class-validator";
import { Ad } from "./Ad";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @IsDate()
  @Column()
  @Field()
  date?: Date;

  @OneToOne(() => Ad, (ad) => ad.transaction)
  @JoinColumn()
  ad?: Ad;

  @ManyToOne(() => User, (user) => user.transactionsAsHelper, { eager: true })
  @Field(() => User)
  userHelper?: User;

  @ManyToOne(() => User, (user) => user.transactionsAsRequester, {
    eager: true,
  })
  @Field(() => User)
  userRequester?: User;

  @BeforeInsert()
  onBeforeInsert() {
    this.date = new Date();
  }
}
