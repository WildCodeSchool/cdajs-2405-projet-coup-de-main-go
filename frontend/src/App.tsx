import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

export default function App() {
    return (
        <Box>
            <Header />
                <Container maxWidth="xl" disableGutters>
                    <Outlet />
                </Container>
            <Footer />
        </Box>
    );
}
