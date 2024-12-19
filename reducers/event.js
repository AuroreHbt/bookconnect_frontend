import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: [], 
    likes: [],  // Ajout de l'état pour les likes des événements
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },
       
        deleteEvent: (state, action) => {
            state.events = state.events.filter(event => event._id !== action.payload.id);
          },
          

          likeEvent: (state, action) => {
            console.log("Adding like:", action.payload);
            const existingEvent = state.likes.find(event => event._id === action.payload._id);
            if (!existingEvent) {
                // Ajoute un événement aux favoris avec isLiked = true
                state.likes.push({ ...action.payload, isLiked: true });
            }
        },

        unlikeEvent: (state, action) => {
            // Filtre les événements qui ne sont pas aimés
            console.log("Removing like for event ID:", action.payload);
            state.likes = state.likes.filter(event => event._id !== action.payload.id);
        },

    },
});

export const { addEvent, likeEvent, unlikeEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
// reducer bien ajouté au App.js