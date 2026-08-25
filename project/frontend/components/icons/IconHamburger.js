export default function IconHamburger({ className, size = 32 }) { // 1. รับค่า size (ตั้งค่าเริ่มต้นไว้ที่ 32)
  return (
    <svg 
      width={45}   // 2. กำหนดความกว้าง
      height={33}  // 3. กำหนดความสูง
      viewBox="0 0 300 300" 
      className={className} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor"> 
        <path d="M236.03,110.47H63.97V87.22h172.05V110.47z M236.03,189.53H63.97v23.25h172.05V189.53z M208.13,138.37H87.22 v23.25h120.9V138.37z" /> 
      </g>
    </svg>
  );
}