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
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    let sharedFormStyles: React.CSSProperties = {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        overflow: "auto",
    };
    let formStyles = {};
    let titleAlign = {};
    let buttonStyles = {};

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

    if (isMobile) {
        formStyles = {
            width: "100%",
        };
        titleAlign = { textAlign: "center" };
        buttonStyles = {
            width: "100%",
            textAlign: "center",
            borderRadius: "10px",
        };
    } else {
        formStyles = {
            height: "100%",
            margin: "auto",
            width: "100%",
        };
        buttonStyles = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
        };
    }

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
            {error && <Alert severity="error">{error.message}</Alert>}
            {loading && <CircularProgress />}
            {justRegistered && (
                <Alert severity="success">Inscription réussi !</Alert>
            )}
        </form>
    );
}

export default Login;
