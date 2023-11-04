import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { Box, Divider, MenuItem, MenuList, Popover, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks/use-auth";

export const MyStoryPopover = (props) => {
    const { anchorEl, onClose, open } = props;
    const router = useRouter();
    const auth = useAuth();

    const handleSignOut = useCallback(() => {
        onClose?.();
        auth.signOut();
        router.push("/auth/login");
    }, [onClose, auth, router]);

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                horizontal: "right",
                vertical: "top",
            }}
            onClose={onClose}
            open={open}
            PaperProps={{ sx: { width: 200 } }}
        >
            <Box
                sx={{
                    py: 1.5,
                    px: 2,
                }}
            >
                <Typography variant="overline">ALo</Typography>
                <Typography color="text.secondary" variant="body2">
                    Phạm Nguyên
                </Typography>
            </Box>
            <Divider />
            <MenuList
                disablePadding
                dense
                sx={{
                    p: "8px",
                    "& > *": {
                        borderRadius: 1,
                    },
                }}
            >
                <MenuItem onClick={handleSignOut}>Đăng xuất</MenuItem>
            </MenuList>
        </Popover>
    );
};

MyStoryPopover.propTypes = {
    anchorEl: PropTypes.any,
    onClose: PropTypes.func,
    open: PropTypes.bool.isRequired,
};
