import { URLPORT } from "./URL";


export const fetchProductTypes = async () => {
    const response = await fetch(URLPORT+'/api/product-types');
    return response.json();
  };
  
  export const addProductType = async (name: string) => {
    const response = await fetch(URLPORT+'/api/product-types', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  };
  
  export const deleteProductType = async (id: string) => {
    const response = await fetch(URLPORT+`/api/product-types/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  
// api.js
export const fetchProductSubTypes = async () => {
    const response = await fetch(URLPORT+'/api/product-subtypes');
    return response.json();
  };
  
  export const addProductSubType = async (name: string) => {
    const response = await fetch(URLPORT+'/api/product-subtypes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    return response.json();
  };
  
  export const deleteProductSubType = async (id: string) => {
    const response = await fetch(URLPORT+`/api/product-subtypes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  };
  
  