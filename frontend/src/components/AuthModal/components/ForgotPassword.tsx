import { Alert, Box, CircularProgress } from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
    SendEmailVerificationMutation,
    useChangeUserPasswordMutation,
    useSendEmailVerificationMutation,
    useVerifyOtpMutation,
} from "../../../generated/graphql-types";

import OTP from "./ForgotPassword/OTP";
import ResetPassword from "./ForgotPassword/ResetPassword";
import SendEmail from "./ForgotPassword/SendEmail";
import GetStyles from "../styles/GetStyles";

export interface ForgotPasswordFormData {
    email: string;
    password: string;
    passwordConfirmation: string;
    otp: string[];
}

interface ForgotPAsswordProps {
    goToLogin: () => void;
    setPasswordChanged: (passwordChanged: boolean) => void;
}

function ForgotPassword({
    goToLogin,
    setPasswordChanged,
}: ForgotPAsswordProps) {
    const inputsRef = useRef<HTMLInputElement[]>([]);
    const [email, setEmail] = useState<string>("");
    const [emailJustSended, setEmailJustSended] = useState<boolean>(false);
    const [otpIsValid, setOtpIsValid] = useState<boolean>(false);
    const [otpJustValidated, setOtpJustValidated] = useState<boolean>(false);
    const { formStyles, sharedFormStyles } = GetStyles();

    // MAJ de l'état de "email"
    const [
        sendEmailVerificationMutation,
        { loading: loadingEmailVerification, error: errorEmailVerification },
    ] = useSendEmailVerificationMutation({
        onCompleted: (data: SendEmailVerificationMutation) => {
            setEmail(data.sendEmailVerification);
            setEmailJustSended(true);
        },
    });
    // Retour sur la page de connexion
    const [
        sendChangePasswordMutation,
        { loading: loadingChangePassword, error: errorChangePassword },
    ] = useChangeUserPasswordMutation({
        onCompleted: () => {
            setPasswordChanged(true);
            setOtpJustValidated(false);
            goToLogin();
        },
        onError: () => {
            setOtpJustValidated(false);
        },
    });
    // MAJ de l'état de "otpIsValid"
    const [verifyOTP, { loading: loadingOTP, error: errorOTP }] =
        useVerifyOtpMutation({
            onCompleted: () => {
                setOtpIsValid(true);
                setEmailJustSended(false);
                setOtpJustValidated(true);
            },
            onError: () => {
                setEmailJustSended(false);
            },
        });

    const { handleSubmit, control, setValue, getValues, register } =
        useForm<ForgotPasswordFormData>({
            defaultValues: {
                otp: ["", "", "", ""],
            },
        });

    const onForgotPasswordFormSubmitted = (
        formData: ForgotPasswordFormData
    ) => {
        if (formData.password && formData.passwordConfirmation) {
            // Changer le mot de passe
            sendChangePasswordMutation({
                variables: {
                    email: email,
                    password: formData.password,
                    passwordConfirmation: formData.passwordConfirmation,
                },
            });
        } else if (formData.otp && formData.otp.join("").length === 4) {
            const code = formData.otp.join("");
            // Vérifier si l'OTP soumis est bien le même que l'OTP en BDD
            verifyOTP({
                variables: {
                    email: email,
                    otp: code,
                },
            });
        } else if (formData.email) {
            // Envoyer un e-mail de vérification et créer un OTP en BDD
            sendEmailVerificationMutation({
                variables: {
                    email: formData.email,
                },
            });
        }
    };

    // Gérer la saisie des chiffres
    const handleChange = (value: string, index: number) => {
        if (/^\d?$/.test(value)) {
            const currentOtp = getValues("otp");
            currentOtp[index] = value;
            setValue("otp", currentOtp);

            if (value && index < 3) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    // Gestion du collage pour remplir les 4 inputs
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedData = e.clipboardData.getData("Text").trim();
        if (/^\d{4}$/.test(pastedData)) {
            const pastedArray: string[] = pastedData.split("");
            pastedArray.forEach((digit, idx) => {
                setValue(`otp.${idx}`, digit);
                inputsRef.current[idx].value = digit;
            });
            inputsRef.current[3].focus();
        }
        e.preventDefault();
    };

    return (
        <form
            style={{
                ...sharedFormStyles,
                ...formStyles,
                justifyContent: "center",
            }}
            onSubmit={handleSubmit(onForgotPasswordFormSubmitted)}
        >
            {email ? (
                otpIsValid ? (
                    // SI l'OTP EST CORRECT
                    <ResetPassword register={register} />
                ) : (
                    // SI L'EMAIL VIENT D'ETRE ENVOYE
                    <OTP
                        handleChange={handleChange}
                        control={control}
                        handlePaste={handlePaste}
                        inputsRef={inputsRef}
                    />
                )
            ) : (
                // SI L'UTILISATEUR VIENT DE CLIQUER SUR MDP OUBLIE
                <SendEmail register={register} />
            )}
            {errorOTP && !emailJustSended && (
                <Alert severity="error">
                    {errorOTP?.message}
                    <br />
                    <Box
                        component="span"
                        onClick={() =>
                            sendEmailVerificationMutation({
                                variables: {
                                    email: email,
                                },
                            })
                        }
                        sx={{
                            cursor: "pointer",
                            fontWeight: "bold",
                            textDecoration: "underline",
                        }}
                    >
                        Renvoyer le mail de rénitialisation
                    </Box>
                </Alert>
            )}
            {(errorEmailVerification || errorChangePassword) &&
                !otpJustValidated && (
                    <Alert severity="error">
                        {errorEmailVerification?.message ||
                            errorChangePassword?.message}
                    </Alert>
                )}
            {(loadingEmailVerification ||
                loadingChangePassword ||
                loadingOTP) && <CircularProgress />}
            {emailJustSended && (
                <Alert severity="success">
                    Le code de rénitialisation vient d'être envoyé à l'adresse
                    suivante : {email}.
                </Alert>
            )}
            {otpJustValidated && (
                <Alert severity="success">
                    Le code de rénitialisation est correct. Vous pouvez créer un
                    nouveau mot de passe.
                </Alert>
            )}
        </form>
    );
}

export default ForgotPassword;
