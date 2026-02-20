import * as React from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { APIFuncionUniversal } from "../api/FunctionAPI";
import { useEffect } from "react";
import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import Divider from "@mui/material/Divider";
import { GenerateId } from "./Function";

const debug = false;

export default function FormulaDialog({ Mode,Type ,Id ,setLoading ,RightCode ,datarow, setDataList, dataList }) {
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const [load, setLoad] = useState(true); //OPD IPD
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]); 
  const [stockData, setStockData] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [formularName, setFormularName] = useState(''); //OPD IPD
  const [filterRightStock, setFilterRightStock] = useState(RightCode === '1700' && 'inter' || 'nor'); //other=nor 1700=inter
  const [filterStock, setFilterStock] = useState('opd'); //OPD IPD
  // const [filteredrightData, setFilteredRightData] = useState([]); //filter by right
  const [filteredstockData, setFilteredStockData] = useState([]); //final filtered
  const [selectedStock, setSelectedStock] = useState(null); //med stock
  const filterOptions = createFilterOptions();

  const handleClickOpen = () => {
    if(Type!=='editor')fetchData();
    if(Type==='editor')setEditorData();
    setLoad(true);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if(Type!=='editor')setLoading(true);
    setFormularName('');
    setData([]);
  };

  const HandleChangeRightOption = (e) => {
    const value = e.target.value;      // get the value of the input
    setFilterRightStock(value);
  };

  const HandleChangeStockOption = (e) => {
    const value = e.target.value;      // get the value of the input
    setFilterStock(value);
  };

  const deleteById = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
        setDataList(prev => prev.filter(item => item.id !== id));
    }
  };

  // const deleteMedFromIndex = (id) => {
  //   // if (window.confirm("Are you sure you want to delete this item?")) {
  //       setDataList(prev => prev.filter(item => item.Id !== id));
  //   // }
  // };

  const deleteMedFromIndex = (index) => {
    setData(prev => prev.filter((_, i) => i !== index));
  };

  const UpdateMedFromIndex = (id, newFormulaList) => {
    setDataList(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, FormulaList: newFormulaList }
          : item
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const tempid = GenerateId();

    const remarkMap = {
      new: `New ${tempid}`,
      add: "Add New To List",
      edit: "Edit List",
    };

    const payload = {
      // "Id" : tempid.toString(),
      "FormulaName" : formularName,
      "FormulaList" : JSON.stringify(data),
      "Remark" : remarkMap[Mode],
      "CreatedBy" : storedData.UserId,
    };

    console.log('payload',payload,storedData)

    const response = await APIFuncionUniversal(
          "post",
          payload,
          `formula`,
          setErrorMsg
        );

        if (response) {
          alert("บันทึกสำเร็จ");
          handleClose();
        } else {
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
  };

  
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    console.log(event);
    // const tempid = GenerateId();

    // const remarkMap = {
    //   new: `New ${tempid}`,
    //   add: "Add New To List",
    //   edit: "Edit List",
    // };

    const payload = {
      // "Id" : tempid.toString(),
      // "FormulaName" : formularName,
      "FormulaList" : JSON.stringify(data),
      // "Remark" : remarkMap[Mode],
      // "CreatedBy" : storedData.UserId,
    };

    // console.log('payload',data)

    const response = await APIFuncionUniversal(
          "put",
          payload,
          `formula/${Id}`,
          setErrorMsg
        );

        if (response) {
          alert("บันทึกสำเร็จ");
          handleClose();
        } else {
          alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        }
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault();
    // console.log(event)
    // console.log("data",data)
    UpdateMedFromIndex(Id,data);
    handleClose();
  };

  const handleChangeQuantity = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...data];
    updatedItems[index][name] = value;
    setData(updatedItems);
  };

  const CovertTypeToText = (type) => {
    if(type===1){
      return "IPD"
    } else if(type===2){
      return "OPD"
    } else if(type===8){
      return "OPD"
    } else if(type===10){
      return "IPD"
    } else {return "*"}
    
  }
  const HandleChangeData = (e) => {
    const value = e.target.value;      // get the value of the input
    // update the corresponding field in InsData
    setFormularName(value);
  };

const fetchData = async () => {

  console.log(Id)

    const [stock] = await Promise.all([
      APIFuncionUniversal("get", null, "stock", setErrorMsg),
    ]);
    const stockDataUnique = stock.map((item, index) => ({
      ...item,
      key: `${item.StockCode}_${index}`,
    }));
    setStockData(stockDataUnique);

    if(Mode!=='new'){
      const [formula] = await Promise.all([
        APIFuncionUniversal("get", null, `formula/${Id}`, setErrorMsg),
      ]);
      // console.log(Id)
      // console.log(formula)
      setFormularName(formula.FormulaName)
      setData(formula.FormulaList)
    }
    setLoad(false)
  };

  const setEditorData = async () => {

    console.log(Id)
  
      const [stock] = await Promise.all([
        APIFuncionUniversal("get", null, "stock", setErrorMsg),
      ]);
      const stockDataUnique = stock.map((item, index) => ({
        ...item,
        key: `${item.StockCode}_${index}`,
      }));
      setStockData(stockDataUnique);
  
      // if(Mode!=='new'){
      //   const [formula] = await Promise.all([
      //     APIFuncionUniversal("get", null, `formula/${Id}`, setErrorMsg),
      //   ]);
        // console.log(Id)
        setFormularName(datarow.FormulaName)
        setData(datarow.FormulaList)
        // console.log(formula.FormulaList)
        // console.log(datarow,Id)
      // }
      setLoad(false)
    };

  const filterStockByRightCode = (data) => {
    const validTypes = filterRightStock === 'inter' ? [8, 10] : [1, 2];
    return data.filter(item => validTypes.includes(item.SKMasterFixSalesPriceType));
  };

  const filterDataStockbytype = (data) => {
    const validTypes = filterStock === 'opd' ? [2, 8] : [1,10];
    return data.filter(item => validTypes.includes(item.SKMasterFixSalesPriceType));
  };

  useEffect(() => {
    if (stockData) {
      const rightFiltered = filterStockByRightCode(stockData);
      const finalFiltered = filterDataStockbytype(rightFiltered);
  
      // setFilteredRightData(rightFiltered);
      setFilteredStockData(finalFiltered);
    }
  }, [filterStock, filterRightStock, stockData]);
  

    const AddMedToList = () => {
        if (selectedStock) {
            setData((prevList) => {
            // หา index ของยาใน list (ใช้ทั้ง StockCode และ SKMasterFixSalesPriceType)
            const existingIndex = prevList.findIndex(
              item =>
                item.StockCode === selectedStock.StockCode &&
                item.SKMasterFixSalesPriceType === selectedStock.SKMasterFixSalesPriceType
            );
      
            if (existingIndex !== -1) {
              // ✅ ถ้ามีอยู่แล้ว ให้บวก Quantity + 1
              const updatedList = [...prevList];
              const currentQty = updatedList[existingIndex].Quantity || 0;
              updatedList[existingIndex] = {
                ...updatedList[existingIndex],
                Quantity: currentQty + 1,
              };
              return updatedList;
            }
      
            // ✅ ถ้ายังไม่มี ให้เพิ่มใหม่พร้อม Quantity = 1
            return [...prevList, { ...selectedStock, Quantity: 1 }];
          });
        } else {
          window.alert(`โปรดเลือกจากรายการยาก่อนกดปุ่ม "+" !!`);
        }
      
        // ✅ เคลียร์ค่า Autocomplete หลังเพิ่ม
        setSelectedStock(null);
      };
      
      // useEffect(() => {
      //       if (open,load) {
      //           fetchData();
              
      //       }
      //     }, [load]);

  return (
    <React.Fragment>
      {Mode === "new" && (
        <Button variant="outlined" onClick={handleClickOpen}>
          เพิ่มสูตรยา
        </Button>
      )}
      {Mode === "add" && (
        <Button variant="outlined" onClick={handleClickOpen}>
          เพิ่มสูตรยา
        </Button>
      )}
      {Mode === "edit" && (<>
        <Stack direction="row" spacing={0.25}>
          <IconButton
            color="primary"
            aria-label="add an alarm"
            size="small"
            onClick={handleClickOpen}
          >
            <EditIcon />
          </IconButton>
          {Type==="editor" && 
            <IconButton aria-label="delete" size="small" color="" onClick={() => deleteById(Id)}>
              <DeleteIcon />
            </IconButton>
          }
        </Stack>
      </>
      )}

      <Dialog 
        fullScreen
        // fullWidth
        // maxWidth='lg'
        open={open} 
        onClose={handleClose} 
        // maxWidth={200}
        
      >
        {debug && (
          <>
            <>Type = &nbsp;{Type}&nbsp;||&nbsp;Mode = {Mode}</>
            
          </>
          )}

        <DialogTitle>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"5px"}}>
            { Type==='add' &&
              <>
                {Mode === "new" && (<><div>ชื่อ : </div><input type="text" className="Inputhoc" name="diagnosis" onChange={HandleChangeData} value={formularName}/></>)}
                {!load && Mode === "edit" && `แก้ไขสูตรยา : ${formularName}`}
              </>
            }

            {Type==='editor' &&
              <>
                {Mode === "new" && (<><div>ชื่อ : </div><input type="text" className="Inputhoc" name="diagnosis" onChange={HandleChangeData} value={formularName}/></>)}
                {Mode === "add" && `เพิ่มสูตรยา ${datarow?.FormulaName}`}
                {Mode === "edit" && `แก้ไขสูตรยา : ${datarow?.FormulaName}`}
              </>
            }
            <IconButton aria-label="delete" size="large" onClick={handleClose}>
              <ClearIcon fontSize="inherit" />
            </IconButton>
            {/* <Button sx={{marginRight:"10px"}} onClick={handleClose} variant="outlined" color="primary">ยกเลิก</Button> */}
            {/* <span>{datarow?.FormulaName}</span> */}
          </div>
        </DialogTitle>
        <DialogContent sx={{backgroundColor:'#f5f5f5',display:'flex'}}>
        <div className="MainFormHoc" >
          
            <table className="HOCTable">
              <thead>
                <tr>
                  <th
                    colSpan={2}
                    style={{ width: "700px", textAlign: "center" }}
                  >
                    <div>
                      <span>รายการค่าใช้จ่าย</span>
                    </div>{" "}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <div>
                      <span>ราคาต่อชิ้น</span>
                    </div>{" "}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <div>
                      <span>จำนวน</span>
                    </div>{" "}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <div>
                      <span>ราคา</span>
                    </div>{" "}
                  </th>
                  <th style={{ textAlign: "center" }}>
                    <div>
                    </div>{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Loop Map List */}
                
                {/* {console.log(data)} */}
                {/* {Mode} */}

                {/* {Mode !== "new" && console.log(datarow)} */}
                {data && data.map((item,index)=>(
                <tr key={item.key}>
                {/* {console.log(item)} */}
                  <td colSpan={2}>
                    <div className="selectedItemListName">
                      {/* &nbsp;-&nbsp;[{CovertTypeToText(item.SKMasterFixSalesPriceType)}]&nbsp;<span>{item.StockCode}</span> */}
                      &nbsp;<span>{item.Name}</span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <div className="selectedItemListName">{item.UnitPrice1.toFixed(2)}</div>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <div className="selectedItemListName">
                      {
                        Mode !== 'show' && storedData.UserType === 1 ? 
                          <input
                            key={item.id}
                            type="text"//todo
                            className="Inputhoc"
                            name="Quantity"
                            value={item.Quantity}
                            onChange={(e) => handleChangeQuantity(e, index)}
                          />
                          : item.Quantity
                      }
                      </div>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <div className="selectedItemListName">{(item.UnitPrice1*item.Quantity).toFixed(2)}</div>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      {/* <div className="selectedItemListName">{(item.UnitPrice1*item.Quantity).toFixed(2)}</div> */}
                      <IconButton aria-label="delete" color="error" onClick={() => deleteMedFromIndex(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>{" "}
                  </td>
                  
                </tr>
              ))}

              {Array.from({ length: 3 - data.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={2}>
                    <div className="selectedItemListName">&nbsp;&nbsp;</div>
                  </td>
                  <td><div className="selectedItemListName"></div></td>
                  <td><div className="selectedItemListName"></div></td>
                  <td><div className="selectedItemListName"></div></td>
                  <td><div className="selectedItemListName"></div></td>
                </tr>
              ))}
              
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
        {/* <div className="MainFormHoc" > */}
            <table className="HOCTable">
              <tbody>
              
              {(storedData.UserType === 1) && stockData && (
                <tr className="AddButtonRow HiddenDiv">
                  <td colSpan={5} style={{ textAlign: "center", color:"#"}}>
                    <div className="HOCradioList">
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="filterRightStock"
                          value='nor'
                          checked={filterRightStock === 'nor'}
                          onChange={HandleChangeRightOption}
                        />
                        <label>Normal</label>
                      </div>
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="filterRightStock"
                          value='inter'
                          checked={filterRightStock === 'inter'}
                          onChange={HandleChangeRightOption}
                        />
                        <label>International</label>
                      </div>
                    </div>

                    <Divider orientation="vertical" flexItem />

                    <div className="HOCradioList">
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="filterStock"
                          value='opd'
                          checked={filterStock === 'opd'}
                          onChange={HandleChangeStockOption}
                        />
                        <label>OPD</label>
                      </div>
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="filterStock"
                          value='ipd'
                          checked={filterStock === 'ipd'}
                          onChange={HandleChangeStockOption}
                        />
                        <label>IPD</label>
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {(storedData.UserType === 1) && filteredstockData && (
                <tr className="AddButtonRow HiddenDiv">
                  <td colSpan={4} style={{ textAlign: "center", color:"#"}}>
                      <Autocomplete
                        className="AutoCompleteCustom"
                        disablePortal
                        options={filteredstockData}
                        getOptionLabel={(option) => `${option.Name}`}
                        renderOption={(props, option) => (
                          <li
                            {...props}
                            key={option.key}
                          >
                            {`${option.Name}`}
                          </li>
                        )}

                        value={selectedStock}
                        onChange={(event, newValue) => {
                          // ✅ ตั้งค่า value ปัจจุบัน
                          setSelectedStock(newValue);
                        }}
                        sx={{ width: "100%" ,minHeight:"500px"}}
                        renderInput={(params) => (
                          <TextField {...params} label={load ? "Loading...":"พิมพ์เพื่อค้นหา..."} />
                        )}
                        disabled={load}
                        filterOptions={(options, state) =>
                          filterOptions(options, state).slice(0, 15) // 👈 limit to 15
                        }
                      />
                  </td>
                  <td colSpan={1} style={{ textAlign: "center",width:"100px"}}>
                    <div className="AddMedBtn" onClick={AddMedToList}>
                      <AddCircleOutlineIcon />
                    </div>
                  </td>
                </tr>
              )}
              
              <tr className="AddButtonRow HiddenDiv">
                  <td colSpan={5} style={{textAlign:"end"}}>
                    <Button sx={{marginRight:"10px"}} onClick={handleClose} variant="outlined" color="primary">ยกเลิก</Button>
                    {Type==="add" &&(
                      <>
                        {Mode === 'new' && <Button onClick={handleSubmit} variant="contained" color="primary">บันทึก</Button>}
                        {Mode === 'edit' && <Button onClick={handleUpdateSubmit} variant="contained" color="primary">บันทึกการแก้ไข</Button>}
                      </>
                    )}
                    {Type==="editor" &&(
                      <>
                        {Mode === 'edit' && <Button onClick={handleSubmitEdit} variant="contained" color="primary">เพิ่ม</Button>}
                      </>
                    )}
                  </td>
                </tr>

              </tbody>
            </table>
          {/* </div> */}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
