import { URLPORT } from "./URL";

export const getAllGeneralDescriptions = async () => {
    const response = await fetch(`${URLPORT}/api/general-description`, {
        method: 'GET',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to retrieve general descriptions: ${errorData.message}`);
    }

    return await response.json();
};

export const getGeneralDescriptionById = async (id : string) => {
    const response = await fetch(`${URLPORT}/api/general-description/${id}`, {
        method: 'GET',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to retrieve general description: ${errorData.message}`);
    }

    return await response.json();
};



export const createGeneralDescription = async (generalDescriptionData: any) => {
    try {
        const response = await fetch(`${URLPORT}/api/general-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(generalDescriptionData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to create general description: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in createGeneralDescription:', error);
        throw error; // Rethrow the error to be caught by the caller
    }
};


export const updateGeneralDescription = async (id : string , generalDescriptionData: any) => {
    const response = await fetch(`${URLPORT}/api/general-description/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(generalDescriptionData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update general description: ${errorData.message}`);
    }

    return await response.json();
};

export const deleteGeneralDescription = async (id: string ) => {
    const response = await fetch(`${URLPORT}/api/general-description/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete general description: ${errorData.message}`);
    }

    return await response.text(); // or handle the response as needed
};

export const addProductToGeneralDescription = async (id : string , productId : any) => {
    const response = await fetch(`${URLPORT}/api/general-description/${id}/add-product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add product to general description: ${errorData.message}`);
    }

    return await response.json();
};

export const removeProductFromGeneralDescription = async (id: string , productId : any) => {
    const response = await fetch(`${URLPORT}/api/general-description/${id}/remove-product`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to remove product from general description: ${errorData.message}`);
    }

    return await response.json();
};

