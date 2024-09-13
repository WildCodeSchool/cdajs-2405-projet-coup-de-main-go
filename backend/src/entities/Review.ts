import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  BeforeInsert,
  ManyToOne,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { IsDate, Length, Max, Min } from "class-validator";
import { User } from "./User";

@ObjectType()
@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @Length(1, 100, {
    message: "Le titre doit contenir entre 1 et 100 caractères.",
  })
  @Column({ length: 100 })
  @Field()
  title: string = "";

  @Length(1, 255, {
    message: "Le commentaire doit contenir entre 1 et 255 caractères.",
  })
  @Column({ nullable: true, length: 255 })
  @Field({ nullable: true })
  comment?: string;

  @Min(0)
  @Max(5)
  @Column("float")
  @Field()
  rating: number = 0;

  @IsDate()
  @Column()
  @Field()
  date?: Date;

  @ManyToOne(() => User, (user) => user.reviewsAsHelper, { eager: true })
  @Field(() => User)
  userHelper?: User;

  @ManyToOne(() => User, (user) => user.reviewsAsRequester, {
    eager: true,
  })
  @Field(() => User)
  userRequester?: User;

  @BeforeInsert()
  onBeforeInsert() {
    this.date = new Date();
  }
}
