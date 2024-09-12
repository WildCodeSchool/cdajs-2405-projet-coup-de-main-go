import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { IsDate, IsEmail, Length } from "class-validator";
import { Chat } from "./Chat";
import { Message } from "./Message";
import { Ad } from "./Ad";
import { Transaction } from "./Transaction";
import { Skill } from "./Skill";
import { Review } from "./Review";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @Length(1, 25, {
    message: "Le prénom doit contenir entre 1 et 25 caractères.",
  })
  @Column({ length: 25 })
  @Field()
  firstName: string = "";

  @Length(1, 25, {
    message: "Le nom doit contenir entre 1 et 25 caractères.",
  })
  @Column({ length: 25 })
  @Field()
  lastName: string = "";

  @Column({ unique: true })
  @Field()
  @IsEmail()
  email: string = "";

  @Length(8, 100, {
    message: "Le mot de passe doit contenir entre 8 et 100 caractères.",
  })
  @Column({ length: 100 })
  @Field()
  password: string = "";

  @Length(1, 255, {
    message: "La biographie doit contenir entre 1 et 255 caractères.",
  })
  @Column({ nullable: true, length: 255 })
  @Field({ nullable: true })
  biography?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  gender?: string;

  @IsDate()
  @Column({ nullable: true })
  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Column()
  @Field()
  picture: string = "";

  @Length(1, 255, {
    message: "L'adresse doit contenir entre 1 et 255 caractères.",
  })
  @Column({ length: 255 })
  @Field()
  address: string = "";

  @Length(5, 5, {
    message: "Le code postal doit contenir 5 caractères.",
  })
  @Column({ length: 5 })
  @Field()
  zipCode: string = "";

  @Length(1, 100, {
    message: "La ville doit contenir entre 1 et 100 caractères.",
  })
  @Column({ length: 100 })
  @Field()
  city: string = "";

  @Column()
  @Field()
  mangoBalance: number = 6;

  @IsDate()
  @Column()
  @Field()
  createdAt?: Date;

  @OneToMany(() => Chat, (chat) => chat.userHelper)
  @Field((type) => [Chat])
  chatsAsHelper?: Promise<Chat[]>;

  @OneToMany(() => Chat, (chat) => chat.userRequester)
  @Field((type) => [Chat])
  chatsAsRequester?: Promise<Chat[]>;

  @OneToMany(() => Transaction, (transaction) => transaction.userHelper)
  @Field((type) => [Transaction])
  transactionsAsHelper?: Promise<Transaction[]>;

  @OneToMany(() => Transaction, (transaction) => transaction.userRequester)
  @Field((type) => [Transaction])
  transactionsAsRequester?: Promise<Transaction[]>;

  @OneToMany(() => Review, (review) => review.userRequester)
  @Field((type) => [Review])
  reviewsAsRequester?: Promise<Review[]>;

  @OneToMany(() => Review, (review) => review.userHelper)
  @Field((type) => [Review])
  reviewsAsHelper?: Promise<Review[]>;

  @OneToMany(() => Message, (message) => message.author)
  @Field((type) => [Message])
  messages?: Promise<Message[]>;

  @OneToMany(() => Ad, (ad) => ad.userRequester)
  @Field((type) => [Ad])
  ads?: Promise<Ad[]>;

  @ManyToMany(() => Skill)
  @JoinTable()
  @Field(() => Skill)
  skills?: Promise<Skill[]>;

  @BeforeInsert()
  onBeforeInsert() {
    this.createdAt = new Date();
  }
}
