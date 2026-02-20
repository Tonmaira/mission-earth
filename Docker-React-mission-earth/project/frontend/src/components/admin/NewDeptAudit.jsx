import React, { useEffect, useState } from "react";
import { APIFuncionUniversal } from "../../api/FunctionAPI";

function NewDeptAudit({Mode ,setRefresh ,EditId, OriginalContent, CloseExit }) {
  const [payload, setPayload] = useState({ ShortName: "",Name: "" });
  const [loading, setLoading] = useState(true);
  const [ErrorMsg, setErrorMsg] = useState("");
  const [errorpayload, setErrorPayload] = useState(false);

  const handleChangeText = (event) => {
    const { name, value } = event.target;
    setPayload((prevPayload) => ({
      ...prevPayload,
      [name]: value,
    }));
  };

  const handleValidation = () => {
      if (!payload.ShortName) {
        alert("โปรดใส่ ShortName");
        setErrorPayload(true);
        return false;
      } else if (!payload.Name) {
        alert("โปรดใส่ชื่อผู้ใช้");
        setErrorPayload(true);
        return false;
      }
    setErrorPayload(false);
    return true;
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      if (handleValidation()) {
        if (Mode === "new") {
        const response = await APIFuncionUniversal("post", payload, "depts",setErrorMsg);
        if (response) {
          alert(`เพิ่ม "แผนก" ใหม่สำเร็จ`);
        } else {
          alert(`Error : ไม่สามารถเพิ่ม "แผนก" ได้`);
        } 
      }  else {
              const response = await APIFuncionUniversal(
                "post",
                payload,
                "depts/edit/" + OriginalContent.Id,
                setErrorMsg
              );
              if (response) {
                alert(`แก้ไข "แผนก" สำเร็จ`);
              } else {
                alert(`Error : ไม่สามารถแก้ไข "แผนก" ได้`);
              }
            }
      }
      if(!errorpayload){
        ResetPayloadData();
        setRefresh(true);
        setLoading(true);
        if(Mode==="edit"){
          CloseExit();
        }
      }
    };

    useEffect (() => {
        if(loading){
          ResetPayloadData();
        }
      }, [loading]);

      const ResetPayloadData = () => {
        if (Mode === "new") {
          setPayload({ ShortName: "",Name: "" }); // All expected fields initialized
        } else {
          setPayload({
            ShortName: String(OriginalContent.ShortName) || "",
            Name: String(OriginalContent.Name) || "",
          });
        }
        setLoading(false);
      };

  return (
    <div className="IPDAuditTable" style={Mode==="edit"?{width:"35rem",height:"fit-content"}:{width:"50rem",height:"fit-content"}}>
      <div className="IPDAuditTable_Header">{Mode==="edit"?`Edit Department ${EditId}`:"NEW Department"}</div>
      <div className="IPDAuditTable_Table_Body">
        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">Short Name</div>
          <input className="SearchBox_Item_Input_Text" style={errorpayload && !payload.ShortName ? { border: "1px solid red" , background:"#ffe0e0"} : {}} name="ShortName"  value={payload.ShortName || ""} onChange={handleChangeText} type="text"></input>
        </div>
        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">Name</div>
          <input className="SearchBox_Item_Input_Text" style={errorpayload && !payload.Name ? { border: "1px solid red" , background:"#ffe0e0"} : {}} name="Name"  value={payload.Name || ""} onChange={handleChangeText} type="text"></input>
        </div>
        
        <div className="SearchBox_Item">
          <button className="SearchBox_SearchBTN" onClick={handleSubmit}>
            {Mode==="edit" ? <>&nbsp;&nbsp;UPDATE DEPT&nbsp;&nbsp;</> : <>&nbsp;&nbsp;ADD DEPT&nbsp;&nbsp;</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewDeptAudit;
