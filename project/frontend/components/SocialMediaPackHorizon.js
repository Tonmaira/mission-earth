"use client";
import IconInstagram from "@/components/IconInstagram";
import IconFacebook from "@/components/IconFacebook";
import IconLine from "@/components/IconLine";

export default function SocialMediaPackHorizon() {
  return (
    /* 1. ใช้ fixed เพื่อให้ลอยทับทุกส่วน และใช้ flex-col เพื่อจัดวางแนวตั้ง */
    <div className="flex md:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex-row items-center gap-6">
      
      {/* Instagram */}
      <a 
        href="https://instagram.com/missionearth.co/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group transition-transform hover:scale-110"
      >
        <IconInstagram className="w-5 md:w-6 h-5 md:h-6 text-[#CEA870] group-hover:text-white transition-all duration-300" />
      </a>

      {/* Facebook */}
      <a 
        href="https://www.facebook.com/profile.php?id=61567764698039" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group transition-transform hover:scale-110"
      >
        <IconFacebook className="w-5 md:w-6 h-5 md:h-6 text-[#CEA870] group-hover:text-white transition-all duration-300" />
      </a>

      {/* Line */}
      <a 
        href="https://lin.ee/MDN9uJ4" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group transition-transform hover:scale-110"
      >
        <IconLine className="w-5 md:w-6 h-5 md:h-6 text-[#CEA870] group-hover:text-white transition-all duration-300" />
      </a>

    </div>

    
    
  );
}