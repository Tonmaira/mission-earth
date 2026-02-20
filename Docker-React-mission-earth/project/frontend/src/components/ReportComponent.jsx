import React, { useCallback, useEffect, useRef, useState } from "react";
import { APIFuncionUniversal } from "../api/FunctionAPI";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorIcon from '@mui/icons-material/Error';
import RightTable from "./home/RightTable";
import InfoPopup from "./InfoPopup";

const ReportComponents = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]); 
  const [search, setSearch] = useState({});
  // const [selecteddept, setSelecteddept] = useState("");
  const [deptFilteredData, setDeptFilteredData] = useState([]);
  const [ErrorMsg, setErrorMsg] = useState("");
  
  // const [questionsdata, setQuestionsdata] = useState(null);

  const handleChangeText = (event) => {
    const { name, value } = event.target;
  
    // Reset selecteddept if date fields change
    // if (name === "Start" || name === "End") {
    //   setSelecteddept("");
    // }
  
    setSearch((prevSearch) => {
      const updated = { ...prevSearch, [name]: value };
  
      if (name === "Start" && (!prevSearch.End || prevSearch.End < value)) {
        updated.End = value;
      }
  
      if (name === "Start" || name === "End") {
        updated.Dept = "";
      }
  
      return updated;
    });
  };

  // useEffect(() => {
  //   if (search.Dept !== "") {
  //     setSelecteddept(search.Dept);
  //   }
  // }, [search.Dept]);

  const SubmitSearch = async () => {
    if (!search?.Start) {
      return alert("กรุณาเลือกช่วงเวลา");
    }
  
    // if (!selecteddept) {
    //   return alert("กรุณาเลือกแผนก");
    // }
  
    fetchQData();
  };
    
  const fetchData = useCallback(async () => {
    const [ deptsresponse] = await Promise.all([
      APIFuncionUniversal("get", null, "depts",setErrorMsg),
    ]);
        
    setDeptFilteredData(deptsresponse);
    setLoading(false);
    
  }, [search]);

  useEffect(() => {
  //   // if (!data || !Array.isArray(data)) return;
    if (search.Dept) {
      setData({result:originalData?.result?.filter(item => item.DeptId === parseInt(search.Dept))});
  // console.log("filter",{result:data?.result?.filter(item => item.DeptId === parseInt(search.Dept))});
    } else {
      setData(originalData)
    }

  }, [search.Dept]);

  const fetchQData = useCallback(async () => {
    // if (!search.Dept) return; // optional: skip if Dept is not selected
  
    let startdate = new Date().toISOString().slice(0, 10);
    let startend = new Date().toISOString().slice(0, 10);

    if (search.Start && search.End) {
      startdate = search.Start;
      startend = search.End;
    }

    try {
      const [reportresponse ] = await Promise.all([
        APIFuncionUniversal("get", null, `hoc/report/${startdate}/${startend}`,setErrorMsg),
      ]);
      setData(reportresponse);
      setOriginalData(reportresponse)
    } catch (err) {
      console.error("Failed to fetch questions:", err);
    }
  }, [search.Start, search.End, setErrorMsg]);  

  useEffect(() => {
    if (loading) fetchData();
  }, [loading, fetchData]);

  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"15px"}}>
      <div className="SearchBox">
        <div
          className="SearchBox_Item"
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <div className="SearchBox_Item_DatePicker">
            <div className="SearchBox_Item_Title">แผนก</div>
            {console.log(search)}
            <div className="SearchBox_Item_Body">
              <select
                className="SearchBox_Item_Input_Text"
                name="Dept"
                value={search.Dept || ""}
                onChange={handleChangeText}
              >
                <option value="">ทั้งหมด</option>
                {deptFilteredData.map((dept) => (
                  <option key={dept.Id} value={dept.Id}>
                    {dept.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="SearchBox_Item_DatePicker">
            <div className="SearchBox_Item_Title">เลือกช่วงเวลา เริ่ม</div>
            <div className="SearchBox_Item_Body">
              <div className="SearchBox_Item_Body_Icon">
                <CalendarMonthIcon fontSize="small" />
              </div>
              <input
                type="date"
                className="SearchBox_Item_Input_DatePicker"
                onChange={handleChangeText}
                name="Start"
                value={search.Start || ""}
              ></input>
            </div>
          </div>
          <div className="SearchBox_Item_DatePicker">
            <div className="SearchBox_Item_Title">ถึง End Date</div>
            <div className="SearchBox_Item_Body">
              <div className="SearchBox_Item_Body_Icon">
                <CalendarMonthIcon fontSize="small" />
              </div>
              <input
                type="date"
                className="SearchBox_Item_Input_DatePicker"
                onChange={handleChangeText}
                name="End"
                value={search.End || ""}
              ></input>
            </div>
          </div>

          <div className="SearchBox_SearchBTNStack">
            <button
              className="SearchBox_SearchBTN"
              style={{ width: "5.8rem", height: "2.8rem", lineHeight: "1rem" }}
              onClick={() => SubmitSearch()}
            >
              ค้นหา
            </button>
          </div>
          <div className="SearchBox_SearchBTNStack"></div>
        </div>
      </div>
      {console.log(data)}
      {!data ? <div className="SearchBox" style={{width:"90%",padding:"15px"}}>
        <div style={{display:"flex",justifyContent:"center",color:"gray"}}><ErrorIcon/>&nbsp;&nbsp;&nbsp;โปรดเลือก "ช่วงเวลา" แล้วเริ่มค้นหา</div>
        </div>
        :
        <RightTable
  title="จำนวนการแฟ้มเอกสารต่อ Auditor"
  Mode="history"
  data={data?.result}
  relocate={true}
  path="staff"
  action={false}
/>
        }

<InfoPopup />
    </div>
  );
  
};

export default ReportComponents;