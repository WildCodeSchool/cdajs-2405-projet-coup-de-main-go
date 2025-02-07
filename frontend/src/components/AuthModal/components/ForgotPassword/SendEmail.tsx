import { Button, Stack, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

import { ForgotPasswordFormData } from "../ForgotPassword";
import GetStyles from "../../styles/GetStyles";

interface SendEmailProps {
    register: UseFormRegister<ForgotPasswordFormData>;
}

function SendEmail({ register }: SendEmailProps) {
    const { buttonStyles } = GetStyles();

    return (
        <>
            <TextField
                type="email"
                placeholder="E-mail"
                label="E-mail"
                {...register("email", { required: true })}
                required
            />
            <Stack sx={buttonStyles}>
                <Button type="submit" sx={buttonStyles}>
                    Envoyer le mail de récupération
                </Button>
            </Stack>
        </>
    );
}

export default SendEmail;
