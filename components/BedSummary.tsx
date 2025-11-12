import React, { useMemo } from 'react';
import { Bed, BedType, BedStatus } from '../types';

interface SummaryCounts {
  [BedStatus.ASSIGNED_PATIENT]: number;
  [BedStatus.STORED_AVAILABLE]: number;
  [BedStatus.OUT_OF_SERVICE]: number;
  total: number;
}

interface SummaryData {
  [key: string]: SummaryCounts;
}

const getStatusColorClass = (status: BedStatus) => {
    switch (status) {
        case BedStatus.ASSIGNED_PATIENT:
            return 'text-green-600';
        case BedStatus.STORED_AVAILABLE:
            return 'text-blue-600';
        case BedStatus.OUT_OF_SERVICE:
            return 'text-red-600';
        default:
            return 'text-slate-600';
    }
};

export const BedSummary: React.FC<{ beds: Bed[] }> = ({ beds }) => {
  const summaryData: SummaryData = useMemo(() => {
    if (!beds) return {};

    return beds.reduce((acc: SummaryData, bed) => {
      // Determine the bed type name to use as the key.
      const bedTypeName = bed.bedType === BedType.OTHER && bed.otherBedTypeName?.trim()
        ? `${bed.bedType} (${bed.otherBedTypeName.trim()})`
        : bed.bedType;

      // If this bed type is not yet in our accumulator, initialize it.
      if (!acc[bedTypeName]) {
        acc[bedTypeName] = {
          [BedStatus.ASSIGNED_PATIENT]: 0,
          [BedStatus.STORED_AVAILABLE]: 0,
          [BedStatus.OUT_OF_SERVICE]: 0,
          total: 0,
        };
      }

      // Increment the count for the bed's status and the total count.
      // This check adds robustness against malformed data from the database.
      if (bed.status && acc[bedTypeName].hasOwnProperty(bed.status)) {
        acc[bedTypeName][bed.status]++;
        acc[bedTypeName].total++;
      }
      
      return acc;
    }, {}); // Start with an empty object as the accumulator.
  }, [beds]);

  // Sort the summary entries alphabetically by bed type for a consistent display.
  const sortedSummaryEntries = useMemo(() => {
    return Object.entries(summaryData).sort((a, b) => a[0].localeCompare(b[0]));
  }, [summaryData]);

  if (Object.keys(summaryData).length === 0) {
    return null; // Don't render the summary if there are no beds.
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-4">Inventory Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedSummaryEntries.map(([bedType, counts]) => (
          <div key={bedType} className="bg-white p-4 rounded-lg shadow-md border border-slate-200 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-slate-800 truncate" title={bedType}>{bedType}</h3>
              <p className="text-sm text-slate-500">Total: <span className="font-semibold text-slate-700">{counts.total}</span></p>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200 space-y-1 text-sm">
              <div className={`flex justify-between items-center ${getStatusColorClass(BedStatus.ASSIGNED_PATIENT)}`}>
                <span>Assigned:</span>
                <span className="font-semibold">{counts[BedStatus.ASSIGNED_PATIENT]}</span>
              </div>
              <div className={`flex justify-between items-center ${getStatusColorClass(BedStatus.STORED_AVAILABLE)}`}>
                <span>Available:</span>
                <span className="font-semibold">{counts[BedStatus.STORED_AVAILABLE]}</span>
              </div>
              <div className={`flex justify-between items-center ${getStatusColorClass(BedStatus.OUT_OF_SERVICE)}`}>
                <span>Out of Service:</span>
                <span className="font-semibold">{counts[BedStatus.OUT_OF_SERVICE]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
