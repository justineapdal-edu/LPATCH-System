"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import SignaturePad from "signature_pad";

interface SignaturePadProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const MAX_SIGNATURE_SIZE = 100 * 1024; // 100KB

export function SignaturePadComponent({
  value,
  onChange,
  error,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 300;
    canvas.height = 150;

    const pad = new SignaturePad(canvas, {
      backgroundColor: "rgb(255, 255, 255)",
    });
    padRef.current = pad;

    pad.addEventListener("endStroke", () => {
      const dataUrl = pad.toDataURL("image/png");
      if (dataUrl.length > MAX_SIGNATURE_SIZE) {
        return;
      }
      onChange(dataUrl);
    });

    return () => {
      pad.off();
    };
  }, [onChange]);

  const handleClear = useCallback(() => {
    padRef.current?.clear();
    onChange("");
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="rounded-md border">
        <canvas
          ref={canvasRef}
          className="w-full cursor-crosshair"
          style={{ height: 150 }}
        />
      </div>
      <button
        type="button"
        onClick={handleClear}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        Clear signature
      </button>
      {value && (
        <div className="mt-2">
          <p className="text-xs text-muted-foreground">Preview:</p>
          <img
            src={value}
            alt="Signature preview"
            className="mt-1 max-w-[200px] h-auto border"
          />
        </div>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
