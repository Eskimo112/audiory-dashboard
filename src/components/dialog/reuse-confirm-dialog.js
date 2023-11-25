import React from "react";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const ConfirmDialog = ({ title, content, isOpen, handleClose, actionContent = 'Xác nhận', cancelContent = 'Hủy', isReverse = false, actionBgColor = 'primary', width = 1200 }) => {
    return (
        <React.Fragment>
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: width,  // Set your width here
                        },
                    },

                }}
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" >
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ display: 'flex', flexDirection: isReverse ? "row-reverse" : "row", justifyContent: "end", columnGap: "0.3em   " }}>
                    <Button onClick={() => { handleClose(false) }} color='inherit'>
                        {cancelContent}
                    </Button>
                    <Button onClick={() => { handleClose(true) }} variant='contained' autoFocus color={actionBgColor}>{actionContent}</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default ConfirmDialog;