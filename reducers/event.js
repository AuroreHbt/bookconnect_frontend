import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const eventSlice = createSlice({
    name: "event",
    initialState,
    reducers: {
        addEvent: (state, action) => {
            state.value.push(action.payload);
        },
        deleteEvent: (state, action) => {
            state.value = state.value.filter(event => event.id !== action.payload); // comparaison par id de chaque event
        },
    },
});

export const { addEvent, deleteEvent } = eventSlice.actions;
export default eventSlice.reducer;
// reducer bien ajouté au App.js