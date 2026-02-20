import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import { useEffect } from "react";
import "../../style/home.css"
export default function SelectType() {
  const { disconnectSocket } = useSocket();
  const { connectSocket } = useSocket();
  const navigate = useNavigate();

  const openNewWindowQueueCheckout = () => {
    const url = "/queuecut";
    const windowName = "QueueCheckout";
    const windowFeatures = "width=550,height=500";
    window.open(url, windowName, windowFeatures);
  };
  
  const handleConnect = (BroadcastParams) => {
    localStorage.removeItem("BroadcastParams");
    disconnectSocket();
    connectSocket(BroadcastParams);
    if(BroadcastParams==="1") navigate("/queue");
    if(BroadcastParams==="2") openNewWindowQueueCheckout();
  };

  useEffect(() => {
    localStorage.removeItem("BroadcastParams");
    disconnectSocket(); // 🔥 reset session ทุกครั้ง
  }, []);

  return (
    <div className="HomeSelectType">
      <div className='HomeSelectTypeButtonDiv HomeSelectTypeButtonDiv' onClick={()=>handleConnect("1")}>Queue</div>
      <div className='HomeSelectTypeButtonDiv HomeSelectTypeButton2Div' style={{height:'100px',fontSize: '24px'}} onClick={()=>handleConnect("2")}>Queue Checkout</div>
    </div>
  );
}
