export default function passwordVerification(password: string): void {
    // Vérification de la taille du mot de passe
    if (password.length < 8) {
        throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
    }

    // Vérification de la robustesse du mot de passe
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
        throw new Error(
            "Le mot de passe doit inclure au moins une majuscule, une minuscule, un chiffre et un caractère spécial."
        );
    }
}
