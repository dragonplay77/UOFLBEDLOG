import { BedType, BedArea, BedStatus, UserRole } from './types';

export const BED_TYPE_OPTIONS = Object.values(BedType).map(value => ({ value, label: value }));
export const BED_AREA_OPTIONS = Object.values(BedArea).map(value => ({ value, label: value }));
export const BED_STATUS_OPTIONS = Object.values(BedStatus).map(value => ({ value, label: value }));
export const USER_ROLE_OPTIONS = Object.values(UserRole).map(value => ({ value, label: value }));
