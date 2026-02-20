import React, { useEffect, useRef, useState } from "react";
import { APIFuncionUniversal } from "../../api/FunctionAPI";
import { useNavigate, useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoIMG from "../../assets/logo-color.png";
import {
  CalculateAge,
  FormatMoney,
  formatShortDate,
  GenerateId,
} from "../../components/Function";
import { Autocomplete, Divider, TextField } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { PrintPageComponent } from "../../components/printpage";
import FormulaDialog from "../../components/FormulaDialog";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function HocDoc({ Mode }) {
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
  const [formulaData, setFormulaData] = useState([]);
  // const [equipmentData, setEquipmentData] = useState([]);
  const [etcData, setETCData] = useState([]);
  const [patInfo, setPatInfo] = useState([]);
  const [filteredetcData, setFilteredEtcData] = useState([]);

  const [InfoData, setInfoData] = useState({
    fullname: "",
    hn: "",
    rightcode: "",
    vn: "",
    birthday: "",
    gender: "",
    visitcodename: "",
    clinic: "",
    doctor: "",
    remark: "",
    visitdate: "",
  });
  const today = new Date().toISOString().split("T")[0];
  const [InsData, setInsData] = useState({
    patienttype: "2",
    diagnosis: "",
    treatment: "",
    admdate: today,
    right: "",
  });
  const [selectedFormula, setSelectedFormula] = useState(null); //med stock
  const [listData, setListData] = useState([]); //med stock
  const [selectedEquipmentStock, setSelectedEquipmentStock] = useState(null); //med eqstock
  const [listEquipmentData, setListEquipmentData] = useState([]); //med eqstock
  const [selectedetc, setSelectedEtc] = useState(null); //etc stock
  const [listETCData, setListETCData] = useState([]); //etc stock
  const [filteretc, setFilteretc] = useState('opd');

  const HandleChangeStockOption = (e) => {
    const value = e.target.value;      // get the value of the input
    setFilteretc(value);
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
        patinfoPromise = APIFuncionUniversal(
          "get",
          null,
          `hoc/${id}`,
          setErrorMsg
        );
        break;
      case "show":
        patinfoPromise = APIFuncionUniversal(
          "get",
          null,
          `hoc/${id}`,
          setErrorMsg
        );
        break;
      case "edit":
        patinfoPromise = APIFuncionUniversal(
          "get",
          null,
          `hoc/${id}`,
          setErrorMsg
        );
        break;
      default:
        patinfoPromise = Promise.resolve(null); // fallback if Mode is something else
    }

    const [doctor, clinic, formula, etc, patinfo] = await Promise.all([
      APIFuncionUniversal("get", null, "doctor", setErrorMsg),
      APIFuncionUniversal("get", null, "clinic", setErrorMsg),
      APIFuncionUniversal("get", null, "formula", setErrorMsg),
      // APIFuncionUniversal("get", null, "stock", setErrorMsg), //Switch Route //TODO
      APIFuncionUniversal("get", null, "stockcode", setErrorMsg), //Switch Route //TODO
      patinfoPromise,
    ]);
    if(patinfo.RightCode==='1700'){
      setFilteretc('inter')
    }
    setDoctorData(doctor);
    setClinicData(clinic);
    setFormulaData(formula);
    // setEquipmentData(equipment);
    setETCData(etc);
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
      setListEquipmentData(patinfo?.FormData?.listEquipmentData || []);
      setListETCData(patinfo?.FormData?.listETCData || []);
    }

    setLoading(false);
  };

  const HandleChangeInsData = (e) => {
    const nameElement = e.target.name; // get the name attribute of the input
    const value = e.target.value; // get the value of the input

    // update the corresponding field in InsData
    setInsData((prev) => ({
      ...prev,
      [nameElement]: value,
    }));
  };

  const TotalObject = (data) => {
    const grandTotal = data.reduce((formulaAcc, formula) => {
      const formulaTotal = formula.FormulaList.reduce((itemAcc, item) => {
        return itemAcc + Number(item.UnitPrice1) * Number(item.Quantity || 1);
      }, 0);

      return formulaAcc + formulaTotal;
    }, 0);

    return grandTotal;
  };

  // const TotalEq = (data = []) => {
  //   return data.reduce((sum, item) => {
  //     return sum + Number(item.UnitPrice1) * Number(item.Quantity || 1);
  //   }, 0);
  // };

  const TotalEtc = (data = []) => {
    return data.reduce((sum, item) => {
      return sum + Number(item.Price) * Number(item.Quantity || 1);
    }, 0);
  };

  const TotalOverall = (data, data2) => {
    const objectprice = TotalObject(data);
    const etcprice = TotalEtc(data2);

    return objectprice +etcprice;
  };

  const AddFormulaToList = () => {
    if (!selectedFormula) {
      return window.alert("โปรดเลือกจากรายการยาก่อนกดปุ่ม '+' !!");
    }

    const exists = listData.some((item) => item.id === selectedFormula.id);
    if (exists) {
      setSelectedFormula(null);
      return window.alert("มีรายการนี้อยู่แล้ว");
    }

    setListData([...listData, selectedFormula]);
    setSelectedFormula(null);
  };

  const AddEquipmentToList = () => {
    if (selectedEquipmentStock) {
      setListEquipmentData((prevList) => {
        // หา index ของยาใน list (ใช้ทั้ง StockCode และ SKMasterFixSalesPriceType)
        const existingIndex = prevList.findIndex(
          (item) => item.StockCode === selectedEquipmentStock.StockCode
          // item.SKMasterFixSalesPriceType === selectedEquipmentStock.SKMasterFixSalesPriceType
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
        return [...prevList, { ...selectedEquipmentStock, Quantity: 1 }];
      });
    } else {
      window.alert(`โปรดเลือกจากรายการยาก่อนกดปุ่ม "+" !!`);
    }

    // ✅ เคลียร์ค่า Autocomplete หลังเพิ่ม
    setSelectedEquipmentStock(null);
  };

  // const handleChangeQuantityEQ = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedItems = [...listEquipmentData];
  //   updatedItems[index][name] = value;
  //   setListEquipmentData(updatedItems);
  // };

  const AddETCToList = () => {
    if (selectedetc) {
      setListETCData((prevList) => {
        // หา index ของยาใน list (ใช้ทั้ง StockCode และ SKMasterFixSalesPriceType)
        const existingIndex = prevList.findIndex(
          (item) => item.Code === selectedetc.Code
          // item.SKMasterFixSalesPriceType === selectedEquipmentStock.SKMasterFixSalesPriceType
        );

        const price = InfoData.rightcode === "1700"
            ? selectedetc.InterPrice
            : (filteretc==='opd'?selectedetc.OPDPrice:selectedetc.IPDPrice);

        if (existingIndex !== -1) {
          // ✅ ถ้ามีอยู่แล้ว ให้บวก Quantity + 1
          const updatedList = [...prevList];
          // const currentQty = updatedList[existingIndex].Quantity || 0;
          const currentQty = Number(updatedList[existingIndex].Quantity) || 0;
          updatedList[existingIndex] = {
            ...updatedList[existingIndex],
            Quantity: currentQty + 1,
            Price: price,
          };
          return updatedList;
        }

        // ✅ ถ้ายังไม่มี ให้เพิ่มใหม่พร้อม Quantity = 1
        return [...prevList, { ...selectedetc, Quantity: 1 ,Price: price}];
      });
    } else {
      window.alert(`โปรดเลือกจากรายการยาก่อนกดปุ่ม "+" !!`);
    }

    // ✅ เคลียร์ค่า Autocomplete หลังเพิ่ม
    setSelectedEtc(null);
  };

  const handleChangeETC = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...listETCData];
    updatedItems[index][name] = value;
    setListETCData(updatedItems);
  };

  // const deleteByStockCode = (Code) => {
  //   if (window.confirm("Are you sure you want to delete this item?")) {
  //     setListEquipmentData((prev) =>
  //       prev.filter((item) => item.StockCode !== Code)
  //     );
  //   }
  // };

  const deleteETCByStockCode = (Code) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setListETCData((prev) =>
        prev.filter((item) => item.Code !== Code)
      );
    }
  };

  const handleSubmitButton = async () => {
    // if (!verifyFormData()) return;

    const TempformData = {
      InfoData,
      InsData,
      listData,
      listEquipmentData,
      listETCData,
    };

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status: 4,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType: storedData.UserType,
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
      InfoData,
      InsData,
      listData,
      listEquipmentData,
      listETCData,
    };

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status: 3,
      FormData: JSON.stringify(TempformData),
      CreatedBy: storedData.UserId,
      UserType: storedData.UserType,
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

  const handleReSubmitButton = async () => {
    // if (!verifyFormData()) return;

    let prestatus;
    if (storedData.UserType === 2) {
      prestatus = 1;
    }

    const TempformData = {
      InfoData,
      InsData,
      listData,
      listEquipmentData,
      listETCData,
    };

    const payload = {
      HN: InfoData.hn,
      VN: InfoData.vn,
      FullName: InfoData.fullname,
      Dept: storedData.Dept,
      Status: prestatus,
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

  const handleEditProceedButton = async () => {
    // if (!verifyFormData()) return;

    let preprocess;
    if (storedData.UserType === 1) {
      preprocess = 4;
    } else if (storedData.UserType === 2) {
      preprocess = 7;
    }

    const TempformData = {
      InfoData,
      InsData,
      listData,
      listEquipmentData,
      listETCData,
      // ,EquData
    };

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
      alert("บันทึกการแก้ไขสำเร็จ");
      navigate(`/dashboard`);
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกการแก้ไข");
    }
  };

  useEffect(() => {
    if (loading) {
      fetchData();
    }
  }, [loading]);

  useEffect(() => {
      if (etcData) {
        const Filtered = etcData;
        // const finalFiltered = filterDataStockbytype(rightFiltered);
    
        // setFilteredRightData(rightFiltered);
        setFilteredEtcData(Filtered);
      }
    }, [filteretc,etcData]);

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
    if (patInfo.Status === 7) {
      preprocess = 8;
    }
    alert(
      `ID [${patInfo.id}] : ${StatusConvert(patInfo.Status)} -> ${StatusConvert(
        preprocess
      )}`
    );
    const payload = {
      id: patInfo.id,
      Status: preprocess,
      CreatedBy: storedData.UserId,
    };

    await APIFuncionUniversal(
      "put",
      payload,
      `hoc/status/${patInfo.id}`,
      setErrorMsg
    );
    await PrintPageComponent(ref);
  };

  return (
    <div ref={componentRef}>
      <div className="print-area">
        <div className="MainFormHoc">
          <table className="HOCTable">
            <thead>
              <tr>
                <th colSpan={4} style={{ textAlign: "center" }}>
                  <div className="HOCTableHeader">
                    <img src={LogoIMG} width={200}></img>
                    {/* {Mode==='show' && patInfo.Status===10 && <div className="PrntBTN HiddenDiv" onClick={()=>HandlePrintHoc(componentRef)}>🖨️&nbsp;พิมพ์เอกสาร</div>} */}
                    <div
                      className="PrntBTN HiddenDiv"
                      onClick={() => HandlePrintHoc(componentRef)}
                    >
                      🖨️&nbsp;พิมพ์เอกสาร
                    </div>
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
                      {clinicData
                        ? clinicData.find(
                            (d) => d.ClinicCode === InfoData?.clinic
                          )?.ClinicNameThai || InfoData?.clinic
                        : InfoData?.clinic}
                    </span>
                  </div>{" "}
                </td>
                <td colSpan={2}>
                  <div>
                    <span>แพทย์</span> :{" "}
                    <span className="HocData">
                      {doctorData
                        ? doctorData.find((d) => d.Doctor === InfoData?.doctor)
                            ?.LocalName || InfoData?.doctor
                        : InfoData?.doctor}
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
                      {InfoData.rightcode
                        ? InfoData.rightcode === "1700"
                          ? `International Services (${InfoData.rightcode})`
                          : `สิทธิการรักษาทั่วไป (${InfoData.rightcode})`
                        : "-"}
                    </span>
                  </div>{" "}
                </td>
                <td>
                  <div>
                    <span>VN Date</span> :{" "}
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
                    {Mode !== "show" && storedData.UserType === 1 ? (
                      <>
                        <div className="HOCradioOption">
                          <input
                            type="radio"
                            name="patienttype"
                            value="1"
                            checked={InsData.patienttype === "1"}
                            onChange={HandleChangeInsData}
                          />
                          <label>ผู้ป่วยเก่า</label>
                        </div>
                        <div className="HOCradioOption">
                          <input
                            type="radio"
                            name="patienttype"
                            value="2"
                            checked={InsData.patienttype === "2"}
                            onChange={HandleChangeInsData}
                          />
                          <label>ผู้ป่วยใหม่</label>
                        </div>
                      </>
                    ) : InsData.patienttype === "1" ? (
                      `ผู้ป่วยเก่า`
                    ) : (
                      `ผู้ป่วยใหม่`
                    )}
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
                    <div className="HocData" style={{ width: "650px" }}>
                      {Mode !== "show" && storedData.UserType === 1 ? (
                        <input
                          type="text"
                          className="Inputhoc"
                          name="diagnosis"
                          onChange={HandleChangeInsData}
                          value={InsData.diagnosis || ""}
                        />
                      ) : (
                        InsData.diagnosis
                      )}
                    </div>
                  </div>{" "}
                </td>
              </tr>
              <tr>
                <td>
                  <div>
                    <div>{`การรักษา : `}</div>
                    <div className="HocData">
                      {Mode !== "show" && storedData.UserType === 1 ? (
                        <input
                          type="text"
                          className="Inputhoc"
                          name="treatment"
                          onChange={HandleChangeInsData}
                          value={InsData.treatment || ""}
                        />
                      ) : (
                        InsData.treatment
                      )}
                    </div>
                  </div>{" "}
                </td>
                <td>
                  <div>
                    <div>{`วันที่เริ่มรับการรักษา : `}</div>
                    <div className="HocData">
                      {Mode !== "show" && storedData.UserType === 1 ? (
                        <input
                          type="date"
                          className="SearchBox_Item_Input_DatePicker"
                          onChange={HandleChangeInsData}
                          name="admdate"
                          value={InsData.admdate || ""}
                        />
                      ) : (
                        InsData.admdate ? formatShortDate(InsData.admdate) : ""
                      )}
                    </div>
                  </div>{" "}
                </td>
                <td>
                  <div>
                    <div>{`สิทธิ : `}</div>
                    <div className="HocData">
                      {Mode !== "show" && storedData.UserType === 1 ? (
                        <input
                          type="text"
                          className="Inputhoc"
                          name="right"
                          onChange={HandleChangeInsData}
                          value={InsData.right || ""}
                        />
                      ) : (
                        InsData.right
                      )}
                    </div>
                  </div>{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="MainFormHoc">
          <table className="HOCTable">
            <thead>
              <tr>
                <th colSpan={2} style={{ width: "700px", textAlign: "center" }}>
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
                {Mode!=='show' && 
                <th style={{ textAlign: "center" }}>
                  <div>
                    <span>Action</span>
                  </div>{" "}
                </th>
                }
              </tr>
            </thead>
            <tbody>
              <tr className="FormulacellHeader">
                <th colSpan={Mode=='show'?5:6}>
                  <div>
                    <span>1.ยาเคมีบำบัด/ยาภูมิคุ้มกัน/ยามุ่งเป้า</span>
                  </div>{" "}
                </th>
              </tr>

              {listData.map((item, index) => (
                <React.Fragment key={`${index}_FormulaGroup`}>
                  <tr className="ItemcellHeader">
                    <td colSpan={5}>
                      <div className="selectedItemHeader">
                        {item.FormulaName}
                      </div>
                    </td>
                    {Mode!=='show' && 
                    <td>
                      <div className="selectedItemHeader">
                        <FormulaDialog
                          Mode="edit"
                          Type="editor"
                          Id={item.id}
                          datarow={item}
                          setDataList={setListData}
                          dataList={listData}
                        />
                      </div>
                    </td>
                    }
                  </tr>

                  {item.FormulaList.map((child, indexList) => (
                    <tr key={indexList}>
                      <td colSpan={2}>
                        <div className="selectedItemListName">
                          &nbsp;<span>{child.Name}</span>
                        </div>
                      </td>

                      <td>
                        <div className="selectedItemListName MoneyAlign">
                          {child.UnitPrice1.toFixed(2)}
                        </div>
                      </td>

                      <td>
                        <div className="selectedItemListName QTYAlign">
                          {child.Quantity}
                        </div>
                      </td>

                      <td>
                        <div className="selectedItemListName MoneyAlign">
                          {(child.UnitPrice1 * child.Quantity).toFixed(2)}
                        </div>
                      </td>
                      {Mode!=='show' && 
                      <td>
                        <div className="selectedItemListName MoneyAlign">
                          {/* {(child.UnitPrice1 * child.Quantity).toFixed(2)} */}
                        </div>
                      </td>
                      }
                    </tr>
                  ))}

                  <tr></tr>
                </React.Fragment>
              ))}

              {Mode !== "show" && storedData.UserType === 1 && (
                <tr className="AddButtonRow HiddenDiv">
                  <td colSpan={5} style={{ textAlign: "center", color: "#" }}>
                    <Autocomplete
                      className="AutoCompleteCustom"
                      disablePortal
                      options={formulaData}
                      getOptionLabel={(option) => `${option.FormulaName}`}
                      renderOption={(props, option) => (
                        <li {...props} key={`option.Id_${GenerateId()}`}>
                          {`${option.FormulaName}`}
                        </li>
                      )}
                      value={selectedFormula}
                      onChange={(event, newValue) => {
                        setSelectedFormula(newValue);
                      }}
                      sx={{ width: "100%", minHeight: "500px" }}
                      renderInput={(params) => (
                        <TextField {...params} label="พิมพ์เพื่อค้นหา..." />
                      )}
                      filterOptions={
                        (options, state) =>
                          filterOptions(options, state).slice(0, 15) // 👈 limit to 15
                      }
                    />
                  </td>
                  <td colSpan={1} style={{ textAlign: "center" }}>
                    <div className="AddMedBtn" onClick={AddFormulaToList}>
                      <AddCircleOutlineIcon />
                    </div>
                  </td>
                </tr>
              )}

              {/* {Mode !== "new" && (
                <>
                  <tr className="FormulacellHeader">
                    <th colSpan={Mode=='show'?5:6}>
                      <div>
                        <span>2. เวชภัณฑ์</span>
                      </div>{" "}
                    </th>
                  </tr>

                  {listEquipmentData?.map((item, index) => (
                    <React.Fragment key={`${index}_EquiomentGroup`}>
                      <tr>
                        <td colSpan={2}>
                          <div className="selectedItemListName">
                            &nbsp;<span>{item.Name}</span>
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName MoneyAlign">
                            {item.UnitPrice1.toFixed(2)}
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName QTYAlign">
                            {Mode !== "show" ?
                              <input
                                key={item.id}
                                type="text"
                                className="Inputhoc"
                                name="Quantity"
                                value={item.Quantity}
                                onChange={(e) => handleChangeQuantityEQ(e, index)}
                              /> :
                              <>
                              {item.Quantity}
                              </>
                            }
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName MoneyAlign">
                            {(item.UnitPrice1 * item.Quantity).toFixed(2)}
                          </div>
                        </td>
                        {Mode !== "show" &&
                          <td>
                            <div className="selectedItemListName MoneyAlign">
                              <IconButton
                                aria-label="delete"
                                size="small"
                                color=""
                                onClick={() => deleteByStockCode(item.StockCode)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </td>
                        }
                      </tr>

                      <tr></tr>
                    </React.Fragment>
                  ))}
                  {Mode !== "show" && (
                    <tr className="AddButtonRow HiddenDiv">
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", color: "#" }}
                      >
                        <Autocomplete
                          className="AutoCompleteCustom"
                          disablePortal
                          options={equipmentData}
                          getOptionLabel={(option) => `${option.StockCode}`}
                          renderOption={(props, option) => (
                            <li {...props} key={`option.Id_${GenerateId()}`}>
                              {`${option.StockCode}`}
                            </li>
                          )}
                          value={selectedEquipmentStock}
                          onChange={(event, newValue) => {
                            setSelectedEquipmentStock(newValue);
                          }}
                          sx={{ width: "100%", minHeight: "500px" }}
                          renderInput={(params) => (
                            <TextField {...params} label="พิมพ์เพื่อค้นหา..." />
                          )}
                          filterOptions={
                            (options, state) =>
                              filterOptions(options, state).slice(0, 15) // 👈 limit to 15
                          }
                        />
                      </td>
                      <td colSpan={1} style={{ textAlign: "center" }}>
                        <div className="AddMedBtn" onClick={AddEquipmentToList}>
                          <AddCircleOutlineIcon />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )} */}

              {Mode !== "new" && (
                <>
                  <tr className="FormulacellHeader">
                    <th colSpan={Mode=='show'?5:6}>
                      <div>
                        <span>2. เวชภัณฑ์/ค่าห้องพัก</span>
                      </div>{" "}
                    </th>
                  </tr>
                  
                  {filteretc==='inter' && 
                    <tr className="AddButtonRow HiddenDiv">
                      <td colSpan={6} style={{ textAlign: "center", color:"#"}}>
                        <div className="HOCradioList">
                          <div className="HOCradioOption">
                            <input
                              type="radio"
                              name="filteretc"
                              value='opd'
                              checked={filteretc === 'opd'}
                              onChange={HandleChangeStockOption}
                            />
                            <label>OPD</label>
                          </div>
                          <div className="HOCradioOption">
                            <input
                              type="radio"
                              name="filteretc"
                              value='ipd'
                              checked={filteretc === 'ipd'}
                              onChange={HandleChangeStockOption}
                            />
                            <label>IPD</label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
{/* {console.log(listETCData)} */}
                  {listETCData?.map((item, index) => (
                    <React.Fragment key={`${index}_EquiomentGroup`}>
                      <tr>
                        <td colSpan={2}>
                          <div className="selectedItemListName">
                            &nbsp;<span>{item.EnglishName || item.ThaiName}</span>
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName MoneyAlign">
                            {Mode !== "show" ?
                              <input
                                key={item.Id}
                                type="text"
                                className="Inputhoc"
                                name="Price"
                                value={item.Price}
                                onChange={(e) => handleChangeETC(e, index)}
                              />
                              :
                              <>{item.Price}</>
                            }
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName QTYAlign">
                          {Mode !== "show" ?
                            <input
                              key={item.Id}
                              type="text"
                              className="Inputhoc"
                              name="Quantity"
                              value={item.Quantity}
                              onChange={(e) => handleChangeETC(e, index)}
                            />
                            :
                            <>{item.Quantity}</>
                          }
                          </div>
                        </td>

                        <td>
                          <div className="selectedItemListName MoneyAlign">
                            {(item.Price * item.Quantity).toFixed(2)}
                          </div>
                        </td>
                        {console.log(listETCData)}
                        {Mode !== "show" &&
                          <td>
                            <div className="selectedItemListName MoneyAlign">
                              <IconButton
                                aria-label="delete"
                                size="small"
                                color=""
                                onClick={() => deleteETCByStockCode(item.Code)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          </td>
                        }
                      </tr>

                      <tr></tr>
                    </React.Fragment>
                  ))}
                  {storedData.UserType!==1 && Mode !== "show" && (
                    <tr className="AddButtonRow HiddenDiv">
                      <td
                        colSpan={5}
                        style={{ textAlign: "center", color: "#" }}
                      >
                      {/* {console.log(filteredetcData)} */}
                        <Autocomplete
                          className="AutoCompleteCustom"
                          disablePortal
                          options={filteredetcData}
                          getOptionLabel={(option) => `${option.Code} | ${option.EnglishName || option.ThaiName}`}
                          renderOption={(props, option) => (
                            <li {...props} key={`option.Id_${GenerateId()}`}>
                              {`${option.Code} | ${option.EnglishName || option.ThaiName}`}
                            </li>
                          )}
                          value={selectedetc}
                          onChange={(event, newValue) => {
                            setSelectedEtc(newValue);
                          }}
                          sx={{ width: "100%", minHeight: "500px" }}
                          renderInput={(params) => (
                            <TextField {...params} label="พิมพ์เพื่อค้นหา..." />
                          )}
                          filterOptions={
                            (options, state) =>
                              filterOptions(options, state).slice(0, 15) // 👈 limit to 15
                          }
                        />
                      </td>
                      <td colSpan={1} style={{ textAlign: "center" }}>
                        <div className="AddMedBtn" onClick={AddETCToList}>
                          <AddCircleOutlineIcon />
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )}

              <tr>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  <div>
                    <span>รวมราคาประเมินทั้งหมด</span>
                  </div>{" "}
                </th>
                <th
                  colSpan={4}
                  style={{ textAlign: "center", color: "#919191" }}
                >
                  <div>
                    <div>{FormatMoney(TotalOverall(listData, listETCData))} บาท</div>
                  </div>{" "}
                </th>
              </tr>
            </tbody>
          </table>
        </div>

{
  Mode==='show' &&
  <>
        <div className="MainFormHoc avoidbreak">
          <table className="HOCTable signTable">
            <tbody>
              <tr>
                <td>
                  <div className="SignBox">
                    <div className="LeftDivSignBox">
                      <div className="SignTitle">ผู้ทราบการประเมินราคา</div>
                    </div>
                    <div className="RightDivSignBox">
                      <div className="SignSpace" />
                      <div className="SignerName">
                        (
                        {patInfo.FullName ? (
                          `${patInfo.FullName}`
                        ) : (
                          <div className="SignSpace" />
                        )}
                        )
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="SignBox">
                    <div className="LeftDivSignBox">
                      <div className="SignTitle">ผู้ประเมินราคา</div>
                    </div>
                    <div className="RightDivSignBox">
                      <div className="SignSpace" />
                      <div className="SignerName">
                        (<div className="SignerName" />)
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="InfoBox">
                    เบอร์โทรศัพท์ติดต่อ : <div className="SignSpace" />
                  </div>
                </td>
                <td>
                  <div className="InfoBox">
                    <div>วัน/เดือน/ปี ที่ประเมิน</div> :{" "}
                    <div className="HocData">
                      <div className="SignSpace" />
                      {/* {formatShortDate(patInfo?.CreateAt)} */}
                    </div>
                  </div>{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="MainFormHoc avoidbreak">
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
  </>
}

        {Mode !== "show" && (
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
              {["edit", "proceed"].includes(Mode) && (
                <>
                  {storedData.UserType !== 1 && (
                    <button
                      className="ButtonReSubmit"
                      onClick={handleReSubmitButton}
                    >
                      {`ส่งกลับตรวจสอบ`}
                    </button>
                  )}
                  <button
                    className="ButtonSubmit"
                    onClick={handleEditProceedButton}
                  >
                    {Mode === "edit"
                      ? `บันทึการแก้ไข`
                      : storedData.UserType === 3
                      ? `บันทึกข้อมูล`
                      : `บันทึกและส่งตรวจสอบ`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HocDoc;
