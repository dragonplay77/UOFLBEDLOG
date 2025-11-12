
import React, { useState, useEffect } from 'react';
import { Bed, BedType, BedArea, BedStatus, UserRole, BedFormData, AppUser } from '../types';
import { BED_TYPE_OPTIONS, BED_AREA_OPTIONS, BED_STATUS_OPTIONS } from '../constants';
import { TextInput } from './TextInput';
import { SelectInput } from './SelectInput';

interface BedFormProps {
  onSubmit: (bedData: BedFormData, id?: string) => void;
  onCancel: () => void;
  initialData?: Bed;
  currentUser: AppUser;
  isSubmitting: boolean;
}

export const BedForm: React.FC<BedFormProps> = ({ onSubmit, onCancel, initialData, currentUser, isSubmitting }) => {
  const [formData, setFormData] = useState<Omit<BedFormData, 'lastEditedBy'>>({
    patientLastName: initialData?.patientLastName || '',
    bedType: initialData?.bedType || BedType.LOW_AIR_LOSS,
    otherBedTypeName: initialData?.otherBedTypeName || '',
    bedArea: initialData?.bedArea || BedArea.ICU,
    status: initialData?.status || BedStatus.STORED_AVAILABLE,
    location: initialData?.location || '',
    isRental: initialData?.isRental || false,
    hillromConfirmation: initialData?.hillromConfirmation || '',
    assetNumber: initialData?.assetNumber || '',
    serialNumber: initialData?.serialNumber || '',
    purchaseOrder: initialData?.purchaseOrder || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BedFormData, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        patientLastName: initialData.patientLastName || '',
        bedType: initialData.bedType,
        otherBedTypeName: initialData.otherBedTypeName || '',
        bedArea: initialData.bedArea,
        status: initialData.status,
        location: initialData.location,
        isRental: initialData.isRental || false,
        hillromConfirmation: initialData.hillromConfirmation || '',
        assetNumber: initialData.assetNumber || '',
        serialNumber: initialData.serialNumber || '',
        purchaseOrder: initialData.purchaseOrder || '',
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.status === BedStatus.OUT_OF_SERVICE && formData.location !== "14th Floor") {
      setFormData(prev => ({ ...prev, location: "14th Floor" }));
    }
  }, [formData.status]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    if (name === 'isRental' && !checked) {
      setFormData(prev => ({ ...prev, hillromConfirmation: '' }));
      if (errors.hillromConfirmation) {
         setErrors(prev => ({ ...prev, hillromConfirmation: undefined}));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof BedFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BedFormData, string>> = {};
    if (formData.status === BedStatus.ASSIGNED_PATIENT && !formData.patientLastName?.trim()) {
      newErrors.patientLastName = "Patient Last Name is required when bed is assigned.";
    }
    if (formData.bedType === BedType.OTHER && !formData.otherBedTypeName?.trim()) {
      newErrors.otherBedTypeName = "Specify bed type name when 'Other' is selected.";
    }
    if (!formData.location.trim()) {
        newErrors.location = "Location is required.";
    }
    if (!formData.bedType) newErrors.bedType = "Bed Type is required.";
    if (!formData.bedArea) newErrors.bedArea = "Bed Area is required.";
    if (!formData.status) newErrors.status = "Status is required.";

    if (formData.isRental && !formData.hillromConfirmation?.trim()) {
      newErrors.hillromConfirmation = "Vendor Confirmation # is required for rental beds.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, initialData?.id);
    }
  };

  const isAdmin = currentUser.role === UserRole.ADMIN;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <SelectInput
          label="Status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          options={BED_STATUS_OPTIONS}
          required
          error={errors.status}
        />
        <TextInput
          label="Patient Last Name"
          id="patientLastName"
          value={formData.patientLastName || ''}
          onChange={handleChange}
          placeholder="Required if assigned"
          required={formData.status === BedStatus.ASSIGNED_PATIENT}
          disabled={formData.status !== BedStatus.ASSIGNED_PATIENT}
          error={errors.patientLastName}
        />
        <SelectInput
          label="Bed Type"
          id="bedType"
          value={formData.bedType}
          onChange={handleChange}
          options={BED_TYPE_OPTIONS}
          required
          error={errors.bedType}
        />
        {formData.bedType === BedType.OTHER ? (
          <TextInput
            label="Other Bed Type Name"
            id="otherBedTypeName"
            value={formData.otherBedTypeName || ''}
            onChange={handleChange}
            placeholder="Specify bed type"
            required
            error={errors.otherBedTypeName}
          />
        ) : <div />}
         <SelectInput
          label="Bed Area"
          id="bedArea"
          value={formData.bedArea}
          onChange={handleChange}
          options={BED_AREA_OPTIONS}
          required
          error={errors.bedArea}
        />
        <TextInput
          label="Location"
          id="location"
          value={formData.location}
          onChange={handleChange}
          placeholder={formData.status === BedStatus.OUT_OF_SERVICE ? "14th Floor (Auto-set)" : "e.g., Room 302, Hub"}
          required
          disabled={formData.status === BedStatus.OUT_OF_SERVICE}
          error={errors.location}
        />
      </div>
      
      <div className="space-y-4 border border-slate-200 p-4 rounded-md">
        <div className="flex items-center">
          <input
            id="isRental"
            name="isRental"
            type="checkbox"
            checked={formData.isRental}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="isRental" className="ml-3 block text-sm font-medium text-slate-700">
            Is this a rental bed?
          </label>
        </div>
        
        <TextInput
          label="Vendor Confirmation #"
          id="hillromConfirmation"
          value={formData.hillromConfirmation || ''}
          onChange={handleChange}
          placeholder="Paste confirmation # from vendor"
          required={formData.isRental} 
          disabled={!formData.isRental} 
          error={errors.hillromConfirmation}
        />
        {formData.isRental && (
           <p className="mt-1 text-xs text-slate-500">
              Please place the order on the vendor's website and paste the confirmation number here.
          </p>
        )}
      </div>
      
      <fieldset className="border border-slate-300 p-4 rounded-md bg-slate-50">
        <legend className="text-lg font-medium text-slate-700 px-2">Admin Details</legend>
        <p className="text-xs text-slate-500 mb-4 px-2">These fields can only be edited by an Administrator.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
            <TextInput label="Asset Number" id="assetNumber" value={formData.assetNumber || ''} onChange={handleChange} disabled={!isAdmin} error={errors.assetNumber} />
            <TextInput label="Serial Number" id="serialNumber" value={formData.serialNumber || ''} onChange={handleChange} disabled={!isAdmin} error={errors.serialNumber} />
            <TextInput label="Purchase Order (PO)" id="purchaseOrder" value={formData.purchaseOrder || ''} onChange={handleChange} disabled={!isAdmin} error={errors.purchaseOrder} />
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
          placeholder="Add any relevant notes about the bed..."
          className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 pt-6 border-t border-slate-200 mt-6">
        <p className="text-sm text-slate-600">
          Editing as: <span className="font-medium text-slate-800">{currentUser.email}</span>
        </p>
        <div className="flex justify-end space-x-3">
            <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-slate-200"
            >
            Cancel
            </button>
            <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
            {isSubmitting ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
                </>
            ) : (
                initialData ? 'Save Changes' : 'Add Bed'
            )}
            </button>
        </div>
      </div>
    </form>
  );
};