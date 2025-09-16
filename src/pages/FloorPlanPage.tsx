import React, { useState } from 'react';
import FloorSelector from '../components/Floor/FloorSelector';
import FloorDiagram from '../components/Floor/FloorDiagram';

const FloorPlanPage: React.FC = () => {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  return (
    <div className="h-[calc(100vh-5rem)] bg-gray-100 flex">
      {/* Left Sidebar - Floor Selector */}
      <div className="w-64 flex-shrink-0">
        <FloorSelector
          selectedFloor={selectedFloor}
          onFloorSelect={setSelectedFloor}
        />
      </div>

      {/* Main Content - Floor Diagram */}
      <div className="flex-1 min-w-0">
        <FloorDiagram floor={selectedFloor} />
      </div>
    </div>
  );
};

export default FloorPlanPage;