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
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$jxsp+6AIQzVVLJKlcw/R7g$g77fYM/y/ItztTbPrwPQen5Y5ko1b7D5Si+H+htxF2U",
      biography: "Passionné par l'entraide et les travaux manuels.",
      gender: "Homme",
      dateOfBirth: new Date("1980-05-20"),
      picture: "jean.jpg",
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
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$jxsp+6AIQzVVLJKlcw/R7g$g77fYM/y/ItztTbPrwPQen5Y5ko1b7D5Si+H+htxF2U",
      biography: "Aime cuisiner et partager ses recettes.",
      gender: "Femme",
      dateOfBirth: new Date("1990-08-15"),
      picture: "marie.jpg",
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
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$jxsp+6AIQzVVLJKlcw/R7g$g77fYM/y/ItztTbPrwPQen5Y5ko1b7D5Si+H+htxF2U",
      biography: "Expert en bricolage et jardinage.",
      gender: "Homme",
      dateOfBirth: new Date("1985-10-10"),
      address: "789 boulevard Saint-Germain",
      zipCode: "75006",
      city: "Paris",
      mangoBalance: 40,
      skills: [skill1],
    });

    // create user test
    const user4 = dataSource.manager.create(User, {
      firstName: "User",
      lastName: "Test",
      email: "user.test@yopmail.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$jxsp+6AIQzVVLJKlcw/R7g$g77fYM/y/ItztTbPrwPQen5Y5ko1b7D5Si+H+htxF2U",
      biography: "User test.",
      gender: "Homme",
      dateOfBirth: new Date("1900-01-01"),
      address: "1 rue de la République",
      zipCode: "75000",
      city: "Paris",
      mangoBalance: 1000,
      skills: [skill1],
    });

    await user1.save();
    await user2.save();
    await user3.save();
    await user4.save();
    console.log("Utilisateurs créés avec succès.");

    console.log("Création des annonces...");
    const ad1 = dataSource.manager.create(Ad, {
      title: "Besoin d'aide pour un jardinage",
      description: "Je cherche quelqu'un pour m'aider à entretenir mon jardin.",
      address: "12 Place Ambroise Courtois",
      zipCode: "69008",
      city: "Lyon",
      latitude: 45.744393,
      longitude: 4.870536,
      duration: 90,
      mangoAmount: 3,
      status: Status.POSTED,
      picture1: "garden1.jpg",
      picture2: "garden2.jpg",
      picture3: "garden3.jpg",
      userRequester: user1,
      skill: skill2,
    });

    const ad2 = dataSource.manager.create(Ad, {
      title: "Montage de meubles",
      description: "J'ai besoin de monter des meubles IKEA.",
      address: "2 Rue Nationale",
      zipCode: "59800",
      city: "Lille",
      latitude: 50.637189,
      longitude: 3.062636,
      duration: 60,
      mangoAmount: 2,
      status: Status.POSTED,
      picture1: "furniture.jpg",
      userRequester: user2,
      skill: skill1,
    });

    const ad3 = dataSource.manager.create(Ad, {
      title: "Cours de cuisine",
      description: "J'aimerais apprendre à cuisiner.",
      address: "5 Rue de la Paix",
      zipCode: "33000",
      city: "Bordeaux",
      latitude: 44.84229,
      longitude: -0.612387,
      duration: 120,
      mangoAmount: 4,
      status: Status.BOOKED,
      userRequester: user3,
      skill: skill3,
    });

    const ad4 = dataSource.manager.create(Ad, {
      title: "50 caractères - Lorem ipsum dolor sit amet, consec",
      description:
        "255 caractères - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duisum",
      address: "2 Place le Plaçat",
      zipCode: "31700",
      city: "Daux",
      latitude: 43.694962,
      longitude: 1.267937,
      duration: 1,
      mangoAmount: 120,
      status: Status.BOOKED,
      userRequester: user3,
      skill: skill3,
    });

    await ad1.save();
    await ad2.save();
    await ad3.save();
    await ad4.save();
    console.log("Annonces créées avec succès.");

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
