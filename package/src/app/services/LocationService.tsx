import { URLPORT } from "./URL";



interface Location
{

    _id : string,
    type : string,
    name : string
}

export const updateLocation = async (id: string, productdata: Partial<Location>) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/id?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productdata),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to update product");
    }
};

export const fetchLocationByName = async (name:string) => {
    try {
        const response = await fetch(`${URLPORT}/api/locations/${encodeURIComponent(name)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const location = await response.json();
        return location;
    } catch (error) {
        console.error('Error fetching location by name:', error);
        throw new Error('Failed to fetch location');
    }
};