const WebSocket = require("ws");
const sequelize = require('../config/dbConn').sequelize; // Import the sequelize instance

function GenerateId() {
  return Date.now() + Math.floor(Math.random() * 1000000);
} 

/**
 * Broadcasts the latest RightVerify data to all connected clients.
//  * @param {Set<WebSocket>} clients - The set of connected WebSocket clients
 */
const broadcastSocketController = async () => {
  try {
    const broadcastQuery = `
      DECLARE @StartDate DATETIME = CONVERT(DATETIME, CONVERT(VARCHAR, GETDATE(), 112));
      DECLARE @EndDate DATETIME = DATEADD(MILLISECOND, -3, DATEADD(DAY, 1, @StartDate));

      SELECT 
        t1.AN,
        t3.HN,
        RIGHT( FirstName , LEN( FirstName ) - 1) as FirstName ,
        RIGHT( LastName , LEN( LastName ) - 1) as LastName,
        t2.ActiveHNBedNo,
        max(t1.MakeDateTime) as MakeDateTime,
        MAX(MedicalTakeHomeDateTime) AS MedicalTakeHomeDateTime,
        CASE WHEN t4.[IpdMasterLogType] = 56 THEN 1 ELSE 0 END AS CashierReady,
        --t4.[IpdMasterLogType] AS CashierReady,
        t4.[MakeDateTime] AS CashierReadyDateTime,
        --MLOG.AN,
        MLOG.Id As CheckoutId,
        MLOG.CreateAt AS CheckoutTime
      FROM DNHOS.dbo.HNIPDDRUG_ORDER_LOG as t1
        LEFT JOIN [DNHOS].[dbo].[HNIPD_MASTER] as t2 on t1.AN = t2.AN
        LEFT JOIN [DNHOS].[dbo].[HNPAT_NAME]  as t3 on t3.HN = t2.HN
        LEFT JOIN [DNHOS].[dbo].[HNIPD_LOG] as t4 on t1.[AN] = t4.[AN] and t4.[MakeDateTime] BETWEEN @StartDate AND @EndDate AND IpdMasterLogType IN (56)
        LEFT JOIN  [QMED_LOG].[dbo].[medlog] as MLOG on t1.AN = MLOG.AN and MLOG.[CreateAt] BETWEEN @StartDate AND @EndDate
      WHERE  DrugOrderNo like 'DTH%' 
        AND t2.[WardAllowDischargeDateTime] BETWEEN @StartDate AND @EndDate
        AND t1.MakeDateTime BETWEEN @StartDate AND @EndDate
        --AND MedicalTakeHomeDateTime is null
        AND IPDDrugOrderLogType='13'
        AND t3.SuffixSmall ='0'
        --AND t1.[AN] NOT IN (
        --  SELECT MLOG.AN 
        --  FROM [QMED_LOG].[dbo].[medlog] MLOG
        --  WHERE MLOG.[CreateAt] BETWEEN @StartDate AND @EndDate
        --)
      GROUP BY t1.AN,FirstName,LastName,t1.MakeDateTime,MedicalTakeHomeDateTime,t2.ActiveHNBedNo,t3.HN,t4.[IpdMasterLogType],t4.[MakeDateTime],MLOG.Id,MLOG.CreateAt
      ORDER BY MakeDateTime;
    `;
    
    const broadcastdata = await sequelize.query(broadcastQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    const result = broadcastdata.map(item => ({
      id: GenerateId(),
      AN: item.AN,
      HN: item.HN,
      FirstName: item?.FirstName ?? '',
      LastName: item?.LastName ?? '',
      ActiveHNBedNo: item.ActiveHNBedNo,
      MakeDateTime: item.MakeDateTime,
      MedicalTakeHomeDateTime: item.MedicalTakeHomeDateTime,
      CashierReady: item.CashierReady,
      CashierReadyDateTime: item.CashierReadyDateTime,
      CheckoutId: item.CheckoutId,
      CheckoutTime: item.CheckoutTime,
    }));

    return result;

  } catch (err) {
    console.error("Error broadcasting RightVerify:", err.message);
    return [];
  }
};

module.exports = { broadcastSocketController };