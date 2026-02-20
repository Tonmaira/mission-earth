import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, Tooltip } from '@mui/material';
import { APIFuncionUniversal } from '../../api/FunctionAPI';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CaseCloaseDialog({ rid }) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState(false);
  const [ErrorMsg, setErrorMsg] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const submitCaseClose = async (rvid) => {
      const payload = {
        id: rvid
        ,Status:12
        ,CreatedBy: userData.UserId
      }
  
      await APIFuncionUniversal(
        "put",
        payload,
        `hoc/status/${rvid}`,
        setErrorMsg
      );
      navigate(0);
    };

  return (
    <React.Fragment>
      <IconButton
        color="secondary"
        aria-label="send"
        size="small"
        onClick={handleClickOpen}
      >
        <Tooltip title="ปิดเคส">
          <DoneAllIcon color='success'/>
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        maxWidth='xs'
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-hndialog"
      >
        <DialogTitle>{"เปลี่ยนสถานะ"}</DialogTitle>
        <DialogContent>
        {`เมื่อ "ยืนยัน" จะทำการเปลี่ยนสถานะเป็น "ปิดเคส" และจะไม่สามารถแก้ไขได้อีก`}
        {`โปรดตรวจสอบเอกสารให้เรียบร้อย`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={()=>submitCaseClose(rid)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}