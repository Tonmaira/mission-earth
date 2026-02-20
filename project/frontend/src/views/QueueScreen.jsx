import { useSocket } from "../context/SocketContext";
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
import Clock from "../components/Clock";
import LOGO_IMG from "../assets/logo-color.png"

export default function QueueScreen() {
  const { queue } = useSocket();
  const navigate = useNavigate();
  function QueueTime(mode,basetime) {
    const date = new Date();
    const formattedTimestamp = basetime?.replace("T", " ").replace("Z", "") || '';
    const date2 = new Date(formattedTimestamp);
    const h = date2.getHours();
    const mm = date2.getMinutes().toString().padStart(2, '0');
    const ss = date2.getSeconds().toString().padStart(2, '0');
    var timeShow = h + ':' + mm + ':' + ss;
    var dateDiff = (date - date2) / 60000; // to Set Alert
  
    var secoundDiff = Math.floor(((date.getTime() - date2.getTime()) / 1000) % 60),
        minsDiff = Math.floor(((date.getTime() - date2.getTime()) / 1000 / 60) % 60),
        hoursDiff = Math.floor((date.getTime() - date2.getTime()) / 1000 / 60 / 60);
  
    var timeDiff = minsDiff + 'm' + ':' + secoundDiff + 's';
  
    if (hoursDiff > 0) {
      timeDiff = hoursDiff + 'H' + ':' + minsDiff + 'm' + ':' + secoundDiff + 's';
    }
  
    if(mode==='diff') return timeDiff;
    if(mode==='time') return timeShow;
    if(mode==='show') return timeShow;
    if(mode==='ddiff') return dateDiff;
  }
  
  const rows = queue[0]?.map(q => ({
    ...q,
    diff: QueueTime('ddiff', q.MakeDateTime),
    time: QueueTime('diff', q.MakeDateTime),
    show: QueueTime('show', q.MakeDateTime),
  }));

  const rows2 = queue[1]?.map(q => ({
    ...q,
    diff: QueueTime('ddiff', q.MedicalTakeHomeDateTime),
    time: QueueTime('diff', q.MedicalTakeHomeDateTime),
    show: QueueTime('show', q.MedicalTakeHomeDateTime),
  }));

  return (<>
    <div className='QmedBorder'>

      <div className='QmedHeaderBorder'>
        <div className='Head'>
          <img width={190} src={LOGO_IMG} />
        </div>
        <div className='Content'>
          <div className="Title">คิวจัดยาผู้ป่วยใน IPD</div>
          <div className="Time"><Clock/></div>
        </div>
        <div className='Tail'>
          <IconButton aria-label="Logout" onClick={()=>navigate('/type')}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <div style={{background:'#fff'}}/>

      <div className='QmedMidFrame'>
        <div className='QmedMidBorder'>
          <div className='Title'>รอจัดยา</div>
          <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
            <table className="LeftBigger">
              <thead>
                <tr>
                  <th style={{width:'280px'}}>AN</th>
                  <th >Name</th>
                  <th style={{width:'250px'}}>Time</th>
                  {/* <th style={{width:'10%'}}>Wait Time</th> */}
                </tr>
              </thead>
              <tbody>
                {rows?.map((q, i) => (
                  <tr key={i} className={ q.diff > 15 ? 'QmedMidBorder_Row_Alert' : '' }>
                    <td>{q.AN}</td>
                    <td className="NameClass">{q?.FirstName+" "+q?.LastName}</td>
                    <td>{q.time}</td>
                    {/* <td>{q.show}</td> */}
                  </tr>
                ))}
                {/* <tr>
                  <td>202600344</td>
                  <td className="NameClass">XXXXX XXXXXXXXX</td>
                  <td>XX:XX</td>
                </tr>
                <tr>
                  <td>202600344</td>
                  <td className="NameClass">XXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXX</td>
                  <td>XX:XX</td>
                </tr>
                <tr>
                  <td>202600344</td>
                  <td className="NameClass">XXXXX XXXXXXXXXXXXXXXXXX</td>
                  <td>XX:XX</td>
                </tr>
                <tr>
                  <td>202600344</td>
                  <td className="NameClass">XXXXX XXXXXXXXXXXXXXXXXXXXXXXXXXX</td>
                  <td>XX:XX</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div style={{background:'#459D9C'}}/>
        </div>

        <div className='QmedMidBorder' style={{width:'800px'}}>
          <div className='Title'>รอจ่ายยา</div>
          <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
            <table className="RightBigger">
              <thead>
                <tr>
                  <th>ActiveHNBedNo</th>
                  <th style={{width:'280px'}}>AN</th>
                </tr>
              </thead>
              <tbody>
                {rows2?.map((q, i) => (
                  <tr key={i} className={ q.diff > 15 ? 'QmedMidBorder_Row_Alert' : 'QmedMidBorder_Row' }>
                    <td>{q.ActiveHNBedNo}</td>
                    <td>{q.AN}</td>
                  </tr>
                ))}
                {/* <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr>
                <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr>
                <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr>
                <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr>
                <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr>
                <tr>
                  <td>DEMO</td>
                  <td>DEMO</td>
                </tr> */}
              </tbody>
            </table>
          </div>
          <div style={{background:'#459D9C'}}/>
        </div>

      </div>
      <div style={{background:'#fff'}}/>

      <div className='QmedFooterBorder'/>
      
    </div>
    

  </>

  );
}