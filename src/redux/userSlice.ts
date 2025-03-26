import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  users: Record<string, any>;
  repos: Record<string, any[]>;
  followers: Record<string, any[]>;
}

const initialState: UserState = {
  users: {},
  repos: {},
  followers: {},
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
      cacheUser(state, action: PayloadAction<{ username: string; data: any }>) {
        state.users[action.payload.username.toLowerCase()] = action.payload.data;
      },
      cacheRepos(state, action: PayloadAction<{ username: string; data: any[] }>) {
        state.repos[action.payload.username.toLowerCase()] = action.payload.data;
      },
      cacheFollowers(state, action: PayloadAction<{ username: string; data: any[] }>) {
        state.followers[action.payload.username.toLowerCase()] = action.payload.data;
      },
      removeUser(state, action: PayloadAction<{ username: string }>) {
        const uname = action.payload.username.toLowerCase();
        delete state.users[uname];
        delete state.repos[uname];
        delete state.followers[uname];
      },
    },
  });
  

  export const {
    cacheUser,
    cacheRepos,
    cacheFollowers,
    removeUser,
  } = userSlice.actions;
  export default userSlice.reducer;
