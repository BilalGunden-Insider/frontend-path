import { defineStore } from 'pinia';

// SSR-safe localStorage helper
const getStoredFavorites = () => {
    if (typeof window !== 'undefined') {
        try {
            return JSON.parse(localStorage.getItem('favoriteMovies')) || [];
        } catch (error) {
            console.error('Error parsing stored favorites:', error);
            return [];
        }
    }
    return [];
};

const saveFavorites = (favorites) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    }
};

export const useStore = defineStore('main', {
    state: () => ({
        favoriteMovies: [],
    }),
    actions: {
        initializeFavorites() {
            this.favoriteMovies = getStoredFavorites();
        },
        toggleFavorite(movie) {
            const index = this.favoriteMovies.findIndex(item => item.id === movie.id);

            if (index === -1) {
                this.favoriteMovies.push(movie);
            } else {
                this.favoriteMovies.splice(index, 1);
            }

            saveFavorites(this.favoriteMovies);
        }
    },
    getters: {
        isFavorite(state) {
            return (movie) => state.favoriteMovies.some(item => item.id === movie.id);
        }
    }
});