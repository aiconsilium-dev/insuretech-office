export interface ApiClaim {
  id: string;
  type: string;
  dong: string;
  ho: string;
  status: string;
  date: string;
  description: string;
}

export interface ApiUser {
  name: string;
  apt: string;
  role: string;
}

export interface ApiFieldCheck {
  id: string;
  claimId: string;
  severity: string;
  cause: string;
  notes: string;
}

export interface ApiNotification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}
