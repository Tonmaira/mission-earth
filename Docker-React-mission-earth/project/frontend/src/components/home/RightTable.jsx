import React, { useState } from "react";
import Divider from "@mui/material/Divider";
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
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import { formatDateTimeN7 } from "../Function";
import { APIFuncionUniversal } from "../../api/FunctionAPI";
import { Tooltip } from "@mui/material";
import StatusChangeDialog from "./StatusChangeDialog";
import HistoryDialog from "./HistoryDialog";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CaseCloaseDialog from "./CaseCloseDialog";
import ArticleIcon from '@mui/icons-material/Article';

const VISIBLE_FIELDS = [
  "HN",
  "VN",
  "FullName",
  "Dept",
  "CreateAt",
  "status",
  "action",
];

const roleMap = {
  1: "เภสัช",
  2: "พยาบาล",
  // 3: "เจ้าหน้าที่ประสานสิทธิ",
  //4: "แพทย์",
};

const visibilityMap = {
  1: [1, 2],
  2: [1, 2],
  3: [1],
  4: [1, 2],
  5: [1, 2],
  6: [1, 2],
  7: [1, 2, 3],
  8: [1, 2, 3],
  9: [1, 2, 3],
  10: [1, 2, 3],
  11: [1, 2, 3],
  12: [1, 2, 3],
};

function RightTable({ Mode,data,action }) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [ErrorMsg, setErrorMsg] = useState("");

  // console.log(userData.UserType)
  
  function filterByUserType(data, userType) {
    return data?.filter((item) => {
      // first check visibility by status + userType
      const canSee = visibilityMap[item.status]?.includes(userType);
      
      // console.log("userData.CreatedBy===item.CreatedBy",userData.UserId,item.CreatedBy)
      if (!canSee) return false;

      // extra condition if userType = 1 → must match Dept
      if (userType === 1 && userData.UserId !== "000000" && userData.UserId!==item.CreatedBy) {
        const dept = parseInt(userData.Dept, 10);
        if ([10, 14].includes(dept)) {
          return item.ClinicId === 10 || item.ClinicId === 14;
        } else {
          return item.ClinicId === dept;
        }
      }

      return true;
    });
  }

  // const result = filterByUserType(data, userData.UserType);
  const result = Mode === "history"
  ? data
  :  userData.Dept === 4 ? data
  : filterByUserType(data, userData.UserType);
    // :[];


    const StatusConvert = (value) => {
      switch (value) {
        case 1:
          return `รอตรวจสอบข้อมูล(เภสัช)`; // 1
        case 2:
          return `กำลังตรวจสอบข้อมูล(เภสัช)`; // 1
        case 3:
          return `แบบร่าง(เภสัช)`; // 1
        case 4:
          return `รอตรวจสอบข้อมูล(พยาบาล)`; // 1 2
        case 5:
          return `กำลังตรวจสอบข้อมูล(พยาบาล)`; // 1 2
        case 6:
          return `แบบร่าง(พยาบาล)`; // 1 2
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
              เสร็จสิ้น <CheckCircleIcon color="success" />
            </>
          ); // 1 2 3
        case 8:
          return `พิมพ์เอกสารแล้ว`;
        default:
          return "-";
      }
    };

  const column = [
    {
      field: "status",
      headerName: "Status",
      width: 340,
      renderCell: (params) => (
        <div className={`DivStatus DivStatus${params.row.status}`}>
          {StatusConvert(params.row.status)}
        </div>
      ),
      headerClassName: "header-center",
    },
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "VN",
      headerName: "VN",
      width: 80,
    },
    {
      field: "HN",
      headerName: "HN",
      width: 180,
    },
    {
      field: "FullName",
      headerName: "ชื่อ-สกุล",
      // flex: 1,
      width: 320,
    },
    {
      field: "Dept",
      headerName: "หน่วยงาน",
      width: 150,
    },
    {
      field: "UserType",
      headerName: "UserType",
      width: 150,
      renderCell: (params) => roleMap[params.row.UserType],
    },
    {
      field: "CreateAt",
      headerName: "สร้างเอกสาร",
      width: 100,
      renderCell: (params) => (
        <span>
          <Tooltip title={formatDateTimeN7(params.row.CreateAt)}>
            {formatDateTimeN7(params.row.CreateAt, "time")}
          </Tooltip>
        </span>
      ),
    },
    {
      field: "AcceptAt",
      headerName: "รับเอกสาร",
      width: 100,
      renderCell: (params) => (
        <span>
          <Tooltip title={formatDateTimeN7(params.row.AcceptAt)}>
            {formatDateTimeN7(params.row.AcceptAt, "time")}
          </Tooltip>
        </span>
      ),
    },
    {
      field: "VerifyAt",
      headerName: "ตรวจสอบ",
      width: 100,
      renderCell: (params) => (
        <span>
          <Tooltip title={formatDateTimeN7(params.row.VerifyAt)}>
            {formatDateTimeN7(params.row.VerifyAt, "time")}
          </Tooltip>
        </span>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 300,
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
          <Stack direction="row" spacing={1}>

            {action&&[1].includes(params.row.status) &&
              [1].includes(userData.UserType) && (
              <IconButton
                aria-label="process"
                size="small"
                onClick={() => handleProcess(params.row)}
              >
                <Tooltip title="ตรวจสอบ">
                  <CheckCircleIcon color="primary" />
                </Tooltip>
              </IconButton>
            )}

            {action&&[4].includes(params.row.status) &&
              [2].includes(userData.UserType) && (
              <IconButton
                aria-label="process"
                size="small"
                onClick={() => handleProcess(params.row)}
              >
                <Tooltip title="ตรวจสอบ">
                  <CheckCircleIcon color="warning" />
                </Tooltip>
              </IconButton>
            )}

            {action&&[7].includes(params.row.status) &&
              [3].includes(userData.UserType) && (
              <IconButton
                aria-label="process"
                size="small"
                onClick={() => handleProcess(params.row)}
              >
                <Tooltip title="ตรวจสอบ">
                  <CheckCircleIcon color="success" />
                </Tooltip>
              </IconButton>
            )}

            <IconButton
              aria-label="showprint"
              size="small"
              onClick={() => handleShow(params.row)}
            >
              <Tooltip title="ดูเอกสาร">
                <VisibilityIcon />
              </Tooltip>
            </IconButton>

            <Divider orientation="vertical" flexItem />

            {action&&userData.Dept === params.row.DeptId &&
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(params.row.status) &&
              [1].includes(userData.UserType) && (
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={() => handleEdit(params.row)}
                >
                  <Tooltip title="แก้ไข">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              )}

              {action&&userData.Dept === params.row.DeptId &&
              [4, 5, 6, 7, 8, 9, 10].includes(params.row.status) &&
              [2].includes(userData.UserType) && (
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={() => handleEdit(params.row)}
                >
                  <Tooltip title="แก้ไข">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              )}

              {action&&userData.Dept === params.row.DeptId &&
              [7, 8, 9, 10].includes(params.row.status) &&
              [3].includes(userData.UserType) && (
                <IconButton
                  aria-label="edit"
                  size="small"
                  onClick={() => handleEdit(params.row)}
                >
                  <Tooltip title="แก้ไข">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              )}

            {action&&userData.UserId === params.row.CreatedBy &&
              [1, 2, 3].includes(userData.UserType) && (
                <IconButton
                  aria-label="cancel"
                  size="small"
                  onClick={() => handleDelete(params.row)}
                >
                  <Tooltip title="ยกเลิก">
                    <DeleteIcon color="error" />
                  </Tooltip>
                </IconButton>
              )}

            <HistoryDialog rid={params.row.id} />

            {action&&userData.Role === 3 && (
              <React.Fragment>
                <Divider orientation="vertical" flexItem />
                <StatusChangeDialog rid={params.row.id} />
              </React.Fragment>
            )}

            {action&&userData.UserType === 3 && params.row.status === 11 && (
              <React.Fragment>
                <Divider orientation="vertical" flexItem />
                <CaseCloaseDialog rid={params.row.id} />
              </React.Fragment>
            )}
          </Stack>
        </Box>
      ),
    },
  ];

  const handleProcess = (row) => {
    let preprocess;
    if(row.status===1){
      preprocess = 2;
    } else if(row.status===4){
      preprocess = 5;
    } else if(row.status===7){
      preprocess = 8;
    }
    alert(
      `ID [${row.id}] : ${StatusConvert(row.status)} -> ${StatusConvert(
        preprocess
      )}`
    );
    handleSubmitReConsiderButton(row.id, preprocess);
    navigate(`/hoc/proceed/${row.id}`);//change navigate location //TODO
  };

  // const handleEditRightOrder = (row) => {
  //   alert(`ID [${row.id}] : ${StatusConvert(row.status)}`);
  //   navigate(`/right/approve/${row.id}`);
  // };

  const handleSubmitReConsiderButton = async (rvid, status) => {
    const payload = {
      id: rvid,
      Status: status,
      CreatedBy: userData.UserId,
    };

    await APIFuncionUniversal(
      "put",
      payload,
      `hoc/status/${rvid}`,
      setErrorMsg
    );
  };

  const handleEdit = (row) => {
    let preprocess;
    if(userData.UserType===1){
      preprocess = 2;
    } else if(userData.UserType===2){
      preprocess = 5;
    } else if(userData.UserType===3){
      preprocess = 8;
    }
    alert(
      `ID [${row.id}] : ${StatusConvert(row.status)} -> ${StatusConvert(
        preprocess
      )}`
    );
    handleSubmitReConsiderButton(row.id, preprocess);
    navigate(`/hoc/edit/${row.id}`);
  };

  const handleShow = (row) => {
    navigate(`/hoc/show/${row.id}`);
  };

  // const handlePrint = (row) => {
  //   navigate(`/hoc/print/${row.id}`);
  // };

  const handleDelete = async (row) => {
    await APIFuncionUniversal(
      "delete",
      null,
      `hoc/${row.id}`,
      setErrorMsg
    );
  };

  const columns = React.useMemo(
    () => column.filter((col) => VISIBLE_FIELDS.includes(col.field)),
    []
  );

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport
          csvOptions={{
            fileName: "thai-export",
            utf8WithBom: true, // 👈 this fixes Thai in Excel
          }}
        />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div className="RightTable">
      <div className="RightTablebox">
        <DataGrid
          rows={result}
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
}

export default RightTable;
