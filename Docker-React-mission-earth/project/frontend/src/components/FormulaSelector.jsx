import React, { useEffect, useRef, useState } from "react";
// import "./../../style/home.css";
// import "./../../style/right.css";
import { APIFuncionUniversal } from "../api/FunctionAPI";
// import RightInfo from "../../components/rightdialog/right_info";
// import RightIns from "../../components/rightdialog/right_ins";
// import RightEtc from "../../components/rightdialog/right_etc";
// import RightVitalsign from "../../components/rightdialog/right_vitalsign";
// import RightChecklist from "../../components/rightdialog/right_Checklist";
// import RightOrder from "../../components/rightdialog/right_order";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoIMG from "../assets/logo-color.png";
import { CalculateAge, formatShortDate } from "../components/Function";
import { Autocomplete, TextField } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { PrintPageComponent } from "../components/printpage";


function FormulaSelector({ Mode }) {
  const componentRef = useRef(null);
  const storedData = JSON.parse(localStorage.getItem("userData"));
  const localsearchvalue = localStorage.getItem("localsearchvalue");
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [ErrorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const filterOptions = createFilterOptions();
  const [doctorData, setDoctorData] = useState([]);
  const [clinicData, setClinicData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [patInfo, setPatInfo] = useState([]);
  const [filterStock, setFilterStock] = useState('opd'); //false=OPD true=IPD
  const [filteredstockData, setFilteredStockData] = useState([]);
  
  const [InfoData, setInfoData] = useState({
    fullname: "",
    hn: "",
    rightcode:"",
    vn: "",
    birthday: "",
    gender: "",
    visitcodename: "",
    clinic: "",
    doctor: "",
    remark: "",
    visitdate: "",
  });
  const [InsData, setInsData] = useState({
    patienttype:"2",
    diagnosis:"",
    treatment:"",
    admdate:"",
    right:"",
  });
  const [selectedStock, setSelectedStock] = useState(null); //med stock
  const [listData, setListData] = useState([]); //med stock
  // const [selectedEquipmentStock, setSelectedEquipmentStock] = useState(null); //med eqstock
  // const [listEquipmentData, setListEquipmentData] = useState([]); //med eqstock
  const equDefaultData = {
    equipment: {
      equipment:"",
      medequipment: "",
      price:0,
      qty:0,
    },
    etc: {
      etc:"",
      medmix: "",
      price:0,
      qty:0,
    },
    lab: {
      lab:"",
      price:0,
      qty:0,
    },
    radiology: {
      radiology:"",
      price:0,
      qty:0,
    },
    special: {
      special:"",
      price:0,
      qty:0,
    },
    diagnostic: {
      diagnostic:"",
      df: "",
      price:0,
      qty:0,
    },
    service: {
      price:0,
      qty:0,
    },
  };
  const [EquData, setEquData] = useState(equDefaultData);
  const rmsDefaultData = {
    room: {
      price:0,
      qty:0,
    },
    nursing: {
      price:0,
      qty:0,
    },
    food: {
      price:0,
      qty:0,
    },
    services: {
      price:0,
      qty:0,
    },
  };
  const [RoomData, setRoomData] = useState(rmsDefaultData);

  const filterDataStockbytype = (type) => {
    const validTypes = type === 'opd' ? [2, 8] : [1,10];
    return stockData.filter(item => validTypes.includes(item.SKMasterFixSalesPriceType));
  };

  const fetchData = async () => {
    let patinfoPromise;

    switch (Mode) {
      case "new":
        patinfoPromise = APIFuncionUniversal(
          "get",
          null,
          `patinfo/vn/${localsearchvalue}`,
          setErrorMsg
        );
        break;
      case "proceed":
        patinfoPromise = APIFuncionUniversal("get", null , `hoc/${id}`, setErrorMsg);
        break;
      case "show":
        patinfoPromise = APIFuncionUniversal("get", null , `hoc/${id}`, setErrorMsg);
      break;
      case "edit":
        patinfoPromise = APIFuncionUniversal("get", null , `hoc/${id}`, setErrorMsg);
      break;
      default:
        patinfoPromise = Promise.resolve(null); // fallback if Mode is something else
    }

    const [doctor, clinic, stock,patinfo] = await Promise.all([
      APIFuncionUniversal("get", null, "doctor", setErrorMsg),
      APIFuncionUniversal("get", null, "clinic", setErrorMsg),
      APIFuncionUniversal("get", null, "stock", setErrorMsg),
      patinfoPromise,
    ]);

    // console.log(patinfo)

    const stockDataUnique = stock.map((item, index) => ({
      ...item,
      key: `${item.StockCode}_${index}`,
    }));

    const filterStockByRightCode = () => {
      const validTypes = patinfo.RightCode === '1700' ? [8, 10] : [1, 2];
      return stockDataUnique.filter(item => validTypes.includes(item.SKMasterFixSalesPriceType));
    };
    
    setDoctorData(doctor);
    setClinicData(clinic);
    setStockData(filterStockByRightCode());
    setFilteredStockData(filterDataStockbytype(filterStock));
    setPatInfo(patinfo);

    if (patinfo && Mode === "new") {
      setInfoData({
        fullname: patinfo?.FullName || "",
        vn: patinfo?.VN || "",
        hn: patinfo?.HN || "",
        rightcode: patinfo?.RightCode || "",
        birthday: patinfo?.BirthDateTime || "",
        gender: patinfo?.Gender || "",
        clinic: patinfo?.Clinic || "",
        doctor: patinfo?.Doctor || "",
        visitdate: patinfo?.VisitDate || "",
      });
    } else {
      setInfoData({
        fullname: patinfo?.FormData?.InfoData?.fullname,
        hn: patinfo?.FormData?.InfoData?.hn,
        vn: patinfo?.FormData?.InfoData?.vn,
        rightcode: patinfo?.FormData?.InfoData?.rightcode,
        birthday: patinfo?.FormData?.InfoData?.birthday,
        gender: patinfo?.FormData?.InfoData?.gender,
        clinic: patinfo?.FormData?.InfoData?.clinic,
        doctor: patinfo?.FormData?.InfoData?.doctor,
        visitdate: patinfo?.FormData?.InfoData?.visitdate,
      });
      setInsData({
        patienttype: patinfo?.FormData?.InsData?.patienttype,
        diagnosis: patinfo?.FormData?.InsData?.diagnosis,
        treatment: patinfo?.FormData?.InsData?.treatment,
        admdate: patinfo?.FormData?.InsData?.admdate,
        right: patinfo?.FormData?.InsData?.right, 
      });
      setListData(patinfo?.FormData?.listData || []);
      // setListEquipmentData(patinfo?.FormData?.listEquipmentData || []);
      setEquData(patinfo?.FormData?.EquData || equDefaultData);
      setRoomData(patinfo?.FormData?.RoomData || rmsDefaultData);
    }

    setLoading(false);
  };

  // const verifyFormData = () => { //TODO
  //   const requiredFields = ["hn", "vn"];
  //   const missingFields = requiredFields.filter(
  //     (field) => !InfoData[field] || InfoData[field].trim() === ""
  //   );
  //   if (missingFields.length > 0) {
  //     alert(`กรุณากรอกข้อมูล: ${missingFields.join(", ")}`);
  //     return false;
  //   }
  //   return true;
  // };

  const HandleChangeInsData = (e) => {
    const nameElement = e.target.name; // get the name attribute of the input
    const value = e.target.value;      // get the value of the input
  
    // update the corresponding field in InsData
    setInsData(prev => ({
      ...prev,
      [nameElement]: value
    }));
  };

  const HandleChangeStockOption = (e) => {
    const value = e.target.value;      // get the value of the input
  
    // update the corresponding field in InsData
    setFilterStock(value);
  };

  const HandleChangeEquData = (e) => {
    const { name, value, dataset } = e.target;
    const topic = dataset.topic;
  
    setEquData((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [name]: value,
      },
    }));
  };  
  
  const HandleChangeRmsData = (e) => {
    const { name, value, dataset } = e.target;
    const topic = dataset.topic;
  
    setRoomData((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [name]: value,
      },
    }));
  };
  
  const TotalMedList = (data) => {
    const total = data.reduce((sum, item) => {
      const price = Number(item.UnitPrice1) || 0;
      const qty = Number(item.Quantity) || 0;
      return sum + price * qty;
    }, 0);
  
    return total;
  };
  
  const TotalObject = (data) => {
    const total = Object.values(data).reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 0;
      return sum + price * qty;
    }, 0);
  
    return total;
  };
  
  const TotalOverall = () => {
    const listtotal = listData.length>0 ? TotalMedList(listData) : 0 ;
    return (listtotal+TotalObject(EquData)+TotalObject(RoomData)).toFixed(2);
  }

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
  
  const AddMedToList = () => {
    if (selectedStock) {
      setListData((prevList) => {
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

  // const AddEquipmentToList = () => {
  //   if (selectedStock) {
  //     setListEquipmentData((prevList) => {
  //       // หา index ของยาใน list (ใช้ทั้ง StockCode และ SKMasterFixSalesPriceType)
  //       const existingIndex = prevList.findIndex(
  //         item =>
  //           item.StockCode === selectedStock.StockCode &&
  //           item.SKMasterFixSalesPriceType === selectedStock.SKMasterFixSalesPriceType
  //       );
  
  //       if (existingIndex !== -1) {
  //         // ✅ ถ้ามีอยู่แล้ว ให้บวก Quantity + 1
  //         const updatedList = [...prevList];
  //         const currentQty = updatedList[existingIndex].Quantity || 0;
  //         updatedList[existingIndex] = {
  //           ...updatedList[existingIndex],
  //           Quantity: currentQty + 1,
  //         };
  //         return updatedList;
  //       }
  
  //       // ✅ ถ้ายังไม่มี ให้เพิ่มใหม่พร้อม Quantity = 1
  //       return [...prevList, { ...selectedStock, Quantity: 1 }];
  //     });
  //   } else {
  //     window.alert(`โปรดเลือกจากรายการยาก่อนกดปุ่ม "+" !!`);
  //   }
  
  //   // ✅ เคลียร์ค่า Autocomplete หลังเพิ่ม
  //   setSelectedEquipmentStock(null);
  // };
  
  const handleChangeQuantity = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...listData];
    updatedItems[index][name] = value;
    setListData(updatedItems);
  };

  // const handleChangeQuantityEQ = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedItems = [...listData];
  //   updatedItems[index][name] = value;
  //   setListEquipmentData(updatedItems);
  // };

  const handleSubmitButton = async () => {
    // if (!verifyFormData()) return;

    const TempformData = {
      InfoData
      ,InsData
      ,listData
      ,EquData
    }

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status:4,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType:storedData.UserType,
    };

    const response = await APIFuncionUniversal(
      "post",
      payload,
      "hoc",
      setErrorMsg
    );
    if (response) {
      alert("ส่งตรวจสอบสิทธิสำเร็จ");
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาดในการส่งตรวจสอบสิทธิ");
    }
  };

  const handleSubmitDraftButton = async () => {
    // if (!verifyFormData()) return;

    const TempformData = {
      InfoData
      ,InsData
      ,listData
      ,EquData
    }

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status:3,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType:storedData.UserType,
    };

    const response = await APIFuncionUniversal(
      "post",
      payload,
      "hoc",
      setErrorMsg
    );
    if (response) {
      alert("ส่งตรวจสอบสิทธิสำเร็จ");
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาดในการส่งตรวจสอบสิทธิ");
    }
  };
  
  const handleReSubmitButton = async () => {//TODO
    // if (!verifyFormData()) return;

    let prestatus;
    if(storedData.UserType===2){
      prestatus = 1;
    } else if(storedData.UserType===3){
      prestatus = 4;
    }

    const TempformData = {
      InfoData
      ,InsData
      ,listData
      ,EquData
    }

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status:prestatus,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType:storedData.UserType,
    };

    const response = await APIFuncionUniversal(
      "put",
      payload,
      `hoc/${id}`,
      setErrorMsg
    );
    if (response) {
      alert("ส่งตรวจสอบสิทธิสำเร็จ");
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาดในการส่งตรวจสอบสิทธิ");
    }
  };

  const handleEditProceedButton = async () => { //TODO
    // if (!verifyFormData()) return;

    let preprocess;
    if(storedData.UserType===1){
      preprocess = 4;
    } else if(storedData.UserType===2){
      preprocess = 7;
    } else if(storedData.UserType===3){
      preprocess = 10;
    }

    const TempformData = {
      InfoData
      ,InsData
      ,listData
      ,EquData
    }

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status: preprocess,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType: storedData.UserType,
    };

    const response = await APIFuncionUniversal(
      "put",
      payload,
      `hoc/${id}`,
      setErrorMsg
    );
    if (response) {
      alert("ส่งตรวจสอบสิทธิสำเร็จ");
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาดในการส่งตรวจสอบสิทธิ");
    }
  };

  useEffect(() => {
    if (loading) {
      fetchData();
      // setFilteredStockData(filterDataStockbytype(filterStock));
      // setData(demodata);
    }
  }, [loading]);

  useEffect(() => {
    if (stockData) {
      setFilteredStockData(filterDataStockbytype(filterStock));
      // setData(demodata);
    }
  }, [filterStock,stockData]);

  const StatusConvert = (value) => {
    switch (value) {
      case 1:
        return "รอตรวจสอบข้อมูล(เภสัช)"; // 1
      case 2:
        return "กำลังตรวจสอบข้อมูล(เภสัช)"; // 1
      case 3:
        return "แบบร่าง(เภสัช)"; // 1
      case 4:
        return "รอตรวจสอบข้อมูล(พยาบาล)"; // 1 2
      case 5:
        return "กำลังตรวจสอบข้อมูล(พยาบาล)"; // 1 2
      case 6:
        return "แบบร่าง(พยาบาล)"; // 1 2
      // case 7:
      //   return "รอตรวจสอบข้อมูล(ประสานสิทธิ)"; // 1 2 3
      // case 8:
      //   return "กำลังตรวจสอบข้อมูล(ประสานสิทธิ)"; // 1 2 3
      // case 9:
      //   return "แบบร่าง(ประสานสิทธิ)"; // 1 2 3
      // case 10:
      //   return "ตรวจสอบแล้ว(ประสานสิทธิ)"; // 1 2 3
      // case 11:
      //   return "พิมพ์เอกสารแล้ว"; // 1 2 3
      case 7:
        return (
          <>
            เสร็จสิ้น <CheckCircleIcon color="success" />
          </>
        ); // 1 2 3
      case 8:
        return `พิมพ์เอกสารแล้ว`;
      default:
        return "-";
    }
  };

  const HandlePrintHoc = async (ref) => {
    let preprocess;
    if(patInfo.Status===10){
      preprocess = 11;
    } 
    alert(
      `ID [${patInfo.id}] : ${StatusConvert(patInfo.Status)} -> ${StatusConvert(preprocess)}`
    );
    const payload = {
            id: patInfo.id
            ,Status:preprocess
            ,CreatedBy: storedData.UserId
          }
      
          await APIFuncionUniversal(
            "put",
            payload,
            `hoc/status/${patInfo.id}`,
            setErrorMsg
          );
          await PrintPageComponent(ref)
  };

  return (
    <div ref={componentRef}>
      <div className="print-area">

        {/* <div className="pageborderA4"> */}
          <div className="MainFormHoc">
            <table className="HOCTable">
              <thead>
                <tr>
                  <th colSpan={4} style={{ textAlign: "center" }}>
                    <div className="HOCTableHeader">
                      <img src={LogoIMG} width={200}></img>
                      {/* <div className="HiddenDiv">
                        Demo Page | Mode : {Mode} | Status :{" "}
                        {Mode === "new" ? "New" : "!new"} | id : {id}
                      </div> */}
                      {Mode==='show' && patInfo.Status===10 && <div className="PrntBTN HiddenDiv" onClick={()=>HandlePrintHoc(componentRef)}>🖨️&nbsp;พิมพ์เอกสาร</div>}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan={4}>
                    <div>
                      <span>ชื่อ</span> :{" "}
                      <span className="HocData">{InfoData?.fullname}</span>
                    </div>{" "}
                  </th>
                </tr>
                <tr>
                  <td>
                    <div>
                      <span>เกิดวันที่</span> :{" "}
                      <span className="HocData">
                        {formatShortDate(InfoData.birthday) || ""}
                      </span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span>อายุ</span> :{" "}
                      <span className="HocData">
                        {InfoData.birthday ? CalculateAge(InfoData.birthday) : 0}
                      </span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span>เพศ</span> :{" "}
                      <span className="HocData">{InfoData?.gender}</span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span>HN</span> :{" "}
                      <span className="HocData">{InfoData?.hn}</span>
                    </div>{" "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <span>คลินิก</span> :{" "}
                      <span className="HocData">
                        {
                          clinicData
                            ? clinicData.find(d => d.ClinicCode === InfoData?.clinic)?.ClinicNameThai || InfoData?.clinic
                            : InfoData?.clinic
                        }
                      </span>
                    </div>{" "}
                  </td>
                  <td colSpan={2}>
                    <div>
                      <span>แพทย์</span> :{" "}
                      <span className="HocData">
                        {
                          doctorData
                            ? doctorData.find(d => d.Doctor === InfoData?.doctor)?.LocalName || InfoData?.doctor
                            : InfoData?.doctor
                        }
                      </span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span>VN</span> :{" "}
                      <span className="HocData">{InfoData?.vn}</span>
                    </div>{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3}>
                    <div>
                      <span>สิทธิการรักษา</span> :{" "}
                      <span className="HocData">
                        {InfoData.rightcode ? 
                          (
                            InfoData.rightcode==="1700" ? `International Services (${InfoData.rightcode})` : `สิทธิการรักษาทั่วไป (${InfoData.rightcode})`
                          )
                          :"-"
                          }
                      </span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span>VN Date Time</span> :{" "}
                      <span className="HocData">
                        {formatShortDate(InfoData?.visitdate)}
                      </span>
                    </div>{" "}
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <div className="HOCradioList">
                      <div>ประเภทผู้ป่วย</div>&nbsp;:&nbsp;
                      {Mode !== 'show' && storedData.UserType === 1 ? <>
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="patienttype"
                          value="1"
                          checked={InsData.patienttype === '1'}
                          onChange={HandleChangeInsData}
                        />
                        <label>ผู้ป่วยเก่า</label>
                      </div>
                      <div className="HOCradioOption">
                        <input
                          type="radio"
                          name="patienttype"
                          value="2"
                          checked={InsData.patienttype === '2'}
                          onChange={HandleChangeInsData}
                        />
                        <label>ผู้ป่วยใหม่</label>
                      </div>
                      </>
                      :
                        InsData.patienttype === '1' ? `ผู้ป่วยเก่า` : `ผู้ป่วยใหม่`
                      }
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="MainFormHoc">
            <table className="HOCTable">
              <thead>
                <tr>
                  <th colSpan={4} style={{ textAlign: "center" }}>
                    <div>
                      <span>แบบประเมินค่าใช้จ่ายด้านการรักษาพยาบาล (HOC)</span>
                    </div>{" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3}>
                    <div className="HocInputBox">
                      <div>{`การวินิจฉัย : `}</div>
                      <div className="HocData">
                        {
                          Mode !== 'show' && storedData.UserType === 1 ? 
                            <input type="text" className="Inputhoc" name="diagnosis" onChange={HandleChangeInsData} value={InsData.diagnosis || ""}/>
                            : InsData.diagnosis
                        }
                      </div>
                    </div>{" "}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>
                      <div>{`การรักษา `}</div>
                      <div className="HocData">
                        {
                          Mode !== 'show' && storedData.UserType === 1 ? 
                            <input type="text" className="Inputhoc" name="treatment" onChange={HandleChangeInsData} value={InsData.treatment || ""}/>
                            : InsData.treatment
                        }
                      </div>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <div>{`วันที่เริ่มรับการรักษา `}</div>
                      <div className="HocData">
                      {
                        Mode !== 'show' && storedData.UserType === 1 ? 
                          <input
                            type="date"
                            className="SearchBox_Item_Input_DatePicker"
                            onChange={HandleChangeInsData}
                            name="admdate"
                            value={InsData.admdate || ""}
                          />
                          : formatShortDate(InsData.admdate)
                        }
                      </div>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                    <div>{`สิทธิ `}</div>
                      <div className="HocData">
                        {
                          Mode !== 'show' && storedData.UserType === 1 ? 
                            <input type="text" className="Inputhoc" name="right" onChange={HandleChangeInsData} value={InsData.right || ""}/>
                            : InsData.right
                        }
                      </div>
                    </div>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        {/* <div className="pageborderA4"> */}

          <div className="MainFormHoc">
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
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th colSpan={5}>
                    <div>
                      <span>1.ยาเคมีบำบัด/ยาภูมิคุ้มกัน/ยามุ่งเป้า</span>
                    </div>{" "}
                  </th>
                </tr>
                {/* Loop Map List */}
                {listData.map((item,index)=>(
                <tr key={item.key}>
                  <td colSpan={2}>
                    <div className="selectedItemListName">
                      &nbsp;-&nbsp;[{CovertTypeToText(item.SKMasterFixSalesPriceType)}]&nbsp;<span>{item.StockCode}</span>
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
                            type="text"
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
                </tr>
              ))}
              {/* Loop End */}

              {/* Render empty rows */}
              {Array.from({ length: 10 - listData.length }).map((_, idx) => (
                <tr key={`empty-${idx}`}>
                  <td colSpan={2}>
                    <div className="selectedItemListName">&nbsp;-&nbsp;</div>
                  </td>
                  <td><div className="selectedItemListName"></div></td>
                  <td><div className="selectedItemListName"></div></td>
                  <td><div className="selectedItemListName"></div></td>
                </tr>
              ))}
              {/* Loop End */}
              {(Mode !== 'show' && storedData.UserType === 1) && stockData && (
                <tr className="AddButtonRow HiddenDiv">
                  <td colSpan={5} style={{ textAlign: "center", color:"#"}}>
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
                        {/* filter : {filterStock} */}
                      </div>
                    </div>
                  </td>
                </tr>
              )}

              {(Mode !== 'show' && storedData.UserType === 1) && filteredstockData && (
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
                            {`[${CovertTypeToText(option.SKMasterFixSalesPriceType)}] (${option.StockCode}) ${option.Name.slice(1)} ${option.UnitPrice1.toFixed(2)} บาท`}
                          </li>
                        )}

                        value={selectedStock}
                        onChange={(event, newValue) => {
                          // ✅ ตั้งค่า value ปัจจุบัน
                          setSelectedStock(newValue);
                        }}
                        sx={{ width: "100%" ,minHeight:"500px"}}
                        renderInput={(params) => (
                          <TextField {...params} label="พิมพ์เพื่อค้นหา..." />
                        )}
                        // disabled
                        filterOptions={(options, state) =>
                          filterOptions(options, state).slice(0, 15) // 👈 limit to 15
                        }
                      />
                  </td>
                  <td colSpan={1} style={{ textAlign: "center" }}>
                    <div className="AddMedBtn" onClick={AddMedToList}>
                      <AddCircleOutlineIcon />
                    </div>
                  </td>
                </tr>
              )}

                {Mode !== "new" && (
                  <>
                    <tr>
                      <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.2</div>&nbsp;
                          <div>เวชภัณฑ์</div>&nbsp;:&nbsp;
                          <div className="HocData">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="equipment"
                              data-topic="equipment"
                              value={EquData.equipment.equipment || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.equipment.equipment)
                          }
                          </div>
                          &nbsp;
                          <div>อุปกรณ์เวชภัณฑ์</div>&nbsp;:&nbsp;
                          <div className="HocData">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="medequipment"
                              data-topic="equipment"
                              value={EquData.equipment.medequipment || ""}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.equipment.medequipment
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="equipment"
                              value={EquData.equipment.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.equipment?.price || 0).toFixed(2)

                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="equipment"
                              value={EquData.equipment.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData.equipment.qty || 0)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.equipment.price || 0)*(EquData.equipment.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.3</div>&nbsp;
                          <div>อื่นๆ</div>&nbsp;:&nbsp;
                          <div className="HocData">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="etc"
                              data-topic="etc"
                              value={EquData.etc.etc || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.etc.etc)
                          }
                          </div>
                          &nbsp;
                          <div>ค่าผสมยา</div>&nbsp;:&nbsp;
                          <div className="HocData">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="medmix"
                              data-topic="etc"
                              value={EquData.etc.medmix || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.etc.medmix)
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="etc"
                              value={EquData.etc.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.etc?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="etc"
                              value={EquData.etc.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.etc?.qty || 0)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.etc.price || 0)*(EquData.etc.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.4</div>&nbsp;
                          <div>
                            ค่าตรวจทางห้องปฏิบัติการ เจาะเลือดก่อนให้ยาเคมีบำบัด
                          </div>
                          &nbsp;:&nbsp;
                          <div className="HocData">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="lab"
                              data-topic="lab"
                              value={EquData.lab.lab || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.lab.lab)
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="lab"
                              value={EquData.lab.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.lab?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="lab"
                              value={EquData.lab.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.lab.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.lab.price || 0)*(EquData.lab.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.5</div>&nbsp;
                          <div>ค่าตรวจทางรังสีวิทยา( X-ray / CT / MRI )</div>
                          &nbsp;:&nbsp;
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="radiology"
                              data-topic="radiology"
                              value={EquData.radiology.radiology || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.radiology.radiology)
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="radiology"
                              value={EquData.radiology.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.radiology?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="radiology"
                              value={EquData.radiology.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.radiology.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.radiology.price || 0)*(EquData.radiology.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                    <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.6</div>&nbsp;
                          <div>ค่าตรวจพิเศษ( EKG / Echo / EST )</div>
                          &nbsp;:&nbsp;
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="special"
                              data-topic="special"
                              value={EquData.special.special || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.special.special)
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="special"
                              value={EquData.special.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.special?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="special"
                              value={EquData.special.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.special.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.special.price || 0)*(EquData.special.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div className="ListInput">
                          <div>&nbsp;&nbsp;&nbsp;1.7</div>&nbsp;
                          <div>ค่าตรวจวินิจฉัยของแพทย์</div>
                          &nbsp;:&nbsp;
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc-list"
                              name="diagnostic"
                              data-topic="diagnostic"
                              value={EquData.diagnostic.diagnostic || ""}
                              onChange={HandleChangeEquData}
                            />
                            : (EquData.diagnostic.diagnostic)
                          }
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="diagnostic"
                              value={EquData.diagnostic.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.diagnostic?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="diagnostic"
                              value={EquData.diagnostic.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.diagnostic.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.diagnostic.price || 0)*(EquData.diagnostic.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span>&nbsp;&nbsp;&nbsp;1.8</span>&nbsp;
                          <span>ค่าบริการพยาบาล+ค่าบริการทั่วไป(OPD)</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="service"
                              value={EquData.service.price || 0}
                              onChange={HandleChangeEquData}
                            />
                            : Number(EquData?.service?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 2 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="service"
                              value={EquData.service.qty || 0}
                              onChange={HandleChangeEquData}
                            />
                            : EquData.service.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((EquData.service.price || 0)*(EquData.service.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={5}>
                        <div>
                          <span>2.ค่าห้องพัก</span>
                        </div>{" "}
                      </th>
                    </tr>
                  </>
                )}

                {Mode !== "new" && (
                  <>
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span>&nbsp;&nbsp;&nbsp;2.1</span>&nbsp;
                          <span>ราคาห้องพัก (คืน/ชม.)</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="room"
                              value={RoomData.room.price || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : Number(EquData?.room?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="room"
                              value={RoomData.room.qty || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : RoomData.room.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((RoomData.room.price || 0)*(RoomData.room.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span>&nbsp;&nbsp;&nbsp;2.2</span>&nbsp;
                          <span>ค่าบริการพยาบาล</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="nursing"
                              value={RoomData.nursing.price || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : Number(EquData?.nursing?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="nursing"
                              value={RoomData.nursing.qty || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : RoomData.nursing.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((RoomData.nursing.price || 0)*(RoomData.nursing.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span>&nbsp;&nbsp;&nbsp;2.3</span>&nbsp;
                          <span>ค่าอาหาร</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="food"
                              value={RoomData.food.price || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : Number(EquData?.food?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="food"
                              value={RoomData.food.qty || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : RoomData.food.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((RoomData.food.price || 0)*(RoomData.food.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                        <div>
                          <span>&nbsp;&nbsp;&nbsp;2.4</span>&nbsp;
                          <span>ค่าบริการทั่วไป</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="price"
                              data-topic="services"
                              value={RoomData.services.price || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : Number(EquData?.services?.price || 0).toFixed(2)
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {
                            Mode !== 'show' && storedData.UserType === 3 ? 
                            <input
                              type="text"
                              className="Inputhoc"
                              name="qty"
                              data-topic="services"
                              value={RoomData.services.qty || 0}
                              onChange={HandleChangeRmsData}
                            />
                            : RoomData.services.qty
                          }
                          </div>
                        </div>{" "}
                      </td>
                      <td>
                        <div>
                          <div className="selectedItemListName">
                          {((RoomData.services.price || 0)*(RoomData.services.qty || 0)).toFixed(2)}
                          </div>
                        </div>{" "}
                      </td>
                    </tr>
                    <tr>
                      <th colSpan={2} style={{ textAlign: "center" }}>
                        <div>
                          <span>รวมราคาประเมินทั้งหมด</span>
                        </div>{" "}
                      </th>
                      <th colSpan={3} style={{ textAlign: "center" ,color: "#919191"}}>
                        <div>
                          <div>{TotalOverall()}</div>
                        </div>{" "}
                      </th>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        {/* </div> */}
        
{/* <div className="page-break"/> */}

          <div className="MainFormHoc avoidbreak">
            <table className="HOCTable signTable">
              <tbody>
                {/* <tr>
                  <td colSpan={2}>
                    <div>
                      <span></span>{" "}
                      <span className="HocData TESTTEXT"> </span>
                    </div>{" "}
                  </td>
                </tr> */}
                <tr>
                  <td>
                    <div className="SignBox">
                      <div className="LeftDivSignBox">
                        <div className="SignTitle">ผู้ทราบการประเมินราคา</div>
                      </div>
                      <div className="RightDivSignBox">
                        <div className="SignSpace"/>
                        <div className="SignerName">({patInfo.FullName ? `${patInfo.FullName}`: <div className="SignSpace"/> })</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="SignBox">
                      <div className="LeftDivSignBox">
                        <div className="SignTitle">ผู้ประเมินราคา</div>
                      </div>
                      <div className="RightDivSignBox">
                        <div className="SignSpace"/>
                        <div className="SignerName">(<div className="SignerName"/>)</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="InfoBox">เบอร์โทรศัพท์ติดต่อ :{" "}
                      <div className="SignSpace"/>
                    </div>
                  </td>
                  <td>
                    <div className="InfoBox">
                      <div>วัน/เดือน/ปี ที่ประเมิน</div> :{" "}
                      <div className="HocData">{formatShortDate(patInfo?.CreateAt)}</div>
                    </div>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="MainFormHoc">
            <table className="HOCTable">
              <tbody>
                <tr>
                  <td>
                    <div>
                      <span>หมายเหตุ</span>
                    </div>{" "}
                  </td>
                  <td>
                    <div>
                      <span style={{ color: "#919191" }}>
                        1.ราคานี้ไม่รวมค่าใช้จ่ายอื่นๆ
                        ที่นอกเหนือจากการรักษาที่ได้ประเมินไว้แล้ว
                      </span>
                    </div>{" "}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                    <div>
                      <span style={{ color: "#919191" }}>
                        2.ค่ารักษาพยาบาลอาจมีการเปลี่ยนแปลงตามภาวะแทรกซ้อนที่เกิดขึ้น
                      </span>
                    </div>{" "}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        {/* </div> */}

        {Mode!=='show' &&
          <div className="MainFormHoc HiddenDiv">
            <div className="ActionBarBTN">
                
              {Mode === "new" && (
                <>
                  <button
                    className="ButtonSubmitDraft"
                    onClick={handleSubmitDraftButton}
                  >
                    บันทึกร่าง
                  </button>
                  <button className="ButtonSubmit" onClick={handleSubmitButton}>
                    ส่งแบบประเมิน
                  </button>
                </>
              )}
              {["edit","proceed"].includes(Mode) && (
                <>
                  {storedData.UserType!==1 &&
                    <button className="ButtonReSubmit" onClick={handleReSubmitButton}>
                      {`ส่งกลับตรวจสอบ`}
                    </button>
                  }
                  <button className="ButtonSubmit" onClick={handleEditProceedButton}>
                    {Mode === "edit" ? `บันทึการแก้ไข` : (storedData.UserType===3 ? `บันทึกข้อมูล` : `บันทึกและส่งตรวจสอบ`)}
                  </button>
                </>
              )}
            </div>
          </div>
        }
        
      </div>
    </div>
  );
}

export default FormulaSelector;
