import {
    Box,
    Button,
    Checkbox,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";

import { RegisterFormData } from "../Register";
import { Skill } from "../../../../types";

interface Step2Props {
    skills: Skill[];
    setStep: (step: number) => void;
    register: UseFormRegister<RegisterFormData>;
}

function Step3({ skills, setStep, register }: Step2Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            <Typography variant="h3">Compétences</Typography>
            <Stack direction={"row"} spacing={"20px"}>
                <Box
                    sx={{
                        backgroundColor: "var(--tertiary)",
                        width: "20px",
                        height: "10px",
                        borderRadius: "20px",
                    }}
                ></Box>
                <Box
                    sx={{
                        backgroundColor: "var(--tertiary)",
                        width: "60px",
                        height: "10px",
                        borderRadius: "20px",
                    }}
                ></Box>
            </Stack>
            <Stack
                direction={"row"}
                spacing={0}
                sx={{
                    backgroundColor: "var(--tertiary)",
                    borderRadius: "20px",
                    flexWrap: "wrap",
                    gap: "20px",
                    height: "100%",
                    overflowY: "scroll",
                    padding: "20px",
                }}
                justifyContent={!isMobile ? "space-between" : "center"}
            >
                {skills!.map((skill: Skill) => (
                    <Stack
                        key={skill.id}
                        sx={{
                            backgroundColor: "var(--white)",
                            borderRadius: "10px",
                            height: "fit-content",
                            padding: "10px",
                        }}
                        width={!isMobile ? "42%" : "84%"}
                    >
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            spacing={0}
                        >
                            <Stack
                                alignItems={"center"}
                                direction={"row"}
                                spacing={"6px"}
                            >
                                <Box
                                    component="img"
                                    src={`/images/skills/${skill.picture}`}
                                    alt={skill.name}
                                    width="50"
                                    height="50"
                                />
                                <Typography fontSize={"12px"}>
                                    {skill.name}
                                </Typography>
                            </Stack>
                            <Checkbox
                                value={skill.id}
                                id={`skill-${skill.id}`}
                                {...register("skillsId", {
                                    required: false,
                                })}
                                sx={{
                                    padding: 0,
                                }}
                            />
                        </Stack>
                    </Stack>
                ))}
            </Stack>
            <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                marginRight={"20px"}
            >
                <Button
                    type="button"
                    onClick={() => setStep(2)}
                    variant="outlined"
                    sx={{ color: "black" }}
                >
                    Annuler
                </Button>
                <Button type="submit">S'inscrire</Button>
            </Stack>
        </>
    );
}

export default Step3;
