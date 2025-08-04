// Local storage utilities for corkboard data

const STORAGE_KEY = 'corkboard_data';
const CORKBOARDS_KEY = 'saved_corkboards';

// Save current corkboard state
export const saveCorkboard = (notes, name = 'Default Corkboard') => {
    const timestamp = new Date().toISOString();
    const corkboardData = {
        name,
        notes,
        lastModified: timestamp,
        created: timestamp
    };

    // Save current state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(corkboardData));

    // Also save to the list of saved corkboards
    const savedCorkboards = getSavedCorkboards();
    const existingIndex = savedCorkboards.findIndex(cb => cb.name === name);

    if (existingIndex >= 0) {
        savedCorkboards[existingIndex] = corkboardData;
    } else {
        savedCorkboards.push(corkboardData);
    }

    localStorage.setItem(CORKBOARDS_KEY, JSON.stringify(savedCorkboards));
    return corkboardData;
};

// Load current corkboard state
export const loadCorkboard = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading corkboard:', error);
        return null;
    }
};

// Get all saved corkboards
export const getSavedCorkboards = () => {
    try {
        const data = localStorage.getItem(CORKBOARDS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading saved corkboards:', error);
        return [];
    }
};

// Load a specific corkboard
export const loadSpecificCorkboard = (name) => {
    const savedCorkboards = getSavedCorkboards();
    const corkboard = savedCorkboards.find(cb => cb.name === name);

    if (corkboard) {
        // Set it as the current corkboard
        localStorage.setItem(STORAGE_KEY, JSON.stringify(corkboard));
        return corkboard;
    }
    return null;
};

// Delete a saved corkboard
export const deleteCorkboard = (name) => {
    const savedCorkboards = getSavedCorkboards();
    const filteredCorkboards = savedCorkboards.filter(cb => cb.name !== name);
    localStorage.setItem(CORKBOARDS_KEY, JSON.stringify(filteredCorkboards));

    // If we're deleting the current corkboard, clear it
    const current = loadCorkboard();
    if (current && current.name === name) {
        localStorage.removeItem(STORAGE_KEY);
    }
};

// Rename a corkboard
export const renameCorkboard = (oldName, newName) => {
    const savedCorkboards = getSavedCorkboards();
    const corkboardIndex = savedCorkboards.findIndex(cb => cb.name === oldName);

    if (corkboardIndex === -1) {
        return false; // Corkboard not found
    }

    // Check if new name already exists
    if (savedCorkboards.some(cb => cb.name === newName)) {
        return false; // Name already exists
    }

    // Update the corkboard name
    savedCorkboards[corkboardIndex].name = newName;
    savedCorkboards[corkboardIndex].lastModified = new Date().toISOString();

    // Save the updated list
    localStorage.setItem(CORKBOARDS_KEY, JSON.stringify(savedCorkboards));

    // If this is the current corkboard, update it too
    const current = loadCorkboard();
    if (current && current.name === oldName) {
        current.name = newName;
        current.lastModified = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }

    return true; // Success
};

// Create a new empty corkboard
export const createNewCorkboard = (name = 'New Corkboard') => {
    const corkboardData = {
        name,
        notes: [],
        lastModified: new Date().toISOString(),
        created: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(corkboardData));
    return corkboardData;
};

// Auto-save functionality (debounced)
let autoSaveTimeout;
export const autoSave = (notes, corkboardName = 'Default Corkboard') => {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveCorkboard(notes, corkboardName);
    }, 1000); // Save after 1 second of inactivity
};
