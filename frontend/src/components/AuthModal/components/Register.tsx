import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";

import {
    RegisterUserMutation,
    useRegisterUserMutation,
} from "../../../generated/graphql-types";

interface RegisterFormData {
    email: string;
    password: string;
    passwordConfirmation: string;
    firstName: string;
    lastName: string;
    address: string;
    zipCode: string;
    city: string;
}

interface RegisterProps {
    goToLogin: () => void;
}

function Register({ goToLogin }: RegisterProps) {
    const [sendRegisterQuery, { loading, error }] = useRegisterUserMutation({
        onCompleted: (data: RegisterUserMutation) => {
            data.register;
        },
        onError: (error: ApolloError) => {
            console.error("register failed", error);
        },
    });

    const { handleSubmit, register } = useForm<RegisterFormData>();

    const onRegisterFormSubmitted = (formData: RegisterFormData) => {
        formData.firstName = "Mattéo";
        formData.lastName = "Donatelli";
        formData.address = "address";
        formData.zipCode = "67540";
        formData.city = "Strasbourg";

        sendRegisterQuery({
            variables: formData,
        });
    };

    return (
        <form id="register" onSubmit={handleSubmit(onRegisterFormSubmitted)}>
            <strong>S’INSCRIRE</strong>
            <br />
            <input
                type="email"
                placeholder="E-mail"
                {...register("email", { required: true })}
            />
            <br />
            <input
                type="password"
                placeholder="Mot de passe"
                {...register("password", { required: true })}
            />
            <br />
            <input
                type="password"
                placeholder="Confirmer le mot de passe"
                {...register("passwordConfirmation", { required: true })}
            />
            <p>
                Vous avez déjà un compte ?{" "}
                <strong className="clickable" onClick={() => goToLogin()}>
                    Me connecter
                </strong>
            </p>
            <button type="submit">Continuer</button>
            {loading && "Loading..."}
            <br />
            {error && "Une erreur est survenue, merci de réessayer..."}
            <br />
        </form>
    );
}

export default Register;
