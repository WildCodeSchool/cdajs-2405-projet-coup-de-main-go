import { Stack, Typography, Link, IconButton, Grid2 } from '@mui/material';
import logo from "../../../public/images/coup_de_main_go.png"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return(
        <Stack
        component="footer"
        sx={{
          backgroundColor: 'secondary.main',
          color: '#fff',
          py: 3,
          px: 5,
          mt: 4,
        }}
      >
        <Grid2 container spacing={2}>
          {/* Colonne "À propos" */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            pt: 2,
          }}>
              À PROPOS DE COUP DE MAIN-GO
            </Typography>
            <Link href="#" underline="hover" color="inherit">
              Qui sommes-nous ?
            </Link>
            <br />
            <Link href="#" underline="hover" color="inherit">
              Nos engagements
            </Link>
          </Grid2>
  
          {/* Colonne "Informations légales" */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            pt: 2,
          }}>
              INFORMATIONS LÉGALES
            </Typography>
            <Link href="#" underline="hover" color="inherit">
              Conditions générales d’utilisation
            </Link>
            <br />
            <Link href="#" underline="hover" color="inherit">
              Vie privée / cookies
            </Link>
          </Grid2>
  
          {/* Colonne "Des questions ?" */}
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Typography variant="h6" component="h1" gutterBottom sx={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.5)',
            pt: 2}}> 
              DES QUESTIONS ?
            </Typography>
            <Link href="#" underline="hover" color="inherit">
              Aide
            </Link>
          </Grid2>
        </Grid2>

        <Stack direction="row" justifyContent="center" alignItems="center" sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            pt: 2,
          }}>
          <img src={logo} alt='logo coup de main-go' width={40}/>
        <Typography variant="body2">
            © Coup de Main-go 2024
          </Typography>
        </Stack>
  
        {/* Ligne inférieure */}
        <Stack
        direction="row" justifyContent="space-between" alignItems="center"
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.5)',
            pt: 2,
          }}
        >
          <Typography variant="body2">
            © Coup de Main-go 2024
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <IconButton
              href="https://linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
              color="inherit"
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              href="https://github.com"
              target="_blank"
              aria-label="GitHub"
              color="inherit"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              aria-label="Instagram"
              color="inherit"
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    )
}