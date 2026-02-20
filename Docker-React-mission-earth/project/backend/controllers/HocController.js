const HOC = require("../models/hoc");
const Staffs = require("../models/staffs");
const Departments = require("../models/departments");
const { Op } = require("sequelize");
const { sequelize } = require("../config/dbConn");
const { QueryTypes } = require("sequelize");
const { executeAndStoreQueryResult } = require("../services/broadcastService");
const { CreateEvent } = require("../controllers/EventCrontroller");

/**
 * Broadcasts the latest Hoc data to all connected clients.
//  * @param {Set<WebSocket>} clients - The set of connected WebSocket clients
 */

const StatusConvertString = (id) => {
  if (id === 1) return "รอตรวจสอบข้อมูล(เภสัช)";
  if (id === 2) return "กำลังตรวจสอบข้อมูล(เภสัช)";
  if (id === 3) return "แบบร่าง(เภสัช)";
  if (id === 4) return "รอตรวจสอบข้อมูล(พยาบาล)";
  if (id === 5) return "กำลังตรวจสอบข้อมูล(พยาบาล)";
  if (id === 6) return "แบบร่าง(พยาบาล)";
  // if (id === 7) return "รอตรวจสอบข้อมูล(ประสานสิทธิ)";
  // if (id === 8) return "กำลังตรวจสอบข้อมูล(ประสานสิทธิ)";
  // if (id === 9) return "แบบร่าง(ประสานสิทธิ)";
  // if (id === 10) return "ตรวจสอบแล้ว(ประสานสิทธิ)";
  // if (id === 11) return "พิมพ์เอกสารแล้ว";
  if (id === 7) return "เสร็จสิ้น";
  if (id === 8) return "พิมพ์เอกสารแล้ว";

  return "ไม่ทราบสถานะ"; // default case
};

HOC.belongsTo(Staffs, {
  foreignKey: "CreatedBy",
  targetKey: "UserId",
});

HOC.belongsTo(Departments, {
  foreignKey: "Dept",
  targetKey: "Id",
});


//Dashboard
// const getAllHoc = async (req, res) => {
//   try {
//     const hoc = await HOC.findAll({
//       include: [
//         {
//           model: Staffs,
//           attributes: ["UserId", "Name"],
//           as: "Staff",
//         },
//         {
//           model: Departments,
//           attributes: ["Id", "ShortName"],
//           as: "Department",
//         },
//       ],
//       where: { DeleteAt: null },
//       order: [
//         ["Status", "ASC"],
//         ["DeleteAt", "ASC"],
//         ["Id", "DESC"],
//       ],
//     });

//     const auditData = hoc.map((item) => ({
//       id: item.Id,
//       HN: item.HN,
//       FullName: item.FullName || "",
//       // insuranceType: item.insuranceType || "",
//       // insuranceCompany: item.insuranceCompany || "",
//       // ContractParty: item.ContractParty || "",
//       Dept: item.Department?.ShortName || null,
//       UserType: item.UserType || null,
//       action: item.Id,
//       status: item.Status,
//       CreateAt: item.CreateAt,
//       AcceptAt: item.AcceptAt,
//       VerifyAt: item.VerifyAt,

//       CreatedBy: item.CreatedBy,
//       CreatedStaffName: item.Staff?.Name || null,
//     }));

//     res.status(200).json(auditData);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const getAllHocById = async (req, res) => {
    const { id } = req.params;
  try {
    const hoc = await HOC.findAll({
      include: [
        {
          model: Staffs,
          attributes: ["UserId", "Name"],
          as: "Staff",
        },
        // {
        //   model: Departments,
        //   attributes: ["Id", "ShortName"],
        //   as: "Department",
        // },
      ],
      where: { DeleteAt: null, Id: id },
      order: [
        ["DeleteAt", "ASC"],
        ["Id", "DESC"],
      ],
    });

    const hocData = hoc.map((item) => ({
      id: item.Id,
      HN: item.HN,
      VN: item.VN,
      FullName: item.FullName,
      Status: item.Status,
      // insuranceType: item.insuranceType,
      // insuranceCompany: item.insuranceCompany,
      // ContractParty: item.ContractParty,
      Dept: item.Dept,
      // Dept: item.Dept,
      // DeptShortName: item.Department?.ShortName || null,
      FormData: JSON.parse(item?.FormData,null),
      // FormData: "test",
      // RightList: JSON.parse(item?.RightList,null),
      Remark: item.Remark,
      CreateAt: item.CreateAt,
      AcceptAt: item.AcceptAt,
      VerifyAt: item.VerifyAt,
      CreatedBy: item.CreatedBy,
      CreatedStaffName: item.Staff?.Name || null,
    }));

    res.status(200).json(hocData[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllHocByVN = async (req, res) => {
  const { id } = req.params;
try {
  const HocQuery = `
      DECLARE @StartDate DATETIME = CONVERT(DATETIME, CONVERT(VARCHAR, GETDATE(), 112));
      DECLARE @EndDate DATETIME = DATEADD(MILLISECOND, -3, DATEADD(DAY, 1, @StartDate));
      DECLARE @VNN NVARCHAR(50) = :id
            
      SELECT 
          hc.Id AS id,
          hc.HN,
          hc.VN,
          hc.FullName,
          hc.UserType,
          hc.Status AS status,
          hc.CreateAt,
          hc.AcceptAt,
          hc.VerifyAt,
          hc.CreatedBy,
          s.Name AS CreatedStaffName,
          d.Id AS DeptId,
          d.FullName AS Dept
          --JSON_VALUE([FormData], '$.InfoData.clinic') AS ClinicCode,
          --(SELECT Id From Departments WHERE ShortName = JSON_VALUE([FormData], '$.InfoData.clinic')) AS ClinicId
      FROM HOC hc
      LEFT JOIN Staffs s 
          ON hc.CreatedBy = s.UserId
      LEFT JOIN Departments d 
          ON s.Dept = d.Id
      WHERE hc.DeleteAt IS NULL
          AND hc.CreateAt BETWEEN @StartDate AND @EndDate
          AND VN = @VNN
      ORDER BY
          hc.Status ASC,
          hc.DeleteAt ASC,
          hc.Id DESC;
    `;
    
    const RightList = await sequelize.query(HocQuery, {
      replacements: { id },
      type: sequelize.QueryTypes.SELECT,
    });

//     // const result = hoc.map(item => ({
//     //   id: item.id,
//     //   HN: item.HN,
//     //   VN: item.VN,
//     //   FullName: item.FullName || "",
//     //   DeptId: item.DeptId || null,
//     //   Dept: item.Dept || null,
//     //   UserType: item.UserType || null,
//     //   status: item.status,
//     //   ClinicId: item.ClinicId, 
//     //   ClinicCode: item.ClinicCode,
//     //   CreateAt: item.CreateAt,
//     //   AcceptAt: item.AcceptAt,
//     //   VerifyAt: item.VerifyAt,
//     //   CreatedBy: item.CreatedBy,
//     //   CreatedStaffName: item.CreatedStaffName || null,
//     // }));

  res.status(200).json(RightList);
} catch (err) {
  res.status(500).json({ message: err.message });
}
};

// const updateRightOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { RightList, Status,CreatedBy,Remark } = req.body;

//     const order = await Hoc.findByPk(id);

//     let tempVerifyAt;
//     let tempAcceptAt;

//     // console.log(order.Id,order.Status)
//     const EventMasterid = id;
//     const EventRemark = `Change Status From ${StatusConvertString(order.Status)}[${order.Status}] to ${StatusConvertString(Status)}[${Status}]`;

//     await CreateEvent(
//       EventMasterid,          // RowId
//       "UPDATE",                 // Action
//       EventRemark, // Remark
//       CreatedBy                 // CreatedBy
//     );

//     if (Status === 5) {
//       tempAcceptAt = order.AcceptAt;
//       tempVerifyAt = sequelize.literal("CURRENT_TIMESTAMP");
//     } else if( order.Status === 1 && Status === 2){
//       tempAcceptAt = sequelize.literal("CURRENT_TIMESTAMP");
//       tempVerifyAt = order.VerifyAt;
//     } else{
//       tempAcceptAt = order.AcceptAt;
//       tempVerifyAt = order.VerifyAt;
//     }

//     if (!order) {
//       return res.status(404).json({ error: "Hoc not found" });
//     }

//     order.RightList = RightList || order.RightList;
//     order.Status = Status || order.Status;
//     order.Remark = Remark || order.Remark;
//     order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
//     order.AcceptAt = tempAcceptAt;
//     order.VerifyAt = tempVerifyAt;

//     await order.save();

//     res.json(order);
//   } catch (error) {
//     console.error("Error updating Hoc:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const updateStatusByStatusNo = async (req, res) => {
  console.log("updateStatusByStatusNo");
  try {
    const { id } = req.params;
    const { Status,CreatedBy } = req.body;

    let tempVerifyAt;
    let tempAcceptAt;

    const order = await HOC.findByPk(id);

    if (Status === 5) {
      tempAcceptAt = order.AcceptAt;
      tempVerifyAt = sequelize.literal("CURRENT_TIMESTAMP");
    } else if(order.Status === 1 && Status === 2){
      tempAcceptAt = sequelize.literal("CURRENT_TIMESTAMP");
      tempVerifyAt = order.VerifyAt;
    } else{
      tempAcceptAt = order.AcceptAt;
      tempVerifyAt = order.VerifyAt;
    }
    
    const EventMasterid = id;
    const EventRemark = `Change Status From ${StatusConvertString(order.Status)}[${order.Status}] to ${StatusConvertString(Status)}[${Status}]`;

    // console.log(order.Id,order.Status)
    await CreateEvent(
      EventMasterid,          // RowId
      "UPDATE",                 // Action
      EventRemark, // Remark
      CreatedBy                 // CreatedBy
    );
    
    if (!order) {
      return res.status(404).json({ error: "Hoc not found" });
    }

    order.Status = Status || order.Status;
    // order.RightList = RightList || order.RightList;
    // order.CreatedBy = CreatedBy || order.CreatedBy;
    order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    order.AcceptAt = tempAcceptAt;
    order.VerifyAt = tempVerifyAt;
    

    await order.save();

    executeAndStoreQueryResult();
    
    res.json(order);
  } catch (error) {
    console.error("Error updating Hoc:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const updateStatusByStatusNoAndRemark = async (req, res) => {
//   console.log("updateStatusByStatusNoAndRemark");
//   try {
//     const { id } = req.params;
//     const { Status,CreatedBy,Remark } = req.body;

//     let tempVerifyAt;
//     let tempAcceptAt;

//     const order = await Hoc.findByPk(id);

//     if (Status === 5) {
//       tempAcceptAt = order.AcceptAt;
//       tempVerifyAt = sequelize.literal("CURRENT_TIMESTAMP");
//     } else if(order.Status === 1 && Status === 2){
//       tempAcceptAt = sequelize.literal("CURRENT_TIMESTAMP");
//       tempVerifyAt = order.VerifyAt;
//     } else{
//       tempAcceptAt = order.AcceptAt;
//       tempVerifyAt = order.VerifyAt;
//     }
    
//     const EventMasterid = id;
//     const EventRemark = `Request Validate Change Status From ${StatusConvertString(order.Status)}[${order.Status}] to ${StatusConvertString(Status)}[${Status}]`;

//     // console.log(order.Id,order.Status)
//     await CreateEvent(
//       EventMasterid,          // RowId
//       "UPDATE",                 // Action
//       EventRemark, // Remark
//       CreatedBy                 // CreatedBy
//     );
    
//     if (!order) {
//       return res.status(404).json({ error: "Hoc not found" });
//     }

//     order.Status = Status || order.Status;
//     order.Remark = Remark || order.Remark;
//     // order.RightList = RightList || order.RightList;
//     // order.CreatedBy = CreatedBy || order.CreatedBy;
//     order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
//     order.AcceptAt = tempAcceptAt;
//     order.VerifyAt = tempVerifyAt;
    

//     await order.save();

    
    
//     res.json(order);
//   } catch (error) {
//     console.error("Error updating Hoc:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// const updatePrintStatus = async (req, res) => {
//   console.log("updatePrintStatus");
//   try {
//     const { Idd, OrderIdd, FilesIDD, PrintStatus, CreatedBy } = req.body;

//     // Find main order by patient Id
//     const order = await Hoc.findByPk(Idd);

//     if (!order) {
//       return res.status(404).json({ error: "Hoc not found" });
//     }

//     // Parse JSON from DB
//     let rightList = order.RightList;
//     if (typeof rightList === "string") {
//       try {
//         rightList = JSON.parse(rightList);
//       } catch (err) {
//         rightList = [];
//       }
//     }

//     // Update PrintStatus
//     const updatedRightList = rightList.map((right) =>
//       right.id === OrderIdd
//         ? {
//             ...right,
//             attachedFiles: right.attachedFiles.map((file) =>
//               file.FilesIDD === FilesIDD
//                 ? { ...file, PrintStatus }
//                 : file
//             ),
//           }
//         : right
//     );

//     // Audit log
//     await CreateEvent(
//       Idd,
//       "UPDATE",
//       `พิมพ์เอกสาร ${FilesIDD} `,
//       CreatedBy
//     );

//     // Save back as string
//     order.RightList = JSON.stringify(updatedRightList);
//     order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");

//     await order.save();

//     res.json(order);
//   } catch (error) {
//     console.error("Error updating PrintStatus:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


const updateStatusDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await HOC.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: "Hoc not found" });
    }

    order.DeleteAt = sequelize.literal("CURRENT_TIMESTAMP");

    await order.save();

    res.json(order);

    // const clients = req.app.locals.wssClients;
    // broadcastAllHoc(clients);

    executeAndStoreQueryResult();
    
  } catch (error) {
    console.error("Error updating Hoc:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const newHoc = async (req, res) => {
  const {
    HN,
    VN,
    FullName,
    FormData,
    Status,
    // insuranceType,
    // insuranceCompany,
    // ContractParty,
    Dept,
    CreatedBy,
  } = req.body;

  try {
    const staff = await Staffs.findOne({ where: { UserId: CreatedBy } });

    if (!staff) {
      return res.status(400).json({ message: "Invalid CreatedBy user" });
    }

    const Hocs = await HOC.create({
      HN,
      VN: VN || null,
      FullName: FullName || null,
      // insuranceType: insuranceType || null,
      // insuranceCompany: insuranceCompany || null,
      // ContractParty: ContractParty || null,
      Status:Status,
      Dept: staff.Dept || Dept,
      FormData: FormData,
      CreatedBy,
      CreateAt: sequelize.literal("CURRENT_TIMESTAMP"),
      UpdateAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // console.log("Hocs",Hocs)
    // Create an event record for this action
    await CreateEvent(
      Hocs.Id,          // RowId
      "CREATE",                 // Action
      `Created Hoc for VN ${VN}`, // Remark
      CreatedBy                 // CreatedBy
    );

    // **Broadcast the updated list to all WebSocket clients**
    // const clients = req.app.locals.wssClients;
    // broadcastAllHoc(clients);

    executeAndStoreQueryResult();

    res.status(201).json({
      message: `Hocs created successfully`,
      Hocs,
    });
  } catch (error) {
    console.error("Error creating Hocs:", error);
    res.status(500).json({
      message: "An error occurred while creating Hocs",
      error: error.message,
    });
  }
};

const updateHoc = async (req, res) => {
  const { id } = req.params; // ดึง id ของ Hoc ที่ต้องการแก้ไข
  const {
    HN,
    VN,
    FullName,
    FormData,
    // insuranceType,
    // insuranceCompany,
    // ContractParty,
    Dept,
    CreatedBy,
    Status
  } = req.body;

  try {
    // ตรวจสอบว่า record มีอยู่จริงหรือไม่
    const Hoc = await HOC.findByPk(id);

    if (!Hoc) {
      return res.status(404).json({ message: "Hoc not found" });
    }

    const EventMasterid = id;
    const EventRemark = `Edit Status From ${StatusConvertString(Hoc.Status)}[${Hoc.Status}] to ${StatusConvertString(Hoc.Status)}[${Hoc.Status}]`;

    await CreateEvent(
      EventMasterid,          // RowId
      "EDIT",                 // Action
      EventRemark, // Remark
      CreatedBy                 // CreatedBy
    );

    // ตรวจสอบว่า UpdatedBy เป็น staff จริงหรือไม่
    // const staff = await Staffs.findOne({ where: { UserId: UpdatedBy } });
    // if (!staff) {
    //   return res.status(400).json({ message: "Invalid UpdatedBy user" });
    // }

    // อัพเดทข้อมูล
    await Hoc.update({
      HN: HN ?? Hoc.HN,
      VN: VN ?? Hoc.VN,
      FullName: FullName ?? Hoc.FullName,
      // insuranceType: insuranceType ?? Hoc.insuranceType,
      // insuranceCompany: insuranceCompany ?? Hoc.insuranceCompany,
      // ContractParty: ContractParty ?? Hoc.ContractParty,
      Dept: Dept ?? Hoc.Dept,
      FormData: FormData ?? Hoc.FormData,
      UpdateAt: sequelize.literal("CURRENT_TIMESTAMP"),
      Status:Status,
    });

    res.json({
      message: "Hoc updated successfully",
      Hoc: Hoc,
    });
  } catch (error) {
    console.error("Error updating Hoc:", error);
    res.status(500).json({
      message: "An error occurred while updating Hoc",
      error: error.message,
    });
  }
};

// const checkDuplicateHoc = async (req, res) => {
//   const { HN } = req.body; // frontend should send { HN: "..." }

//   if (!HN) {
//     return res.status(400).json({ message: "HN is required." });
//   }

//   try {
//     // Use CURRENT_TIMESTAMP in SQL directly
//     const query = `
//       SELECT 1 
//       FROM Hoc
//       WHERE HN = :hn
//         AND DeleteAt IS NULL
//         AND CONVERT(date, CreateAt) = CONVERT(date, CURRENT_TIMESTAMP)
//     `;

//     const result = await sequelize.query(query, {
//       replacements: { hn: HN },
//       type: QueryTypes.SELECT,
//     });

//     if (result.length > 0) {
//       // Duplicate exists → 304 Not Modified
//       return res.status(304).json({ message: "Record already exists." });
//     }

//     // No duplicate → 200 OK
//     return res.status(200).json({ message: "No duplicate found." });
//   } catch (err) {
//     console.error("Error in checkDuplicateHocByQuery:", err);
//     return res.status(500).json({ message: err.message });
//   }
// };

const HistoryAllHoc = async (req, res) => {
  const { start, end } = req.params;

  console.log("start", start);
  console.log("end", end);

  try {
    const startdate = `${start} 00:00:00.000`;
    const enddate = `${end} 23:59:59.999`;

    const HocQuery = `
      SELECT 
        rv.Id AS id,
        rv.HN,
        rv.VN,
        rv.FullName,
        rv.UserType,
        rv.Status AS status,
        rv.CreateAt,
        rv.AcceptAt,
        rv.VerifyAt,
        rv.CreatedBy,
        s.Name AS CreatedStaffName,
        d.Id AS DeptId,
        d.ShortName AS Dept
      FROM 
        Hoc rv
      LEFT JOIN Staffs s 
        ON rv.CreatedBy = s.UserId
      LEFT JOIN Departments d 
        ON s.Dept = d.Id
      WHERE 
        rv.DeleteAt IS NULL
        AND rv.CreateAt BETWEEN :startdate AND :enddate
      ORDER BY 
        rv.Status ASC,
        rv.DeleteAt ASC,
        rv.Id DESC;
    `;

    const hoc = await sequelize.query(HocQuery, {
      type: sequelize.QueryTypes.SELECT,
      replacements: { startdate, enddate },
      logging: console.log,
    });

    // console.log(hoc);

    const result = hoc.map(item => ({
      id: item.id,
      HN: item.HN,
      VN: item.VN,
      FullName: item.FullName || "",
      DeptId: item.DeptId || null,
      Dept: item.Dept || null,
      UserType: item.UserType || null,
      status: item.status,
      CreateAt: item.CreateAt,
      AcceptAt: item.AcceptAt,
      VerifyAt: item.VerifyAt,
      CreatedBy: item.CreatedBy,
      CreatedStaffName: item.CreatedStaffName || null,
    }));

    // executeAndStoreQueryResult();

    return res.status(200).json({ result });

  } catch (err) {
    console.error("Error broadcasting Hoc:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  // checkDuplicateHoc,
  updateStatusDelete,
  updateStatusByStatusNo,
  // updateRightOrder,
  // getAllHoc,
  getAllHocById,
  updateHoc,
  // updatePrintStatus,
  newHoc,
  HistoryAllHoc,
  // updateStatusByStatusNoAndRemark,
  getAllHocByVN,
};
