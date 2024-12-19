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
            console.log('addLike', action.payload)
            const story = state.value.find(story => story._id === action.payload._id);
            if (story) {
                story.isLiked = true;
            } else {
                state.value.push({ ...action.payload, isLiked: true });
            }
            console.log('story:', state.value);
        },
        removeLike: (state, action) => {
            const story = state.value.find(story => story._id === action.payload._id);
            if (story) {
                story.isLiked = false;
            }
            console.log('remove like', state.value);
        },
    },
});


export const { addStory, deleteStory, updateStory, addLike, removeLike } = storySlice.actions;
export default storySlice.reducer;
// reducer bien ajouté au App.js