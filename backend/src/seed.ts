import "reflect-metadata";
import { dataSource } from "./datasource/index";
import { Ad } from "./entities/Ad";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { Review } from "./entities/Review";
import { Skill } from "./entities/Skill";
import { Transaction } from "./entities/Transaction";
import { User } from "./entities/User";
import { Status } from "./entities/Ad";

async function seed() {
    try {
        console.log("Initialisation de la base de données...");
        await dataSource.initialize();
        console.log("Base de données PostgreSQL initialisée avec succès.");

        console.log("Création des compétences...");
        const skill1 = dataSource.manager.create(Skill, {
            name: "Bricolage",
            picture: "diy.png",
        });
        const skill2 = dataSource.manager.create(Skill, {
            name: "Jardinage",
            picture: "garden.png",
        });
        const skill3 = dataSource.manager.create(Skill, {
            name: "Apprentissage",
            picture: "learning.png",
        });
        const skill4 = dataSource.manager.create(Skill, {
            name: "Déplacements",
            picture: "shift.png",
        });
        const skill5 = dataSource.manager.create(Skill, {
            name: "Informatique",
            picture: "computer.png",
        });
        const skill6 = dataSource.manager.create(Skill, {
            name: "Animaux",
            picture: "animals.png",
        });
        const skill7 = dataSource.manager.create(Skill, {
            name: "Sport",
            picture: "sport.png",
        });

        await skill1.save();
        await skill2.save();
        await skill3.save();
        await skill4.save();
        await skill5.save();
        await skill6.save();
        await skill7.save();
        console.log("Compétences créées avec succès.");

        console.log("Création des utilisateurs...");
        const user1 = dataSource.manager.create(User, {
            firstName: "Jean",
            lastName: "Dupont",
            email: "jean.dupont@example.com",
            password: "P@assword123",
            biography: "Passionné par l'entraide et les travaux manuels.",
            gender: "Homme",
            dateOfBirth: new Date("1980-05-20"),
            picture: "jean.png",
            address: "123 rue de Paris",
            zipCode: "75001",
            city: "Paris",
            mangoBalance: 50,
            skills: [skill1, skill2],
        });

        const user2 = dataSource.manager.create(User, {
            firstName: "Marie",
            lastName: "Dubois",
            email: "marie.dubois@example.com",
            password: "P@assword123",
            biography: "Aime cuisiner et partager ses recettes.",
            gender: "Femme",
            dateOfBirth: new Date("1990-08-15"),
            picture: "marie.png",
            address: "456 avenue des Champs",
            zipCode: "75008",
            city: "Paris",
            mangoBalance: 30,
            skills: [skill2, skill3],
        });

        const user3 = dataSource.manager.create(User, {
            firstName: "Paul",
            lastName: "Martin",
            email: "paul.martin@example.com",
            password: "P@assword123",
            biography: "Expert en bricolage et jardinage.",
            gender: "Homme",
            dateOfBirth: new Date("1985-10-10"),
            picture: "paul.png",
            address: "789 boulevard Saint-Germain",
            zipCode: "75006",
            city: "Paris",
            mangoBalance: 40,
            skills: [skill1],
        });

        await user1.save();
        await user2.save();
        await user3.save();
        console.log("Utilisateurs créés avec succès.");

        console.log("Création des annonces...");
        const ad1 = dataSource.manager.create(Ad, {
            title: "Besoin d'aide pour un jardinage",
            description:
                "Je cherche quelqu'un pour m'aider à entretenir mon jardin.",
            address: "123 rue de Paris",
            zipCode: "75001",
            city: "Paris",
            duration: 30,
            mangoAmount: 100,
            status: Status.POSTED,
            picture1: "garden.jpg",
            userRequester: user1,
            skill: skill1,
        });

        const ad2 = dataSource.manager.create(Ad, {
            title: "Montage de meubles",
            description: "J'ai besoin de monter des meubles IKEA.",
            address: "456 avenue des Champs",
            zipCode: "75008",
            city: "Paris",
            duration: 60,
            mangoAmount: 80,
            status: Status.BOOKED,
            picture1: "furniture.jpg",
            userRequester: user2,
        });

        const ad3 = dataSource.manager.create(Ad, {
            title: "Cours de cuisine",
            description: "Je propose un cours de cuisine chez moi.",
            address: "789 boulevard Saint-Germain",
            zipCode: "75006",
            city: "Paris",
            duration: 90,
            mangoAmount: 120,
            status: Status.FINALISED,
            picture1: "cooking.jpg",
            userRequester: user3,
            skill: skill3,
        });

        await ad1.save();
        await ad2.save();
        await ad3.save();
        console.log("Annonces créées avec succès.");

        console.log("Création des transactions...");
        const transaction1 = dataSource.manager.create(Transaction, {
            ad: ad1,
            userHelper: user3,
            userRequester: user1,
        });

        const transaction2 = dataSource.manager.create(Transaction, {
            ad: ad2,
            userHelper: user2,
            userRequester: user1,
        });

        const transaction3 = dataSource.manager.create(Transaction, {
            ad: ad3,
            userHelper: user1,
            userRequester: user2,
        });

        await transaction1.save();
        await transaction2.save();
        await transaction3.save();
        console.log("Transactions créées avec succès.");

        console.log("Création des reviews...");
        const review1 = dataSource.manager.create(Review, {
            title: "Excellent travail",
            rating: 4,
            comment: "Très bon travail, merci beaucoup !",
            userHelper: user1,
            userRequester: user3,
        });

        const review2 = dataSource.manager.create(Review, {
            title: "Service rapide",
            rating: 5,
            comment: "Service excellent et rapide.",
            userHelper: user2,
            userRequester: user1,
        });

        const review3 = dataSource.manager.create(Review, {
            title: "Cours de cuisine",
            rating: 3,
            userHelper: user3,
            userRequester: user2,
        });

        await review1.save();
        await review2.save();
        await review3.save();
        console.log("Reviews créées avec succès.");

        console.log("Création des chats...");
        const chat1 = dataSource.manager.create(Chat, {
            isHelpProposed: false,
            userHelper: user2,
            userRequester: user1,
            ad: ad1,
        });

        const chat2 = dataSource.manager.create(Chat, {
            isHelpProposed: false,
            userHelper: user1,
            userRequester: user2,
            ad: ad2,
        });

        const chat3 = dataSource.manager.create(Chat, {
            isHelpProposed: false,
            userHelper: user1,
            userRequester: user3,
            ad: ad3,
        });

        await chat1.save();
        await chat2.save();
        await chat3.save();
        console.log("Chats créés avec succès.");

        console.log("Création des messages...");
        const message1 = dataSource.manager.create(Message, {
            message: "Bonjour, je suis disponible pour vous aider.",
            isViewedByRequester: true,
            isViewedByHelper: true,
            chat: chat1,
            author: user2,
            date: new Date("2024-10-01T10:00:00"),
        });

        const message2 = dataSource.manager.create(Message, {
            message: "Merci, ça serait super!",
            isViewedByRequester: true,
            isViewedByHelper: true,
            chat: chat1,
            author: user1,
            date: new Date("2024-10-02T10:00:00"),
        });

        const message3 = dataSource.manager.create(Message, {
            message: "Je suis intéressé par votre cours.",
            isViewedByRequester: true,
            isViewedByHelper: true,
            chat: chat3,
            author: user1,
            date: new Date("2024-11-25T10:00:00"),
        });

        const message4 = dataSource.manager.create(Message, {
            message: "Je suis disponible demain.",
            isViewedByRequester: true,
            isViewedByHelper: true,
            chat: chat2,
            author: user1,
            date: new Date("2024-11-23T10:00:00"),
        });

        await message1.save();
        await message2.save();
        await message3.save();
        await message4.save();
        console.log("Messages créés avec succès.");

        console.log("Données fictives insérées avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'insertion des données : ", error);
    } finally {
        await dataSource.destroy();
        console.log("Source de données détruite.");
    }
}

seed();
