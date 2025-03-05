import { User } from "../entities/User";

export async function sendEmailWithBrevo(
    user: User,
    templateId: number,
    params: object
) {
    const brevo = require("@getbrevo/brevo");
    let defaultClient = brevo.ApiClient.instance;

    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    let apiInstance = new brevo.TransactionalEmailsApi();
    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.sender = {
        name: "Coup de Main-Go",
        email: "matteo.donatelli1@gmail.com",
    };
    sendSmtpEmail.to = [{ email: user.email, name: user.firstName }];
    sendSmtpEmail.templateId = templateId;
    sendSmtpEmail.params = params;

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("Email envoyé avec succès :", response);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
    }
}
