import React, { useEffect, useState } from "react";
import { APIFuncionUniversal } from "../../api/FunctionAPI";

function NEWUserIPDAudit({ Mode, setRefresh, OriginalContent, CloseExit }) {
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deptFilteredData, setDeptFilteredData] = useState([]);
  const [userdept, setUserdept] = useState("");
  const [usertype, setUsertype] = useState("");
  const [userrole, setUserrole] = useState("");
  const [ErrorMsg, setErrorMsg] = useState("");
  const [errorpayload, setErrorPayload] = useState(false);

  const fetchData = async () => {
    const [deptsresponse] = await Promise.all([
      APIFuncionUniversal("get", null, "depts",setErrorMsg),
    ]);

    setDeptFilteredData(
      deptsresponse.filter((item) => item.Status === "Active")
    );
  };

  useEffect(() => {
    fetchData();
  }, [Mode]);

  const handleChangeText = (event) => {
    const { name, value } = event.target;
      setPayload((prevPayload) => ({
        ...prevPayload,
        [name]: value,
      }));
  };

  const handleChangeDept = (event) => {
    const { value } = event.target;
    setUserdept(value);
  };
  
  const handleChangeType = (event) => {
    const { value } = event.target;
    setUsertype(value);
  };

  const handleChangeRole = (event) => {
    const { value } = event.target;
    setUserrole(value);
  };

  useEffect(() => {
    setPayload((prevPayload) => ({
      ...prevPayload,
      Dept: userdept,
      UserType: usertype,
      Role: userrole,
    }));
  }, [userdept,usertype,userrole]);

  useEffect(() => {
    if(loading){
      ResetPayloadData();
    }
  }, [loading]);

  const handleValidation = () => {
    if (Mode === "new") {
      if (!payload.UserId) {
        alert("โปรดใส่ Username/Userid");
        setErrorPayload(true);
        return false;
      } else if (!payload.Name) {
        alert("โปรดใส่ชื่อผู้ใช้");
        setErrorPayload(true);
        return false;
      }
    }
    setErrorPayload(false);
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      if (Mode === "new") {
        const response = await APIFuncionUniversal("post", payload, "staffs",setErrorMsg);
        if (response) {
          alert("ทำการเพิ่มผู้ใช้สำเร็จ");
        } else {
          alert("เกิดข้อผิดพลาดในการเพิ่มผู้ใช้");
        }
      } else {

        const response = await APIFuncionUniversal(
          "put",
          payload,
          "staffs/" + OriginalContent.UserId,
          setErrorMsg
        );
        if (response) {
          alert("ทำการแก้ไขผู้ใช้สำเร็จ");
        } else {
          alert("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
        }
      }
    };
    ResetPayloadData();
    setRefresh(true);
    setLoading(true);
    CloseExit();
  };

  useEffect(() => {
    ResetPayloadData();
  }, [Mode]);

  const ResetPayloadData = () => {
    if (Mode === "new") {
      // setPayload({ Dept:"1", UserType:"1",Role: "1" }); // All expected fields initialized
      setUserdept("1");
      setUsertype("1");
      setUserrole("1");
    } else {
      setPayload({
        Dept: String(OriginalContent.Dept),
        Role: String(OriginalContent.Role),
        UserType: String(OriginalContent.UserType),
        UserId: OriginalContent.UserId || "",
        Name: OriginalContent.Name || ""
      });
    }
    setLoading(false);
  };

  return (
    <div className="IPDAuditTable" style={Mode==="edit"?{width:"35rem",height:"fit-content"}:{width:"50rem",height:"fit-content"}}>
      <div className="IPDAuditTable_Header">
        {Mode === "edit" ? `Edit User ${OriginalContent.UserId}` : "NEW USER"}
      </div>
      {!loading && (
      <div className="IPDAuditTable_Table_Body">
          <div className="SearchBox_Item">
          
            <div className="SearchBox_Item_Title">Username/Userid</div>
            <input
              className="SearchBox_Item_Input_Text"
              style={errorpayload && !payload.UserId ? { border: "1px solid red" , background:"#ffe0e0"} : {}}
              name="UserId"
              onChange={handleChangeText}
              value={payload?.UserId}
              type="text"
              disabled={Mode==="edit"}
            ></input>
          </div>
        {/* )} */}
        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">Name</div>
          <input
            className="SearchBox_Item_Input_Text"
            style={errorpayload && !payload.Name ? { border: "1px solid red" , background:"#ffe0e0"} : {}}
            name="Name"
            onChange={handleChangeText}
            value={payload?.Name}
            type="text"
          ></input>
        </div>

        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">แผนก</div>
            <select
              className="SearchBox_Item_Input_Text"
              name="Dept"
              onChange={handleChangeDept}
              value={payload.Dept}
            >
              {deptFilteredData?.map((item, index) => (
                <option key={`DeptId-${index}`} value={item.Id} >
                  {item?.ShortName || ""} - {item?.Name || ""}
                </option>
              ))}
            </select>
          </div>
        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">ส่วนงาน</div>
          <label>
            <input
              type="radio"
              className="options"
              name="UserType"
              value="1"
              checked={(payload?.UserType) == "1"}

              onChange={handleChangeType}
            />
            เภสัช
          </label>
          <label>
            <input
              type="radio"
              className="options"
              name="UserType"
              value="2"
              checked={(payload?.UserType) == "2"}
              onChange={handleChangeType}
            />
            พยาบาล
          </label>
          {/* <label>
            <input
              type="radio"
              className="options"
              name="UserType"
              value="3"
              checked={(payload?.UserType) == "3"}

              onChange={handleChangeType}
            />
            เจ้าหน้าที่ประสานสิทธิ
          </label> */}
        </div>
        <div className="SearchBox_Item">
          <div className="SearchBox_Item_Title">ระดับ</div>
          <label>
            <input
              type="radio"
              className="options"
              name="Role"
              value="3"
              checked={(payload?.Role) == "3"}

              onChange={handleChangeRole}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              className="options"
              name="Role"
              value="1"
              checked={(payload?.Role) == "1"}

              onChange={handleChangeRole}
            />
            User
          </label>
        </div>
        <div className="SearchBox_Item">
          <button className="SearchBox_SearchBTN" onClick={handleSubmit}>
            {Mode === "new" ? (
              <>&nbsp;&nbsp;ADD USER&nbsp;&nbsp;</>
            ) : (
              <>&nbsp;&nbsp;UPDATE USER&nbsp;&nbsp;</>
            )}
          </button>
        </div>
      </div>
      )}
    </div>
  );
}

export default NEWUserIPDAudit;
