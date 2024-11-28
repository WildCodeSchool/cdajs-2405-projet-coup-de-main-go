import { Box, Typography } from "@mui/material";

type ChatDetailPictureProps = {
  ad?: {
    title: string;
    mangoAmount: number;
  };
};

export default function ChatDetailPicture({
  ad,
}: ChatDetailPictureProps){
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "row",
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <img
        src="https://plus.unsplash.com/premium_photo-1680286739871-01142bc609df?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt={ad?.title}
        style={{
          width: 60,
          height: 60,
          marginRight: 2,
          borderRadius: 12,
        }}
      />
      <Box sx={{ ml: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {ad?.title}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {ad?.mangoAmount}
          </Typography>
          <img src="./mango.png" alt="mango" style={{ width: 16 }} />
        </Box>
      </Box>
    </Box>
  );
}
