
export enum BedType {
  REGULAR = "Regular",
  LOW_AIR_LOSS = "Low Air Loss",
  BARI_LAL = "Bari LAL",
  POSEY_BED = "Posey Bed",
  RECLINER_CHAIR = "Recliner Chair",
  OTHER = "Other (Specify)"
}


export enum BedStatus {
  ASSIGNED_PATIENT = "Assigned to Patient",
  STORED_AVAILABLE = "Stored - Available",
  OUT_OF_SERVICE = "Out of Service / Broken"
}

export enum UserRole {
  USER = "User",
  ADMIN = "Admin"
}

export interface Bed {
  id: string;
  patientLastName?: string;
  bedType: BedType;
  otherBedTypeName?: string;
  department?: string; // Unit/Department where the bed is assigned
  status: BedStatus;
  location: string; 
  isRental: boolean;
  hillromConfirmation?: string;
  assetNumber?: string;
  serialNumber?: string;
  notes?: string; // Added notes field
  lastEditedBy: string;
  lastEditedDate: string; // ISO string format
}

export interface BedFormData extends Omit<Bed, 'id' | 'lastEditedDate' | 'lastEditedBy'> {
  // id, lastEditedDate, and lastEditedBy are handled internally
}

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
}