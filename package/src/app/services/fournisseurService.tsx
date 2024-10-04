
import { URLPORT } from './URL';
export const  fetchFournisseurs = async () => {
    try {
        const response = await fetch(URLPORT+'/api/fournisseurs');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching pension options:');
    }
};

