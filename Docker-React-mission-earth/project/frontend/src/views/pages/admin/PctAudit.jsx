import React, { useEffect, useState } from "react";
import "./../../../style/home.css";
import DynamicTable from "../../../components/DynamicTable";
import { APIFuncionUniversal } from "../../../api/FunctionAPI";
import NewPctAudit from "../../../components/admin/NewPctAudit";

function PctAudit() {
  const [refresh, setRefresh] = useState(true);
  const [pctdata, setPctdata] = useState(null);
  const [ErrorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (refresh) {
        const data = await APIFuncionUniversal("get", null, "pct",setErrorMsg);
        setPctdata(data);
        setRefresh(false);
      }
    };
    fetchData();
  }, [refresh]);

  const OpenRemoveAudit = async (id) => {
    await APIFuncionUniversal("put", { Mock: "blank" }, "pct/" + id,setErrorMsg);
    setRefresh(true);
  };

  return (
    <div className="page_home_body">
      <DynamicTable
        title="PCT"
        data={pctdata}
        EditFunction={true}
        EditContent={NewPctAudit}
        EditContentMode="edit"
        setRefresh={setRefresh}
        RemoveFunction={OpenRemoveAudit}
      />
      <NewPctAudit Mode="new" setRefresh={setRefresh} />
    </div>
  );
}

export default PctAudit;
