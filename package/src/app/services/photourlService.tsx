import { URLPORT } from "./URL";

export const uploadUrls = async (productId: string, urls: string[]) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/uploadUrls/${productId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urls }),
        });

        if (!response.ok) {
            throw new Error(`Failed to upload URLs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Uploaded URLs:', data);
        return data;
    } catch (error) {
        console.error('Error uploading URLs:', error);
        throw error;
    }
};
export const updateUrlType = async (urlId: string, type: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/updatePhotoURLType/${urlId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update URL type: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Updated URL type:', data);
        return data;
    } catch (error) {
        console.error('Error updating URL type:', error);
        throw error;
    }
};
export const updateUrlOrdre = async (urlId: string, ordre: number) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/updateURLOrdre/${urlId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ordre }),
        });

        if (!response.ok) {
            throw new Error(`Failed to update URL ordre: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Updated URL ordre:', data);
        return data;
    } catch (error) {
        console.error('Error updating URL ordre:', error);
        throw error;
    }
};
export const getUrlsByProductId = async (productId: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/getUrls/${productId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Failed to get URLs: ${response.statusText}`);
        }

        const data = await response.json();
      
        const urlPhotos = data.map((url: any) => ({
            _id: url._id,
            filename: url.url,  // Assuming url field contains the URL string
            ordre: url.ordre,
            photoType: url.type,   // Mark as URL type
            contentType: 'url', // Can be adjusted based on how you handle URLs
        }));
        console.log('Fetched URLs:', urlPhotos);
        return urlPhotos;
    } catch (error) {
        console.error('Error fetching URLs:', error);
        throw error;
    }
};

export const deleteUrl = async (urlId: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/deleteUrl/${urlId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Failed to delete URL: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Deleted URL:', data);
        return data;
    } catch (error) {
        console.error('Error deleting URL:', error);
        throw error;
    }
};
