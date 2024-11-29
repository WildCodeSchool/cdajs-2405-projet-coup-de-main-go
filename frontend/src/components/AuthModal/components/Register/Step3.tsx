import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";
import { Skill } from "../../../../types";

interface Step2Props {
    skills: Skill[];
    setStep: (step: number) => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step3({ skills, setStep, register }: Step2Props) {
    return (
        <>
            <strong id="auth-title">Compétences</strong>
            <div id="auth-steps">
                <div id="auth-other-step"></div>
                <div id="auth-current-step"></div>
            </div>
            <ul id="auth-skills">
                {skills!.map((skill: Skill) => (
                    <li key={skill.id}>
                        <label
                            className="clickable"
                            htmlFor={`skill-${skill.id}`}
                        >
                            <div id="auth-skill">
                                <img
                                    src={skill.picture}
                                    alt={skill.name}
                                    width="50"
                                    height="50"
                                />
                                <p>{skill.name}</p>
                            </div>
                            <input
                                type="checkbox"
                                value={skill.id}
                                id={`skill-${skill.id}`}
                                {...register("skillsId", {
                                    required: false,
                                })}
                            />
                        </label>
                    </li>
                ))}
            </ul>
            <div id="auth-buttons">
                <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="clickable"
                >
                    Annuler
                </button>
                <button type="submit" className="clickable">
                    S'inscrire
                </button>
            </div>
        </>
    );
}

export default Step3;
