import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: [], 
    likes: [],  // Ajout de l'état pour les likes des événements
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.value.push(action.payload);
        },
        likeEvent: (state, action) => {
            if (!state.likes.includes(action.payload.id)) {
                state.likes.push(action.payload.id); // Ajout du like
            }
        },
        unlikeEvent: (state, action) => {
            state.likes = state.likes.filter(id => id !== action.payload.id); 
        },

        deleteEvent: (state, action) => {
            state.value = state.value.filter(event => event.id !== action.payload); // comparaison par id de chaque event
        },
    },
});

export const { addEvent, likeEvent,unlikeEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
// reducer bien ajouté au App.js