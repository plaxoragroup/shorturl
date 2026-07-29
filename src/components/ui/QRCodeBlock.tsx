import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from './Button';
import './QRCodeBlock.css';

interface QRCodeBlockProps {
  value: string;
}

export const QRCodeBlock: React.FC<QRCodeBlockProps> = ({ value }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'plaxora-qr.png';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="qr-block">
      <div className="qr-box" ref={qrRef}>
        <QRCodeCanvas 
          value={value} 
          size={200} 
          bgColor={"#ffffff"} 
          fgColor={"#000000"} 
          level={"H"} 
          includeMargin={false}
        />
      </div>
      <Button variant="ghost" onClick={downloadQR} className="mt-4">
        Download PNG
      </Button>
    </div>
  );
};

export default QRCodeBlock;
