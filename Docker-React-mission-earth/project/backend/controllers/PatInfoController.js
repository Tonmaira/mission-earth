const HN_PAT_INFO = require("../models/hnpatinfo");

// const getPatInfoByHN = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const temppatinfo = await HN_PAT_INFO.findOne({
//       where: { HN: id },
//     });

//     if (!temppatinfo) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     const patinfo = {
//       VisitDate: temppatinfo.VisitDate,
//       VN: temppatinfo.VN,
//       HN: temppatinfo.HN,
//       BirthDateTime: temppatinfo.BirthDateTime,
//       IDcard: temppatinfo.IDcard,
//       Passport: temppatinfo.Passport,
//       CardETC: temppatinfo.CardETC,
//       NationalityCode: temppatinfo.NationalityCode,
//       Gender: temppatinfo.Gender,
//       InitialName: temppatinfo.InitialName,
//       FirstName: temppatinfo.FirstName,
//       LastName: temppatinfo.LastName,
//     };

//     res.status(200).json(patinfo);
//   } catch (err) {
//     console.error("Error fetching patient info:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// const getPatInfoByVN = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const temppatinfo = await HN_PAT_INFO.findOne({
//       where: { VN: id },
//     });

//     if (!temppatinfo) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     const patinfo = {
//       VisitDate: temppatinfo.VisitDate,
//       VN: temppatinfo.VN,
//       HN: temppatinfo.HN,
//       BirthDateTime: temppatinfo.BirthDateTime,
//       IDcard: temppatinfo.IDcard,
//       Passport: temppatinfo.Passport,
//       CardETC: temppatinfo.CardETC,
//       NationalityCode: temppatinfo.NationalityCode,
//       Gender: temppatinfo.Gender,
//       InitialName: temppatinfo.InitialName,
//       FirstName: temppatinfo.FirstName,
//       LastName: temppatinfo.LastName,
//     };

//     res.status(200).json(patinfo);
//   } catch (err) {
//     console.error("Error fetching patient info:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// const postPatInfoByHN = async (req, res) => {
//   const { hn } = req.body;

//   try {
//     const temppatinfo = await HN_PAT_INFO.findOne({
//       where: { HN: hn },
//     });

//     if (!temppatinfo) {
//       return res.status(404).json({ message: "Patient not found" });
//     }

//     // ฟังก์ชันช่วยสำหรับจัดรูปแบบทศนิยม
//     const formatDecimal = (val) =>
//       val !== null && val !== undefined ? parseFloat(val).toFixed(2) : null;
    
//     const patinfo = {
//       VisitDate: temppatinfo.VisitDate,
//       VN: temppatinfo.VN,
//       HN: temppatinfo.HN,
//       BirthDateTime: temppatinfo.BirthDateTime,
//       Gender: temppatinfo.Gender,
//       FullName:`${temppatinfo?.InitialName} ${temppatinfo?.FirstName.slice(1)} ${temppatinfo?.LastName.slice(1)}`,
//       VisitCodeName: temppatinfo.VisitCodeName.slice(1),
//       Clinic: temppatinfo.Clinic,
//       Doctor: temppatinfo.Doctor,
//       VitalSign: {
//         bmi: temppatinfo.bmi,
//         HC: temppatinfo.HC,
//         Ht: temppatinfo.Ht,
//         tc: formatDecimal(temppatinfo.tc),
//         p: temppatinfo.p,
//         r: temppatinfo.r,
//         bps: temppatinfo.bps,
//         bpd: temppatinfo.bpd,
//         o2sat: temppatinfo.o2sat,
//         ps: temppatinfo.ps,
//       }
//     };

//     res.status(200).json(patinfo);
//   } catch (err) {
//     console.error("Error fetching patient info:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

const getPatInfoByVN = async (req, res) => {
  const { vn } = req.params;

  try {
    const temppatinfo = await HN_PAT_INFO.findOne({
      where: { VN: vn },
    });

    if (!temppatinfo) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // ฟังก์ชันช่วยสำหรับจัดรูปแบบทศนิยม
    const formatDecimal = (val) =>
      val !== null && val !== undefined ? parseFloat(val).toFixed(2) : null;
    
    const patinfo = {
      VisitDate: temppatinfo.VisitDate,
      VN: temppatinfo.VN,
      HN: temppatinfo.HN,
      RightCode: temppatinfo.RightCode,
      BirthDateTime: temppatinfo.BirthDateTime,
      Gender: temppatinfo.Gender,
      FullName:`${temppatinfo?.InitialName} ${temppatinfo?.FirstName.slice(1)} ${temppatinfo?.LastName.slice(1)}`,
      VisitCodeName: temppatinfo.VisitCodeName.slice(1),
      Clinic: temppatinfo.Clinic,
      Doctor: temppatinfo.Doctor,
      // VitalSign: {
      //   bmi: temppatinfo.bmi,
      //   HC: temppatinfo.HC,
      //   Ht: temppatinfo.Ht,
      //   tc: formatDecimal(temppatinfo.tc),
      //   p: temppatinfo.p,
      //   r: temppatinfo.r,
      //   bps: temppatinfo.bps,
      //   bpd: temppatinfo.bpd,
      //   o2sat: temppatinfo.o2sat,
      //   ps: temppatinfo.ps,
      // }
    };

    res.status(200).json(patinfo);
  } catch (err) {
    console.error("Error fetching patient info:", err);
    res.status(500).json({ message: err.message });
  }
};

const checkInfoExistbyVN = async (req, res) => {
  console.log('checkInfoExistbyVN')
  const { VN } = req.params; // frontend should send { HN: "..." }

  if (!VN) {
    return res.status(400).json({ message: "VN is required." });
  }

  try {
    // Use CURRENT_TIMESTAMP in SQL directly
    const temppatinfo = await HN_PAT_INFO.findOne({
      where: { VN: VN },
    });

    if (!temppatinfo) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (temppatinfo.length > 0) {
      // Duplicate exists → 304 Not Modified
      return res.status(304).json({ message: "Record exists." });
    }

    // No duplicate → 200 OK
    return res.status(200).json({ message: "Record Exist" });
  } catch (err) {
    console.error("Error in checkDuplicateRightVerifyByQuery:", err);
    return res.status(500).json({ message: err.message });
  }
};





module.exports = {
  // getPatInfoByHN,
  // getPatInfoByVN,
  // postPatInfoByHN,
  getPatInfoByVN,
  checkInfoExistbyVN
};
