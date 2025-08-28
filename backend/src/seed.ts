import "reflect-metadata";
import { dataSource } from "./datasource/index";
import { Ad } from "./entities/Ad";
import { Chat } from "./entities/Chat";
import { Message } from "./entities/Message";
import { Review } from "./entities/Review";
import { Skill } from "./entities/Skill";
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
      address: "8 Rue des Célestes",
      zipCode: "38200 ",
      city: "Vienne",
      latitude: 45.524891,
      longitude: 4.877942,
      mangoBalance: 50,
      skills: [skill1, skill2],
      otpAttempts: 0,
    });

    const user2 = dataSource.manager.create(User, {
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@example.com",
      password:
        "$argon2id$v=19$m=65536,t=3,p=4$jxsp+6AIQzVVLJKlcw/R7g$g77fYM/y/ItztTbPrwPQen5Y5ko1b7D5Si+H+htxF2U",
      biography:
        "Passionnée de jardinage et aimant les animaux, je suis toujours partante pour donner un coup de main.",
      gender: "Femme",
      dateOfBirth: new Date("1990-08-15"),
      picture: "marie.jpg",
      address: "5 rue du Dauphiné",
      zipCode: "69003",
      city: "Lyon",
      latitude: 45.752579,
      longitude: 4.868088,
      mangoBalance: 20,
      skills: [skill2, skill6],
      otpAttempts: 0,
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
      picture: "paul.jpg",
      address: "10 Rue Louis Pasteur",
      zipCode: "69600",
      city: "Oullins",
      latitude: 45.717476,
      longitude: 4.804119,
      mangoBalance: 40,
      skills: [skill1],
      otpAttempts: 0,
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
      description:
        "Je cherche quelqu'un pour m'aider à entretenir mon jardin, en particulier pour désherber et faire de nouvelles plantations.",
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
      title: "Montage d'étagères IKEA",
      description:
        "J'ai besoin de monter des meubles IKEA. J'ai tout le matériel nécessaire.",
      address: "10 Cours Gambetta",
      zipCode: "69007",
      city: "Lyon",
      latitude: 45.753204,
      longitude: 4.849035,
      duration: 60,
      mangoAmount: 2,
      status: Status.POSTED,
      picture1: "furniture.jpg",
      userRequester: user2,
      skill: skill1,
    });

    const ad3 = dataSource.manager.create(Ad, {
      title: "Cours de cuisine",
      description:
        "J'aimerais apprendre à cuisiner. Est-ce qu'un bon cuisinier aurait un peu de temps à m'accorder pour m'apprendre les basiques ?",
      address: "5 Rue de la Paix",
      zipCode: "33000",
      city: "Bordeaux",
      latitude: 44.84229,
      longitude: -0.612387,
      duration: 120,
      mangoAmount: 4,
      status: Status.POSTED,
      picture1: "cuisine1.jpg",
      picture2: "cuisine2.jpg",
      userRequester: user3,
      skill: skill3,
    });

    const ad4 = dataSource.manager.create(Ad, {
      title: "Besoin d'aide pour monter une armoire ",
      description:
        "J’ai une grande armoire à portes coulissantes à monter et je me sens un peu dépassé(e) par les étapes. Je peux donner un coup de main aussi, mais j’aurais besoin d’être guidé(e). Merci d’avance !",
      address: "5 Rue Maréchal Leclerc",
      zipCode: "69500",
      city: "Bron",
      latitude: 45.737770080566406,
      longitude: 4.912293434143066,
      duration: 120,
      mangoAmount: 4,
      status: Status.POSTED,
      picture1: "armoire.png",
      userRequester: user3,
      skill: skill1,
    });

    const ad5 = dataSource.manager.create(Ad, {
      title: "Besoin d’aide pour mon jardin",
      description:
        "Mon jardin est un peu à l’abandon : herbes hautes, massifs envahis, haies non taillées… J’aurais besoin d’un·e main verte pour m’aider à le remettre en état. ",
      address: "1 Rue de la Republique",
      zipCode: "95100",
      city: "Argenteuil",
      latitude: 48.949954,
      longitude: 2.258203,
      duration: 240,
      mangoAmount: 8,
      status: Status.POSTED,
      picture1: "ad5.jpg",
      userRequester: user1,
      skill: skill2,
    });

    const ad6 = dataSource.manager.create(Ad, {
      title: "Nourrir mes chats",
      description:
        "Je m’absente 4 jours et j’ai besoin de quelqu’un pour passer nourrir mes deux chats, changer leur litière et leur tenir un peu compagnie.",
      address: "1 Rue de la Republique",
      zipCode: "95100",
      city: "Argenteuil",
      latitude: 48.949954,
      longitude: 2.258203,
      duration: 120,
      mangoAmount: 4,
      status: Status.POSTED,
      picture1: "ad6.jpg",
      userRequester: user1,
      skill: skill6,
    });

    const ad7 = dataSource.manager.create(Ad, {
      title: "Démonter un vieux meuble lourd",
      description:
        "J’ai une vieille armoire à démonter pour la sortir de la pièce, mais elle est lourde, en bois massif, et je ne peux pas le faire seul·e. Je cherche une personne costaud(e) et habile pour m’aider à démonter proprement et sans tout casser.",
      address: "1 Rue Villon",
      zipCode: "69003",
      city: "Lyon",
      latitude: 45.748477,
      longitude: 4.867974,
      duration: 180,
      mangoAmount: 6,
      status: Status.POSTED,
      picture1: "meuble.jpg",
      userRequester: user2,
      skill: skill1,
    });

    const ad8 = dataSource.manager.create(Ad, {
      title: "Installer une imprimante Wi-Fi ",
      description:
        "J’ai acheté une nouvelle imprimante multifonctions, mais je n’arrive pas à la connecter correctement à mon ordinateur et à mon réseau Wi-Fi. Si quelqu’un s’y connaît un peu et peut passer m’aider à la configurer, ce serait top ! ",
      address: "1 Rue de la Republique",
      zipCode: "95100",
      city: "Argenteuil",
      latitude: 48.949954,
      longitude: 2.258203,
      duration: 240,
      mangoAmount: 8,
      status: Status.POSTED,
      picture1: "ad8.jpg",
      userRequester: user1,
      skill: skill5,
    });

    const ad9 = dataSource.manager.create(Ad, {
      title: "Fixer des étagères au mur",
      description:
        "Je viens d’emménager et je souhaite fixer plusieurs étagères et cadres. Malheureusement, je ne suis pas équipé(e) (ni très bricoleur·se !). Bienvenu à vous !",
      address: "5 Rue Maréchal Leclerc",
      zipCode: "69500",
      city: "Bron",
      latitude: 45.737770080566406,
      longitude: 4.912293434143066,
      duration: 60,
      mangoAmount: 2,
      status: Status.POSTED,
      picture1: "frame.jpg",
      userRequester: user3,
      skill: skill1,
    });

    const ad10 = dataSource.manager.create(Ad, {
      title: "Potager de balcon",
      description:
        "J’aimerais installer un petit potager sur mon balcon, mais je ne sais pas quelles plantes choisir ni comment bien les disposer. J’aimerais apprendre en le faisant ensemble !",
      address: "5 Rue Maréchal Leclerc",
      zipCode: "69500",
      city: "Bron",
      latitude: 45.737770080566406,
      longitude: 4.912293434143066,
      duration: 120,
      mangoAmount: 3,
      status: Status.POSTED,
      picture1: "potager.png",
      picture2: "tomatoes.jpg",
      picture3: "potager3.jpg",
      userRequester: user1,
      skill: skill2,
    });

    const ad11 = dataSource.manager.create(Ad, {
      title: "Promener mon chien ",
      description:
        "Je suis immobilisée après une entorse et je ne peux pas sortir mon chien comme d’habitude. Il a besoin de 2 promenades par jour.",
      address: "1 Rue de la Republique",
      zipCode: "95100",
      city: "Argenteuil",
      latitude: 48.949954,
      longitude: 2.258203,
      duration: 180,
      mangoAmount: 6,
      status: Status.POSTED,
      picture1: "dog.jpg",
      userRequester: user4,
      skill: skill6,
    });

    const ad12 = dataSource.manager.create(Ad, {
      title: "Arroser mes plantes en mon absence",
      description:
        "Je pars une semaine et je cherche une personne de confiance pour arroser mes plantes vertes et mon mini potager. Environ 20 minutes tous les deux jours suffisent.",
      address: "10 Cours Gambetta",
      zipCode: "69007",
      city: "Lyon",
      latitude: 45.753204,
      longitude: 4.849035,
      duration: 120,
      mangoAmount: 4,
      status: Status.POSTED,
      picture1: "houseplant.jpg",
      userRequester: user3,
      skill: skill2,
    });

    await ad1.save();
    await ad2.save();
    await ad3.save();
    await ad4.save();
    await ad5.save();
    await ad6.save();
    await ad7.save();
    await ad8.save();
    await ad9.save();
    await ad10.save();
    await ad11.save();
    await ad12.save();
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
      isHelpProposed: true,
      userHelper: user2,
      userRequester: user1,
      ad: ad1,
    });

    const chat2 = dataSource.manager.create(Chat, {
      isHelpProposed: true,
      userHelper: user3,
      userRequester: user2,
      ad: ad2,
    });

    const chat3 = dataSource.manager.create(Chat, {
      isHelpProposed: true,
      userHelper: user1,
      userRequester: user3,
      ad: ad3,
    });

    const chat4 = dataSource.manager.create(Chat, {
      isHelpProposed: true,
      userHelper: user1,
      userRequester: user4,
      ad: ad5,
    });

    // await chat1.save();
    // await chat2.save();
    await chat3.save();
    await chat4.save();
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

    const message5 = dataSource.manager.create(Message, {
      message: "Bonjour ! Je serais ravi(e) de vous aider 😊",
      isViewedByRequester: true,
      isViewedByHelper: true,
      chat: chat2,
      author: user3,
      date: new Date("2025-04-02T10:00:00"),
    });

    // await message1.save();
    // await message2.save();
    await message3.save();
    // await message4.save();
    // await message5.save();
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
