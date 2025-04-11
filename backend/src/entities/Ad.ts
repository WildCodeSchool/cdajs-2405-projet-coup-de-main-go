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
import { S } from "@faker-js/faker/dist/airline-D6ksJFwG";

export enum Status {
  POSTED = "posted",
  BOOKED = "booked",
  FINALISED = "finalised",
  ISREVIEWED = "isreviewed",
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

  @Column({ type: "double precision", nullable: true })
  @Field({ nullable: true })
  latitude?: number;

  @Column({ type: "double precision", nullable: true })
  @Field({ nullable: true })
  longitude?: number;

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

  @Column({ nullable: true })
  private skillId?: string;

  private static skillsById: { [skillId: string]: Skill } = {};

  async getSkill(): Promise<Skill | undefined> {
    if (this.skillId == undefined) {
      return undefined;
    }

    if (!Ad.skillsById[this.skillId]) {
      // cannot find flyweight shared object instance -> reload cache

      const skills: Skill[] = await Skill.find({
        where: {}
      });

      for (const skill of skills) {
        Ad.skillsById[skill.id!] = skill;
      }
    }

    return Ad.skillsById[this.skillId];
  }

  setSkill(skill: Skill | undefined) {
    this.skillId = skill ? skill.id : undefined;
  }

  @ManyToOne(() => Skill, (skill) => skill.ads, { eager: false })
  @Field(() => Skill)
  skill__?: Skill;

  @OneToOne(() => Transaction, (transaction) => transaction.ad)
  @Field(() => Transaction)
  transaction?: Transaction;

  constructor(
    title: string,
    description: string,
    address: string,
    zipCode: string,
    city: string,
    duration: number,
    mangoAmount: number,
    userRequester: User,
    skill: Skill,
    picture1?: string,
    picture2?: string,
    picture3?: string
  ) {
    super();
    this.title = title;
    this.description = description;
    this.address = address;
    this.zipCode = zipCode;
    this.city = city;
    this.duration = duration;
    this.mangoAmount = mangoAmount;
    this.userRequester = userRequester;
    this.skill__ = skill;
    this.picture1 = picture1 || "";
    this.picture2 = picture2 || "";
    this.picture3 = picture3 || "";
  }

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
