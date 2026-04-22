import React, { useState, useEffect } from "react";

interface Achievement {
  name: string;
  description: string;
  achievementIcon: string;
  achievementPoints: number;
}

interface AchievementPopupProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  achievement,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setIsVisible(true), 100);

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade out animation
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`bg-gradient-to-br from-yellow-600 to-yellow-800 border-4 border-yellow-400 rounded-lg p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        {/* Achievement Icon */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">
            {achievement.achievementIcon}
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">
            QUEST COMPLETED!
          </h2>
        </div>

        {/* Achievement Details */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-black mb-2">
            {achievement.name}
          </h3>
          <p className="text-black mb-4">{achievement.description}</p>
          <div className="inline-flex items-center bg-black bg-opacity-20 rounded-full px-4 py-2">
            <span className="text-black font-bold">
              +{achievement.achievementPoints} Points
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleClose}
            className="bg-black hover:bg-gray-800 text-yellow-400 font-bold py-2 px-6 rounded transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-2 right-2">
          <div className="text-yellow-300 animate-spin">[STAR]</div>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="text-yellow-300 animate-spin-reverse">[STAR]</div>
        </div>
      </div>
    </div>
  );
};

export default AchievementPopup;
