/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View,
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Timetable } from '../components/Timetable';
import { Colors } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

type SnapStackParamList = {
	SnapShot: {
		name: string;
		color: string;
		timetableMode: string;
		isConfirm: boolean;
		uri: string;
	};
};

type Props = NativeStackScreenProps<SnapStackParamList, 'SnapShot'>;
import { RootState } from '../store';
import {
	getGroupDates,
	getIndividualDates,
	getOtherConfirmDates,
	initializeConfirmTime,
	makeConfirmDates,
	makeConfirmPrepare,
	makeInitialConfirmTime,
	makeInitialIndividual,
	makeTeamTime,
	postConfirm,
	postRevert,
	postSnapShot,
	setGroupTimeToConfirm
} from '../store/timetable';
import team from '../store/team';
import { ModalLoading } from '../components/ModalLoading';
import { Sequence } from '../components/Sequence';
import { DayOfWeek } from '../components';
import { confirmProve, getUserMe, setConfirmProve } from '../store/login';

export default function SnapShot({ route }: Props) {
	const {
		snapShotDate,
		teamConfirmDate,
		peopleCount,
		startHour,
		endHour,
		user,
		id,
		token,
		timeMode,
		confirmDates,
		joinUri,
		confirmClubs,
		confirmDatesTimetable,
		createdDate,
		uri
	} = useSelector(({ timetable, login, team }: RootState) => ({
		snapShotDate: timetable.snapShotDate,
		teamConfirmDate: timetable.teamConfirmDate,
		peopleCount: login.peopleCount,
		startHour: timetable.startHour,
		endHour: timetable.endHour,
		user: login.user,
		id: login.id,
		token: login.token,
		timeMode: timetable.timeMode,
		confirmDates: timetable.confirmDates,
		joinUri: team.joinUri,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		createdDate: timetable.createdDate,
		uri: timetable.teamURI
	}));
	// useState
	const [mode, setMode] = useState('initial');
	const [loadingMode, setLoading] = useState('initial');
	const [modalVisible, setModalVisible] = useState(false);
	const [loadingVisible, setLoadingVisible] = useState(false);
	const [sequence] = useState([0, 1, 2, 3]);
	const [currentNumber, setCurrent] = useState(0);
	// navigation
	const { name, color, timetableMode, isConfirm } = route.params;
	const navigation = useNavigation();
	const dispatch = useDispatch();

	//modal
	// useEffect
	useEffect(() => {
		if (loadingMode === 'loading') {
			setTimeout(() => {
				if (timeMode === 'make') {
					dispatch(getGroupDates({ id, user, token, uri: joinUri }));
					dispatch(getIndividualDates({ id, user, token, uri: joinUri }));
				} else {
					dispatch(getGroupDates({ id, user, token, uri }));
					dispatch(getIndividualDates({ id, user, token, uri }));
				}
				dispatch(
					getOtherConfirmDates({
						confirmClubs,
						confirmDatesTimetable,
						isGroup: true
					})
				);
				dispatch(
					getOtherConfirmDates({
						confirmClubs,
						confirmDatesTimetable,
						isGroup: false
					})
				);
				dispatch(makeInitialConfirmTime());
				setLoading('success');
			}, 500);
		}
	}, [mode, timeMode, loadingMode]);
	// useCallback
	const goLeft = useCallback(() => {
		if (timetableMode === 'confirm') {
			dispatch(initializeConfirmTime());
			setLoadingVisible(false);
			// dispatch(makeInitialIndividual());
			dispatch(getUserMe({ token }));
			setTimeout(() => {
				dispatch(
					getOtherConfirmDates({
						confirmClubs,
						confirmDatesTimetable,
						isGroup: true
					})
				);
				dispatch(setGroupTimeToConfirm());
			}, 100);
		}
		navigation.goBack();
	}, []);
	const onPressConfirm = useCallback(() => {
		setLoading('initial');
		setLoadingVisible(true);
	}, []);
	const onPressOk = useCallback(() => {
		dispatch(makeConfirmPrepare());
		if (timeMode === 'make') {
			dispatch(
				postConfirm({ date: confirmDates, id, token, uri: joinUri, user })
			);
			dispatch(postSnapShot({ uri: joinUri, id, token, user }));
		} else {
			dispatch(postConfirm({ date: confirmDates, id, token, uri, user }));
			dispatch(postSnapShot({ uri, id, token, user }));
		}
		dispatch(makeTeamTime({ color, endHour, startHour, peopleCount }));
		dispatch(setConfirmProve(true));
		setLoading('loading');
	}, [confirmDates, timeMode, joinUri]);
	const onPressRevert = useCallback(() => {
		setLoading('revert');
		setLoadingVisible(true);
	}, []);
	const onPressRevertOk = useCallback(() => {
		dispatch(postRevert({ id, uri, user, token }));
		dispatch(makeInitialIndividual());
		setLoading('loading');
	}, []);
	return (
		<SafeAreaView style={{ backgroundColor: color }}>
			<View style={[styles.view]}>
				<NavigationHeader
					headerColor={color}
					title={name}
					titleStyle={{ paddingLeft: 0 }}
					Left={() => (
						<Icon
							name="angle-left"
							size={24}
							onPress={goLeft}
							color={Colors.white}
							// style={{ marginLeft: '3%' }}
						/>
					)}
					Right={() => (
						<MIcon
							name="check-bold"
							size={27}
							color={Colors.white}
							style={{ paddingTop: 1 }}
							onPress={() =>
								timetableMode === 'confirm' ? onPressConfirm() : onPressRevert()
							}
						/>
					)}
				/>

				<View style={styles.viewHeight}>
					{timetableMode === 'confirm' ? (
						<View style={{ flexDirection: 'column' }}>
							<View style={{ height: 20 }} />
							<Sequence
								color={color}
								currentNumber={currentNumber}
								mode={sequence}
							/>
							{currentNumber === 0 && (
								<View
									style={{ flexDirection: 'row', justifyContent: 'center' }}
								>
									<Text style={[styles.stepText, { color: color }]}>
										모임 시작 시간
									</Text>
									<Text style={styles.stepText}>을 터치해 주세요</Text>
								</View>
							)}
							{currentNumber === 1 && (
								<Text style={styles.stepText}>
									모임 시작 시간을 설정해 주세요
								</Text>
							)}
							{currentNumber === 2 && (
								<Text style={styles.stepText}>
									모임 종료 시간을 설정해 주세요
								</Text>
							)}
							{currentNumber === 3 && (
								<View
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignContent: 'center',
										alignItems: 'center'
									}}
								>
									<Text style={styles.stepText}>상단의 </Text>
									<MIcon
										name="check-bold"
										style={{ marginBottom: 8 }}
										size={27}
										color={color}
									/>
									<Text style={styles.stepText}>
										버튼을 눌러서 저장해 주세요
									</Text>
								</View>
							)}
						</View>
					) : (
						<>
							<Text style={styles.titleText}>저장일 : {createdDate}</Text>
							<View style={styles.rowButtonView}>
								<View />

								<View style={{ flexDirection: 'row' }}>
									<View style={[styles.boxView, { backgroundColor: color }]} />
									<Text style={styles.infoText}>가능 일정</Text>
									<View
										style={[
											styles.boxView,
											{ backgroundColor: Colors.grey300 }
										]}
									/>
									<Text style={styles.infoText}>개인 일정</Text>
									<View
										style={[styles.boxView, { backgroundColor: Colors.white }]}
									/>
									<Text style={styles.infoText}>비어있는 일정</Text>
								</View>
							</View>
						</>
					)}
				</View>
				<DayOfWeek isTeam={true} />
				<ScrollView style={{ backgroundColor: Colors.white }}>
					{timetableMode === 'confirm' ? (
						<Timetable
							teamConfirmDate={teamConfirmDate}
							color={color}
							isConfirm={isConfirm}
							modalVisible={modalVisible}
							mode={mode}
							setMode={setMode}
							setModalVisible={setModalVisible}
							setCurrent={setCurrent}
							isHomeTime={false}
						/>
					) : (
						<Timetable
							snapShotDate={snapShotDate}
							color={color}
							isHomeTime={false}
						/>
					)}
					<ModalLoading
						loadingVisible={loadingVisible}
						setLoadingVisible={setLoadingVisible}
						color={color}
						loadingMode={loadingMode}
						setLoading={setLoading}
						onPressOk={onPressOk}
						onPressRevertOk={onPressRevertOk}
						goLeft={goLeft}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowButtonView: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 25,
		alignSelf: 'center'
	},
	viewHeight: {
		height: 115
	},
	touchableBoxView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center'
		// height: 20,
	},
	modeDescriptionText: {
		flexDirection: 'row',
		alignSelf: 'center'
	},
	iconText: {
		fontFamily: 'NanumSquareR',
		fontSize: 15,
		textAlign: 'center',
		letterSpacing: -1,
		marginTop: 2,
		marginLeft: 1,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center'
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		marginTop: 25
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		textAlign: 'center',
		letterSpacing: -1,

		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center'
	},
	boxButtonView: {
		width: 15,
		height: 15,
		borderWidth: 0.3
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.5,
		marginTop: 1,
		alignSelf: 'center'
	},
	titleText: {
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		marginTop: 25,
		letterSpacing: -1,
		height: 25
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
		marginTop: 20,
		textAlign: 'center'
	},
	loadingText: {
		fontFamily: 'NanumSquareR',
		fontSize: 20,
		color: Colors.white
	}
});
