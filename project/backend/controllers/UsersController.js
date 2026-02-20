const users = require("../models/users");
// const Departments = require("../../models/departments");
const bcrypt = require("bcrypt");
const { sequelize } = require("../config/dbConn");

// staffs.belongsTo(Departments, {
//   foreignKey: "Dept",
//   targetKey: "Id",
//   as: "Department",
// });

const { fn, col } = require("sequelize");

const handleNewUser = async (req, res) => {
  const { UserId, Name,  Role, UserType } = req.body;
  console.log("handleNewUser call :", UserId, "|", Name, "|", Role, "|", UserType);

  if (!UserId) {
    return res.status(400).json({ message: "userid field is required." });
  }

  try {
    const duplicate = await users.findOne({ where: { UserId: UserId } });

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
    // user.Dept = Dept || 1;
    user.Role = Role || 1;
    user.UserType = UserType || 1;
    user.CreateAt = sequelize.literal("CURRENT_TIMESTAMP");
    user.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    user.DeleteAt = null;

    const result = await users.create(user);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const tempuser = await users.findAll({
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

    if (!tempuser || tempuser.length === 0) {
      return res.status(404).json({ message: "No User found" });
    }

    const user = tempuser.map((s) => ({
      Id: s.Id,
      UserId: s.UserId,
      Name: s.Name,
      // Dept: s.Dept,
      // Dept: s.Department?.ShortName || null,
      Role: s.Role,
      UserType: s.UserType,
      Status: s.DeleteAt ? "Inactive" : "Active",
    }));

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  console.log("getUserById called :", id);
  try {
    const tempuser = await users.findOne({
      include: [
        {
          model: Departments,
          attributes: ["FullName"],
          as: "Department",
        },
      ],
      where: { UserId: id } });

    const user = {
      UserId: tempuser.UserId,
      Name: tempuser.Name,
      // Dept: tempuser.Dept,
      // DeptName: tempuser.Department?.FullName || null,
      Role: tempuser.Role,
      UserType: tempuser.UserType,
    };
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserById = async (req, res) => {
  console.log("updateUserById called");
  const { id } = req.params;
  const { Name, Role, UserType} = req.body;

  try {
    const user = await users.findOne({ where: { UserId: id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.Name = Name || user.Name;
    // user.Dept = Dept || user.Dept;
    user.Role = Role || user.Role;
    user.UserType = UserType || user.UserType;

    user.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetUserPasswordById = async (req, res) => {
  console.log("resetUserPasswordById called");
  const { id } = req.params;

  try {
    const user = await users.findOne({ where: { UserId: id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("User found:", user.UserId);
    const hashedPwd = await bcrypt.hash(user.UserId, 10);
    user.Password = hashedPwd;
    user.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserPasswordById = async (req, res) => {
  console.log("updateUserPasswordById called");
  const { id } = req.params;
  const { Password, NewPassword } = req.body;

  try {
    const user = await users.findOne({ where: { UserId: id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password Not MATCH!!" });
    } else {
      const hashedPwd = await bcrypt.hash(NewPassword, 10);
      user.Password = hashedPwd;
      user.UpdateAt = sequelize.literal("CURRENT_TIMESTAMP");
      await user.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const switchUserStatusById = async (req, res) => {
  const { id } = req.params;
  console.log("switchStatusById called :", id);
  try {
    const user = await users.findOne({ where: { Id: id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.DeleteAt) {
      user.DeleteAt = null; // Set to null to activate
    } else {
      user.DeleteAt = sequelize.literal("CURRENT_TIMESTAMP"); // Set to current timestamp to deactivate
    }
    await user.save();
    res.status(200).json({ message: "Status updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  handleNewUser,
  getAllUser,
  getUserById,
  updateUserById,
  resetUserPasswordById,
  updateUserPasswordById,
  switchUserStatusById,
};