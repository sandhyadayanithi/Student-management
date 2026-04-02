export interface Student {
  id?: string;
  rollNumber: string;
  name: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}
