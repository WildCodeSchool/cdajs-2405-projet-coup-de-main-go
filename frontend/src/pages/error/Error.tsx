import { Box, Link, Stack, Typography } from "@mui/material";
import error from "@public/images/undraw_not_found_re_bh2e.svg"
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";

export default function Error() {
    return (
        <Box>
        <Header />
            <Stack alignItems="center" justifyContent="center" component="main">
                <img src={error} alt="Not_found" />
                <Typography>Cette page n'existe plus, elle a peut-être été supprimée, vous pouvez retourner à l'accueil juste <Link href="/" underline="hover" >ici</Link></Typography>
            </Stack>
        <Footer />
        </Box>
    )
}