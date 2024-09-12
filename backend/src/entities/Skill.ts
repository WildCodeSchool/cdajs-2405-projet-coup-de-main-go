import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
} from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";
import { Length } from "class-validator";
import { Ad } from "./Ad";

@ObjectType()
@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id?: string;

  @Length(1, 25, {
    message: "Le nom doit contenir entre 1 et 25 caractères.",
  })
  @Column({ length: 25 })
  @Field()
  name: string = "";

  @ManyToMany(() => Ad, (ad) => ad.skills)
  @Field(() => Ad)
  ads?: Promise<Ad[]>;
}
