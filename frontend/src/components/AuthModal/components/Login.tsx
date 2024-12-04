import { Alert, CircularProgress } from "@mui/material";
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
    justRegistered: Boolean;
    setJustRegistered: (justRegistered: Boolean) => void;
    goToRegister: () => void;
}

function Login({
    justRegistered,
    setJustRegistered,
    goToRegister,
}: LoginProps) {
    const { login } = useAuth();

    const [sendLoginQuery, { loading, error }] = useLoginUserLazyQuery({
        onCompleted: (data: LoginUserQuery) => {
            const { token, userId } = data.login;
            login(token, userId);
        },
    });

    const { handleSubmit, register } = useForm<LoginFormData>();

    const onLoginFormSubmitted = (formData: LoginFormData) => {
        setJustRegistered(false);
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
            {error && <Alert severity="error">{error.message}</Alert>}
            {loading && <CircularProgress />}
            {justRegistered && (
                <Alert severity="info">Inscription réussi !</Alert>
            )}
        </form>
    );
}

export default Login;
