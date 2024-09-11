import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    @Field((type) => ID)
    id?: string;

    @Column()
    @Field()
    name: string = "";

    @Column()
    @Field()
    email: string = "";

    @Column()
    @Field()
    password: string = "";
}
