export interface Faculty {
  facultyId: string;
  facultyName: string;
  email: string;
  password?: string;
}

export interface FacultyLoginCredentials {
  email: string;
  password?: string;
}
