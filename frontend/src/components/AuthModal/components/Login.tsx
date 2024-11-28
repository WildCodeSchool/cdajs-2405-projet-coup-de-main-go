import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
    LoginUserQuery,
    useLoginUserLazyQuery,
} from "../../../generated/graphql-types";

import { useAuth } from "../../../contexts/AuthContext";

export interface LoginFormData {
    email: string;
    password: string;
}

interface LoginProps {
    goToRegister: () => void;
}

function Login({ goToRegister }: LoginProps) {
    const { login } = useAuth();

    // Requête Apollo : Login
    const [sendLoginQuery] = useLoginUserLazyQuery({
        onCompleted: (data: LoginUserQuery) => {
            const token: string = data.login;
            login(token);
        },
        onError: (error: ApolloError) => {
            console.error("login failed", error);
        },
    });
    // Récupération des méthodes de LoginFormData
    const { handleSubmit, register } = useForm<LoginFormData>();
    // Lors de la soumission du formulaire
    const onLoginFormSubmitted = (formData: LoginFormData) => {
        sendLoginQuery({
            variables: formData,
        });
    };

    return (
        <form id="login" onSubmit={handleSubmit(onLoginFormSubmitted)}>
            <strong id="auth-title">CONNEXION</strong>
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
            <p>
                Envie de nous rejoindre ?{" "}
                <strong
                    className="clickable underline"
                    onClick={() => goToRegister()}
                >
                    Créer un compte
                </strong>
            </p>
            <button type="submit" className="clickable">
                Se connecter
            </button>
        </form>
    );
}

export default Login;
