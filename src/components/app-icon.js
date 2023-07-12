import { Box, BoxProps, Typography, useTheme } from "@mui/material";
import { ImSearch } from "react-icons/im";

export default function AppIcon({ size = 28, ...props }) {
  const theme = useTheme();
  return (
    <Box display="flex" alignItems="baseline" {...props}>
      <ImSearch
        size={size}
        style={{
          marginRight: "-4px",
          transform: "rotate(70deg)",
          color: theme.palette.primary.main,
        }}
      />
      {/* <Typography
        fontWeight={700}
        fontSize={`${size - 14}px`}
        color={props.color ?? theme.palette.text.primary}
        sx={{ textDecoration: "none", textTransform: "none" }}
      >
        ricible
      </Typography> */}
    </Box>
  );
}
