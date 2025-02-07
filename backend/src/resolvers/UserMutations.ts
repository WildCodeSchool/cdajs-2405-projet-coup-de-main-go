import * as argon2 from "argon2";
import { validateOrReject } from "class-validator";
import { Resolver, Mutation, Arg } from "type-graphql";
import { In } from "typeorm";

import { dataSource } from "../datasource";
import { Skill } from "../entities/Skill";
import { User } from "../entities/User";
import passwordVerification from "../utils/passwordVerification";
import uploadFile from "../utils/uploadFile";
import { sendEmailWithBrevo } from "../utils/sendEmailWithBrevo";

@Resolver(User)
export class UserMutations {
    @Mutation(() => User)
    async register(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Arg("address") address: string,
        @Arg("zipCode") zipCode: string,
        @Arg("city") city: string,
        @Arg("skillsId", () => [String]) skillsId: string[]
    ): Promise<User> {
        const isEmailUsed: User | null = await dataSource.manager.findOne(
            User,
            {
                where: { email },
            }
        );

        if (isEmailUsed) {
            throw new Error("L'adresse mail est déjà utilisée");
        }

        passwordVerification(password);

        // argon2
        const passwordHashed: string = await argon2.hash(password);

        // Charger les skills en fonction de leur id
        const skills = await dataSource.manager.find(Skill, {
            where: { id: In(skillsId) },
        });

        let user: User;
        try {
            // Créer l'utilisateur
            user = dataSource.manager.create(User, {
                email,
                password: passwordHashed,
                firstName,
                lastName,
                address,
                zipCode,
                city,
                skills,
            });

            // Valider l'entité avant de la sauvegarder
            await validateOrReject(user).catch((errors) => {
                // Si la validation échoue, afficher les erreurs
                console.log("Erreurs de validation:", errors);
                throw new Error("Validation échouée");
            });

            // Sauvegarder l'utilisateur dans la base de données
            await dataSource.manager.save(user);
        } catch (error) {
            console.error(error);
            throw new Error("Erreur lors de l'inscription");
        }

        return user;
    }

    @Mutation(() => Boolean)
    async deleteAccount(@Arg("id") id: string): Promise<Boolean> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { id },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        try {
            await dataSource.manager.delete(User, { id });
        } catch (error: unknown) {
            console.error(error);
            throw new Error("Erreur lors de la suppression de l'utilisateur");
        }

        return true;
    }

    @Mutation(() => Boolean)
    async changePassword(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("passwordConfirmation") passwordConfirmation: string
    ): Promise<Boolean> {
        let user: User | null;
        user = await dataSource.manager.findOne(User, {
            where: { email },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        if (password !== passwordConfirmation) {
            throw new Error("Les mots de passe doivent être identiques");
        }

        passwordVerification(password);

        // argon2
        user.password = await argon2.hash(password);

        try {
            // Valider l'entité avant de la sauvegarder
            await validateOrReject(user).catch((errors) => {
                // Si la validation échoue, afficher les erreurs
                console.log("Erreurs de validation:", errors);
                throw new Error("Validation échouée");
            });

            // Sauvegarder l'utilisateur dans la base de données
            await dataSource.manager.save(user);
        } catch (error: unknown) {
            console.error(error);
            throw new Error("Erreur lors de la suppression de l'utilisateur");
        }

        return true;
    }

    @Mutation(() => User)
    async updateUser(
        @Arg("id") id: string,
        @Arg("email", { nullable: true }) email?: string,
        @Arg("firstName", { nullable: true }) firstName?: string,
        @Arg("lastName", { nullable: true }) lastName?: string,
        @Arg("address", { nullable: true }) address?: string,
        @Arg("zipCode", { nullable: true }) zipCode?: string,
        @Arg("city", { nullable: true }) city?: string,
        @Arg("biography", { nullable: true }) biography?: string,
        @Arg("gender", { nullable: true }) gender?: string,
        @Arg("dateOfBirth", { nullable: true }) dateOfBirth?: Date,
        @Arg("picture", { nullable: true }) picture?: string,
        @Arg("skillsId", () => [String], { nullable: true }) skillsId?: string[]
    ): Promise<User> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { id },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        if (email) {
            const isEmailUsed: User | null = await dataSource.manager.findOne(
                User,
                {
                    where: { email },
                }
            );
            if (isEmailUsed) {
                throw new Error("L'adresse mail est déjà utilisée");
            }
            user.email = email;
        }
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (address) user.address = address;
        if (zipCode) user.zipCode = zipCode;
        if (city) user.city = city;
        if (skillsId && skillsId.length > 0) {
            // Charger les skills en fonction de leur id
            const skills = await dataSource.manager.find(Skill, {
                where: { id: In(skillsId) },
            });
            user.skills = skills;
        }

        if (biography) user.biography = biography;
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;
        if (picture) user.picture = picture;

        try {
            // Valider l'entité avant de la sauvegarder
            await validateOrReject(user).catch((errors) => {
                // Si la validation échoue, afficher les erreurs
                console.log("Erreurs de validation:", errors);
                throw new Error("Validation échouée");
            });

            // Sauvegarder l'utilisateur dans la base de données
            await dataSource.manager.save(user);
        } catch (error: unknown) {
            console.error(error);
            throw new Error(
                "Erreur lors de la mise à jour des données de l'utilisateur"
            );
        }

        return user;
    }

    @Mutation(() => Number)
    async transferMango(
        @Arg("id") id: string,
        @Arg("amount") amount: number
    ): Promise<number> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { id },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        user.mangoBalance += amount;

        try {
            // Valider l'entité avant de la sauvegarder
            await validateOrReject(user).catch((errors) => {
                // Si la validation échoue, afficher les erreurs
                console.log("Erreurs de validation:", errors);
                throw new Error("Validation échouée");
            });

            // Sauvegarder l'utilisateur dans la base de données
            await dataSource.manager.save(user);
        } catch (error: unknown) {
            console.error(error);
            throw new Error("Erreur lors de la suppression de l'utilisateur");
        }

        return user.mangoBalance;
    }

    @Mutation(() => User)
    async updateProfilePicture(
        @Arg("id") id: string,
        @Arg("picture") picture: string
    ): Promise<User> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { id },
        });
        if (!user) {
            throw new Error("User not found");
        }

        if (!picture) {
            throw new Error("No file path provided");
        }

        try {
            const savedFileName = uploadFile({
                base64String: picture,
                targetType: "user",
                id,
                oldFileName: user.picture,
            });

            user.picture = savedFileName;
            await dataSource.manager.save(user);

            return user;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de l'upload : ${error.message}`);
            }
            throw new Error("Une erreur inconnue est survenue.");
        }
    }

    @Mutation(() => String)
    async sendEmailVerification(@Arg("email") email: string): Promise<string> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { email },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        // Générer un OTP à 4 chiffres
        const OTP = Math.floor(Math.random() * 9000 + 1000).toString();

        // argon2
        const hashedOTP: string = await argon2.hash(OTP);

        // Sauvegarder en base
        user.otp = hashedOTP;
        user.otpCreatedAt = new Date();
        // Réinitialiser le compteur d'échecs
        user.otpAttempts = 0;
        await dataSource.manager.save(user);

        // Envoi de l'email
        const params = {
            verificationCode: OTP,
            firstName: user.firstName,
        };
        const templateId = 1;
        sendEmailWithBrevo(user, templateId, params);

        return email;
    }

    @Mutation(() => Boolean)
    async verifyOTP(
        @Arg("email") email: string,
        @Arg("otp") otp: string
    ): Promise<Boolean> {
        const user: User | null = await dataSource.manager.findOne(User, {
            where: { email },
        });

        if (!user) {
            throw new Error("L'utilisateur n'existe pas");
        }

        const OTP_EXPIRATION_MINUTES = 5;
        // Nombre max de tentatives autorisées
        const MAX_ATTEMPTS = 3;
        const now = new Date();

        // Vérifier si le code a expiré
        if (
            !user.otpCreatedAt ||
            (now.getTime() - user.otpCreatedAt.getTime()) / (1000 * 60) >
                OTP_EXPIRATION_MINUTES
        ) {
            throw new Error("Le code de confirmation a expiré");
        }

        // Vérifier le nombre de tentatives
        if (user.otpAttempts >= MAX_ATTEMPTS) {
            throw new Error("Trop de tentatives échouées");
        }

        // argon2
        const isMatch: boolean = await argon2.verify(user.otp || "", otp);

        if (!isMatch) {
            user.otpAttempts += 1;
            await dataSource.manager.save(user);
            throw new Error("Le code de confirmation est incorrect");
        }

        // Code valide : réinitialisation des champs
        user.otp = undefined;
        user.otpCreatedAt = undefined;
        user.otpAttempts = 0;
        await dataSource.manager.save(user);

        return true;
    }
}
