import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { useForm } from "react-hook-form";

import {
    LoginUserQuery,
    useLoginUserLazyQuery,
} from "../../../generated/graphql-types";

import { useAuth } from "../../../contexts/AuthContext";
import GetStyles from "../styles/GetStyles";

export interface LoginFormData {
    email: string;
    password: string;
}

interface LoginProps {
    justRegistered: boolean;
    passwordChanged: boolean;
    setJustRegistered: (justRegistered: boolean) => void;
    setPasswordChanged: (passwordChanged: boolean) => void;
    goToRegister: () => void;
    resetPassword: () => void;
}

function Login({
    justRegistered,
    passwordChanged,
    setJustRegistered,
    setPasswordChanged,
    goToRegister,
    resetPassword,
}: LoginProps) {
    const { login } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { formStyles, titleAlign, buttonStyles, sharedFormStyles } =
        GetStyles();

    const [sendLoginQuery, { loading, error }] = useLoginUserLazyQuery({
        onCompleted: (data: LoginUserQuery) => {
            const { token, userId } = data.login;
            login(token, userId);
        },
    });

    const { handleSubmit, register } = useForm<LoginFormData>();

    const onLoginFormSubmitted = (formData: LoginFormData) => {
        setJustRegistered(false);
        setPasswordChanged(false);
        sendLoginQuery({
            variables: formData,
        });
    };

    return (
        <form
            style={{ ...sharedFormStyles, ...formStyles }}
            onSubmit={handleSubmit(onLoginFormSubmitted)}
        >
            <Typography variant="h3" sx={titleAlign}>
                CONNEXION
            </Typography>
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
            {!isMobile && (
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
            )}
            <Stack sx={buttonStyles}>
                <Button type="submit" sx={buttonStyles}>
                    Se connecter
                </Button>
                {isMobile && (
                    <>
                        <Typography>Je n'ai pas de compte</Typography>
                        <Button
                            type="submit"
                            onClick={() => goToRegister()}
                            sx={[buttonStyles, { color: "black" }]}
                            variant="outlined"
                        >
                            S'inscrire
                        </Button>
                    </>
                )}
            </Stack>
            <Typography
                onClick={() => resetPassword()}
                sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    alignSelf: isMobile ? "center" : "flex-end",
                }}
            >
                Mot de passe oublié ?
            </Typography>
            {error && <Alert severity="error">{error.message}</Alert>}
            {loading && <CircularProgress />}
            {justRegistered && !passwordChanged && (
                <Alert severity="success">Inscription réussi !</Alert>
            )}
            {passwordChanged && (
                <Alert severity="success">
                    Le mot de passe a bien été renitialisé !
                </Alert>
            )}
        </form>
    );
}

export default Login;
