import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    events: [],
    eventsPlanner: [],    // Événements organisés par l'utilisateur
    likes: [],  // Ajout de l'état pour les likes des événements
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.events.push(action.payload);
        },

        addEventPlanner: (state, action) => {
            state.eventsPlanner.push(action.payload);
        },
       
        deleteEvent: (state, action) => {
            state.events = state.events.filter(event => event._id !== action.payload.id);
          },
          

        likeEvent: (state, action) => {
            if (!state.likes.includes(action.payload.id)) {
                state.likes.push(action.payload.id); // Ajout du like
            }
        },
        unlikeEvent: (state, action) => {
            state.likes = state.likes.filter(id => id !== action.payload.id); 
        },

    },
});

export const { addEvent, addEventPlanner, likeEvent,unlikeEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
// reducer bien ajouté au App.js