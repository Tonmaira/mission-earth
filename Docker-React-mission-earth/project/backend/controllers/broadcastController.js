const Hoc = require("../models/hoc");
// const Staffs = require("../models/staffs");
// const Departments = require("../models/departments");
const WebSocket = require("ws");
const sequelize = require('../config/dbConn').sequelize; // Import the sequelize instance

/**
 * Broadcasts the latest RightVerify data to all connected clients.
//  * @param {Set<WebSocket>} clients - The set of connected WebSocket clients
 */

const broadcastController = async () => {
  try {
    const broadcastQuery = `
  DECLARE @StartDate DATETIME = CONVERT(DATETIME, CONVERT(VARCHAR, GETDATE(), 112));
  DECLARE @EndDate DATETIME = DATEADD(MILLISECOND, -3, DATEADD(DAY, 1, @StartDate));

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
  FROM 
    HOC hc
  LEFT JOIN Staffs s 
    ON hc.CreatedBy = s.UserId
  LEFT JOIN Departments d 
    ON s.Dept = d.Id
  WHERE 
    hc.DeleteAt IS NULL
    AND hc.CreateAt BETWEEN @StartDate AND @EndDate
  ORDER BY
    hc.Status ASC,
    hc.DeleteAt ASC,
    hc.Id DESC;
    `;
    
    const broadcastdata = await sequelize.query(broadcastQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    const result = broadcastdata.map(item => ({
      id: item.id,
      HN: item.HN,
      VN: item.VN,
      FullName: item.FullName || "",
      DeptId: item.DeptId || null,
      Dept: item.Dept || null,
      UserType: item.UserType || null,
      status: item.status,
      // ClinicId: item.ClinicId, 
      // ClinicCode: item.ClinicCode,
      CreateAt: item.CreateAt,
      AcceptAt: item.AcceptAt,
      VerifyAt: item.VerifyAt,
      CreatedBy: item.CreatedBy,
      CreatedStaffName: item.CreatedStaffName || null,
    }));

    return result;

  } catch (err) {
    console.error("Error broadcasting RightVerify:", err.message);
  }
  // console.log("broadcastController");
};

module.exports = { broadcastController };