import { ApolloError } from "@apollo/client";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
    RegisterUserMutation,
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
    goToLogin: () => void;
}

function Register({ goToLogin }: RegisterProps) {
    // Trois étapes pour s'inscrire
    const [step, setStep] = useState<number>(1);

    // Requête Apollo : Enregistrement de l'utilisateur
    const [sendRegisterQuery] = useRegisterUserMutation({
        onCompleted: (data: RegisterUserMutation) => {
            data.register;
            goToLogin();
        },
        onError: (error: ApolloError) => {
            console.error("register failed", error);
        },
    });
    // Récupération des méthodes de RegisterFormData
    const { handleSubmit, register } = useForm<RegisterFormData>();

    // Requête Apollo : Récupération des Skills
    const { data } = useGetAllSkillsQuery();
    // Initialisation de la variable skills
    const skills: Skill[] = data?.getAllSkills || [];
    // Lors de la soumission du formulaire
    const onRegisterFormSubmitted = (formData: RegisterFormData) => {
        // Si pas de Skills alors return un tableau vide
        if (!formData.skillsId) {
            formData.skillsId = [];
        }

        sendRegisterQuery({
            variables: formData,
        });
    };

    return (
        <form id="register" onSubmit={handleSubmit(onRegisterFormSubmitted)}>
            {step === 1 && (
                <Step1
                    goToLogin={goToLogin}
                    setStep={setStep}
                    register={register}
                />
            )}
            {step === 2 && <Step2 setStep={setStep} register={register} />}
            {step === 3 && (
                <Step3 skills={skills} setStep={setStep} register={register} />
            )}
        </form>
    );
}

export default Register;
