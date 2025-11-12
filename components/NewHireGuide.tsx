import React from 'react';

export const NewHireGuide: React.FC = () => {
  return (
    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
      <h2 className="text-xl font-semibold text-indigo-700 mb-4">Welcome to the Hospital Bed Log!</h2>
      <p>
        This system is designed to help us efficiently track and manage hospital bed inventory. 
        Accurate and up-to-date information is crucial for patient care, resource allocation, and operational smoothness.
      </p>

      <h3 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">1. Logging In</h3>
      <p>
        To access the Bed Log, you'll first need to log in:
      </p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Enter the email and password provided to you.</li>
        <li>
          <strong>Admin Role:</strong> If you are an Administrator, you will have additional permissions to edit specific fields like "Asset Number", "Serial Number", and "Purchase Order (PO)". These fields will be disabled for regular users. You can also manage the user list.
        </li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">2. Key Features & Workflow</h3>
      
      <h4 className="text-md font-semibold text-gray-800 mt-4 mb-1">Adding a New Bed</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Click the "Add New Bed" button.</li>
        <li>Fill in all required fields (marked with a red asterisk <span className="text-red-500">*</span>).</li>
        <li><strong>Bed Type:</strong> Choose the correct type. If you select "Other (Specify)", a new field will appear where you must enter the specific name of the bed type.</li>
        <li><strong>Bed Area:</strong> Select the designated area for the bed (e.g., ICU, Frazier).</li>
        <li><strong>Status:</strong> This is crucial.
          <ul className="list-circle pl-5 mt-1 space-y-1">
            <li><em>Assigned to Patient:</em> If selected, the "Patient Last Name" field becomes required.</li>
            <li><em>Stored - Available:</em> The bed is clean, in good condition, and ready for a new patient.</li>
            <li><em>Out of Service / Broken:</em> If a bed is broken or needs repair, select this status. The "Location" field will automatically be set to "14th Floor". This is a standard procedure, so ensure the bed is physically moved there or tagged appropriately.</li>
          </ul>
        </li>
        <li><strong>Location:</strong> Enter the current physical location of the bed (e.g., "Room 302A", "Hallway C", "Hub Storage"). This is disabled if status is "Out of Service / Broken".</li>
        <li>
            <strong>Rental Beds:</strong>
            <ul className="list-circle pl-5 mt-1 space-y-1">
                <li>Check the "Is this a rental bed?" box if the bed is a rental.</li>
                <li>If checked, the "Vendor Confirmation #" field becomes <strong>mandatory</strong>. You must place the rental order on the vendor's website first, then obtain the confirmation number and paste it into this field.</li>
            </ul>
        </li>
        <li><strong>Notes:</strong> Use this field to add any relevant details not covered by other fields (e.g., "Awaiting mattress replacement," "Special attachments included").</li>
      </ul>

      <h4 className="text-md font-semibold text-gray-800 mt-4 mb-1">Editing an Existing Bed</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li>Find the bed you want to update in the main table.</li>
        <li>Click the "Edit" button (with a pencil icon) on that bed's row.</li>
        <li>The form will pop up, pre-filled with the bed's current information.</li>
        <li>Modify the necessary fields and click "Save Changes". The system will automatically record your email and the time of the edit.</li>
      </ul>
      
      <h4 className="text-md font-semibold text-gray-800 mt-4 mb-1">Searching and Sorting the Log</h4>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Search:</strong> Use the search bar at the top of the table to quickly find beds. You can search by Patient Last Name, Bed Type, Location, Asset/Serial Number, Vendor Confirmation #, or even text within the Notes.</li>
        <li><strong>Sort:</strong> Click on the column headers (e.g., "Status", "Location", "Last Edit") to sort the bed list by that column. Clicking again will toggle between ascending and descending order. An arrow indicator will show the current sort direction.</li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">3. Important Reminders</h3>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>Accuracy is Key:</strong> Please double-check all information before submitting. The integrity of this log depends on accurate data entry.</li>
        <li><strong>"Out of Service" Beds:</strong> Remember, marking a bed as "Out of Service / Broken" will automatically assign its location to "14th Floor". Follow hospital protocol for these beds.</li>
        <li><strong>Audit Trail:</strong> Every time you add or save changes to a bed, your email address and the current timestamp are automatically recorded. This ensures accountability and helps in tracking changes.</li>
      </ul>

      <h3 className="text-lg font-semibold text-indigo-600 mt-6 mb-2">4. Need Help?</h3>
      <p>
        If you encounter any issues, have questions, or need technical support with the Bed Log system, please refer to the contact information in the footer of the application page (Created by Shekib Kohistani, shekib.kohistani@uoflhealth.org).
      </p>
      <p className="mt-4">Thank you for helping us maintain an accurate and efficient bed management system!</p>
    </div>
  );
};
