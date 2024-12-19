import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: []
};

export const storySlice = createSlice({
    name: "story",
    initialState,
    reducers: {
        addStory: (state, action) => {
            state.value.push(action.payload);
        },
        deleteStory: (state, action) => {
            state.value = state.value.filter(story => story.id !== action.payload); // comparaison par id de chaque story
        },
        updateStory: (state, action) => {
            state.value = state.value.map(story =>
                String(story._id) === String(action.payload.id) ? { ...story, ...action.payload.data } : story
                // story.id === action.payload.id : compare les id de la story à modifier avce la story affichée
                // { ...story, ...action.payload.data } : si les id match, l'objet story est mis à jour par un objet contenant les nouvelles data
                // : story => si les id ne match pas, la story reste inchangée
            );
        },
        addLike: (state, action) => {
            console.log("Adding like:", action.payload);
            const existingStory = state.value.find(story => story._id === action.payload._id);
            if (!existingStory) {
                state.value.push({ ...action.payload, isLiked: true });
            }
        },
        removeLike: (state, action) => {
            console.log("Removing like for story ID:", action.payload);
            state.value = state.value.filter(story => story._id !== action.payload);
        },
    },
});


export const { addStory, deleteStory, updateStory, addLike, removeLike } = storySlice.actions;
export default storySlice.reducer;
// reducer bien ajouté au App.js