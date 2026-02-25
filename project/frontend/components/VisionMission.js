"use client";
import TranslateIcon from "@/components/TranslateIcon";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import Link from "next/link";

export default function VisionMission() {
  return (
<section className="flex flex-col items-center justify-center min-h-[100vh] w-full px-4 py-20">
          
        <div className="max-w-2xl text-center space-y-24 mt-20">
          <ScrollReveal>
          <div className="space-y-2">
            <h2 className="text-[#CEA870] text-xl mb-4 uppercase tracking-widest font-semibold">Vision</h2>
            <p className="text-[#CEA870] text-sm leading-relaxed">
              To be the trusted partner in sustainability training, 
empowering green economy with capability for lasting environmental impact 
and lead the transition to a greener future.
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              เป็นพันธมิตรด้านการฝึกอบรมด้านความยั่งยืน
เสริมสร้างเศรษฐกิจสีเขียวด้วยศักยภาพที่ส่งผลต่อสิ่งแวดล้อมอย่างยั่งยืน
และเป็นผู้นำในการเปลี่ยนผ่านสู่อนาคตที่เป็นมิตรต่อสิ่งแวดล้อมยิ่งขึ้น
            </p>
          </div>
          </ScrollReveal>
          <ScrollReveal>
          <div className="space-y-6">
             <h2 className="text-[#CEA870] text-xl mb-4 uppercase tracking-widest font-semibold">Mission</h2>
            <div className="space-y-2">
            <p className="text-[#CEA870] text-sm leading-relaxed">
              To provide training on sustainability capability and expertise. 
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              จัดการฝึกอบรมด้านความยั่งยืน
            </p>
            </div>
            <div className="space-y-2">
            <p className="text-[#CEA870] text-sm leading-relaxed">
              To create activities that deliver sustainability to communities 
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              สร้างสรรค์กิจกรรมที่ส่งเสริมความยั่งยืนให้กับชุมชน
            </p>
            </div>
          </div>
          </ScrollReveal>
        </div>
        
      </section>
  );
}