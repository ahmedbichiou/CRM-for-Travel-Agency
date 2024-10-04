
import { URLPORT } from './URL';
const API_URL_PRODUCT_TYPES = URLPORT+'/api/product-types';
const API_URL_PRODUCT_LOCATIONS = URLPORT+'/api/product-locations';
const API_URL_PRODUCT_STATUSES = URLPORT+'/api/product-statuses';
const API_URL_PRODUCT_SUBTYPES = URLPORT+'/api/product-subtypes';

export const fetchProductTypes = async () => {
    try {
        const response = await fetch(API_URL_PRODUCT_TYPES);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pension options:');
    }
};

export const fetchProductLocations  = async () => {
    try {
        const response = await fetch(API_URL_PRODUCT_LOCATIONS);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pension options:');
    }
};

export const fetchProductStatuses  = async () => {
    try {
        const response = await fetch(API_URL_PRODUCT_STATUSES);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pension options:');
    }
};

export const fetchProductSubTypes = async () => {
    try {
        const response = await fetch(API_URL_PRODUCT_SUBTYPES);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pension options:');
    }
};

export const fetchProductIds = async (): Promise<{ _id: string, id: string }[]> => {
    try {
        const response = await fetch(`${URLPORT}/api/products/ids`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        // Map the response data to the format { _id: string, id: string }
        return data.map((product: { _id: string, id: string }) => ({
            _id: product._id,
            id: product.id
        }));
    } catch (error) {
        console.error('Error fetching product IDs:', error);
        throw new Error('Failed to fetch product IDs');
    }
};
export const getIdFrom_Id = async (_id: string): Promise<string> => {
    try {
        const response = await fetch(`${URLPORT}/api/products/get-id-from-_id?_id=${_id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error('Error fetching ID from _id:', error);
        throw new Error('Failed to fetch ID from _id');
    }
};