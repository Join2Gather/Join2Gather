import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Dimensions, View, Alert } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeDayIdx,
	checkIsBlank,
	checkIsExist,
	checkMode,
	cloneEveryTime,
	findTimeFromResponse,
	getGroupDates,
	getIndividualDates,
	getOtherConfirmDates,
	makeInitialIndividual,
	makeTeamTime,
	setDay,
	setStartHour,
	setTimeModalMode,
	toggleTimePick
} from '../store/timetable';
import type { make60, timeType } from '../interface';
import { Text } from '../theme';
import { RootState } from '../store';
import { checkInMode, initialTimeMode, kakaoLogin } from '../store/individual';
import { ModalTime } from './';
import { ModalTimePicker } from './ModalTimePicker';
import { findHomeTime } from '../store/login';
import { ModalIndividualTime } from './ModalIndividualTime';
import { TouchableOpacity } from 'react-native';
import { Spinner } from './Spinner';
import { Platform } from 'react-native';
import { setModalMode } from '../store/team';
import { getGroupIndividualTime } from '../hooks/getGroupIndividualTime';

const isAOS = Platform.OS === 'android';

const boxHeight = 28.0;
const inBoxHeight = 7.0;
const lastBox = 25;
const screen = Dimensions.get('screen');
const borderWidth = 0.3;

interface props {
	mode?: string;
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>> | null;
	setMode?: React.Dispatch<React.SetStateAction<string>>;
	setIsTimeMode?: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrent?: React.Dispatch<React.SetStateAction<number>>;
	isGroup?: boolean;
	isConfirm?: boolean;
	individualDates?: make60[];
	snapShotDate?: make60[];
	uri?: string;
	postDatesPrepare?: boolean;
	confirmDatesPrepare?: boolean;
	individualTimesText?: Array<string>;
	endIdx?: number;
	color?: string;
	teamConfirmDate?: make60[];
	isHomeTime: boolean;
}

interface modalData {
	people: Array<string>;
	startTime: timeType;
	endTime: timeType;
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
	setIsTimeMode,
	setCurrent,
	isGroup,
	isConfirm,
	individualDates,
	snapShotDate,
	uri,
	postDatesPrepare,
	confirmDatesPrepare,
	individualTimesText,
	endIdx,
	color,
	teamConfirmDate,
	isHomeTime
}: props) {
	const {
		dates,
		id,
		user,
		token,
		isTimePicked,
		postIndividualDates,
		confirmDates,
		teamDatesWith60,
		timeMode,
		joinUri,
		confirmClubs,
		confirmDatesTimetable,
		timesText,
		endHourTimetable,
		reload,
		findTime,
		findIndividual,
		selectTimeMode,
		modalMode,
		inTimeMode,
		isInitial
	} = useSelector(
		({ timetable, individual, login, loading, team }: RootState) => ({
			dates: timetable.dates,
			id: login.id,
			user: login.user,
			token: login.token,
			postIndividualDates: timetable.postIndividualDates,
			confirmDates: timetable.confirmDates,
			isTimePicked: timetable.isTimePicked,
			teamDatesWith60: timetable.teamDatesWith60,
			timeMode: timetable.timeMode,
			joinUri: team.joinUri,
			confirmClubs: login.confirmClubs,
			confirmDatesTimetable: login.confirmDatesTimetable,
			timesText: timetable.timesText,
			endHourTimetable: timetable.endHour,
			reload: timetable.reload,
			findTime: timetable.findTime,
			findIndividual: login.findIndividual,
			selectTimeMode: timetable.selectTimeMode,
			modalMode: timetable.modalMode,
			inTimeMode: individual.inTimeMode,
			isInitial: timetable.isInitial
		})
	);
	const dispatch = useDispatch();
	const [timeModalVisible, setTimeModalVisible] = useState(false);
	const [inModalVisible, setInModalVisible] = useState(false);
	const [date, setDate] = useState<Date>(new Date());
	const [endHour, setEndHour] = useState(0);
	const [isConfirmMode, setIsConfirm] = useState(false);
	const [select, setSelect] = useState({
		idx: 0,
		time: 0,
		day: ''
	});
	const [count, setCount] = useState(1);
	const [loading, setLoading] = useState('');
	// useEffect
	useEffect(() => {
		date.setMinutes(0);
	}, [date]);

	const [tableMode, setTableMode] = useState('group');
	useEffect(() => {
		mode === undefined && setMode && setMode('normal');
	}, [mode]);
	useEffect(() => {
		endIdx ? setEndHour(endIdx) : setEndHour(endHourTimetable);
	}, [endIdx, endHourTimetable]);

	// 최초 렌더링 개인 페이지 정보 받아오기
	useEffect(() => {
		if (isInitial) {
			isGroup && setLoading('loading'),
				setTimeout(() => {
					setLoading('');
				}, 500);
			uri &&
				getGroupIndividualTime(
					{ id, token, uri: timeMode === 'make' ? joinUri : uri, user },
					{ confirmClubs, confirmDatesTimetable },
					dispatch
				);
		}
	}, [uri, isGroup, isInitial]);

	useEffect(() => {
		// 시간 누르기 로직
		if (!isHomeTime) {
			if (selectTimeMode === 'normal' && tableMode === 'individual') {
				setMode && setMode('startMinute');
				setIsTimeMode && setIsTimeMode(true);
				onSetStartHour(select.idx, select.time, select.day);
			} else if (tableMode === 'individual') {
				dispatch(
					findTimeFromResponse({
						time: select.time,
						day: select.day,
						isTeam: false
					})
				);
				dispatch(findHomeTime({ day: select.day, time: select.time }));
				dispatch(setTimeModalMode(true));
			} else if (selectTimeMode.includes('team') && tableMode === 'gr') {
				dispatch(
					findTimeFromResponse({
						time: select.time,
						day: select.day,
						isTeam: true
					})
				);
				setTimeout(() => {
					setTimeModalVisible(true);
				}, 100);
			}
		}
	}, [select, selectTimeMode, tableMode, isHomeTime]);
	useEffect(() => {
		if (modalMode === true && !isHomeTime) {
			if (
				selectTimeMode.includes('individual') ||
				selectTimeMode.includes('team')
			) {
				setTimeModalVisible(true);
			} else {
				setInModalVisible(true);
			}
		}
	}, [modalMode, selectTimeMode, mode]);
	useEffect(() => {
		if (mode === 'startMinute' && !isTimePicked) {
			setModalVisible && setModalVisible(true);
		} else if (mode === 'startMinute' && isTimePicked) {
			setMode && setMode('normal');
		}
	}, [isTimePicked, mode]);
	useEffect(() => {
		if (isHomeTime) {
			console.log(inTimeMode);
			if (
				inTimeMode.includes('home') ||
				inTimeMode.includes('team') ||
				inTimeMode.includes('everyTime')
			) {
				// 빈 칸 아닐 경우
				dispatch(findHomeTime({ day: select.day, time: select.time }));
				setTimeout(() => {
					setInModalVisible(true);
				}, 100);
			} else if (inTimeMode.includes('normal')) {
				// 시간 설정 로직
				date.setHours(select.time);
				setDate(new Date(date));
				setModalVisible && setModalVisible(true);
				setIsTimeMode && setIsTimeMode(true);
				setMode && setMode('startMode');
				setCurrent && setCurrent(1);
			}
			return () => {
				setModalVisible && setModalVisible(false);
			};
		}
	}, [inTimeMode, isHomeTime]);

	// useCallback

	const onPressGroupTime = useCallback(
		(time: number, day: string, is: boolean, idx: number) => {
			dispatch(setStartHour(time));
			dispatch(changeDayIdx(idx));
			dispatch(checkMode({ time, mode: 'group' }));
			setSelect({ idx, time, day });
			setIsConfirm(is);
			setTableMode('gr');
		},
		[]
	);

	const onPressIndividualTime = useCallback(
		(time: number, day: string, idx: number) => {
			dispatch(changeDayIdx(idx));
			dispatch(checkMode({ time, mode: 'in' }));
			dispatch(setStartHour(time));

			setSelect({ idx, time, day });
			setTableMode('individual');
			setCurrent && setCurrent(0);
		},
		[]
	);

	const onPressHomeTime = useCallback(
		(time: number, day: string, idx: number) => {
			dispatch(checkInMode({ time, idx, day }));
			setSelect({ idx, time, day });
		},
		[]
	);
	const onPressNext = useCallback(() => {
		setTimeModalVisible(false);
		setInModalVisible(false);
		setCurrent && setCurrent(1);
		onSetStartHour(select.idx, select.time, select.day);
		dispatch(setTimeModalMode(false));
	}, [select]);

	const onSetStartHour = useCallback(
		(idx: number, time: number, day: string) => {
			dispatch(toggleTimePick());
			dispatch(setStartHour(time));
			setCurrent && setCurrent(1);
			date.setHours(time);
			setDate(new Date(date));
			dispatch(changeDayIdx(idx));
			dispatch(setDay(day));

			setTimeout(() => {
				isConfirm
					? dispatch(checkIsExist('start'))
					: dispatch(checkIsBlank('start'));
			}, 100);
			setTimeout(() => {
				setMode && setMode('startMinute');
			}, 100);
		},
		[isGroup, date, isConfirm, mode]
	);

	const onPlusHour = useCallback(
		(hour: number) => {
			date.setHours(hour + 1);
		},
		[date]
	);

	return (
		<View style={styles.view}>
			<Spinner loading={loading} />
			<View style={styles.rowView}>
				<View style={[styles.timeView, {}]}>
					{individualTimesText
						? individualTimesText.map((time, idx) => (
								<View
									style={[
										styles.timeEachView,
										{
											borderColor: color ? color : Colors.blue500,
											height: 60
										}
									]}
									key={idx}
								>
									<Text style={styles.timeText}>{time}</Text>
								</View>
						  ))
						: timesText.map((time, idx) => (
								<View
									style={[
										styles.timeEachView,
										{
											borderColor: color ? color : Colors.blue500,
											height: 60
										}
									]}
									key={idx}
								>
									<Text style={styles.timeText}>{time}</Text>
								</View>
						  ))}
				</View>
				{/* <Spinner loading={loading} /> */}
				<View style={styles.contentView}>
					{isGroup ? (
						<>
							{teamDatesWith60.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableOpacity
											accessibilityRole="button"
											style={[
												styles.boxView,
												{
													// borderColor: day.timeBackColor[Number(time)],
													// backgroundColor: day.timeBackColor[Number(time)],
												}
											]}
											key={time}
											onPress={() => {
												mode === 'confirmMode' &&
													onSetStartHour(idx, Number(time), day.day);
												mode === 'normal' &&
													onPressGroupTime(Number(time), day.day, false, idx);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={[
														styles.timeSmallView,
														{
															backgroundColor: t.color,

															borderTopWidth:
																Number(time) === endHour
																	? borderWidth
																	: t.borderTop
																	? borderWidth
																	: 0,
															borderBottomWidth:
																Number(time) === endHour - 1 && tIdx === 5
																	? borderWidth
																	: 0,
															borderLeftWidth:
																Number(time) === endHour ? 0 : borderWidth,
															borderRightWidth:
																Number(time) === endHour ? 0 : borderWidth
														}
													]}
												/>
											))}
										</TouchableOpacity>
									))}
								</View>
							))}
						</>
					) : individualDates ? (
						<>
							{individualDates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableOpacity
											style={[
												styles.boxView,
												{ backgroundColor: day.timeBackColor[Number(time)] }
											]}
											key={time}
											onPress={() => {
												onPressHomeTime(Number(time), day.day, idx);
												console.log(day.timeBackColor[Number(time)]);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={[
														styles.timeSmallView,
														{
															backgroundColor: t.color,
															borderTopWidth:
																Number(time) === endHour
																	? borderWidth
																	: t.borderTop
																	? borderWidth
																	: 0,
															borderBottomWidth:
																Number(time) === endHour - 1 && tIdx === 5
																	? borderWidth
																	: 0,
															borderLeftWidth:
																Number(time) === endHour ? 0 : borderWidth,
															borderRightWidth:
																Number(time) === endHour ? 0 : borderWidth
														}
													]}
												/>
											))}
										</TouchableOpacity>
									))}
								</View>
							))}
						</>
					) : snapShotDate ? (
						<>
							{snapShotDate.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableOpacity
											style={[
												styles.boxView,
												{ backgroundColor: day.timeBackColor[Number(time)] }
											]}
											key={time}
											onPress={() => {
												console.log('hi');
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={[
														styles.timeSmallView,
														{
															backgroundColor: t.color,
															borderTopWidth:
																Number(time) === endHour
																	? borderWidth
																	: t.borderTop
																	? borderWidth
																	: 0,
															borderBottomWidth:
																Number(time) === endHour - 1 && tIdx === 5
																	? borderWidth
																	: 0,
															borderLeftWidth:
																Number(time) === endHour ? 0 : borderWidth,
															borderRightWidth:
																Number(time) === endHour ? 0 : borderWidth
														}
													]}
												/>
											))}
										</TouchableOpacity>
									))}
								</View>
							))}
						</>
					) : teamConfirmDate ? (
						<>
							{teamConfirmDate.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableOpacity
											style={[
												styles.boxView,
												{ backgroundColor: day.timeBackColor[Number(time)] }
											]}
											key={time}
											onPress={() => {
												onPressGroupTime(Number(time), day.day, true, idx);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={[
														styles.timeSmallView,
														{
															backgroundColor: t.color,
															borderTopWidth:
																Number(time) === endHour
																	? borderWidth
																	: t.borderTop
																	? t.borderWidth
																	: 0,

															borderBottomWidth:
																Number(time) === endHour - 1 && tIdx === 5
																	? borderWidth
																	: t.borderBottom
																	? t.borderWidth
																	: 0,
															borderLeftWidth:
																Number(time) === endHour
																	? t.borderWidth
																	: t.borderWidth,

															borderRightWidth:
																Number(time) === endHour
																	? t.borderWidth
																	: t.borderWidth
														}
													]}
												/>
											))}
										</TouchableOpacity>
									))}
								</View>
							))}
						</>
					) : (
						<>
							{dates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableOpacity
											style={[
												styles.boxView,
												{ backgroundColor: day.timeBackColor[Number(time)] }
											]}
											key={time}
											onPress={() => {
												mode === 'normal' &&
													onPressIndividualTime(Number(time), day.day, idx);
												mode === 'startMode' &&
													onSetStartHour(idx, Number(time), day.day);
												console.log(day.timeBackColor[Number(time)]);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={[
														styles.timeSmallView,
														{
															backgroundColor: t.color,
															borderTopWidth:
																Number(time) === endHour
																	? borderWidth
																	: t.borderTop
																	? borderWidth
																	: 0,
															borderBottomWidth:
																Number(time) === endHour - 1 && tIdx === 5
																	? borderWidth
																	: 0,
															borderLeftWidth:
																Number(time) === endHour ? 0 : borderWidth,
															borderRightWidth:
																Number(time) === endHour ? 0 : borderWidth
														}
													]}
												/>
											))}
										</TouchableOpacity>
									))}
								</View>
							))}
						</>
					)}

					<ModalTime
						color={color}
						setTimeModalVisible={setTimeModalVisible}
						timeModalVisible={timeModalVisible}
						findTime={findTime}
						isConfirmMode={isConfirmMode}
						onPressNext={onPressNext}
						tableMode={tableMode}
						isGroup={isGroup}
					/>
					<ModalIndividualTime
						findIndividual={findIndividual}
						setInModalVisible={setInModalVisible}
						inModalVisible={inModalVisible}
						inTimeMode={inTimeMode}
					/>
					<ModalTimePicker
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						setMode={setMode}
						setIsTimeMode={setIsTimeMode}
						setCurrent={setCurrent}
						id={id}
						postIndividualDates={postIndividualDates}
						token={token}
						uri={uri}
						user={user}
						postDatesPrepare={postDatesPrepare}
						confirmDatesPrepare={confirmDatesPrepare}
						isConfirm={isConfirm}
						confirmDates={confirmDates}
						date={date}
						setDate={setDate}
						timeMode={timeMode}
						joinUri={joinUri}
						isHomeTime={isHomeTime}
						findTime={findTime}
						onPlusHour={onPlusHour}
						count={count}
						setCount={setCount}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: { flex: 1, flexDirection: 'column', paddingTop: 0 },
	contentView: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-evenly'
	},
	timeView: {
		width: screen.width / 13
	},
	timeText: {
		fontSize: 10,
		alignSelf: 'flex-end',
		textAlign: 'right',
		fontFamily: 'NanumSquareR',
		marginTop: 2
	},
	columnView: {
		flexDirection: 'column'
	},
	rowView: {
		flexDirection: 'row'
	},

	timeEachView: {
		borderTopWidth: 2,

		width: screen.width / 3,
		alignSelf: 'flex-end'
	},
	boxView: {
		height: 30,
		borderColor: Colors.black,
		width: screen.width / 9
	},
	timeSmallView: {
		flex: isAOS ? 1 : 0,
		height: 5
	}
});
