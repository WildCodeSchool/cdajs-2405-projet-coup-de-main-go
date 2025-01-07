import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";

interface Step1Props {
    goToLogin: () => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step1({ goToLogin, register }: Step1Props) {
    return (
        <>
            <Typography variant="h2">S’INSCRIRE</Typography>
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
            <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button type="submit">Continuer</Button>
            </Stack>
        </>
    );
}

export default Step1;
