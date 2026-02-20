import React, { useEffect, useState } from "react";
import "./../../../style/home.css";
import DynamicTable from "../../../components/DynamicTable";
import { APIFuncionUniversal } from "../../../api/FunctionAPI";
import NewDeptAudit from "../../../components/admin/NewDeptAudit";

function DeptAudit() {
  const [refresh, setRefresh] = useState(true);
  const [deptsdata, setDeptsdata] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (refresh) {
        const data = await APIFuncionUniversal("get", null, "depts",setErrorMsg);
        setDeptsdata(data);
        setRefresh(false);
      }
    };
    fetchData();
  }, [refresh]);

  const OpenRemoveAudit = async (id) => {
    await APIFuncionUniversal("put", { Mock: "blank" }, "depts/" + id,setErrorMsg);
    setRefresh(true);
  };

  return (
    <div className="page_home_body" style={{flexDirection:"row"}}>
      <DynamicTable
        title="Department"
        data={deptsdata}
        EditFunction={true}
        EditContent={NewDeptAudit}
        EditContentMode="edit"
        setRefresh={setRefresh}
        RemoveFunction={OpenRemoveAudit}
      />
      <NewDeptAudit Mode="new" setRefresh={setRefresh} />
    </div>
  );
}

export default DeptAudit;
