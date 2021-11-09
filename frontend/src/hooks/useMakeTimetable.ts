import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import type { time, state_time } from '../interface';
import { useEffect } from 'react';
import { cloneDates } from '../store/timetable';
import { cloneIndividualDates } from '../store/individual';

export function useMakeTimetable() {
	const times: Array<state_time> = [];
	const timesText: Array<string> = [];

	for (let i = 8; i <= 24; i += 1) {
		times.push({
			time: i,
			color: Colors.white,
			isPicked: false,
			endPercent: 100,
			startPercent: 100,
			mode: 'normal',
			isEveryTime: false,
			isFullTime: false,
		});
		if (i <= 12) {
			if (i % 2 === 0) {
				timesText.push(`${i} AM`);
			}
		} else {
			if (i % 2 === 0) {
				timesText.push(`${i - 12} PM`);
			}
		}
		if (i === 24) {
			times.push({
				time: 1,
				color: Colors.white,
				isPicked: false,
				startPercent: 100,
				endPercent: 100,
				mode: 'normal',
				isEveryTime: false,
				isFullTime: false,
			});
			timesText.push('2 AM');
		}
	}

	const defaultDates = [
		{ day: 'sun', times: times },
		{ day: 'mon', times: times },
		{ day: 'tue', times: times },
		{ day: 'wed', times: times },
		{ day: 'thu', times: times },
		{ day: 'fri', times: times },
		{ day: 'sat', times: times },
	];

	return { defaultDates, timesText };
}
