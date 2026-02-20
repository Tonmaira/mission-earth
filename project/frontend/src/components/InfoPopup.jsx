import React, { useState } from "react";
import InfoIcon from '@mui/icons-material/Info';

function InfoPopup() {
  const [show,setShow] = useState(false);
  
  const toggleShow = () => {
    setShow(!show)
  }

  const StatusList = [
    { value: 1, def:"รอตรวจสอบข้อมูล(เภสัช)" },
    { value: 2, def:"กำลังตรวจสอบข้อมูล(เภสัช)" },
    { value: 3, def:"แบบร่าง(เภสัช)" },
    { value: 4, def:"รอตรวจสอบข้อมูล(พยาบาล)" },
    { value: 5, def:"กำลังตรวจสอบข้อมูล(พยาบาล)" },
    { value: 6, def:"แบบร่าง(พยาบาล)" },
    // { value: 7, def:"รอตรวจสอบข้อมูล(ประสานสิทธิ)" },
    // { value: 8, def:"กำลังตรวจสอบข้อมูล(ประสานสิทธิ)" },
    // { value: 9, def:"แบบร่าง(ประสานสิทธิ)" },
    // { value: 10, def:"ตรวจสอบแล้ว(ประสานสิทธิ)" },
    // { value: 11, def:"พิมพ์เอกสารแล้ว" },
    { value: 7, def:"เสร็จสิ้น" },
    { value: 8, def:"พิมพ์เอกสารแล้ว" },
  ]; 
  
  return (
    
    show ? 
      <div className="InfoPopup_Main" onClick={toggleShow}>
        <table className="InfoPopup_Table">
          <thead>
            <tr>
              <th>สถานะ</th>
              <th>ความหมาย</th>
            </tr>
          </thead>
          <tbody>
            {StatusList.map((option) => (
              <tr key={option.value}>
                <td> {option.value} </td>
                <td style={{padding:"5px"}}>
                  <button
                    disabled
                    className={`DivStatus DivStatus${option.value}`}
                    style={{color:"#000",lineHeight:1.5}}
                  >
                    {option.def}
                  </button>
                </td>
              </tr>
            ))}
            {/* <tr>              
              <td colSpan={2}> *กรณีที่ไม่เลือกข้อใดจะนับเป็น 0 คะแนน </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    :
    <div className="InfoPopup_Button" onClick={toggleShow}>
      <InfoIcon />
      <div>รายละเอียด</div>
    </div>
  );
}

export default InfoPopup;
