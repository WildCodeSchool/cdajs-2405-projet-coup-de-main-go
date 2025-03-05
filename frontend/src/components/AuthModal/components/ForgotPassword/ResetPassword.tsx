import { Button, Stack, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

import { ForgotPasswordFormData } from "../ForgotPassword";
import GetStyles from "../../styles/GetStyles";

interface ResetPasswordProps {
    register: UseFormRegister<ForgotPasswordFormData>;
}

function ResetPassword({ register }: ResetPasswordProps) {
    const { buttonStyles } = GetStyles();

    return (
        <>
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
                {...register("passwordConfirmation", {
                    required: true,
                })}
                label="Confirmer le mot de passe"
                required
            />
            <Stack sx={buttonStyles}>
                <Button type="submit" sx={buttonStyles}>
                    Rénitialiser le mot de passe
                </Button>
            </Stack>
        </>
    );
}

export default ResetPassword;
