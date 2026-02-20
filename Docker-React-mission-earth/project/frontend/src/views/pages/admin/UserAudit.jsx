import React, { useEffect, useState } from "react";
import "./../../../style/home.css";
import NEWUserIPDAudit from "../../../components/admin/newUserAudit";
import DynamicTable from "../../../components/DynamicTable";
import { APIFuncionUniversal } from "../../../api/FunctionAPI";

function UserIPDAudit() {
  const [refresh, setRefresh] = useState(true);
  const [userdata, setUserdata] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (refresh) {
        const data = await APIFuncionUniversal("get", null, "staffs",setErrorMsg);
        setUserdata(data);
        setRefresh(false);
      }
    };
    fetchData();
  }, [refresh]);

  const OpenRemoveUserAudit = async (id) => {
      await APIFuncionUniversal("get", null , "staffs/switch/" + id,setErrorMsg);
      setRefresh(true);
    };

  return (
    <div className="page_home_body" style={{flexDirection:"row"}}>
      <DynamicTable
        title="Users"
        data={userdata || null}
        EditFunction={true}
        EditContent={NEWUserIPDAudit}
        EditContentMode="edit"
        setRefresh={setRefresh}
        RemoveFunction={OpenRemoveUserAudit}
      />
      <NEWUserIPDAudit Mode="new" setRefresh={setRefresh} />
    </div>
  );
}

export default UserIPDAudit;