'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toastError, toastSuccess } from '@/lib/toast';
import QRCode from 'react-qr-code';

export default function QrModal({ url, label = 'QR Code' }) {
  const [open, setOpen] = useState(false);
  const generatingRef = useRef(false);
  const svgWrapperRef = useRef(null);

  useEffect(() => {
    if (!open || generatingRef.current) return;
    generatingRef.current = true;
    generatingRef.current = false;
  }, [open, url]);

  const downloadPng = async () => {
    try {
      const svgEl = svgWrapperRef.current?.querySelector('svg');
      if (!svgEl) {
        toastError('QR not ready yet');
        return;
      }
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);

      const img = new Image();
      const size = 1024; // high-res PNG
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = svgDataUrl;
      });

      // Fill white background for better printing
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${label.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toastSuccess('QR downloaded');
    } catch {
      toastError('Download failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2">
          Show QR
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{label}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div ref={svgWrapperRef} className="p-2 bg-white rounded-md border">
            <QRCode value={url || ''} size={256} bgColor="#ffffff" fgColor="#000000" />
          </div>
          <Button onClick={downloadPng} className="w-full">
            Download PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


