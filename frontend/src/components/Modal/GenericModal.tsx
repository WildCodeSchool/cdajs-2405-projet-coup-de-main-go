import { Box, Modal, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

type GenericModalProps = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    maxWidth?: string;
    fullScreen?: boolean;
    bgColor?: string;
};

export default function GenericModal({
    open,
    onClose,
    children,
    title,
    maxWidth = "sm",
    fullScreen = false,
    bgColor = "tertiary.main",
}: GenericModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    p: 3,
                    bgcolor: bgColor,
                    borderRadius: 2,
                    maxWidth: maxWidth,
                    width: "100%",
                    height: fullScreen ? "100vh" : "auto",
                    overflow: "auto",
                }}
            >
                {title && (
                    <Box sx={{ mb: 2, fontSize: 20, fontWeight: 600 }}>
                        <Typography variant="h5">{title}</Typography>
                    </Box>
                )}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "text.secondary",
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {children}
            </Box>
        </Modal>
    );
}
