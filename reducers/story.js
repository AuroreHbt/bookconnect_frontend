import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
    // value: { storyId: null, title: null, description: null }
};

export const storySlice = createSlice({
    name: "story",
    initialState,
    reducers: {
        addStory: (state, action) => {
            console.log(action.payload);
            state.value.push(action.payload);
            console.log(state.value)
        },
        deleteStory: (state, action) => {
            console.log(action.payload)
            state.value = state.value.filter(story => story.id !== action.payload); // comparaison par id de chaque story
        },
        // addStory: (state, action) => {
        //     // Assurez-vous que l'action.payload contient les propriétés nécessaires
        //     state.story = { ...action.payload }; // Remplace l'objet d'histoire par le nouvel objet
        // },
        // deleteStory: (state) => {
        //     // Réinitialise l'objet d'histoire à son état initial
        //     state.story = { id: null, title: null, description: null };
        // }
    },
});

export const { addStory, deleteStory } = storySlice.actions;
export default storySlice.reducer;
// reducer bien ajouté au App.js