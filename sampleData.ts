import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from './firebase';
import { BedFormData, BedType, BedArea, BedStatus, AppUser } from './types';

const SAMPLE_BEDS: BedFormData[] = [
  {
    patientLastName: 'Smith',
    bedType: BedType.LOW_AIR_LOSS,
    bedArea: BedArea.ICU,
    status: BedStatus.ASSIGNED_PATIENT,
    location: 'ICU-3A',
    isRental: false,
    assetNumber: 'HR-10234',
    notes: 'Post-op monitoring'
  },
  {
    patientLastName: 'Johnson',
    bedType: BedType.BARI_LAL,
    bedArea: BedArea.JEWISH,
    status: BedStatus.STORED_AVAILABLE,
    location: 'Storage Room B',
    isRental: true,
    hillromConfirmation: 'CONF-8891',
    notes: 'Ready for dispatch'
  },
  {
    patientLastName: 'Garcia',
    bedType: BedType.RECLINER_CHAIR,
    bedArea: BedArea.FRAZIER,
    status: BedStatus.OUT_OF_SERVICE,
    location: 'Workshop',
    isRental: false,
    serialNumber: 'SN-7782',
    notes: 'Wheel lock issue'
  },
  {
    patientLastName: 'Lee',
    bedType: BedType.OTHER,
    otherBedTypeName: 'Cardiac Bed',
    bedArea: BedArea.VENDOR,
    status: BedStatus.ASSIGNED_PATIENT,
    location: '4 West - 412',
    isRental: true,
    purchaseOrder: 'PO-55213',
    notes: 'Vendor delivery expected tomorrow'
  }
];

export async function seedSampleBeds(currentUser: AppUser): Promise<number> {
  let created = 0;
  for (const item of SAMPLE_BEDS) {
    await addDoc(collection(db, 'beds'), {
      ...item,
      lastEditedBy: currentUser.email,
      lastEditedDate: Timestamp.now(),
    });
    created += 1;
  }
  return created;
}
