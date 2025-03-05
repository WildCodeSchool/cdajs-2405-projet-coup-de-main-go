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

    @Column({ default: false })
    @Field()
    isHelpProposed!: boolean;

    @IsDate()
    @Column()
    @Field()
    date?: Date;

    @ManyToOne(() => User, (user) => user.chatsAsHelper, { eager: true })
    @Field(() => User)
    userHelper: User;

    @ManyToOne(() => User, (user) => user.chatsAsRequester, { eager: true })
    @Field(() => User)
    userRequester: User;

    @ManyToOne(() => Ad, (ad) => ad.chats, { eager: true })
    @Field(() => Ad)
    ad: Ad;

    @OneToMany(() => Message, (message) => message.chat)
    @Field(() => [Message])
    messages?: Promise<Message[]>;

    constructor(
        isHelpProposed: boolean,
        userHelper: User,
        userRequester: User,
        ad: Ad,
        messages?: Promise<Message[]>
    ) {
        super();
        this.isHelpProposed = isHelpProposed;
        this.userHelper = userHelper;
        this.userRequester = userRequester;
        this.ad = ad;
        this.messages = messages;
    }

    @BeforeInsert()
    onBeforeInsert() {
        this.date = new Date();
    }
}
