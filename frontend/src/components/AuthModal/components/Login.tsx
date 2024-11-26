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

    const [sendLoginQuery, { loading, error }] = useLoginUserLazyQuery({
        onCompleted: (data: LoginUserQuery) => {
            const token: string = data.login;
            login(token);
        },
        onError: (error: ApolloError) => {
            console.error("login failed", error);
        },
    });

    const { handleSubmit, register } = useForm<LoginFormData>();

    const onLoginFormSubmitted = (formData: LoginFormData) => {
        sendLoginQuery({
            variables: formData,
        });
    };

    return (
        <form id="login" onSubmit={handleSubmit(onLoginFormSubmitted)}>
            <strong>CONNEXION</strong>
            <br />
            <input
                type="email"
                placeholder="E-mail"
                {...register("email", { required: true })}
            />
            <br />
            <input
                type="password"
                placeholder="Mot de passe"
                {...register("password", { required: true })}
            />
            <p>
                Envie de nous rejoindre ?{" "}
                <strong className="clickable" onClick={() => goToRegister()}>
                    Créer un compte
                </strong>
            </p>
            <button type="submit">Se connecter</button>
            {loading && "Loading..."}
            <br />
            {error && "Une erreur est survenue, merci de réessayer..."}
            <br />
        </form>
    );
}

export default Login;
