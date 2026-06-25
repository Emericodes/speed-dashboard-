import React, { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { Customer,Filters, FilterStatus } from "../types/Client";
import './FilterBar.css';



const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'Tous', label: 'Tous les statuts' },
  { value: 'En attente', label: 'En attente' },
  { value: 'Échoué', label: 'Échoué' },
  { value: 'Livré', label: 'Livré' },
];

interface CustomerFilterBarProps {
  customers: Customer[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const CustomerFilterBar: React.FC<CustomerFilterBarProps> = ({ customers, filters, setFilters }) => {
  const nameInput = filters.name ?? '';
  const adressInput = filters.adress ?? '';
  const statusFilter = filters.status ?? 'Tous';
  const [nameSuggestions, setNameSuggestions] = useState<string[]>([]);
  const [adressSuggestions, setAdressSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(-1);

 
  const getSuggestions = (input: string, field: 'name' | 'adress') => {
    if (input.length === 0) return [];
    const suggestions = customers
      .filter((customer) =>
        customer[field].toLowerCase().includes(input.toLowerCase())
      )
      .map((customer) => customer[field]);
    return [...new Set(suggestions)]; 
  };

  useEffect(() => {
    setNameSuggestions(getSuggestions(nameInput, 'name'));
    setActiveSuggestionIndex(-1);
  }, [nameInput, customers]);

  useEffect(() => {
    setAdressSuggestions(getSuggestions(adressInput, 'adress'));
    setActiveSuggestionIndex(-1);
  }, [adressInput, customers]);

 
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    isNameField: boolean
  ) => {
    const suggestions = isNameField ? nameSuggestions : adressSuggestions;
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          isNameField
            ? handleSelectName(suggestions[activeSuggestionIndex])
            : handleSelectAdress(suggestions[activeSuggestionIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        isNameField ? setNameSuggestions([]) : setAdressSuggestions([]);
        break;
    }
  };

  const handleSelectName = (name: string) => {
    setFilters((prev) => ({ ...prev, name }));
    setNameSuggestions([]);
  };

  const handleSelectAdress = (adress: string) => {
    setFilters((prev) => ({ ...prev, adress }));
    setAdressSuggestions([]);
  };


  return (
    <div className="customer-filter-bar">
      <div className="filter-section">
        <label htmlFor="name-input">Nom du client :</label>
        <div className="input-with-suggestions">
          <input
            id="name-input"
            type="text"
            value={nameInput}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, true)}
            placeholder="Tapez un nom..."
            aria-autocomplete="list"
            aria-controls="name-suggestions"
            aria-expanded={nameSuggestions.length > 0}
          />
          {nameSuggestions.length > 0 && (
            <ul
              id="name-suggestions"
              className="suggestions-list"
              role="listbox"
              aria-label="Suggestions de noms"
            >
              {nameSuggestions.map((name, index) => (
                <li
                  key={name}
                  onClick={() => handleSelectName(name)}
                  className={index === activeSuggestionIndex ? 'active' : ''}
                  role="option"
                  aria-selected={index === activeSuggestionIndex}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectName(name);
                  }}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="adress-input">Adresse :</label>
        <div className="input-with-suggestions">
          <input
            id="adress-input"
            type="text"
            value={adressInput}
            onChange={(e) => setFilters((prev) => ({ ...prev, adress: e.target.value }))}
            onKeyDown={(e) => handleKeyDown(e, false)}
            placeholder="Tapez une adresse..."
            aria-autocomplete="list"
            aria-controls="adress-suggestions"
            aria-expanded={adressSuggestions.length > 0}
          />
          {adressSuggestions.length > 0 && (
            <ul
              id="adress-suggestions"
              className="suggestions-list"
              role="listbox"
              aria-label="Suggestions d'adresses"
            >
              {adressSuggestions.map((adress, index) => (
                <li
                  key={adress}
                  onClick={() => handleSelectAdress(adress)}
                  className={index === activeSuggestionIndex ? 'active' : ''}
                  role="option"
                  aria-selected={index === activeSuggestionIndex}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSelectAdress(adress);
                  }}
                >
                  {adress}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="filter-section">
        <label htmlFor="status-select">Statut :</label>
        <select
          id="status-select"
          value={statusFilter}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as FilterStatus }))}
          className="status-select"
          aria-label="Filtrer par statut"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default CustomerFilterBar;