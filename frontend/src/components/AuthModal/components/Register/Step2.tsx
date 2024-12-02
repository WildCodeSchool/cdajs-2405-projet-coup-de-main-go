import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";

interface Step2Props {
    setStep: (step: number) => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step3({ setStep, register }: Step2Props) {
    return (
        <>
            <strong id="auth-title">Formulaire</strong>
            <div id="auth-steps">
                <div id="auth-current-step"></div>
                <div id="auth-other-step"></div>
            </div>
            <div className="auth-inline">
                <input
                    type="text"
                    placeholder="Prénom"
                    {...register("firstName", { required: true })}
                />
                <input
                    type="text"
                    placeholder="Nom"
                    {...register("lastName", { required: true })}
                />
            </div>
            <input
                type="text"
                placeholder="Adresse"
                {...register("address", { required: true })}
            />
            <div className="auth-inline">
                <input
                    type="text"
                    placeholder="Code Postal"
                    {...register("zipCode", { required: true })}
                />
                <input
                    type="text"
                    placeholder="Ville"
                    {...register("city", { required: true })}
                />
            </div>
            <div id="auth-buttons">
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="clickable"
                >
                    Annuler
                </button>
                <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="clickable"
                >
                    Suivant
                </button>
            </div>
        </>
    );
}

export default Step3;
