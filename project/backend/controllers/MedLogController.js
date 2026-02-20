const Medlog = require("../models/medlog");
const { sequelize } = require("../config/dbConn");
const { broadcastOrdersByType } = require("../service/socket");
const { broadcastSocketController } = require("./broadcastController");

const CreateMedlog = async (req, res) => {
  const { AN } = req.body;

  try {
    const EventData = await Medlog.create({
      AN,
      CreateAt: sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await broadcastOrdersByType(broadcastSocketController);

    res.status(200).json({message:"Create Medlog succesfully",EventData});
  } catch (err) {
        console.error("Create event error!:", err);
        res.status(500).json({ message: err.message });
      }
}

const DeleteMedlog = async (req, res) => {
  const { an } = req.params;

  try {
    const deletedCount = await Medlog.destroy({
      where: { AN: an }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Medlog not found" });
    }

    await broadcastOrdersByType(broadcastSocketController);

    res.status(200).json({
      message: "Remove Medlog successfully",
      deletedCount
    });
  } catch (err) {
    console.error("Remove event error!:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  CreateMedlog,
  DeleteMedlog
};