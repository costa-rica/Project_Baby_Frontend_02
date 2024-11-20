import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    nom: null,
    practicien: null,
    notes: null,
    photos: [],
    modalOuvert: false,
  },
};

export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    sauvgaurderDocumentInfos: (state, action) => {
      state.value.nom = action.payload.nom;
      state.value.practicien = action.payload.practicien;
      state.value.notes = action.payload.notes;
    },
    documentModalRestOuvert: (state) => {
      state.value.modalOuvert = true;
    },
    doucumentModalResterFermer: (state) => {
      state.value.modalOuvert = false;
    },
    ajouterPhoto: (state, action) => {
      state.value.photos.push(action.payload);
    },
    supprimerPhoto: (state, action) => {
      state.value.photos = state.value.photos.filter(
        (data) => data !== action.payload
      );
    },
    supprimerTousLesPhotos: (state) => {
      state.value.photos = [];
    },
    logOutDocument: (state) => {
      state.value.nom = null;
      state.value.notes = null;
      state.value.photos = null;
      state.value.practicien = null;
      state.value.modalOuvert = false;
    },
  },
});

export const {
  sauvgaurderDocumentInfos,
  documentModalRestOuvert,
  doucumentModalResterFermer,
  ajouterPhoto,
  supprimerPhoto,
  supprimerTousLesPhotos,
  logOutDocument,
} = documentSlice.actions;
export default documentSlice.reducer;
