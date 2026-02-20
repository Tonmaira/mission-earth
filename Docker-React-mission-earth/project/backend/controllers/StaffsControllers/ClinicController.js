const { sequelize } = require("../../config/dbConn");
const QUEUE_CLINIC_NAME = require("../../models/clinic");

const getAllClinics = async (req, res) => {
  try {
    const tempclinics = await QUEUE_CLINIC_NAME.findAll(
      {
      order: [
        // ["DeleteAt", "ASC"],
        ["ClinicCode", "ASC"],
      ],
    }
  );

    if (!tempclinics || tempclinics.length === 0) {
      return res.status(404).json({ message: "No staff found" });
    }
    const clinicsdata = tempclinics.map((clinics) => ({
      ClinicCode: clinics.ClinicCode,
      ClinicNameThai: clinics.ClinicNameThai,
      // Name: doc.Name,
      // Status: dept.DeleteAt ? "Inactive" : "Active",
    }));
    res.status(200).json(clinicsdata);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const switchStatusDeptById = async (req, res) => {
//   const { id } = req.params;
//   console.log("switchStatusById called :", id);
//   try {
//     const tempdepartments = await departments.findOne({ where: { Id: id } });
//     if (!tempdepartments) {
//       return res.status(404).json({ message: "Department not found" });
//     }
//     if (tempdepartments.DeleteAt) {
//       tempdepartments.DeleteAt = null; // Set to null to activate
//     } else {
//       tempdepartments.DeleteAt = sequelize.literal("CURRENT_TIMESTAMP"); // Set to current timestamp to deactivate
//     }
//     await tempdepartments.save();
//     res.status(200).json({ message: "Status updated successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const updateDeptById = async (req, res) => {
//   const { id } = req.params;
//   const { ShortName, Name } = req.body;

//   try {
//     const tempdepartments = await departments.findOne({ where: { Id: id } });
//     if (!tempdepartments) {
//       return res.status(404).json({ message: "Department not found" });
//     }

//     tempdepartments.ShortName = ShortName || tempdepartments.ShortName;
//     tempdepartments.Name = Name || tempdepartments.Name;
//     tempdepartments.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");

//     await tempdepartments.save();
//     res.status(200).json(tempdepartments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const newDept = async (req, res) => {
//   const { ShortName, Name } = req.body;

//   try {
//     const DeptData = await departments.create({
//       ShortName: ShortName,
//       Name: Name || ShortName,
//       CreateAt: sequelize.literal("CURRENT_TIMESTAMP"),
//       UpdateAt: sequelize.literal("CURRENT_TIMESTAMP"),
//     });

//     res.status(201).json({ message: `Dept created successfully`, DeptData });
//   } catch (error) {
//     console.error("Error creating company:", error);
//     res
//       .status(500)
//       .json({
//         message: "An error occurred while creating Dept",
//         error: error.message,
//       });
//   }
// };

module.exports = {
  getAllClinics,
  // switchStatusDeptById,
  // updateDeptById,
  // newDept,
};