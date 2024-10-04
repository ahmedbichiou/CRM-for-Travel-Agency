

import { URLPORT } from "./URL";

export const fetchProductLocations = async () => {
    const response = await fetch(URLPORT + '/api/product-locations');
    return response.json();
  };
  
  export const addProductLocation = async (type: string, name: string) => {
    const response = await fetch(URLPORT + '/api/product-locations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, name }),
    });
    return response.json();
  };
  
  export const deleteProductLocation = async (id: string) => {
    const response = await fetch(URLPORT + `/api/product-locations/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  
  export const fetchPensions = async () => {
    const response = await fetch(URLPORT + '/api/pensions');
    return response.json();
  };
  
  export const addPension = async (name: string) => {
    const response = await fetch(URLPORT + '/api/pensions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  };
  
  export const deletePension = async (id: string) => {
    const response = await fetch(URLPORT + `/api/pensions/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  

  
  export const addFournisseur = async (name: string, reference: string) => {
    const response = await fetch(URLPORT + '/api/fournisseurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, reference }),
    });
    return response.json();
  };
  
  export const deleteFournisseur = async (id: string) => {
    const response = await fetch(URLPORT + `/api/fournisseurs/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  