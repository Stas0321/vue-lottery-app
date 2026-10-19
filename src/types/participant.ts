export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

export type SortField = 'name' | 'birthDate';
export type SortDirection = 'asc' | 'desc';