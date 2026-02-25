"use client";
import TranslateIcon from "@/components/TranslateIcon";
import Image from "next/image";
import Link from "next/link";

export default function FooterSection() {
  return (
<footer className="bg-[#002E4B] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start text-xs text-gray-400">
          <div className="mb-8 md:mb-0">
            <h4 className="text-[#CEA870] font-bold mb-4 uppercase">Mission Earth</h4>
            <p>Home</p>
            <p>About Us</p>
          </div>
          <div className="space-y-2">
            <p className="text-[#CEA870] uppercase font-bold">Contact Info</p>
            <p>บริษัท มิชชั่น เอิร์ธ จำกัด</p>
            <p>Line: @missionearth</p>
            <p>Tel: 012-345-6789</p>
          </div>
        </div>
      </footer>
  )
}