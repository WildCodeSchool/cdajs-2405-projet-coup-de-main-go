import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
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
    justRegistered: boolean;
    setJustRegistered: (justRegistered: boolean) => void;
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
            <Typography variant="h3">CONNEXION</Typography>
            <TextField
                type="email"
                placeholder="E-mail"
                label="E-mail"
                {...register("email", { required: true })}
                required
            />
            <TextField
                type="password"
                placeholder="Mot de passe"
                label="Mot de passe"
                {...register("password", { required: true })}
                required
            />
            <Typography>
                Envie de nous rejoindre ?{" "}
                <Box
                    component="span"
                    onClick={() => goToRegister()}
                    sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        textDecoration: "underline",
                    }}
                >
                    Créer un compte
                </Box>
            </Typography>
            <Stack
                direction={"row"}
                sx={{
                    justifyContent: "flex-end",
                }}
            >
                <Button type="submit">Se connecter</Button>
            </Stack>
            {error && <Alert severity="error">{error.message}</Alert>}
            {loading && <CircularProgress />}
            {justRegistered && (
                <Alert severity="success">Inscription réussi !</Alert>
            )}
        </form>
    );
}

export default Login;
