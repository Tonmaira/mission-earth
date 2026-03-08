"use client";
import { motion, AnimatePresence } from 'framer-motion';

export default function ServicePopup({ 
  isOpen, 
  onClose, 
  services, 
  allTags, 
  currentTag, 
  expandedCat, 
  setExpandedCat, 
  scrollRef, 
  onSelectTag 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          {/* 1. Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-md"
          />

          {/* 2. Central Popup Card */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-[#052032] border border-[#CEA870]/30 rounded-[30px] p-8 shadow-2xl h-[550px] flex flex-col"
          >
            <p className="text-[#CEA870]/60 text-xs font-bold uppercase tracking-[0.2em] mb-6 text-center shrink-0">
              All Services
            </p>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide flex flex-col gap-3">
              {services.map((cat, idx) => {
                const isExpanded = expandedCat === idx;
                const isActiveCategory = currentTag.categoryIndex === idx;

                return (
                  <div key={idx} className="flex flex-col gap-1">
                    {/* หมวดหมู่หลัก */}
                    <button
                      onClick={() => {
                        setExpandedCat(isExpanded ? null : idx); 
                        
                        const firstTagIndex = allTags.findIndex(tag => tag.categoryIndex === idx);
                        if (firstTagIndex !== -1 && scrollRef.current) {
                          const cardWidth = scrollRef.current.offsetWidth * 0.84;
                          scrollRef.current.scrollTo({
                            left: firstTagIndex * (cardWidth + 20),
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`py-4 px-6 rounded-2xl text-left transition-all flex justify-between items-center ${
                        isActiveCategory ? "bg-[#CEA870]/10 border border-[#CEA870]/30" : "hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      <span className={`text-lg uppercase tracking-wider ${isActiveCategory ? "text-[#CEA870]" : "text-gray-300"}`}>
                        {cat.title}
                      </span>
                      <svg className={`w-4 h-4 text-[#CEA870] transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M19 9l-7 7-7-7" strokeWidth={2} />
                      </svg>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden flex flex-col gap-1 pl-4"
                        >
                          <button
                            onClick={() => {
                              onSelectTag(idx, cat.tags[0].name);
                              onClose();
                            }}
                            className="py-4 px-6 text-left text-sm font-bold text-[#CEA870] hover:bg-[#CEA870]/10 rounded-xl transition-all flex items-center gap-3"
                          >
                            <div className="w-2 h-2 bg-[#CEA870] rounded-full shadow-[0_0_8px_#CEA870]" />
                            ALL {cat.title.toUpperCase()}
                          </button>

                          {cat.tags.map((tag, tIdx) => (
                            <button
                              key={tIdx}
                              onClick={() => {
                                onSelectTag(idx, tag.name);
                                onClose();
                              }}
                              className="py-3.5 px-6 text-left text-sm text-gray-400 hover:text-white flex items-center gap-3 transition-all active:scale-95"
                            >
                              <div className="w-1 h-1 bg-gray-600 rounded-full ml-1" />
                              {tag.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={onClose}
              className="mt-6 w-full py-2 text-gray-500 text-sm font-medium hover:text-white transition-colors shrink-0"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}