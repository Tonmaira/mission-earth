const Event = require("../models/event");
const Staffs = require("../models/staffs");
const { Op } = require("sequelize");
const { sequelize } = require("../config/dbConn");

Event.belongsTo(Staffs, {
  foreignKey: "CreatedBy",
  targetKey: "UserId",
});

async function CreateEvent(RowId, Action, Remark, CreatedBy) {
  try {
    const EventData = await Event.create({
      RowId,
      Action,
      Remark,
      CreatedBy,
      CreateAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Just return the created event instead of using res
    return EventData;
  } catch (error) {
    console.error("Error creating event:", error);
    // Throw the error so the caller can handle it
    throw new Error(error.message);
  }
}

const getEventHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const Events = await Event.findAll({
      include: [
        {
          model: Staffs,
          attributes: ["UserId", "Name"],
          as: "Staff",
        },
      ],
      where: { RowId: Number(id) },
      order: [["Id", "ASC"]],
    });

    const EventsData = Events.map((item) => ({
      Id: item.Id,
      Action: item.Action,
      Remark: item.Remark,
      CreateAt: item.CreateAt,
      CreatedBy: item.CreatedBy,
      CreatedStaffName: item.Staff?.Name || null,
    }));

    res.status(200).json(EventsData);
  } catch (err) {
    console.error("Error fetching event history:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getEventHistory
  ,CreateEvent
};