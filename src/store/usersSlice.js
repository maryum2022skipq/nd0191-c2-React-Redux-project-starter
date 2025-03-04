import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { _getUsers } from '../utils/_DATA';
import { saveQuestion, saveQuestionAnswer } from './actions';

const initialState = {};

export const getAllUsers = createAsyncThunk('users/fetchAllUsers', _getUsers);

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {})
      .addCase(getAllUsers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(saveQuestion.fulfilled, (state, action) => {
        state[action.payload.author].questions.push(action.payload.id);
      })
      .addCase(saveQuestionAnswer.fulfilled, (state, action) => {
        state[action.payload.authedUser].answers[action.payload.qid] =
          action.payload.answer;
      });
  },
});

export const selectLeaderboardData = ({ users }) =>
  users &&
  Object.values(users)
    .map(({ id, name, avatarURL, questions, answers }) => ({
      id,
      name,
      avatarURL,
      questionsAsked: questions.length,
      questionsAnswered: Object.keys(answers).length,
      score: questions.length + Object.keys(answers).length,
    }))
    .sort((a, b) => b.score - a.score);

export const selectIsQuestionAnswered =
  (question_id) =>
  ({ users, authedUser }) => {
    return users[authedUser]?.answers.hasOwnProperty(question_id);
  };

export default usersSlice.reducer;
