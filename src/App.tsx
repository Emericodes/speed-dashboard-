import { useState } from 'react'
import type { Customer, Filters, FilterStatus } from "./types/Client";
import FilterBar from "./components/filterBar";

import './App.css'

const INITIAL_Customers: Customer[] = [
  { id: '1', name: 'Société TransLog', adress: '12 Rue des Lilas, Lille', status: 'En attente', estimatedTime: '09:15' },
  { id: '2', name: 'Boulangerie Dupont', adress: '45 Avenue Foch, Marcq', status: 'Livré', estimatedTime: '10:30' },
  { id: '3', name: 'Garage AutoPlus', adress: '8 Boulevard Central, Seclin', status: 'En attente', estimatedTime: '11:45' },
];

function App() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_Customers);
  const [filters, setFilters] = useState<Filters>({
    name: "",
    adress: "",
    estimatedTime: "",
    status: "Tous",
  });

 
  const filteredCustomers = customers.filter((customer) => {
    const nameMatch = customer.name.toLowerCase().includes(filters.name.toLowerCase());
    const adressMatch = customer.adress.toLowerCase().includes(filters.adress.toLowerCase());
    const statusMatch = !filters.status || filters.status === "Tous" || customer.status === filters.status;
    return nameMatch && adressMatch && statusMatch;
  });

  const updateCustomerDelivery = (idCustomer: string, newStatus: FilterStatus) => {
    setCustomers(
      customers.map((customer) => {
        if (customer.id === idCustomer) {
          const cModify = { 
            ...customer, 
            status: newStatus as Customer['status'] 
          };
          return cModify; 
        } else {
          return customer; 
        }
      })
    );
  };

  return (
    <>
      <section id="center">
        <div className="hero">
          <h1>Speed Dashboard</h1>
        </div>

      
        <FilterBar 
          customers={customers} 
          filters={filters} 
          setFilters={setFilters} 
        />

        <div className="customer-grid">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div key={customer.id} className="customer-card">
                <h3>{customer.name}</h3>
                <p><strong>Adresse :</strong> {customer.adress}</p>
                <p><strong>Statut :</strong> {customer.status}</p>

                <div className="card-actions">
                  <button onClick={() => updateCustomerDelivery(customer.id, 'Livré')}>
                    ✅ Enregistrer la livraison
                  </button>

                  <button onClick={() => updateCustomerDelivery(customer.id, 'Échoué')}>
                    ❌ Client absent
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">Aucun client ne correspond à vos filtres.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default App;