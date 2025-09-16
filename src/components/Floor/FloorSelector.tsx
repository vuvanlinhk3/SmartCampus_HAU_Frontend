import React from 'react';
import { Building2 } from 'lucide-react';

interface FloorSelectorProps {
  selectedFloor: number;
  onFloorSelect: (floor: number) => void;
}

const FloorSelector: React.FC<FloorSelectorProps> = ({ selectedFloor, onFloorSelect }) => {
  const floors = Array.from({ length: 20 }, (_, i) => i + 1);

  const getFloorType = (floor: number) => {
    if (floor === 1) return 'Sảnh chính';
    if (floor <= 5) return 'Văn phòng';
    return 'Căn hộ';
  };

  return (
    <div className="bg-white h-full flex flex-col border-r border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chọn Tầng</h2>
            <p className="text-xs text-gray-600">20 tầng có sẵn</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {floors.map((floor) => (
            <button
              key={floor}
              onClick={() => onFloorSelect(floor)}
              className={`
                w-full text-left px-3 py-2 rounded transition-colors
                ${selectedFloor === floor 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded flex items-center justify-center text-xs font-medium
                    ${selectedFloor === floor 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {floor}
                  </div>
                  <div>
                    <div className="text-sm">Tầng {floor}</div>
                    <div className="text-xs text-gray-500">
                      {getFloorType(floor)}
                    </div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloorSelector;