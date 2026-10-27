import React from "react";
import type { QQShowItem, QQShowOutfit } from "../types/qqShow";
import { LAYER_ORDER } from "../types/qqShow";
import { resolveOutfitLayers } from "../utils/resolveOutfitLayers";
import "./QQShow.css";

interface QQShowProps {
  outfit: QQShowOutfit;
  onItemChange: (category: string, item: QQShowItem | null) => void;
  displayRef?: React.RefObject<HTMLDivElement | null>;
}

const QQShow: React.FC<QQShowProps> = ({ outfit, displayRef }) => {
  const allDisplayItems = resolveOutfitLayers(outfit);

  return (
    <div className="qq-show-container">
      <div className="qq-show-display" ref={displayRef}>
        {allDisplayItems.map((item) => {
          const layerValue = LAYER_ORDER[item.category as keyof typeof LAYER_ORDER] ?? 0;
          return (
            <div
              key={`${item.category}-${item.id}`}
              className="qq-show-layer"
              style={{ zIndex: layerValue }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="qq-show-item-image"
                draggable={false}
              />
            </div>
          );
        })}

        {allDisplayItems.length === 0 && (
          <div className="qq-show-empty">
            <p>选择装扮来创建你的QQ秀</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QQShow;
