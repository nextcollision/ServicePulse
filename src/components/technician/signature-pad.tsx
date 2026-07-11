"use client";

import * as React from "react";
import SignatureCanvas from "react-signature-canvas";
import { cn } from "@/lib/utils";

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  className?: string;
  width?: number;
  height?: number;
}

export function SignaturePad({
  onSignatureChange,
  className,
  width,
  height = 200,
}: SignaturePadProps) {
  const signatureRef = React.useRef<SignatureCanvas>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(width || 300);

  // Measure container width
  React.useEffect(() => {
    if (!width && containerRef.current) {
      const updateWidth = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.offsetWidth);
        }
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, [width]);

  const handleEnd = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        onSignatureChange(null);
      } else {
        const dataUrl = signatureRef.current.toDataURL("image/png");
        onSignatureChange(dataUrl);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn("touch-none", className)}>
      <SignatureCanvas
        ref={signatureRef}
        canvasProps={{
          width: containerWidth - 4, // Account for border
          height: height,
          className: "rounded-lg bg-gray-50 dark:bg-gray-900",
          style: {
            touchAction: "none",
          },
        }}
        penColor="black"
        minWidth={1.5}
        maxWidth={3}
        throttle={16}
        onEnd={handleEnd}
      />
    </div>
  );
}
