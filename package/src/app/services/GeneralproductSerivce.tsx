import { URLPORT } from "./URL";

interface ProductData {
    id: string;
    productName: string;
    productType: string;
    productStatus: string;
    productSubType: string;
    pension: string;
    longitude: string;
    latitude: string;
    fournisseur: string;
}

// Function to add a product
export const addProduct = async (productdata: ProductData) => {
    try {
        const response = await fetch(`${URLPORT}/api/products`, {
            method: 'POST',
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
        throw new Error("Failed to add product");
    }
};

// Function to fetch all products
export const fetchProducts = async () => {
    try {
        const response = await fetch(`${URLPORT}/api/products`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to fetch products");
    }
};

// Function to fetch a product by ID
export const fetchProductById = async (id: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/id?id=${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
};

export const fetchProductByfullId = async (id: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/findbyfullid/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch product:', error);
        return null;
    }
};


// Function to update a product by ID
export const updateProduct = async (id: string, productdata: Partial<ProductData>) => {
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



// Function to delete a product by ID
export const deleteProduct = async (id: string,_id: string ) => {
    try {


        const dataIDS = fetchPhotoIds(_id);
        const photoIds = (await dataIDS).map((photo: { _id: string }) => photo._id);
        await deletePhotos(photoIds);
        const response = await fetch(`${URLPORT}/api/products/id?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
       

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to delete product");
    }
};


export const addLocationToProduct = async (productId: string, locationId: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/add-location/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ locationId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Network response was not ok: ${errorData.message}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to add location to product`);
    }
};


// Function to remove a location from a product
export const removeLocationFromProduct = async (id: string, locationId: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/remove-location/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ locationId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error("Failed to remove location from product");
    }
};


// services/GeneralproductSerivce.ts

export const uploadPhoto = async (productId: string, formData: FormData) => {
    const response = await fetch(`${URLPORT}/api/photos/upload/${productId}`, {
      method: 'POST',
      body: formData,
    });
  
    if (!response.ok) {
      throw new Error('Failed to upload photo');
    }
  
    return response.json();
  };

  
  export const deletePhotos = async (photoIds: string[]) => {
    try {
        // Iterate through each photo ID and delete it
        await Promise.all(photoIds.map(async (photoId) => {
            await deletePhoto(photoId);
        }));
        
        console.log('All photos deleted successfully');
    } catch (error) {
        console.error('Error deleting photos:', error);
    }
};




  
  // Update the Photo interface to use the PhotoType enum
  interface Photo {
    contentType: string; // Changed from 'any' to 'string' for more accurate typing
    _id: string;
    filename: string;
    ordre: number;
    base64: string;
    photoType: string; // Use the enum for photoType
  }
// Function to change the ordre of a photo
export const changeOrdre = async (fileId: string, newOrdre: number) => {
    const response = await fetch(`${URLPORT}/api/photos/updateOrdre/${fileId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ordre: newOrdre }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update photo ordre: ${errorData.message}`);
    }

    return await response.text(); // or handle the response as needed
};  
export const fetchPhotoIds  = async (productId: string): Promise<Photo[]> => {
    const response = await fetch(`${URLPORT}/api/photos/GetPhotoIdsByProductId/${productId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch photos');
    }


    if (!response.ok) {
        throw new Error('Failed to fetch photos');
    }

    const data = await response.json();

    // Check if photos array exists and is not empty, otherwise return an empty array
    const photos = data.photos && Array.isArray(data.photos) ? data.photos : [];

    // Map the photos array to the desired format
    return photos.map((photo: any) => ({
        _id: photo._id,
       
    }));
};
export const fetchPhotos = async (productId: string): Promise<Photo[]> => {
    const response = await fetch(`${URLPORT}/api/photos/GetByproductid/${productId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch photos');
    }

    const data = await response.json();

    // Check if photos array exists and is not empty, otherwise return an empty array
    const photos = data.photos && Array.isArray(data.photos) ? data.photos : [];

    // Map the photos array to the desired format
    return photos.map((photo: any) => ({
        _id: photo._id,
        filename: photo.filename,
        ordre: photo.ordre,
        base64: photo.base64,
        photoType: photo.photoType,
        contentType: photo.contentType,
    }));
};

export const deletePhoto = async (fileId: string) => {
    const response = await fetch(`${URLPORT}/api/photos/delete/${fileId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete photo');
    }

    return await response.text(); // or handle the response as needed
};


// Function to update the photo type
export const editPhotoType = async (fileId: string, photoType: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/photos/updatePhotoType/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photoType }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update photo type: ${errorData.message}`);
        }

        return await response.text(); // or handle the response as needed
    } catch (error) {
        throw new Error(`Failed to update photo type: ${error}`);
    }
};


export const deleteDescription = async (productId: string, descriptionId: string) => {
    try {
      const response = await fetch(`${URLPORT}/api/products/delete-descriptions/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "descriptionId": descriptionId
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete description');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error("failed");
    }
  };

  export const addDescription = async (productId: string, description: { title: string; family: string; description: string; ordre: string | '' }) => {
    try {
      const response = await fetch(`${URLPORT}/api/products/add-descriptions/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(description),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add description');
      }
  
      return await response.json();
    } catch (error) {
      throw new Error("failed");
    }
  };




export const updateDescriptionOrdre = async (productId: string, descriptionId: string, newOrdre: number) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/Specific/${productId}/descriptions/${descriptionId}/ordre`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newOrdre }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update description ordre: ${errorData.message}`);
        }

        return await response.json(); // Handle the response as needed
    } catch (error) {
        throw new Error(`Failed to update description ordre`);
    }
};
export const fetchSpecificDescription = async (productId: string, descriptionId: string) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/specific-description/${productId}/${descriptionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch specific description');
        }

        return await response.json(); // Handle the response as needed
    } catch (error) {
        throw new Error("Failed to fetch specific description");
    }
};

interface DescriptionUpdateData {
    title?: string;
    family?: string;
    description?: string;
}


export const updateDescription = async (productId: string, descriptionId: string, updateData: DescriptionUpdateData) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/update-description/${productId}/${descriptionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update description: ${errorData.message}`);
        }

        return await response.json(); // Return the updated description data
    } catch (error) {
        throw new Error(`Failed to update description:`);
    }
};


export const fetchProductsPagination = async (page: number, limit: number) => {
    try {
        const response = await fetch(`${URLPORT}/api/products/pagination?page=${page}&limit=${limit}`);
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return { products: [], totalProducts: 0, totalPages: 0 };
    }
};
export const fetchProductsBySearch = async (searchCriteria: {
    id?: string;
    productName?: string;
    productType?: string;
    productLocation?: string;
    productStatus?: string;
    productSubType?: string;
    fournisseur?: string;
}, page: number = 1, limit: number = 10) => {
    try {
        const queryParams = new URLSearchParams({
            ...searchCriteria,
            page: page.toString(),
            limit: limit.toString(),
        }).toString();
        
        const response = await fetch(`${URLPORT}/api/products/search?${queryParams}`);
        console.log(`${URLPORT}/api/products/search?${queryParams}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw new Error("Failed to fetch products");
    }
};
