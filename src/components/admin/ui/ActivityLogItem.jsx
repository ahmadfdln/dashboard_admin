import React from 'react';
import { Users, BookOpen, MapPin } from 'lucide-react';

export function ActivityLogItem({ log }) {
  let Icon = Users;
  if (log.type === 'COURSE_CREATE') Icon = BookOpen;
  if (log.type === 'ROOM_CREATE') Icon = MapPin;

  return (
    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div>
        <p className="font-medium text-gray-900 text-sm">{log.action}</p>
        <p className="text-gray-500 text-xs">{log.timestamp}</p>
      </div>
    </div>
  );
}