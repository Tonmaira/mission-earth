import { useSocket } from "../context/SocketContext";
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import LoopIcon from '@mui/icons-material/Loop';
import Clock from "../components/Clock";
import axios from "axios";
import { useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

export default function Queue_Checkout() {
  const { queue } = useSocket();
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const [modehistory,setModeHistory] = useState(false); 
  const switchHistory = (bool) => {
    setModeHistory(bool);
  };
  const [open, setOpen] = useState(false);
  const [chkoutparams, setChkoutparams] = useState('');
  const handleClickOpen = (AN) => {
    setChkoutparams(AN)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [openun, setOpenun] = useState(false);
  const [unchkoutparams, setUnchkoutparams] = useState('');
  const handleClickOpenun = (AN) => {
    setUnchkoutparams(AN)
    setOpenun(true);
  };

  const handleCloseun = () => {
    setOpenun(false);
  };
  
  function QueueTime(mode,basetime) {
    const date = new Date();
    const formattedTimestamp = basetime?.replace("T", " ").replace("Z", "") || '';
    const date2 = new Date(formattedTimestamp);
    const h = date2.getHours();
    const mm = date2.getMinutes().toString().padStart(2, '0');
    const ss = date2.getSeconds().toString().padStart(2, '0');
    var timeShow = h + ':' + mm + ':' + ss;
    var dateDiff = (date - date2) / 60000; // to Set Alert
  
    var secoundDiff = Math.floor(((date.getTime() - date2.getTime()) / 1000) % 60),
        minsDiff = Math.floor(((date.getTime() - date2.getTime()) / 1000 / 60) % 60),
        hoursDiff = Math.floor((date.getTime() - date2.getTime()) / 1000 / 60 / 60);
  
    var timeDiff = minsDiff + 'm' + ':' + secoundDiff + 's';
  
    if (hoursDiff > 0) {
      timeDiff = hoursDiff + 'H' + ':' + minsDiff + 'm' + ':' + secoundDiff + 's';
    }
  
    if(mode==='diff') return timeDiff;
    if(mode==='time') return timeShow;
    if(mode==='show') return timeShow;
    if(mode==='ddiff') return dateDiff;
  }

  const rows = queue[0]?.map(q => ({
    ...q,
    diff: QueueTime('ddiff', q.CashierReadyDateTime),
    time: QueueTime('diff', q.CashierReadyDateTime),
    show: QueueTime('show', q.CashierReadyDateTime),
  }));

  const rows2 = queue[1]?.map(q => ({
    ...q,
    diff: QueueTime('ddiff', q.CashierReadyDateTime),
    time: QueueTime('diff', q.CashierReadyDateTime),
    show: QueueTime('show', q.CashierReadyDateTime),
  }));

  const ToCheckout = async (AN) => {
    try {
       await axios.post(`${apiUrl}/medlog`, {AN});
    } catch (error) {
      console.error("Error saving data:", error);
    }
    handleClose();
  };

  const ToUnCheckout = async (AN) => {
    try {
       await axios.delete(`${apiUrl}/medlog/${AN}`, null);
    } catch (error) {
      console.error("Error saving data:", error);
    }
    handleCloseun();
  };

  return (<>
  {console.log(chkoutparams)}
    <div className='QmedChkOutBorder'>

      <div className='QmedChkOutHeaderBorder'>
        <div className='Content'>
          <div className="Title">
          
            <div className={!modehistory ? 'CheckOutBtn Active' : 'CheckOutBtn InactiveL'} onClick={()=>switchHistory(false)}>รอจ่ายยา</div>
            <div className={!modehistory ? 'CheckOutBtn InactiveR' : 'CheckOutBtn Active'} onClick={()=>switchHistory(true)}>AN ที่จ่ายยาแล้ว</div>
          </div>
          <div className="Time"><Clock/></div>
        </div>
      </div>

    { !modehistory ?
      <div className='QmedChkOutMidFrame'>
        <div className='QmedChkOutMidBorder' style={{width:'100%'}}>
          <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
            <table className="QMEDCHKTable">
              <thead>
                <tr>
                  <th style={{width:'80px'}}>Active Bed</th>
                  <th style={{width:'100px'}}>AN</th>
                  <th >Name</th>
                  <th style={{width:'65px'}}>Checkout</th>
                  <th style={{width:'100px'}}>Cashier Ready</th>
                </tr>
              </thead>
              <tbody>
                {rows?.map((q, i) => (
                  <tr key={i} className={ q.diff > 15 ? 'QmedChkOutMidBorder_Row_Alert' : 'QmedChkOutMidBorder_Row' }>
                    <td>{q.ActiveHNBedNo}</td>
                    <td>{q.AN}</td>
                    <td className='NameClass' style={{fontSize:'15px'}}>{q?.FirstName+" "+q?.LastName}</td>
                    <td>
                      <IconButton aria-label="CheckOut" onClick={()=>handleClickOpen(q.AN)}>
                        <CheckIcon />
                      </IconButton>
                      {/* <ConfirmDialog open={open} setOpen={setOpen} Fn={ToCheckout} Params={q.AN} IsHistory={modehistory} Title={`เสร็จสิ้นรายการ? ${q.AN}`} /> */}
                    </td>
                    <td>{q.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    :
      <div className='QmedChkOutMidFrame'>
        <div className='QmedChkOutMidBorder' style={{width:'100%'}}>
          <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
            <table className="QMEDCHKTable">
              <thead>
                <tr>
                  <th style={{width:'80px'}}>Active Bed</th>
                  <th style={{width:'100px'}}>AN</th>
                  <th>Name</th>
                  <th style={{width:'65px'}}>Undo</th>
                  <th style={{width:'100px'}}>Cashier Ready</th>
                </tr>
              </thead>
              <tbody>
                {rows2?.map((q, i) => (
                  <tr key={i} className='QmedChkOutMidBorder_Row' >
                    <td>{q.ActiveHNBedNo}</td>
                    <td>{q.AN}</td>
                    <td className='NameClass' style={{fontSize:'15px'}}>{q?.FirstName+" "+q?.LastName}</td>
                    <td>
                      <IconButton aria-label="CheckOut" onClick={()=>handleClickOpenun(q.AN)}>
                        <LoopIcon />
                      </IconButton>
                    </td>
                    <td>{q.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    }
      
      <div style={{background:'#459D9C'}}/>

      <div className='QmedChkOutFooterBorder'>
        <div className='Content'>
        </div>
      </div>
      
    </div>

    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`รายการเสร็จสิ้น?`}
        </DialogTitle>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>ยกเลิก</Button>
          <Button variant="contained" onClick={()=>ToCheckout(chkoutparams)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openun}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`กู้คืนรายการ?`}
        </DialogTitle>
        <DialogActions>
          <Button variant="outlined" color="error" onClick={handleClose}>ยกเลิก</Button>
          <Button variant="contained" onClick={()=>ToUnCheckout(unchkoutparams)} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
  </>);
}