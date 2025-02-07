import { Box, Button, Stack, TextField } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { ForgotPasswordFormData } from "../ForgotPassword";
import GetStyles from "../../styles/GetStyles";

interface OTPProps {
    handleChange: (value: string, index: number) => void;
    handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
    control: Control<ForgotPasswordFormData>;
    inputsRef: React.MutableRefObject<HTMLInputElement[]>;
}

function OTP({ handleChange, handlePaste, control, inputsRef }: OTPProps) {
    const { buttonStyles } = GetStyles();

    return (
        <>
            <Box display="flex" justifyContent="center" gap={2}>
                {Array(4)
                    .fill(0)
                    .map((_, index) => (
                        <Controller
                            key={index}
                            name={`otp.${index}`}
                            control={control}
                            rules={{
                                required: true,
                                maxLength: 1,
                                minLength: 1,
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    inputRef={(el) =>
                                        (inputsRef.current[index] = el)
                                    }
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    onPaste={handlePaste}
                                    variant="outlined"
                                    slotProps={{
                                        htmlInput: {
                                            sx: {
                                                textAlign: "center",
                                                fontSize: "1.5rem",
                                            },
                                        },
                                    }}
                                    sx={{ width: "3rem" }}
                                />
                            )}
                        />
                    ))}
            </Box>
            <Stack sx={{ buttonStyles, alignItems: "center" }}>
                <Button type="submit" sx={buttonStyles}>
                    Soumettre le code de confirmation
                </Button>
            </Stack>
        </>
    );
}

export default OTP;
