import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core";

const PersonalSeeds = (props) => {

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Personal Seeds</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {props.personalSeedsContent}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>

                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PersonalSeeds;