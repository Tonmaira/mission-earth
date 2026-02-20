const staffs = require("../../models/staffs");
const Departments = require("../../models/departments");
const bcrypt = require("bcrypt");
const { sequelize } = require("../../config/dbConn");

staffs.belongsTo(Departments, {
  foreignKey: "Dept",
  targetKey: "Id",
  as: "Department",
});

const { fn, col } = require("sequelize");

const handleNewStaff = async (req, res) => {
  const { UserId, Name, Dept, Role, UserType } = req.body;
  console.log("handleNewStaff call :", UserId, "|", Name, "|", Dept, "|", Role, "|", UserType);

  if (!UserId) {
    return res.status(400).json({ message: "userid field is required." });
  }

  try {
    const duplicate = await staffs.findOne({ where: { UserId: UserId } });

    if (duplicate) {
      return res.status(202).json({ message: `User Exists: ${UserId}` });
    }

    const validColumns = req.body;
    const user = {};

    for (const column in validColumns) {
      const value = validColumns[column];

      if (
        value !== undefined &&
        value !== null &&
        value !== "Invalid date" &&
        !(typeof value === "string" && value.length === 0)
      ) {
        if (["CreateAt", "UpdateAt", "DeleteAt"].includes(column)) {
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime())) {
            user[column] = dateValue;
          } else {
            console.warn(`Ignored invalid date for column ${column}:`, value);
          }
        } else {
          user[column] = value;
        }
      }
    }

    const hashedPwd = await bcrypt.hash(UserId, 10);
    user.UserId = UserId;
    user.Name = Name || UserId;
    user.Password = hashedPwd;
    user.Dept = Dept || 1;
    user.Role = Role || 1;
    user.UserType = UserType || 1;
    user.CreateAt = sequelize.literal("CURRENT_TIMESTAMP");
    user.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    user.DeleteAt = null;

    const result = await staffs.create(user);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllStaff = async (req, res) => {
  try {
    const tempstaff = await staffs.findAll({
      include: [
        {
          model: Departments,
          attributes: ["ShortName"],
          as: "Department",
        },
      ],
      order: [
        ["DeleteAt", "ASC"],
        ["Id", "ASC"],
      ],
    });

    if (!tempstaff || tempstaff.length === 0) {
      return res.status(404).json({ message: "No staff found" });
    }

    const staff = tempstaff.map((s) => ({
      Id: s.Id,
      UserId: s.UserId,
      Name: s.Name,
      // Dept: s.Dept,
      Dept: s.Department?.ShortName || null,
      Role: s.Role,
      UserType: s.UserType,
      Status: s.DeleteAt ? "Inactive" : "Active",
    }));

    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStaffById = async (req, res) => {
  const { id } = req.params;
  console.log("getStaffById called :", id);
  try {
    const tempstaff = await staffs.findOne({
      include: [
        {
          model: Departments,
          attributes: ["FullName"],
          as: "Department",
        },
      ],
      where: { UserId: id } });

    const staff = {
      UserId: tempstaff.UserId,
      Name: tempstaff.Name,
      Dept: tempstaff.Dept,
      DeptName: tempstaff.Department?.FullName || null,
      Role: tempstaff.Role,
      UserType: tempstaff.UserType,
    };
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStaffById = async (req, res) => {
  console.log("updateStaffById called");
  const { id } = req.params;
  const { Name, Role, Dept, UserType} = req.body;

  try {
    const staff = await staffs.findOne({ where: { UserId: id } });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.Name = Name || staff.Name;
    staff.Dept = Dept || staff.Dept;
    staff.Role = Role || staff.Role;
    staff.UserType = UserType || staff.UserType;

    staff.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");

    await staff.save();
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetStaffPasswordById = async (req, res) => {
  console.log("resetStaffPasswordById called");
  const { id } = req.params;

  try {
    const staff = await staffs.findOne({ where: { UserId: id } });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    console.log("Staff found:", staff.UserId);
    const hashedPwd = await bcrypt.hash(staff.UserId, 10);
    staff.Password = hashedPwd;
    staff.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    await staff.save();
    res.status(200).json(staff);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStaffPasswordById = async (req, res) => {
  console.log("updateStaffPasswordById called");
  const { id } = req.params;
  const { Password, NewPassword } = req.body;

  try {
    const staff = await staffs.findOne({ where: { UserId: id } });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(Password, staff.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password Not MATCH!!" });
    } else {
      const hashedPwd = await bcrypt.hash(NewPassword, 10);
      staff.Password = hashedPwd;
      staff.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
      await staff.save();
      res.status(200).json(staff);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const switchStaffStatusById = async (req, res) => {
  const { id } = req.params;
  console.log("switchStatusById called :", id);
  try {
    const staff = await staffs.findOne({ where: { Id: id } });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    if (staff.DeleteAt) {
      staff.DeleteAt = null; // Set to null to activate
    } else {
      staff.DeleteAt = sequelize.literal("CURRENT_TIMESTAMP"); // Set to current timestamp to deactivate
    }
    await staff.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewStaff,
  getAllStaff,
  getStaffById,
  updateStaffById,
  resetStaffPasswordById,
  updateStaffPasswordById,
  switchStaffStatusById,
};