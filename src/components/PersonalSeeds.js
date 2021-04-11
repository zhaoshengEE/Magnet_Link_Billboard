import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from "@material-ui/core";

const PersonalSeeds = (props) => {

    return (
        <div>
            <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Personal Seeds</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        <TableContainer component={Paper}>
                            <Table  aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Seed Id</TableCell>
                                        <TableCell align="right">Name</TableCell>
                                        <TableCell align="right">Link</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.personalSeeds?.map((seed)=>(

                                        <TableRow key={seed.seedId}>
                                            <TableCell align="right">{seed.id}</TableCell>
                                            <TableCell align="right">{seed.name}</TableCell>

                                            <TableCell align="right">{seed.link}</TableCell>

                                        </TableRow>
                                        )
                                    )}
                                </TableBody>
                                </Table>
                           </TableContainer>



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