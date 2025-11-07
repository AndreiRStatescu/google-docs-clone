import { useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

// Ruler configuration constants
const DOCUMENT_WIDTH = 816; // Standard document width (8.5" paper at ~96 DPI)
const DEFAULT_MARGIN = 56; // Default margin (0.5-0.6 inches)
const MIN_CONTENT_WIDTH = 100; // Minimum content width between margins
const RULER_SEGMENTS = 82; // Number of segments for ruler divisions
const TICK_MARK_COUNT = 83; // Number of tick marks (creates 82 segments)
const MAJOR_TICK_INTERVAL = 10; // Major tick marks every 10 units
const MINOR_TICK_INTERVAL = 5; // Minor tick marks every 5 units

const markers = Array.from({ length: TICK_MARK_COUNT }, (_, i) => i);

export const Ruler = () => {
  const [leftMargin, setLeftMargin] = useState(DEFAULT_MARGIN);
  const [rightMargin, setRightMargin] = useState(DEFAULT_MARGIN);

  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);

  const handleLeftMouseDown = () => {
    setIsDraggingLeft(true);
  };

  const handleRightMouseDown = () => {
    setIsDraggingRight(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
      const container = rulerRef.current.querySelector("#ruler-container");
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const relativeX = e.clientX - containerRect.left;
        const rawPosition = Math.max(0, Math.min(relativeX, DOCUMENT_WIDTH));

        if (isDraggingLeft) {
          const maxLeftPosition =
            DOCUMENT_WIDTH - rightMargin - MIN_CONTENT_WIDTH;
          const newLeftPosition = Math.min(rawPosition, maxLeftPosition);
          setLeftMargin(newLeftPosition);
        } else if (isDraggingRight) {
          const maxRightPosition =
            DOCUMENT_WIDTH - (leftMargin + MIN_CONTENT_WIDTH);
          const newRightPosition = Math.max(DOCUMENT_WIDTH - rawPosition, 0);
          const constrainedRightPosition = Math.min(
            newRightPosition,
            maxRightPosition
          );
          setRightMargin(constrainedRightPosition);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingLeft(false);
    setIsDraggingRight(false);
  };

  const handleLeftDoubleClick = () => {
    setLeftMargin(DEFAULT_MARGIN);
  };

  const handleRightDoubleClick = () => {
    setRightMargin(DEFAULT_MARGIN);
  };

  return (
    <div
      ref={rulerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="h-6 border-b border-gray-300 flex items-end relative select-none print:hidden"
    >
      <div
        id="ruler-container"
        className="max-w-[816px] mx-auto w-full h-full relative"
      >
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={isDraggingLeft}
          onMouseDown={handleLeftMouseDown}
          onDoubleClick={handleLeftDoubleClick}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={isDraggingRight}
          onMouseDown={handleRightMouseDown}
          onDoubleClick={handleRightDoubleClick}
        />

        <div className="absolute inset-x-0 bottom-0">
          <div className="relative" style={{ width: `${DOCUMENT_WIDTH}px` }}>
            {markers.map(marker => {
              const position = (marker * DOCUMENT_WIDTH) / RULER_SEGMENTS;

              return (
                <div
                  key={marker}
                  className="absolute border-0"
                  style={{ left: `${position}px` }}
                >
                  {marker % MAJOR_TICK_INTERVAL === 0 && (
                    <>
                      <div className="absolute bottom-0 w-px h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / MAJOR_TICK_INTERVAL + 1}
                      </span>
                    </>
                  )}
                  {marker % MINOR_TICK_INTERVAL === 0 &&
                    marker % MAJOR_TICK_INTERVAL !== 0 && (
                      <div className="absolute bottom-0 w-px h-1.5 bg-neutral-500" />
                    )}
                  {marker % MINOR_TICK_INTERVAL !== 0 && (
                    <div className="absolute bottom-0 w-px h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className={`absolute top-0 w-4 h-full cursor-ew-resize z-[5] group ${isLeft ? "-ml-2" : "-mr-2"}`}
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    </div>
  );
};
