import React, { useEffect, useState } from "react";
import { APIFuncionUniversal } from "../api/FunctionAPI";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ErrorIcon from '@mui/icons-material/Error';
import RightTable from "./home/RightTable";
import InfoPopup from "./InfoPopup";
import "../style/package.css"
import DynamicTable from "./DynamicTable";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FormulaDialog from "./FormulaDialog";

const VISIBLE_FIELDS = [
  // "VN",
  "FormulaName",
  // "FullName",
  // "insuranceType",
  // "insuranceCompany",
  // "ContractParty",
  // "Dept",
  // "CreateAt",
  // "AcceptAt",
  // "VerifyAt",
  // "status",
  "action",
  // "UserType",
];

// const testdata = [
//   {id:1,FormulaName:"aaa",action:1},
//   {id:2,FormulaName:"bbb",action:2},
//   {id:3,FormulaName:"ccc",action:3},
// ];

const PackageManager = ({Mode}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [ErrorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const [formula] = await Promise.all([
      APIFuncionUniversal("get", null, "formula/list", setErrorMsg),
    ]);
    setData(formula);

    setLoading(false);
  };

  useEffect(() => {
      if (loading) {
        fetchData();
      }
    }, [loading]);

  const StatusConvert = (value) => {
      switch (value) {
        case 1:
          return `รอตรวจสอบข้อมูล(เภสัช) ${value}`; // 1
        case 2:
          return `กำลังตรวจสอบข้อมูล(เภสัช) ${value}`; // 1
        case 3:
          return `แบบร่าง(เภสัช) ${value}`; // 1
        case 4:
          return `รอตรวจสอบข้อมูล(พยาบาล) ${value}`; // 1 2
        case 5:
          return `กำลังตรวจสอบข้อมูล(พยาบาล) ${value}`; // 1 2
        case 6:
          return `แบบร่าง(พยาบาล) ${value}`; // 1 2
        // case 7:
        //   return `รอตรวจสอบข้อมูล(ประสานสิทธิ) ${value}`; // 1 2 3
        // case 8:
        //   return `กำลังตรวจสอบข้อมูล(ประสานสิทธิ) ${value}`; // 1 2 3
        // case 9:
        //   return `แบบร่าง(ประสานสิทธิ) ${value}`; // 1 2 3
        // case 10:
        //   return `ตรวจสอบแล้ว(ประสานสิทธิ) ${value}`; // 1 2 3
        // case 11:
        //   return "พิมพ์เอกสารแล้ว"; // 1 2 3
        case 7:
          return (
            <>
              เสร็จสิ้น <CheckCircleIcon color="success" /> {value}
            </>
          ); // 1 2 3
        case 8:
          return `พิมพ์เอกสารแล้ว`;
        default:
          return "-";
      }
    };

  const column = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "FormulaName",
      headerName: "สูตร",
      flex: 1,
      // width: 320,
    },
    {
      field: "action",
      headerName: "Action",
      width: 250,
      // flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            p: 1,
          }}
        >
        {/* {console.log(params.row.id)} */}
          <Stack direction="row" spacing={1}>
            
            <FormulaDialog Mode="edit" Type='add' Id={params.row.id} setLoading={setLoading}/>

            <IconButton
              aria-label="cancel"
              size="small"
              onClick={() => handleDelete(params.row)}
            >
              <Tooltip title="ยกเลิก">
                <DeleteIcon color="error" />
              </Tooltip>
            </IconButton>

          </Stack>
        </Box>
      ),
    },
  ];
 
    // const handleSubmitReConsiderButton = async (rvid, status) => {
    //   const payload = {
    //     id: rvid,
    //     Status: status,
    //     CreatedBy: userData.UserId,
    //   };
  
    //   await APIFuncionUniversal(
    //     "put",
    //     payload,
    //     `hoc/status/${rvid}`,
    //     setErrorMsg
    //   );
    // };
  
    // const handleEdit = (row) => {
    //   let preprocess;
    //   if(userData.UserType===1){
    //     preprocess = 2;
    //   } else if(userData.UserType===2){
    //     preprocess = 5;
    //   } else if(userData.UserType===3){
    //     preprocess = 8;
    //   }
    //   alert(
    //     `ID [${row.id}] : ${StatusConvert(row.status)} -> ${StatusConvert(
    //       preprocess
    //     )}`
    //   );
    //   handleSubmitReConsiderButton(row.id, preprocess);
    //   navigate(`/hoc/edit/${row.id}`);
    // };
  
    // const handleShow = (row) => {
    //   navigate(`/hoc/show/${row.id}`);
    // };
  
    // const handlePrint = (row) => {
    //   navigate(`/hoc/print/${row.id}`);
    // };
  
    const handleDelete = async (row) => {
      await APIFuncionUniversal(
        "delete",
        null,
        `formula/${row.id}`,
        setErrorMsg
      );
      setLoading(true);
    };

  const columns = React.useMemo(
    () => column.filter((col) => VISIBLE_FIELDS.includes(col.field)),
    []
  );

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        {/* <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            fileName: "thai-export",
            utf8WithBom: true, // 👈 this fixes Thai in Excel
          }}
        />
        <GridToolbarQuickFilter /> */}
      </GridToolbarContainer>
    );
  }


  // GenerateId


  return (
    <div className="PackageSelector">
      <div className="PackageSelector_Header">
        <div>จัดการสูตรยา</div>
        <FormulaDialog Mode="new" Type='add' setLoading={setLoading}/>
        {/* <button className="DialogHNButton" variant="outlined" >เพิ่มสูตรยา</button> */}
      </div>
      <div className="PackageSelector_Body">
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            filter: {
              filterModel: {
                items:
                  userData.UserType === 1
                    ? [
                        {
                          field: "DeptId", // match column field
                          operator: "=", // or "equals" depending on your MUI version
                          value: parseInt(userData.Dept), // Dept is number, convert to string
                        },
                      ]
                    : [],
              },
            },
            pagination: {
              paginationModel: {
                pageSize: 25,
              },
            },
          }}
          slots={{ toolbar: CustomToolbar }}
          pageSizeOptions={[25, 50, 100]}
          disableRowSelectionOnClick
          showToolbar
        />
      </div>
    </div>
  );
  
};

export default PackageManager;