const FORMULA = require("../models/formula");
const Staffs = require("../models/staffs");
const Departments = require("../models/departments");
const { Op } = require("sequelize");
const { sequelize } = require("../config/dbConn");
const { QueryTypes } = require("sequelize");
const { executeAndStoreQueryResult } = require("../services/broadcastService");
const { CreateEvent } = require("../controllers/EventCrontroller");

const newFormula = async (req, res) => {
  const {
    FormulaName,
    FormulaList,
    Remark,
    CreatedBy
  } = req.body;

  try {

    if (!FormulaName) {
      return res.status(400).json({ message: "Invalid FormulaName" });
    }

    const formulas = await FORMULA.create({
      FormulaName: FormulaName,
      FormulaList: FormulaList,
      Remark:Remark,
      CreatedBy:CreatedBy,
    });

    // await CreateEvent(
    //   formulas.Id,          // RowId
    //   "CREATE",                 // Action
    //   `Created Formula ${FormulaName}`, // Remark
    //   CreatedBy                 // CreatedBy
    // );

    res.status(201).json({
      message: `formulas created successfully`,
      formulas,
    });
  } catch (error) {
    console.error("Error creating formulas:", error);
    res.status(500).json({
      message: "An error occurred while creating formulas",
      error: error.message,
    });
  }
};

const getFormulaList = async (req, res) => {
try {
  const formulars = await FORMULA.findAll({where: {
    DeleteAt: null
  }
});

  const formularsData = formulars.map((item) => ({
    id: item.Id,
    FormulaName: item.FormulaName,
    action: item.Id,
    // FormulaList: JSON.parse(item?.FormulaList,"[]"),
    // Remark: item.Remark,
  }));

  res.status(200).json(formularsData);
} catch (err) {
  res.status(500).json({ message: err.message });
}
};

const getAllFormula = async (req, res) => {
    const { id } = req.params;
  try {
    const formulars = await FORMULA.findAll({where: {
      DeleteAt: null
    }
  });
  
    const formularsData = formulars.map((item) => ({
      id: item.Id,
      FormulaName: item.FormulaName,
      FormulaList: JSON.parse(item?.FormulaList,"[]"),
      Remark: item.Remark,
    }));

    res.status(200).json(formularsData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllFormulaById = async (req, res) => {
  const { id } = req.params;

  try {
    const formular = await FORMULA.findOne({where: {
      Id: id,
      DeleteAt: null
    }
  });

    if (!formular) {
      return res.status(404).json({ message: "Formula not found" });
    }

    const data = {
      id: formular.Id,
      FormulaName: formular.FormulaName,
      FormulaList: JSON.parse(formular?.FormulaList || "[]"),
      Remark: formular.Remark,
    };

    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const UpdateFormulaById = async (req, res) => {
  const { id } = req.params;
  const {FormulaList} = req.body;

  try {
    const formulas = await FORMULA.findByPk(id);
    if (!formulas) {
      return res.status(404).json({ message: "formulas not found" });
    }
    
    await formulas.update({FormulaList: FormulaList});

  res.json({
      message: "FORMULA updated successfully",
      data: formulas,
    });
  } catch (error) {
    console.error("Error updating FORMULA:", error);
    res.status(500).json({
      message: "An error occurred while updating FORMULA",
      error: error.message,
    });
  }
};

//const updateHoc = async (req, res) => {
  //   const { id } = req.params; // ดึง id ของ Hoc ที่ต้องการแก้ไข
  //   const {
  //     HN,
  //     VN,
  //     FullName,
  //     FormData,
  //     // insuranceType,
  //     // insuranceCompany,
  //     // ContractParty,
  //     Dept,
  //     CreatedBy,
  //     Status
  //   } = req.body;
  
  //   try {
  //     // ตรวจสอบว่า record มีอยู่จริงหรือไม่
  //     const Hoc = await HOC.findByPk(id);
  
  //     if (!Hoc) {
  //       return res.status(404).json({ message: "Hoc not found" });
  //     }
  
  //     const EventMasterid = id;
  //     const EventRemark = `Edit Status From ${StatusConvertString(Hoc.Status)}[${Hoc.Status}] to ${StatusConvertString(Hoc.Status)}[${Hoc.Status}]`;
  
  //     await CreateEvent(
  //       EventMasterid,          // RowId
  //       "EDIT",                 // Action
  //       EventRemark, // Remark
  //       CreatedBy                 // CreatedBy
  //     );
  
      // ตรวจสอบว่า UpdatedBy เป็น staff จริงหรือไม่
      // const staff = await Staffs.findOne({ where: { UserId: UpdatedBy } });
      // if (!staff) {
      //   return res.status(400).json({ message: "Invalid UpdatedBy user" });
      // }
  
  //     // อัพเดทข้อมูล
  //     await Hoc.update({
  //       HN: HN ?? Hoc.HN,
  //       VN: VN ?? Hoc.VN,
  //       FullName: FullName ?? Hoc.FullName,
  //       // insuranceType: insuranceType ?? Hoc.insuranceType,
  //       // insuranceCompany: insuranceCompany ?? Hoc.insuranceCompany,
  //       // ContractParty: ContractParty ?? Hoc.ContractParty,
  //       Dept: Dept ?? Hoc.Dept,
  //       FormData: FormData ?? Hoc.FormData,
  //       UpdateAt: sequelize.literal("CURRENT_TIMESTAMP"),
  //       Status:Status,
  //     });
  
  //     res.json({
  //       message: "Hoc updated successfully",
  //       Hoc: Hoc,
  //     });
  //   } catch (error) {
  //     console.error("Error updating Hoc:", error);
  //     res.status(500).json({
  //       message: "An error occurred while updating Hoc",
  //       error: error.message,
  //     });
  //   }
  // };
  
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

const DeleteFormulaById = async (req, res) => {
  try {
    const { id } = req.params;
    const formulas = await FORMULA.findByPk(id);

    if (!formulas) {
      return res.status(404).json({ error: "FORMULA not found" });
    }

    formulas.DeleteAt = sequelize.literal("CURRENT_TIMESTAMP");

    await formulas.save();

    res.json(formulas);

    // const clients = req.app.locals.wssClients;
    // broadcastAllHoc(clients);

    // executeAndStoreQueryResult();
    
  } catch (error) {
    console.error("Error updating FORMULA:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// const getByVN = async (req, res) => {
//   const { id } = req.params;
// try {
//   const HocQuery = `
//       DECLARE @StartDate DATETIME = CONVERT(DATETIME, CONVERT(VARCHAR, GETDATE(), 112));
//       DECLARE @EndDate DATETIME = DATEADD(MILLISECOND, -3, DATEADD(DAY, 1, @StartDate));
//       DECLARE @VNN NVARCHAR(50) = :id
            
//       SELECT 
//           hc.Id AS id,
//           hc.HN,
//           hc.VN,
//           hc.FullName,
//           hc.UserType,
//           hc.Status AS status,
//           hc.CreateAt,
//           hc.AcceptAt,
//           hc.VerifyAt,
//           hc.CreatedBy,
//           s.Name AS CreatedStaffName,
//           d.Id AS DeptId,
//           d.FullName AS Dept
//           --JSON_VALUE([FormData], '$.InfoData.clinic') AS ClinicCode,
//           --(SELECT Id From Departments WHERE ShortName = JSON_VALUE([FormData], '$.InfoData.clinic')) AS ClinicId
//       FROM HOC hc
//       LEFT JOIN Staffs s 
//           ON hc.CreatedBy = s.UserId
//       LEFT JOIN Departments d 
//           ON s.Dept = d.Id
//       WHERE hc.DeleteAt IS NULL
//           AND hc.CreateAt BETWEEN @StartDate AND @EndDate
//           AND VN = @VNN
//       ORDER BY
//           hc.Status ASC,
//           hc.DeleteAt ASC,
//           hc.Id DESC;
//     `;
    
//     const RightList = await sequelize.query(HocQuery, {
//       replacements: { id },
//       type: sequelize.QueryTypes.SELECT,
//     });

// //     // const result = hoc.map(item => ({
// //     //   id: item.id,
// //     //   HN: item.HN,
// //     //   VN: item.VN,
// //     //   FullName: item.FullName || "",
// //     //   DeptId: item.DeptId || null,
// //     //   Dept: item.Dept || null,
// //     //   UserType: item.UserType || null,
// //     //   status: item.status,
// //     //   ClinicId: item.ClinicId, 
// //     //   ClinicCode: item.ClinicCode,
// //     //   CreateAt: item.CreateAt,
// //     //   AcceptAt: item.AcceptAt,
// //     //   VerifyAt: item.VerifyAt,
// //     //   CreatedBy: item.CreatedBy,
// //     //   CreatedStaffName: item.CreatedStaffName || null,
// //     // }));

//   res.status(200).json(RightList);
// } catch (err) {
//   res.status(500).json({ message: err.message });
// }
// };

const updateRightOrder = async (req, res) => {
  const { id } = req.params;
  const { FormulaName, FormulaList,Remark } = req.body;

  try {
    const formular = await FORMULA.findByPk(id);
    // const formular = await FORMULA.findOne({ Id: id });

    if (!formular) {
      return res.status(404).json({ message: "Formula not found" });
    }

    const EventMasterid = id;
    const EventRemark = `Change Status From ${StatusConvertString(order.Status)}[${order.Status}] to ${StatusConvertString(Status)}[${Status}]`;
    await CreateEvent(
      EventMasterid,          // RowId
      "UPDATE",                 // Action
      EventRemark, // Remark
      CreatedBy                 // CreatedBy
    );

    if (Status === 5) {
      tempAcceptAt = order.AcceptAt;
      tempVerifyAt = sequelize.literal("CURRENT_TIMESTAMP");
    } else if( order.Status === 1 && Status === 2){
      tempAcceptAt = sequelize.literal("CURRENT_TIMESTAMP");
      tempVerifyAt = order.VerifyAt;
    } else{
      tempAcceptAt = order.AcceptAt;
      tempVerifyAt = order.VerifyAt;
    }

    if (!order) {
      return res.status(404).json({ error: "Hoc not found" });
    }

    order.RightList = RightList || order.RightList;
    order.Status = Status || order.Status;
    order.Remark = Remark || order.Remark;
    order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    order.AcceptAt = tempAcceptAt;
    order.VerifyAt = tempVerifyAt;

    await order.save();

    res.json(order);

    // const data = {
    //   id: formular.Id,
    //   FormulaName: formular.FormulaName,
    //   FormulaList: JSON.parse(formular?.FormulaList || "[]"),
    //   Remark: formular.Remark,
    // };

    // res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const updateStatusByStatusNo = async (req, res) => {
//   console.log("updateStatusByStatusNo");
//   try {
//     const { id } = req.params;
//     const { Status,CreatedBy } = req.body;

//     let tempVerifyAt;
//     let tempAcceptAt;

//     const order = await HOC.findByPk(id);

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
//     const EventRemark = `Change Status From ${StatusConvertString(order.Status)}[${order.Status}] to ${StatusConvertString(Status)}[${Status}]`;

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
//     // order.RightList = RightList || order.RightList;
//     // order.CreatedBy = CreatedBy || order.CreatedBy;
//     order.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
//     order.AcceptAt = tempAcceptAt;
//     order.VerifyAt = tempVerifyAt;
    

//     await order.save();

//     executeAndStoreQueryResult();
    
//     res.json(order);
//   } catch (error) {
//     console.error("Error updating Hoc:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

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






// const updateHoc = async (req, res) => {
//   const { id } = req.params; // ดึง id ของ Hoc ที่ต้องการแก้ไข
//   const {
//     HN,
//     VN,
//     FullName,
//     FormData,
//     // insuranceType,
//     // insuranceCompany,
//     // ContractParty,
//     Dept,
//     CreatedBy,
//     Status
//   } = req.body;

//   try {
//     // ตรวจสอบว่า record มีอยู่จริงหรือไม่
//     const Hoc = await HOC.findByPk(id);

//     if (!Hoc) {
//       return res.status(404).json({ message: "Hoc not found" });
//     }

//     const EventMasterid = id;
//     const EventRemark = `Edit Status From ${StatusConvertString(Hoc.Status)}[${Hoc.Status}] to ${StatusConvertString(Hoc.Status)}[${Hoc.Status}]`;

//     await CreateEvent(
//       EventMasterid,          // RowId
//       "EDIT",                 // Action
//       EventRemark, // Remark
//       CreatedBy                 // CreatedBy
//     );

    // ตรวจสอบว่า UpdatedBy เป็น staff จริงหรือไม่
    // const staff = await Staffs.findOne({ where: { UserId: UpdatedBy } });
    // if (!staff) {
    //   return res.status(400).json({ message: "Invalid UpdatedBy user" });
    // }

//     // อัพเดทข้อมูล
//     await Hoc.update({
//       HN: HN ?? Hoc.HN,
//       VN: VN ?? Hoc.VN,
//       FullName: FullName ?? Hoc.FullName,
//       // insuranceType: insuranceType ?? Hoc.insuranceType,
//       // insuranceCompany: insuranceCompany ?? Hoc.insuranceCompany,
//       // ContractParty: ContractParty ?? Hoc.ContractParty,
//       Dept: Dept ?? Hoc.Dept,
//       FormData: FormData ?? Hoc.FormData,
//       UpdateAt: sequelize.literal("CURRENT_TIMESTAMP"),
//       Status:Status,
//     });

//     res.json({
//       message: "Hoc updated successfully",
//       Hoc: Hoc,
//     });
//   } catch (error) {
//     console.error("Error updating Hoc:", error);
//     res.status(500).json({
//       message: "An error occurred while updating Hoc",
//       error: error.message,
//     });
//   }
// };

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

// const HistoryAllHoc = async (req, res) => {
//   const { start, end } = req.params;

//   console.log("start", start);
//   console.log("end", end);

//   try {
//     const startdate = `${start} 00:00:00.000`;
//     const enddate = `${end} 23:59:59.999`;

//     const HocQuery = `
//       SELECT 
//         rv.Id AS id,
//         rv.HN,
//         rv.VN,
//         rv.FullName,
//         rv.UserType,
//         rv.Status AS status,
//         rv.CreateAt,
//         rv.AcceptAt,
//         rv.VerifyAt,
//         rv.CreatedBy,
//         s.Name AS CreatedStaffName,
//         d.Id AS DeptId,
//         d.ShortName AS Dept
//       FROM 
//         Hoc rv
//       LEFT JOIN Staffs s 
//         ON rv.CreatedBy = s.UserId
//       LEFT JOIN Departments d 
//         ON s.Dept = d.Id
//       WHERE 
//         rv.DeleteAt IS NULL
//         AND rv.CreateAt BETWEEN :startdate AND :enddate
//       ORDER BY 
//         rv.Status ASC,
//         rv.DeleteAt ASC,
//         rv.Id DESC;
//     `;

//     const hoc = await sequelize.query(HocQuery, {
//       type: sequelize.QueryTypes.SELECT,
//       replacements: { startdate, enddate },
//       logging: console.log,
//     });

//     // console.log(hoc);

//     const result = hoc.map(item => ({
//       id: item.id,
//       HN: item.HN,
//       VN: item.VN,
//       FullName: item.FullName || "",
//       DeptId: item.DeptId || null,
//       Dept: item.Dept || null,
//       UserType: item.UserType || null,
//       status: item.status,
//       CreateAt: item.CreateAt,
//       AcceptAt: item.AcceptAt,
//       VerifyAt: item.VerifyAt,
//       CreatedBy: item.CreatedBy,
//       CreatedStaffName: item.CreatedStaffName || null,
//     }));

//     // executeAndStoreQueryResult();

//     return res.status(200).json({ result });

//   } catch (err) {
//     console.error("Error broadcasting Hoc:", err.message);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


module.exports = {
  // checkDuplicateHoc,
  getAllFormulaById,
  getAllFormula,
  getFormulaList,
  DeleteFormulaById,
  UpdateFormulaById,
  // updateStatusDelete,
  // updateStatusByStatusNo,
  // updateRightOrder,
  // getAllHoc,
  // updateHoc,
  // updatePrintStatus,
  newFormula,
  // HistoryAllHoc,
  // updateStatusByStatusNoAndRemark,
  // getAllHocByVN,
};
