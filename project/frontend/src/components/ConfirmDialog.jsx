import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import axios from 'axios';

export default function ConfirmDialog({open, setOpen, Params, IsHistory, Title}) {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

      const ToCheckout = async (AN) => {
        try {
           await axios.post(`${apiUrl}/medlog`, {AN});
        } catch (error) {
          console.error("Error saving data:", error);
        }
      };

  return (
    <>
    <IconButton aria-label="CheckOut" onClick={handleClickOpen}>
        {IsHistory? <LoopIcon /> : <CheckIcon />}
        
    </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {Title}
        </DialogTitle>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>ยกเลิก</Button>
          <Button variant="contained" onClick={()=>ToCheckout(Params)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
