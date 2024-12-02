import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function App() {
    return (
        <Box>
            <Container maxWidth="xl">
                <Outlet />
            </Container>
        </Box>
    );
}
