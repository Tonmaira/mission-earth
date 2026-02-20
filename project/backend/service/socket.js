const { broadcastSocketController } = require("../controllers/broadcastController");
const { Server } = require("socket.io");
let io;

function GroupDataByType(rows, BroadcastParams) {
  // console.log(rows)
  const datamed = rows.filter(r => r.MedicalTakeHomeDateTime === null && r.CheckoutTime === null);
  const datacashier = rows.filter(r => r.MedicalTakeHomeDateTime != null && r.CashierReady === 1 && r.CheckoutTime === null);
  const CheckoutData = rows.filter(r => r.CheckoutTime != null);
  
  switch (BroadcastParams) {
    case "1":
      return [datamed,datacashier];
    case "2":
      return [datacashier,CheckoutData];
    default:
      return [];
  }
};  

function initSocket(server) {
  io = new Server(server, {
  cors: {
    origin: "*"
  }
});

  io.on("connection", async socket => {
    const { BroadcastParams } = socket.handshake.query;
    if (!BroadcastParams) return socket.disconnect();
  
    socket.join(`BroadcastParams:${BroadcastParams}`);
    console.log(`Connected BroadcastParams: ${BroadcastParams}`);
  
    const rows = await broadcastSocketController();
    const data = GroupDataByType(rows, BroadcastParams);
  
    socket.emit("queue:init", {
      BroadcastParams: BroadcastParams,
      data: data,
      updatedAt: Date.now()
    });
  
    socket.on("queue:refresh", async () => {
      const rows = await broadcastSocketController();
      const data = GroupDataByType(rows, BroadcastParams);
      socket.emit("queue:update", { type: BroadcastParams, data: data, updatedAt: Date.now()});
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected BroadcastParams: ${BroadcastParams}`);
    });

  });
}

async function broadcastOrdersByType() {
  const onlineTypes = [...io.sockets.adapter.rooms.keys()]
    .filter(r => r.startsWith("BroadcastParams:"))
    .map(r => r.replace("BroadcastParams:", ""));

  if (!onlineTypes.length) return;

  const rows = (await broadcastSocketController()) ?? [];
    
  for (const BroadcastParams of onlineTypes) {
      io.to(`BroadcastParams:${BroadcastParams}`).emit("queue:update", {
        BroadcastParams,
        data:GroupDataByType(rows, BroadcastParams),
        updatedAt: Date.now()
      });
  }

  console.log("🖥️ Online screens:", onlineTypes);
}


module.exports = { initSocket, broadcastOrdersByType };