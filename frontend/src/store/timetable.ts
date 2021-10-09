import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createRequestSaga from '../hooks/createRequestSaga';
import * as api from '../lib/api/team';
import { takeLatest } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import type {
	default_days,
	requestTeamAPI,
	responseTeamAPI,
	state_time,
	team,
	timetable,
} from '../interface';

const POST_TEAM = 'team/POST_TEAM';

export const postTeamName = createAction(
	POST_TEAM,
	(data: requestTeamAPI) => data
);

const postTeamSaga = createRequestSaga(POST_TEAM, api.postTeamName);

export function* teamSaga() {
	yield takeLatest(POST_TEAM, postTeamSaga);
}

const initialState: timetable = {
	dates: {
		sun: { day: '', times: [] },
		mon: { day: '', times: [] },
		tue: { day: '', times: [] },
		thu: { day: '', times: [] },
		wed: { day: '', times: [] },
		fri: { day: '', times: [] },
		sat: { day: '', times: [] },
	},
};

export const timetableSlice = createSlice({
	name: 'timetable',
	initialState,
	reducers: {
		cloneDates: (state, action: PayloadAction<default_days>) => {
			state.dates = action.payload;
		},
	},
	extraReducers: {},
});

export const { cloneDates } = timetableSlice.actions;

export default timetableSlice.reducer;
