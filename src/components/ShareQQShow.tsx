import React from "react";
import type { QQShowOutfit } from "../types/qqShow";
import { LAYER_ORDER } from "../types/qqShow";
import { resolveOutfitLayers } from "../utils/resolveOutfitLayers";

interface ShareQQShowProps {
  outfit: QQShowOutfit;
  displayRef?: React.RefObject<HTMLDivElement | null>;
}

const ShareQQShow: React.FC<ShareQQShowProps> = ({ outfit, displayRef }) => {
  const allDisplayItems = resolveOutfitLayers(outfit);

  return (
    <div className="share-display-container" ref={displayRef}>
      <div className="share-display-area">
        {allDisplayItems.map((item) => {
          const layerValue = LAYER_ORDER[item.category as keyof typeof LAYER_ORDER] ?? 0;
          return (
            <div
              key={`${item.category}-${item.id}`}
              className="share-display-layer"
              style={{ zIndex: layerValue }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="share-display-image"
                draggable={false}
              />
            </div>
          );
        })}

        {allDisplayItems.length === 0 && (
          <div className="share-display-empty">
            <p>选择装扮来创建你的QQ秀</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareQQShow;
