import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import SendIcon from "@mui/icons-material/Send";
import { APIFuncionUniversal } from '../../api/FunctionAPI';
// import { APIFuncionUniversal } from '../../api/FunctionAPI';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function StatusChangeDialog({ rid }) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [open, setOpen] = useState(false);
  const [status , setStatus] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeText = (event) => {
    const { value } = event.target;
    setStatus(value);
  };

  const handleCloseAndGotoMainRightPage = () => {
    handleSubmitReConsiderButton(rid, parseInt(status));
  };

  const handleSubmitReConsiderButton = async (rvid,status) => {
      const payload = {
        id: rvid
        ,Status:status
        ,CreatedBy: userData.UserId
      }
  
      await APIFuncionUniversal(
        "put",
        payload,
        `hoc/status/${rvid}`,
        setErrorMsg
      );
      setOpen(false);
      // navigate(0);
    };

  return (
    <React.Fragment>
      <IconButton
        color="secondary"
        aria-label="send"
        size="small"
        onClick={handleClickOpen}
      >
        <Tooltip title="เปลี่ยนสถานะ">
          <SendIcon />
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
        <select
              className="InfoRightInputSelect"
              name="claimtype"
              onChange={handleChangeText}
              value={status}
            >
              <option value={0}>โปรดเลือก</option>
              <option value={1}>รอตรวจสอบข้อมูล(เภสัช)</option>
              <option value={2}>กำลังตรวจสอบข้อมูล(เภสัช)</option>
              <option value={3}>แบบร่าง(เภสัช)</option>
              <option value={4}>รอตรวจสอบข้อมูล(พยาบาล)</option>
              <option value={5}>กำลังตรวจสอบข้อมูล(พยาบาล)</option>
              {/* <option value={6}>แบบร่าง(พยาบาล)</option> */}
              {/* <option value={7}>รอตรวจสอบข้อมูล(ประสานสิทธิ)</option> */}
              {/* <option value={8}>กำลังตรวจสอบข้อมูล(ประสานสิทธิ)</option> */}
              {/* <option value={9}>แบบร่าง(ประสานสิทธิ)</option> */}
              {/* <option value={10}>ตรวจสอบแล้ว(ประสานสิทธิ)</option> */}
              {/* <option value={11}>พิมพ์เอกสารแล้ว</option> */}
              <option value={7}>เสร็จสิ้น</option>
              <option value={8}>พิมพ์เอกสารแล้ว</option>
            </select>
          <button className="DialogSearch" onClick={handleCloseAndGotoMainRightPage}>ค้นหา</button>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}