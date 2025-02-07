import { useMediaQuery, useTheme } from "@mui/material";

function GetStyles() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    let modalStyles: React.CSSProperties = {};
    let image = "";
    let imgStyles: React.CSSProperties = {};
    let formStyles: React.CSSProperties = {};
    let titleAlign: React.CSSProperties = {};
    let buttonStyles: React.CSSProperties = {};
    let formSpace = "";
    const sharedFormStyles: React.CSSProperties = {
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        overflow: "auto",
    };

    if (isMobile) {
        modalStyles = {
            height: "calc(100vh - 32px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
        };
        image = "coup_de_main_go";
        imgStyles = {
            width: "128px",
            borderRadius: "20px",
        };
        formStyles = {
            width: "100%",
        };
        titleAlign = { textAlign: "center" };
        buttonStyles = {
            width: "100%",
            textAlign: "center",
            borderRadius: "10px",
        };
        formSpace = "space-between";
    } else {
        modalStyles = {
            height: "600px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
        };
        image = "auth-modal-img";
        imgStyles = {
            width: "40%",
            minHeight: "100%",
            objectFit: "cover",
            objectPosition: "40%",
            borderRadius: "20px",
        };
        formStyles = {
            height: "100%",
            margin: "auto",
            width: "100%",
        };
        buttonStyles = {
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
        };
    }

    return {
        modalStyles,
        image,
        imgStyles,
        formStyles,
        titleAlign,
        buttonStyles,
        formSpace,
        sharedFormStyles,
    };
}

export default GetStyles;
