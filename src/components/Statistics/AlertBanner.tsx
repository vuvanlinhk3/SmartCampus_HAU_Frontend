import React, { useState } from 'react';
import { AlertTriangle, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Alert } from '../../types';

interface AlertBannerProps {
  alerts: Alert[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  const criticalAlerts = visibleAlerts.filter(alert => alert.type === 'critical');
  const warningAlerts = visibleAlerts.filter(alert => alert.type === 'warning');

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId]);
  };

  if (visibleAlerts.length === 0) return null;

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getAlertIcon = (type: string) => {
    return <AlertTriangle className="h-5 w-5 flex-shrink-0" />;
  };

  return (
    <div className="bg-red-600 shadow-lg border-b-2 border-red-700">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-white" />
            <div className="text-white">
              <span className="font-semibold">
                {warningAlerts.length} cảnh báo nghiêm trọng
              </span>
              {warningAlerts.length > 0 && (
                <span className="ml-2 opacity-90">
                  • {warningAlerts.length} cảnh báo
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white hover:text-red-100 transition-colors duration-200 flex items-center space-x-1"
          >
            <span className="text-sm font-medium">
              {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3">
            {visibleAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${getAlertColor(alert.type)} bg-opacity-90`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-current opacity-60 hover:opacity-80 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;