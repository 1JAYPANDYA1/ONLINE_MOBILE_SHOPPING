import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  ThumbnailImageList: [],
};

export const getThumbnailImages = createAsyncThunk(
  "/order/getThumbnailImages",
  async () => {
    const response = await axios.get(
      `http://localhost:5000/api/common/Thumbnail/get`
    );

    return response.data;
  }
);

export const addThumbnailImage = createAsyncThunk(
  "/order/addThumbnailImage",
  async (image) => {
    const response = await axios.post(
      `http://localhost:5000/api/common/Thumbnail/add`,
      { image }
    );

    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getThumbnailImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getThumbnailImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ThumbnailImageList = action.payload.data;
      })
      .addCase(getThumbnailImages.rejected, (state) => {
        state.isLoading = false;
        state.ThumbnailImageList = [];
      });
  },
});

export default commonSlice.reducer;
