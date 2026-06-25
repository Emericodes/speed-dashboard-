export interface Customer{
id: string;
name: string;
adress: string;
status: 'En attente' | 'Livré' | 'Échoué'; 
estimatedTime: string;
}

export type FilterStatus = Customer['status'] | 'Tous';

export type Filters = Omit<Customer, 'id' | 'status'> & {
  status: FilterStatus;
}