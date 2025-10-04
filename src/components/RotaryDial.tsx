
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface RotaryDialProps {
  initialRotation?: number;
  onRotationChange: (deg: number) => void;
  snapDegrees?: number;
  children: React.ReactNode;
  northIndicatorDeg?: number;
}

const RotaryDial: React.FC<RotaryDialProps> = ({ 
  initialRotation = 0,
  onRotationChange, 
  snapDegrees,
  children,
  northIndicatorDeg
}) => {
  const [rotation, setRotation] = useState(initialRotation);
  const dialRef = useRef<HTMLDivElement>(null);
  const startAngleRef = useRef(0);
  const startRotationRef = useRef(initialRotation);

  useEffect(() => {
    onRotationChange(rotation);
  }, [rotation, onRotationChange]);
  
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    e.preventDefault();
    dialRef.current.setPointerCapture(e.pointerId);

    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    startAngleRef.current = angle;
    startRotationRef.current = rotation;

    dialRef.current.onpointermove = handlePointerMove;
    dialRef.current.onpointerup = handlePointerUp;
    dialRef.current.onpointercancel = handlePointerUp;
  }, [rotation]);

  const handlePointerMove = (e: PointerEvent) => {
    if (!dialRef.current) return;
    
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    let angleDiff = currentAngle - startAngleRef.current;
    let newRotation = (startRotationRef.current + angleDiff + 360) % 360;

    if (snapDegrees) {
      newRotation = Math.round(newRotation / snapDegrees) * snapDegrees;
    }
    
    setRotation(newRotation);
  };
  
  const handlePointerUp = (e: PointerEvent) => {
    if (!dialRef.current) return;
    dialRef.current.releasePointerCapture(e.pointerId);
    dialRef.current.onpointermove = null;
    dialRef.current.onpointerup = null;
    dialRef.current.onpointercancel = null;
  };

  const roundedRotation = Math.round(rotation);

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        <div className="text-center">
            <span className="text-6xl font-bold tabular-nums text-gray-700">{roundedRotation}°</span>
        </div>
        <div
            ref={dialRef}
            className="relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gray-100 border-8 border-gray-200 flex items-center justify-center touch-none select-none overscroll-contain shadow-inner"
            onPointerDown={handlePointerDown}
        >
            {/* Background Ticks */}
            {[...Array(72)].map((_, i) => (
                <div
                    key={i}
                    className={`absolute w-1 h-2 top-0 left-1/2 -ml-0.5 ${i % 9 === 0 ? 'bg-gray-500 h-4' : 'bg-gray-300'}`}
                    style={{ transform: `rotate(${i * 5}deg) translateY(-0.5rem)`, transformOrigin: '0 8rem' }}
                />
            ))}
            
             {/* North Indicator if provided */}
             {northIndicatorDeg !== undefined && (
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
                    style={{
                        transform: `rotate(${northIndicatorDeg}deg) translateY(-10.5rem)`,
                        transformOrigin: '50% 11rem',
                    }}
                >
                    <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-red-600">N</span>
                        <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-8 border-t-red-600"></div>
                    </div>
                </div>
            )}

            {/* Rotatable content */}
            <div
                className="absolute w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                {children}
            </div>
        </div>
    </div>
  );
};

export default RotaryDial;