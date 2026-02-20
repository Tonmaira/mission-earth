import HomeIcon from '@mui/icons-material/Home';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import SearchIcon from '@mui/icons-material/Search';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ScienceIcon from '@mui/icons-material/Science';

export const LinkList = [
    {
        id: 1,
        name: "Home",
        location: "/dashboard",
        icon: <HomeIcon fontSize="small" style={{ color: "#fff" }} />,
        iconMobile: <HomeIcon fontSize="small" style={{ color: "blue" }} />,
        permission: "user",
    },
    // {
    //     id: 2,
    //     name: "ค้นหาเอกสาร",
    //     location: "/ipdaudit",
    //     icon: <SearchIcon fontSize="small" style={{ color: "#fff" }}/>,
    //     iconMobile: <SearchIcon fontSize="small" style={{ color: "#ff9320" }} />,
    //     permission: "user",
    // },
    // {
    //     id: 3,
    //     name: "กรอกข้อมูล",
    //     location: "/ipdaudit/create/new",
    //     icon: <EditDocumentIcon fontSize="small" style={{ color: "#fff" }}/>,
    //     iconMobile: <EditDocumentIcon fontSize="small" style={{ color: "#4dafab" }} />,
    //     permission: "user",
    // },
    // {
    //     id: 4,
    //     name: "สรุป",
    //     location: "/report",
    //     icon: <DescriptionIcon fontSize="small" style={{ color: "#fff" }}/>,
    //     iconMobile: <DescriptionIcon fontSize="small" style={{ color: "#2bcb2b" }} />,
    //     permission: "user",
    // },
    // {
    //     id: 5,
    //     name: "DEPT",
    //     location: "/admin/dept",
    //     icon: <PersonIcon fontSize="small" style={{ color: "#fff" }}/>,
    //     iconMobile: <PersonIcon fontSize="small" style={{ color: "purple" }} />,
    //     permission: "admin",
    // },
    // {
    //     id: 6,
    //     name: "PCT",
    //     location: "/admin/pct",
    //     icon: <PersonIcon fontSize="small" style={{ color: "#fff" }}/>,
    //     iconMobile: <PersonIcon fontSize="small" style={{ color: "purple" }} />,
    //     permission: "admin",
    // },
    {
        id: 7,
        name: "ADMIN",
        location: "/admin",
        icon: <PersonIcon fontSize="small" style={{ color: "#fff" }}/>,
        iconMobile: <PersonIcon fontSize="small" style={{ color: "purple" }} />,
        permission: "admin",
    },
    {
        id: 8,
        name: "HISTORY",
        location: "/report",
        icon: <AssessmentIcon fontSize="small" style={{ color: "#fff" }}/>,
        iconMobile: <AssessmentIcon fontSize="small" style={{ color: "purple" }} />,
        permission: "user",
    },
    {
        id: 9,
        name: "FORMULA",
        location: "/package",
        icon: <ScienceIcon fontSize="small" style={{ color: "#fff" }}/>,
        iconMobile: <ScienceIcon fontSize="small" style={{ color: "purple" }} />,
        permission: "admin",
    }
];

// export const TableList_Data = {
//     DeptAudit : {
//         name:"จำนวนการ Audit แต่ละแผนก"
//     },
//     PCTAudit : {
//         name:"จำนวนการ Audit แต่ละ PCT"
//     },
//     AuditorAudit : {
//         name:"จำนวนการแฟ้มเอกสารต่อ Auditor"
//     }
// };