import type { Timestamp } from "@angular/fire/firestore";

export interface Clip {
  docId?: string;
  uid: string;
  displayName: string;
  title: string;
  filename: string;
  timestamp: Timestamp;
  url: string;
  screenshotUrl: string;
  screenshotName: string;
}
