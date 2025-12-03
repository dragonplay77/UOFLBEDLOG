
import React, { useRef } from 'react';
import { Bed, UserRole } from '../types';
import { BedLogItem } from './BedLogItem';

type SortableBedKeys = keyof Bed;

interface BedLogTableProps {
  beds: Bed[];
  onEditBed: (bed: Bed) => void;
  currentUserRole: UserRole;
  sortConfig: { key: SortableBedKeys | null; direction: 'ascending' | 'descending' };
  requestSort: (key: SortableBedKeys) => void;
}

export const BedLogTable: React.FC<BedLogTableProps> = ({ beds, onEditBed, currentUserRole, sortConfig, requestSort }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const headers: { label: string; key: SortableBedKeys | null }[] = [
    { label: "Patient L.N.", key: "patientLastName" },
    { label: "Bed Type", key: "bedType" },
    { label: "Department", key: "department" },
    { label: "Status", key: "status" },
    { label: "Location", key: "location" },
    { label: "Rental?", key: "isRental" },
    { label: "Vendor #", key: "hillromConfirmation" },
    { label: "Asset #", key: "assetNumber" },
    { label: "Serial #", key: "serialNumber" },
    { label: "Notes", key: "notes" },
    { label: "Last Edit", key: "lastEditedDate" },
    { label: "", key: null } 
  ];

  const getSortIndicator = (columnKey: SortableBedKeys | null) => {
    if (!columnKey) return null;
    if (sortConfig.key !== columnKey) {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 text-slate-400 invisible group-hover:visible"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" /></svg>;
    }
    if (sortConfig.direction === 'ascending') {
      return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 text-slate-700"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>;
    }
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 text-slate-700"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>;
  };

  const scrollBy = (dx: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dx, behavior: 'smooth' });
    }
  };

  return (
    <div className="shadow-sm rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center justify-end gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 sticky top-0 z-20">
        <span className="text-xs text-gray-600 mr-auto">Table Controls</span>
        <button type="button" onClick={() => scrollBy(-300)} className="px-2 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">Scroll Left</button>
        <button type="button" onClick={() => scrollBy(300)} className="px-2 py-1 text-xs rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100">Scroll Right</button>
      </div>
      <div ref={scrollRef} className="overflow-x-auto">
      {beds.length === 0 ? (
        <p className="text-center text-slate-500 py-16 text-lg bg-white rounded-lg">No beds match your search criteria. <br/> Add a new bed to get started.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr>
              {headers.map(header => (
                <th
                  key={header.label}
                  scope="col"
                  onClick={header.key ? () => requestSort(header.key!) : undefined}
                  className={`px-5 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-b border-gray-200 ${header.key ? 'cursor-pointer hover:bg-gray-200/60 group' : ''}`}
                >
                  <div className="flex items-center">
                    {header.label}
                    {header.key && getSortIndicator(header.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {beds.map((bed) => (
              <BedLogItem key={bed.id} bed={bed} onEdit={onEditBed} currentUserRole={currentUserRole} />
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};