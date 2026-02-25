"use client";

import { useState, useEffect, useRef } from "react";

export default function ScrollRevealDown({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // เมื่อแสดงผลแล้ว ให้เลิกตรวจจับเพื่อประหยัดทรัพยากรเครื่องครับ
          observer.unobserve(domRef.current);
        }
      });
    }, {
      threshold: 0.1 // เริ่มเล่นเมื่อเห็นแค่ 10% ของกล่อง
    });

    const { current } = domRef;
    observer.observe(current);

    return () => observer.unobserve(current);
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 -translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}