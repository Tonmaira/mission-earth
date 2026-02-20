import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import Slide from '@mui/material/Slide';
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { useNavigate } from 'react-router-dom';
import { formatDateTimeN7 } from '../Function';
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HocDocList({open,setOpen,data,VN}) {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  // const [open, setOpen] = React.useState(false);

  const VISIBLE_FIELDS = [
    "HN",
    "VN",
    "FullName",
    "insuranceType",
    "insuranceCompany",
    "ContractParty",
    "Dept",
    "CreateAt",
    "AcceptAt",
    "VerifyAt",
    "status",
    "action",
    // "UserType",
  ];
  
  const roleMap = {
    1: "เภสัช",
    2: "พยาบาล",
    // 3: "เจ้าหน้าที่ประสานสิทธิ",
    //4: "แพทย์",
  };

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
  
  const handleShow = (row) => {
    navigate(`/hoc/show/${row.id}`);
  };

  const column = [
    {
      field: "status",
      headerName: "Status",
      width: 240,
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
              
            <IconButton
              aria-label="showprint"
              size="small"
              onClick={() => handleShow(params.row)}
            >
              <Tooltip title="ดูเอกสาร">
                <VisibilityIcon />
              </Tooltip>
            </IconButton>
  
            
          </Stack>
        </Box>
      ),
    },
  ];

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseAndNewDoc = () => {
    setOpen(false);
    navigate(`/hoc/${VN}`);
  };
  const columns = React.useMemo(
      () => column.filter((col) => VISIBLE_FIELDS.includes(col.field)),
      []
    );

  return (
    <React.Fragment>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        maxWidth='100๔'
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"มีเอกสารของ VN ที่ค้นหา ต้องหารสร้างเอกสารใหม่?"}</DialogTitle>
        <DialogContent>
          <div className="RightTable">
                <div className="RightTablebox">
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
                    // slots={{ toolbar: CustomToolbar }}
                    pageSizeOptions={[25, 50, 100]}
                    disableRowSelectionOnClick
                    // showToolbar
                  />
                </div>
              </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color='error' onClick={handleClose}>ยกเลิก</Button>
          <Button variant="contained" color='primary' onClick={handleCloseAndNewDoc}>เพิ่มเอกสาร</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
