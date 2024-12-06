import { Avatar, Box, Divider, Stack, Typography } from "@mui/material";
import { GetAdByIdQuery } from "../../generated/graphql-types";
import theme from "../../mui";
import ReviewsIcon from "@mui/icons-material/Reviews";
import StarRateIcon from "@mui/icons-material/StarRate";

interface DetailUserProps {
  ad: GetAdByIdQuery["getAdById"];
}

export default function DetailUser({ ad }: DetailUserProps) {
  return (
    <>
      <Box
        sx={{
          backgroundColor: theme.palette.primary.main,
          height: "6rem",
          position: "relative",
          borderRadius: "1rem 1rem 0 0",
        }}
      >
        <Avatar
          src="https://plus.unsplash.com/premium_photo-1705018501151-4045c97658a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt={ad.userRequester.firstName}
          sx={{
            width: "5rem",
            height: "5rem",
            position: "absolute",
            bottom: "-2.5rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </Box>
      <Stack
        sx={{
          backgroundColor: "white",
          alignItems: "center",
          padding: "3.5rem 0 2rem 0",
          borderRadius: "0 0 1rem 1rem",
        }}
      >
        {/* Name and biography */}
        <Stack
          spacing={1}
          sx={{
            alignItems: "center",
            width: "70%",
          }}
        >
          <Typography variant="h6">
            {ad.userRequester.firstName} {ad.userRequester.lastName.charAt(0)}.
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            {ad.userRequester.biography}
          </Typography>
        </Stack>

        {/* Rating and number of comments */}
        <Stack direction="row" sx={{ width: "14rem" }}>
          <Stack spacing={1} sx={{ width: "100%", alignItems: "center" }}>
            <StarRateIcon sx={{ color: theme.palette.primary.main }} />
            {/* TODO: Replace with actual rating */}
            <Typography>4/5</Typography>
          </Stack>
          <Divider orientation="vertical" flexItem />
          <Stack spacing={1} sx={{ width: "100%", alignItems: "center" }}>
            <ReviewsIcon sx={{ color: theme.palette.primary.main }} />
            {/* TODO: Replace with actual number of comments */}
            <Typography>50 avis</Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
