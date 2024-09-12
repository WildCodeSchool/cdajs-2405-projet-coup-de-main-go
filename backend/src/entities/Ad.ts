import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToOne,
} from "typeorm";
import { Field, ObjectType, ID, registerEnumType } from "type-graphql";
import { IsDate, IsEnum, Length } from "class-validator";
import { Chat } from "./Chat";
import { User } from "./User";
import { Skill } from "./Skill";
import { Transaction } from "./Transaction";

export enum Status {
  POSTED = "posted",
  BOOKED = "booked",
  FINALISED = "finalised",
}

registerEnumType(Status, {
  name: "Status",
  description: "Statut de l'annonce",
});

@ObjectType()
@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @Length(1, 50, {
    message: "Le titre doit contenir entre 1 et 50 caractères.",
  })
  @Column({ length: 50 })
  @Field()
  title: string = "";

  @Length(1, 255, {
    message: "La description doit contenir entre 1 et 255 caractères.",
  })
  @Column({ length: 255 })
  @Field()
  description: string = "";

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
  duration: number = 0;

  @Column()
  @Field()
  mangoAmount: number = 0;

  @IsEnum(Status)
  @Column({ type: "enum", enum: Status, default: Status.POSTED })
  @Field(() => Status)
  status: Status = Status.POSTED;

  @IsDate()
  @Column()
  @Field()
  createdAt?: Date;

  @IsDate()
  @Column()
  @Field()
  updatedAt?: Date;

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture1: string = "";

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture2: string = "";

  @Column({ nullable: true })
  @Field({ nullable: true })
  picture3: string = "";

  @OneToMany(() => Chat, (chat) => chat.ad)
  @Field((type) => [Chat])
  chats?: Promise<Chat[]>;

  @ManyToOne(() => User, (user) => user.ads, { eager: true })
  @Field(() => User)
  userRequester?: User;

  @ManyToOne(() => Skill, (skill) => skill.ads, { eager: true })
  @Field(() => Skill)
  skill?: Skill;

  @OneToOne(() => Transaction, (transaction) => transaction.ad)
  transaction?: Transaction;

  @BeforeInsert()
  onBeforeInsert() {
    const date = new Date();
    this.createdAt = date;
    this.updatedAt = date;
  }

  @BeforeUpdate()
  onBeforeUpdate() {
    this.updatedAt = new Date();
  }
}
