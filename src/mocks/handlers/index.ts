import { authHandlers } from './auth';
import { claimsHandlers } from './claims';
import { fieldChecksHandlers } from './fieldChecks';
import { notificationsHandlers } from './notifications';

export const handlers = [
  ...authHandlers,
  ...claimsHandlers,
  ...fieldChecksHandlers,
  ...notificationsHandlers,
];
