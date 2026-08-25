export default function IconClose({ className }) {
  return (
    <svg 
      width={45}   // 2. กำหนดความกว้าง
      height={45}  // 3. กำหนดความสูง
      viewBox="0 0 300 300" 
      className={className} // รับค่า hover:text-white จากข้างนอก
      xmlns="http://www.w3.org/2000/svg">


      <g fill="currentColor"> 
        <path d="M166.44,150l52.61,52.61l-16.44,16.44L150,166.44l-52.61,52.61l-16.44-16.44L133.56,150L80.95,97.39
	l16.44-16.44L150,133.56l52.61-52.61l16.44,16.44L166.44,150z" /> {/* ก๊อปเฉพาะ d="..." มาวาง */}
      </g>
    </svg>
  );
}