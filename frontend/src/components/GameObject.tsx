/**
 * Game Object Component
 * 
 * Renders a single interactive stimulus object (animal/shape)
 * Handles flashing animation when selected as target
 */

import React from 'react';

interface GameObjectProps {
  id: number;
  emoji: string;
  isFlashing: boolean;
  isSelected: boolean;
  onClick: (id: number) => void;
  flashSpeed: number;
}

export const GameObject: React.FC<GameObjectProps> = ({
  id,
  emoji,
  isFlashing,
  isSelected,
  onClick,
  flashSpeed,
}) => {
  const animationDuration = `${0.5 / flashSpeed}s`;

  return (
    <button
      onClick={() => onClick(id)}
      className={`
        relative
        w-24 h-24
        rounded-lg
        transition-all duration-200
        flex items-center justify-center
        text-5xl
        ${
          isSelected
            ? 'ring-4 ring-blue-500 bg-blue-50'
            : 'bg-white hover:bg-gray-50'
        }
        ${isFlashing ? 'animate-flash' : ''}
        shadow-lg hover:shadow-xl
      `}
      style={{
        animationDuration: isFlashing ? animationDuration : undefined,
      }}
    >
      {emoji}
      {isSelected && (
        <div className="absolute top-1 right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </button>
  );
};
