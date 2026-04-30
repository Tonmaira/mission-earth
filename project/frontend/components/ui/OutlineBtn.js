/**
 * OutlineBtn — gold pill button
 * Props: label, small, onClick
 */
export default function OutlineBtn({ label, small, onClick, href }) {
  const cls = `
    border border-[#CEA870] rounded-full text-[#CEA870] bg-transparent
    hover:bg-[#CEA870] hover:text-white
    transition-all duration-500 whitespace-nowrap cursor-pointer
    uppercase tracking-widest font-semibold
    ${small ? "px-6 py-2 text-[10px]" : "px-8 py-3 text-xs"}
  `;
  if (href) return <a href={href} className={cls}>{label}</a>;
  return <button onClick={onClick} className={cls}>{label}</button>;
}