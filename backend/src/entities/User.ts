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
import { IsEmail, Length, Matches } from "class-validator";
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

    @Column({ length: 100 })
    @Field()
    password: string = "";

    @Column({ nullable: true, length: 255 })
    @Field({ nullable: true })
    biography?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    gender?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    dateOfBirth?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    picture?: string;

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
    @Field(() => [Skill])
    skills?: Skill[];

    @Column({ nullable: true })
    @Field({ nullable: true })
    otp?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    otpCreatedAt?: Date;

    @Column()
    @Field()
    otpAttempts: number = 0;

    constructor(
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        picture: string,
        address: string,
        zipCode: string,
        city: string
    ) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.picture = picture;
        this.address = address;
        this.zipCode = zipCode;
        this.city = city;
    }

    @BeforeInsert()
    onBeforeInsert() {
        this.createdAt = new Date();
    }
}
