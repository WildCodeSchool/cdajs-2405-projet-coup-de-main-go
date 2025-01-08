import { Alert, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    CredentialsVerificationQuery,
    useCredentialsVerificationLazyQuery,
    useGetAllSkillsQuery,
    useRegisterUserMutation,
} from "../../../generated/graphql-types";
import { Skill } from "../../../types";

import Step1 from "./Register/Step1";
import Step2 from "./Register/Step2";
import Step3 from "./Register/Step3";

export interface RegisterFormData {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    lastName: string;
    address: string;
    zipCode: string;
    city: string;
    skillsId: string[];
}

interface RegisterProps {
    setJustRegistered: (justRegistered: boolean) => void;
    goToLogin: () => void;
}

function Register({ setJustRegistered, goToLogin }: RegisterProps) {
    // Récupération des méthodes de RegisterFormData
    const {
        formState: { errors },
        handleSubmit,
        register,
        setValue,
    } = useForm<RegisterFormData>();
    // Trois étapes pour s'inscrire
    const [step, setStep] = useState<number>(1);

    // Requête Apollo : Enregistrement de l'utilisateur
    const [
        sendRegisterQuery,
        { loading: registerLoading, error: registerError },
    ] = useRegisterUserMutation({
        onCompleted: () => {
            setJustRegistered(true);
            goToLogin();
        },
    });

    // Requête Apollo : Vérifier les credentials
    const [
        sendCredentialsVerification,
        { loading: verificationLoading, error: verificationError },
    ] = useCredentialsVerificationLazyQuery({
        onCompleted: (data: CredentialsVerificationQuery) => {
            // Si la vérification est passée, passer à l'étape suivante
            if (data.credentialsVerification) {
                setStep(2);
            }
        },
    });

    // Requête Apollo : Récupération des Skills
    const { data: skillsData } = useGetAllSkillsQuery();
    // Initialisation de la variable skills
    const skills: Skill[] = skillsData?.getAllSkills || [];

    // Lors de la soumission du formulaire
    const onRegisterFormSubmitted = (formData: RegisterFormData) => {
        if (step === 1) {
            // Vérifier les credentials
            sendCredentialsVerification({
                variables: formData,
            });
        }

        if (step === 2) {
            setStep(3);
        }

        if (step === 3) {
            // Si pas de Skills alors return un tableau vide
            if (!formData.skillsId) {
                formData.skillsId = [];
            }

            sendRegisterQuery({
                variables: formData,
            });
        }
    };

    return (
        <form id="register" onSubmit={handleSubmit(onRegisterFormSubmitted)}>
            {step === 1 && <Step1 goToLogin={goToLogin} register={register} />}
            {step === 2 && (
                <Step2
                    errors={errors}
                    register={register}
                    setStep={setStep}
                    setValue={setValue}
                />
            )}
            {step === 3 && (
                <Step3 setStep={setStep} skills={skills} register={register} />
            )}
            {registerError && (
                <Alert severity="error">{registerError.message}</Alert>
            )}
            {verificationError && (
                <Alert severity="error">{verificationError.message}</Alert>
            )}
            {(registerLoading || verificationLoading) && <CircularProgress />}
        </form>
    );
}

export default Register;
