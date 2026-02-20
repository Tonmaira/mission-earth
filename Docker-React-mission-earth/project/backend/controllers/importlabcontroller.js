const path = require("path");
const XLSX = require("xlsx");
const sequelize = require("../config/dbConn").sequelize;

const FileLab = path.join(__dirname, "../data/Lab.xls");
const FileTreatment = path.join(__dirname, "../data/Treatment(4).xls");
const FileXray = path.join(__dirname, "../data/Xray.xls");

const normalize = (val) =>
  val === undefined || val === null || val === "" ? null : String(val).trim();

async function ReadLabExcel(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const workbook = XLSX.readFile(FileLab);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      await sequelize.query(
        `
          INSERT INTO [dbo].[StockCode] (Code, EnglishName, ThaiName, Type, OPDPrice, IPDPrice, InterPrice)
          VALUES (:Code, :EnglishName, :ThaiName, :Type,
                  :OPDPrice, :IPDPrice, :InterPrice);
        `,
        {
          replacements: {
            Code: normalize(row.Code),
            EnglishName: normalize(row.EnglishName),
            ThaiName: normalize(row.ThaiName), // ✅ ALWAYS EXISTS
            Type: "Lab",
            OPDPrice: Number(row.OPDPrice) || 0,
            IPDPrice: Number(row.IPDPrice) || 0,
            InterPrice: Number(row.InterPrice) || 0,
          },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Lab imported successfully (MERGE UPSERT)",
      total: data.length,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("MERGE error:", err);

    res.status(500).json({
      message: "Error processing Excel",
      error: err.message,
    });
  }
}

async function ReadTreatmentExcel(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const workbook = XLSX.readFile(FileTreatment);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      await sequelize.query(
        `
          INSERT INTO [dbo].[StockCode] (Code, EnglishName, ThaiName, Type, Activity, OPDPrice, IPDPrice, InterPrice)
          VALUES (:Code, :EnglishName, :ThaiName, :Type,
                  :Activity, :OPDPrice, :IPDPrice, :InterPrice);
        `,
        {
          replacements: {
            Code: normalize(row.Code),
            EnglishName: normalize(row.EnglishName),
            ThaiName: normalize(row.ThaiName), // ✅ ALWAYS EXISTS
            Type: "Treatment",
            Activity:normalize(row.Activity),
            OPDPrice: Number(row.OPDPrice) || 0,
            IPDPrice: Number(row.IPDPrice) || 0,
            InterPrice: Number(row.InterPrice) || 0,
          },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Lab imported successfully (MERGE UPSERT)",
      total: data.length,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("MERGE error:", err);

    res.status(500).json({
      message: "Error processing Excel",
      error: err.message,
    });
  }
}

async function ReadXrayExcel(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const workbook = XLSX.readFile(FileXray);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    for (const row of data) {
      await sequelize.query(
        `
          INSERT INTO [dbo].[StockCode]
          (Code, EnglishName, ThaiName, Type, OPDPrice, IPDPrice, InterPrice)
        VALUES
          (:Code, :EnglishName, :ThaiName, :Type, :OPDPrice, :IPDPrice, :InterPrice)
        `,
        {
          replacements: {
            Code: normalize(row.Code),
            EnglishName: normalize(row.EnglishName),
            ThaiName: normalize(row.ThaiName), // ✅ ALWAYS EXISTS
            Type: "Xray",
            Activity:normalize(row.Activity),
            OPDPrice: Number(row.OPDPrice) || 0,
            IPDPrice: Number(row.IPDPrice) || 0,
            InterPrice: Number(row.InterPrice) || 0,
          },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Lab imported successfully (MERGE UPSERT)",
      total: data.length,
    });
  } catch (err) {
    await transaction.rollback();
    console.error("MERGE error:", err);

    res.status(500).json({
      message: "Error processing Excel",
      error: err.message,
    });
  }
}

module.exports = { ReadLabExcel,ReadTreatmentExcel,ReadXrayExcel };
