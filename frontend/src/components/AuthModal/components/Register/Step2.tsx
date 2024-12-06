import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { RegisterFormData } from "../Register";

interface Step2Props {
    errors: FieldErrors<RegisterFormData>;
    register: UseFormRegister<RegisterFormData>;
    setStep: (step: number) => void;
    setValue: UseFormSetValue<RegisterFormData>;
}

function Step3({ errors, register, setStep, setValue }: Step2Props) {
    const handleChangeZipCode = (string: string): string => {
        const re = /^[0-9]*$/;

        if ((!string.includes(" ") && re.test(string)) || string === "") {
            return string;
        } else {
            return string
                .split("")
                .splice(0, string.length - 1)
                .join("");
        }
    };

    return (
        <>
            <Typography variant="h2">Formulaire</Typography>
            <Stack direction={"row"} spacing={"20px"}>
                <Box
                    sx={{
                        backgroundColor: "var(--tertiary)",
                        borderRadius: "20px",
                        height: "10px",
                        width: "60px",
                    }}
                ></Box>
                <Box
                    sx={{
                        backgroundColor: "var(--tertiary)",
                        borderRadius: "20px",
                        height: "10px",
                        width: "20px",
                    }}
                ></Box>
            </Stack>
            <Stack direction={"row"}>
                <TextField
                    type="text"
                    placeholder="Prénom"
                    {...register("firstName", { required: true })}
                    label="Prénom"
                    required
                />
                <TextField
                    type="text"
                    placeholder="Nom"
                    {...register("lastName", { required: true })}
                    label="Nom"
                    required
                />
            </Stack>
            <TextField
                type="text"
                placeholder="Adresse"
                {...register("address", { required: true })}
                label="Adresse"
                required
            />
            <Stack direction={"row"}>
                {/* TO DO : Autoriser uniquement les chiffres */}
                <TextField
                    type="text"
                    placeholder="Code Postal"
                    label="Code Postal"
                    {...register("zipCode", {
                        required: "Le code postal est requis",
                        minLength: {
                            value: 5,
                            message:
                                "Le code postal doit comporter 5 caractères",
                        },
                        maxLength: {
                            value: 5,
                            message:
                                "Le code postal doit comporter 5 caractères",
                        },
                    })}
                    error={!!errors.zipCode} // Si une erreur existe, active l'état d'erreur
                    helperText={errors.zipCode?.message as string} // Affiche le message d'erreur
                    onChange={
                        (e) =>
                            setValue(
                                "zipCode",
                                handleChangeZipCode(e.target.value)
                            ) // Si nécessaire
                    }
                />

                <TextField
                    type="text"
                    placeholder="Ville"
                    {...register("city", { required: true })}
                    label="Ville"
                    required
                />
            </Stack>
            <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button
                    type="button"
                    onClick={() => setStep(1)}
                    variant="outlined"
                    sx={{ color: "black" }}
                >
                    Annuler
                </Button>
                <Button type="submit">Suivant</Button>
            </Stack>
        </>
    );
}

export default Step3;
