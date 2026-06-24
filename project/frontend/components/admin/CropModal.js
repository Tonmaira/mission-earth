"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

async function getCroppedBlob(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
}

export default function CropModal({ imageSrc, aspect = 16 / 9, onConfirm, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
    await onConfirm(blob);
    setProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#052032] rounded-2xl border border-white/10 w-full max-w-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <p className="text-white font-semibold text-sm">ปรับรูปภาพ</p>
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Crop area */}
        <div className="relative w-full bg-black" style={{ height: "360px" }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="px-6 py-4 space-y-4 border-t border-white/10">
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-xs shrink-0">Zoom</span>
            <input
              type="range" min={1} max={3} step={0.01}
              value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-[#CEA870] cursor-pointer"
            />
            <span className="text-gray-500 text-xs w-8 text-right">{zoom.toFixed(1)}x</span>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onCancel} disabled={processing}
              className="px-5 py-2 rounded-full text-sm border border-white/10 text-gray-400 hover:border-white/30 transition-all disabled:opacity-50">
              ยกเลิก
            </button>
            <button onClick={handleConfirm} disabled={processing}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-[#CEA870] text-[#002740] hover:bg-[#CEA870]/90 transition-all disabled:opacity-50">
              {processing ? "กำลังประมวลผล..." : "ยืนยัน"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
