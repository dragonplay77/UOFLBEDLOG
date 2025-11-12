
import React from 'react';
import { Bed, BedStatus, BedType, UserRole } from '../types';

interface BedLogItemProps {
  bed: Bed;
  onEdit: (bed: Bed) => void;
  currentUserRole: UserRole;
}

export const BedLogItem: React.FC<BedLogItemProps> = ({ bed, onEdit, currentUserRole }) => {
  const getStatusPillClasses = () => {
    switch (bed.status) {
      case BedStatus.ASSIGNED_PATIENT:
        return 'bg-green-100 text-green-800 border border-green-200';
      case BedStatus.STORED_AVAILABLE:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case BedStatus.OUT_OF_SERVICE:
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const displayBedType = bed.bedType === BedType.OTHER ? `${bed.bedType} (${bed.otherBedTypeName || 'N/A'})` : bed.bedType;
  
  const formattedDate = new Date(bed.lastEditedDate).toLocaleString([], {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <tr className={`hover:bg-gray-50 transition-colors odd:bg-white even:bg-gray-50`}>
      <td className="px-5 py-4 whitespace-nowrap text-sm font-medium">{bed.patientLastName || 'N/A'}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{displayBedType}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.bedArea}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusPillClasses()}`}>
          {bed.status}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.location}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${bed.isRental ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
          {bed.isRental ? 'Yes' : 'No'}
        </span>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.hillromConfirmation || 'N/A'}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.assetNumber || 'N/A'}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.serialNumber || 'N/A'}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">{bed.purchaseOrder || 'N/A'}</td>
      <td className="px-5 py-4 text-sm min-w-[150px]">{bed.notes || 'N/A'}</td>
      <td className="px-5 py-4 whitespace-nowrap text-sm">
        <div className="truncate" title={bed.lastEditedBy}>{bed.lastEditedBy}</div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </td>
      <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(bed)}
          className="text-indigo-600 hover:text-indigo-900 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
          Edit
        </button>
      </td>
    </tr>
  );
};
