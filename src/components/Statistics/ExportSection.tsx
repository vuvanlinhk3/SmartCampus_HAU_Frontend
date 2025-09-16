import React from 'react';
import { Download } from 'lucide-react';
import { Room, Equipment } from '../../types';

interface ExportSectionProps {
  rooms: Room[];
  equipment: Equipment[];
}

const ExportSection: React.FC<ExportSectionProps> = ({ rooms, equipment }) => {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      alert('Không có dữ liệu để xuất');
      return;
    }

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    ).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportRooms = () => {
    exportToCSV(rooms, 'rooms');
  };

  const handleExportEquipment = () => {
    exportToCSV(equipment, 'equipment');
  };

  if (rooms.length === 0 && equipment.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Xuất dữ liệu</h3>
      <div className="flex flex-wrap gap-4">
        {rooms.length > 0 && (
          <button
            onClick={handleExportRooms}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất phòng học
          </button>
        )}
        
        {equipment.length > 0 && (
          <button
            onClick={handleExportEquipment}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất thiết bị
          </button>
        )}
      </div>
    </div>
  );
};

export default ExportSection;