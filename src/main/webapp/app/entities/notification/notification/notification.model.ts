import * as dayjs from 'dayjs';
import { NotificationType } from 'app/entities/enumerations/notification-type.model';

export interface INotification {
  id?: number;
  date?: dayjs.Dayjs;
  sentDate?: dayjs.Dayjs;
  format?: NotificationType;
  userId?: number;
  locationNumber?: string;
  locationCode?: string;
  details?: string | null;
}

export class Notification implements INotification {
  constructor(
    public id?: number,
    public date?: dayjs.Dayjs,
    public sentDate?: dayjs.Dayjs,
    public format?: NotificationType,
    public userId?: number,
    public locationNumber?: string,
    public locationCode?: string,
    public details?: string | null
  ) {}
}

export function getNotificationIdentifier(notification: INotification): number | undefined {
  return notification.id;
}
