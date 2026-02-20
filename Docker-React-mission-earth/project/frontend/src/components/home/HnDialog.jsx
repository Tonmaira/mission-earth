import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APIFuncionUniversal } from '../../api/FunctionAPI';
import HocDocList from './HocDocList';


const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

  
    // const storedAuth = JSON.parse(localStorage.getItem("auth"));
    // const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
// import { APIFuncionUniversal } from '../../api/FunctionAPI';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HNDialog() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openRightList, setOpenRightList] = useState(false);
  const [rightList, setRightList] = useState(false);
  const [SearchValue , setSearchValue] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeDialogText = (event) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  const CheckCallingApi = async (searchvalue) => {
    localStorage.removeItem("localdata");
    localStorage.removeItem("localhn");
    localStorage.setItem("localhn", SearchValue); // input type text 
    localStorage.removeItem("localsearchvalue");
    localStorage.setItem("localsearchvalue", SearchValue); // input type text 
    
    try {
      const urlCheck = `${apiUrl}/hoc/VN/${searchvalue}`;
      const RightList = await axios.get(urlCheck);
      // if (RightList.status === 200 || RightList.status === 304) {
      //   handleCloseAndGotoMainRightPage(searchvalue);
      // }
      // console.log(RightList.data.length);

      if(RightList.data.length>0){
        console.log("Show Dialog");
        setRightList(RightList.data);
        setOpenRightList(true);
      } else {
        const url = `${apiUrl}/patinfo/vn/check/${searchvalue}`;
        const response = await axios.get(url);
        if (response.status === 200 || response.status === 304) {
          handleCloseAndGotoMainRightPage(searchvalue);
        }
      }
    } catch (err) {
      if (err.response) {
        alert(`ไม่พบ VN "${searchvalue}" `);
      } else {
        console.error("API error:", err.message);
      }
    }
  };

  const handleCloseAndGotoMainRightPage = (vn) => {
    setOpen(false);
    navigate(`/hoc/${vn}`);
  };

  return (
    <React.Fragment>
      <button className="DialogHNButton" variant="outlined" onClick={handleClickOpen}>
        สร้างเอกสาร
      </button>
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
        <DialogTitle>{"ค้นหา VN "}</DialogTitle>
        <DialogContent>
          <input className="DialogHNText" type="text" onChange={handleChangeDialogText}></input>
        </DialogContent>
        <DialogActions>
          <button className="DialogSearch" onClick={()=>CheckCallingApi(SearchValue)}>ค้นหา</button>
        </DialogActions>
      </Dialog>
      <HocDocList data={rightList} open={openRightList} setOpen={setOpenRightList} VN={SearchValue}/>
    </React.Fragment>
  );
}