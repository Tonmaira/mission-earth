import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { IconButton, Tooltip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { APIFuncionUniversal } from '../../api/FunctionAPI';
import { formatDateTimeN7 } from '../Function';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryDialog({ rid }) {
  const [open, setOpen] = useState(false);
  const [HistoryData , setHistoryData] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchHistory = async ( ) => {
      const response = await APIFuncionUniversal(
        "get",
        null,
        `event/${rid}`,
        setErrorMsg
      );
      setHistoryData(response);
    };
    
    useEffect(() => {
      if (open) fetchHistory();
    }, [open, rid]);
    


  return (
    <React.Fragment>
      <IconButton
        color="secondary"
        aria-label="send"
        size="small"
        onClick={()=>handleClickOpen()}
      >
        <Tooltip title="ประวัติการทำรายการ">
          <HistoryIcon />
        </Tooltip>
      </IconButton>
      <Dialog
        open={open}
        maxWidth='xl'
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-hndialog"
      >
        <DialogTitle>{"ประวัติการทำรายการ"}</DialogTitle>
        <DialogContent>
        <table className='HistoryTable'>
  <thead>
    <tr>
      <th>ลำดับ</th>
      <th>Action</th>
      <th>Remark</th>
      <th>ทำรายการเมื่อ</th>
      <th>ทำรายการโดย</th>
    </tr>
  </thead>
  <tbody>
    {HistoryData.length > 0 ? (
      HistoryData.map((row, index) => (
        <tr key={index}>
          <td>{index+1}</td>
          <td>{row.Action}</td>
          <td>{row.Remark}</td>
          <td>{formatDateTimeN7(row.CreateAt,7)}</td>
          <td>{row.CreatedStaffName}({row.CreatedBy})</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="3" style={{ textAlign: 'center' }}>
          {ErrorMsg || 'No data'}
        </td>
      </tr>
    )}
  </tbody>
</table>

        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}