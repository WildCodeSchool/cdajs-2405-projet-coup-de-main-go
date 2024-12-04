import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";

interface Step1Props {
    goToLogin: () => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step1({ goToLogin, register }: Step1Props) {
    return (
        <>
            <strong id="auth-title">S’INSCRIRE</strong>
            <input
                type="email"
                placeholder="E-mail"
                {...register("email", { required: true })}
            />
            <input
                type="password"
                placeholder="Mot de passe"
                {...register("password", { required: true })}
            />
            <input
                type="password"
                placeholder="Confirmer le mot de passe"
                {...register("passwordConfirmation", { required: true })}
            />
            <p>
                Vous avez déjà un compte ?{" "}
                <strong
                    className="clickable underline"
                    onClick={() => goToLogin()}
                >
                    Me connecter
                </strong>
            </p>
            <button type="submit" className="clickable">
                Continuer
            </button>
        </>
    );
}

export default Step1;
