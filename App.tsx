
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Bed, UserRole, BedFormData, AppUser, BedStatus } from './types';
import { BedLogTable } from './components/BedLogTable';
import { Modal } from './components/Modal';
import { BedForm } from './components/BedForm';
import { NewHireGuide } from './components/NewHireGuide';
import { UserManagement } from './components/UserManagement';
import { BedSummary } from './components/BedSummary';

type SortableBedKeys = keyof Bed;

interface AppProps {
  currentUser: AppUser;
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ currentUser, onLogout }) => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBed, setEditingBed] = useState<Bed | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableBedKeys; direction: 'ascending' | 'descending' }>({ key: 'lastEditedDate', direction: 'descending' });
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const enableSampleSeed = import.meta.env.VITE_ENABLE_SAMPLE_SEED === 'true';

  useEffect(() => {
    setIsLoading(true);
    const bedsCollectionRef = collection(db, 'beds');
    const q = query(bedsCollectionRef, orderBy('lastEditedDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bedsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastEditedDate: (data.lastEditedDate as Timestamp).toDate().toISOString(),
        } as Bed;
      });
      setBeds(bedsData);
      setError(null);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching beds:", err);
      setError("Failed to load bed data. Please check your connection and refresh.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenAddModal = useCallback(() => {
    setEditingBed(null);
    setError(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((bed: Bed) => {
    setEditingBed(bed);
    setError(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBed(null);
    setError(null);
  }, []);

  const handleFormSubmit = useCallback(async (formData: BedFormData, id?: string) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const bedDataForDb = {
        ...formData,
        lastEditedBy: currentUser.email,
        lastEditedDate: Timestamp.now(),
      };

      if (id) {
        const bedDocRef = doc(db, 'beds', id);
        await updateDoc(bedDocRef, bedDataForDb);
      } else {
        await addDoc(collection(db, 'beds'), bedDataForDb);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving bed data:", err);
      setError("An error occurred while saving the data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUser, handleCloseModal]);

  const requestSort = useCallback((key: SortableBedKeys) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const sortedAndFilteredBeds = useMemo(() => {
    let processableBeds = [...beds];

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      processableBeds = processableBeds.filter(bed => 
        Object.values(bed).some(value => 
            String(value).toLowerCase().includes(lowerSearchTerm)
        )
      );
    }

    if (sortConfig.key) {
      processableBeds.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (aValue == null) return 1;
        if (bValue == null) return -1;
        
        const strA = String(aValue).toLowerCase();
        const strB = String(bValue).toLowerCase();

        if (strA < strB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (strA > strB) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    return processableBeds;
  }, [beds, searchTerm, sortConfig]);

  const handleOpenGuideModal = useCallback(() => setIsGuideModalOpen(true), []);
  const handleCloseGuideModal = useCallback(() => setIsGuideModalOpen(false), []);
  const handleOpenUserModal = useCallback(() => setIsUserModalOpen(true), []);
  const handleCloseUserModal = useCallback(() => setIsUserModalOpen(false), []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
              Hospital Bed Log
            </h1>
            <p className="text-sm text-gray-600 hidden sm:block">Track and manage hospital bed inventory efficiently.</p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                {currentUser.role === UserRole.ADMIN && (
                   <button
                      onClick={handleOpenUserModal}
                      className="bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center"
                      aria-label="Manage Users"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-0 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm7.5 2.962c1.146 0 2.233.234 3.22.662M12 10.5a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm7.5 2.962a4.5 4.5 0 01-.662 3.22m0 0a4.5 4.5 0 01-3.22.662m3.22-.662a4.5 4.5 0 00-3.22.662M3 18.75a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72M13.5 18.75a9.094 9.094 0 013.741-.479 3 3 0 01-4.682-2.72" /></svg>
                      <span className="hidden sm:inline">Users</span>
                  </button>
                )}
                <button
                    onClick={handleOpenGuideModal}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center"
                    aria-label="Open New Hire Guide"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-0 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" /></svg>
                    <span className="hidden sm:inline">Help</span>
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-0 sm:mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>
                    <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
         {!isLoading && <BedSummary beds={beds} />}

      <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-700 whitespace-nowrap text-center md:text-left">Logged in as: <span className="font-semibold">{currentUser.email} ({currentUser.role})</span></p>
             <div className="relative w-full md:max-w-md">
                <input
                    type="text"
                    placeholder="Search beds (patient, location, notes...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
                    aria-label="Search beds"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                     {searchTerm ? (
                        <button onClick={() => setSearchTerm('')} className="p-1 -mr-1 text-gray-500 hover:text-gray-700" aria-label="Clear search">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                     ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 pointer-events-none">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                     )}
                </div>
            </div>
         </div>

         {/* Legend for quick color reference */}
         <div className="mb-6 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm">
           <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
             <span className="font-medium text-gray-700 mr-1">Legend:</span>
             <span className="px-2.5 py-1 inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
               <span className="h-2 w-2 rounded-full bg-blue-500"></span>
               {BedStatus.STORED_AVAILABLE}
             </span>
             <span className="px-2.5 py-1 inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 border border-green-200">
               <span className="h-2 w-2 rounded-full bg-green-500"></span>
               {BedStatus.ASSIGNED_PATIENT}
             </span>
             <span className="px-2.5 py-1 inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 border border-red-200">
               <span className="h-2 w-2 rounded-full bg-red-500"></span>
               {BedStatus.OUT_OF_SERVICE}
             </span>
           </div>
         </div>

        <div className="mb-2 flex justify-end items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add New Bed
          </button>
          {currentUser.role === UserRole.ADMIN && enableSampleSeed && (
            <button
              onClick={async () => {
                // Lazy import to keep bundle size the same when not used
                const { seedSampleBeds } = await import('./sampleData');
                setError(null);
                setIsSubmitting(true);
                try {
                  const count = await seedSampleBeds(currentUser);
                  // reuse error banner area as a quick status via setError(null) and below we'll add a small inline message
                  alert(`Inserted ${count} sample bed entr${count === 1 ? 'y' : 'ies'}.`);
                } catch (e) {
                  console.error(e);
                  alert('Failed to insert sample data.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="text-sm text-gray-600 underline hover:text-gray-800"
              title="Add a few example rows to the table"
            >
              Add sample data
            </button>
          )}
        </div>
        
        {isLoading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
                <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="ml-4 text-lg text-slate-600">Loading Bed Data...</p>
            </div>
        ) : error && !isModalOpen ? (
             <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
                <p className="font-bold">Error</p>
                <p>{error}</p>
            </div>
        ) : (
            <BedLogTable 
                beds={sortedAndFilteredBeds} 
                onEditBed={handleOpenEditModal} 
                currentUserRole={currentUser.role}
                sortConfig={sortConfig}
                requestSort={requestSort}
            />
        )}


        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingBed ? 'Edit Bed Information' : 'Add New Bed to Log'}
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
          )}
          <BedForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingBed || undefined}
            currentUser={currentUser}
            isSubmitting={isSubmitting}
          />
        </Modal>

        <Modal
            isOpen={isGuideModalOpen}
            onClose={handleCloseGuideModal}
            title="New Hire Guide: Hospital Bed Log"
        >
            <NewHireGuide />
        </Modal>

        <Modal
            isOpen={isUserModalOpen}
            onClose={handleCloseUserModal}
            title="User Management"
        >
            <UserManagement />
        </Modal>

      </main>
      <footer className="text-center mt-12 pb-6 px-4">
        <p className="text-sm text-gray-600">Created by Shekib Kohistani.</p>
        <p className="text-sm text-gray-600">
          For support, contact: <a href="mailto:skbedlog@gmail.com" className="text-indigo-600 hover:text-indigo-800 hover:underline">skbedlog@gmail.com</a>
        </p>
        <p className="text-xs text-gray-500 mt-2">&copy; {new Date().getFullYear()} Hospital Bed Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
