import React, { useEffect, useState } from 'react';
import RightTable from './../../components/home/RightTable';
import NavList from './../../components/NavList';
import './../../style/home.css';
import { useWebSocket } from '../../context/WebSocketContext';
import HNDialog from '../../components/home/HnDialog';
import InfoPopup from '../../components/InfoPopup';

function Home() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const { connectWebSocket, disconnectWebSocket, dataCenter, dataEvent, load } = useWebSocket();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(dataCenter);
  // const MemoRightTable = React.memo(RightTable);

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  
  useEffect(() => {
    setData(dataCenter);
    setLoading(false)
  }, [dataCenter]);
  
  return (
    <div className="page_home_body">
      
    <InfoPopup/>
        {/* {console.log(data)} */}
      {!loading ? (
        <div className='DialogHN'>
          {userData.UserType === 1 && <HNDialog />}
          <RightTable
            title="จำนวนการแฟ้มเอกสารต่อ Auditor"
            Mode="view"
            data={data}
            relocate={true}
            path="staff"
            action={true}
          />
        </div>
        
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Home;
