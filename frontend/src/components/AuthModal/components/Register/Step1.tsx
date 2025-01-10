import {
    Box,
    Button,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";

interface Step1Props {
    goToLogin: () => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step1({ goToLogin, register }: Step1Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    let titleAlign = {};
    let buttonStyles = {};

    if (isMobile) {
        titleAlign = { textAlign: "center" };
        buttonStyles = {
            width: "100%",
            textAlign: "center",
            borderRadius: "10px",
        };
    } else {
        buttonStyles = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
        };
    }

    return (
        <>
            <Typography variant="h3" sx={titleAlign}>
                S’INSCRIRE
            </Typography>
            <TextField
                type="email"
                placeholder="E-mail"
                {...register("email", { required: true })}
                label="E-mail"
                required
            />
            <TextField
                type="password"
                placeholder="Mot de passe"
                {...register("password", { required: true })}
                label="Mot de passe"
                helperText="Le mot de passe doit inclure au moins une majuscule, une
                minuscule, un chiffre et un caractère spécial et contenir au moins 8 caractères."
                required
            />
            <TextField
                type="password"
                placeholder="Confirmer le mot de passe"
                {...register("passwordConfirmation", { required: true })}
                label="Confirmer le mot de passe"
                required
            />
            {!isMobile && (
                <Typography>
                    Vous avez déjà un compte ?{" "}
                    <Box
                        component="span"
                        onClick={() => goToLogin()}
                        sx={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            textDecoration: "underline",
                        }}
                    >
                        Me connecter
                    </Box>
                </Typography>
            )}
            <Stack sx={buttonStyles}>
                <Button type="submit" sx={buttonStyles}>
                    Continuer
                </Button>
                {isMobile && (
                    <>
                        <Typography>J'ai déjà un compte</Typography>
                        <Button
                            type="submit"
                            onClick={() => goToLogin()}
                            sx={[buttonStyles, { color: "black" }]}
                            variant="outlined"
                        >
                            Se connecter
                        </Button>
                    </>
                )}
            </Stack>
        </>
    );
}

export default Step1;
