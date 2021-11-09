/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
    TouchableView,
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { Timetable } from '../components';
import { Colors } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import {
	cloneDates,
	makeInitialTimetable,
	setEndHour,
	setEndMin,
	setStartHour,
	setStartMin,
} from '../store/timetable';
import { RootState } from '../store';
import { findURI } from '../store/login';
import { useMakeTimetable } from '../hooks';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
type TeamStackParamList = {
	TeamTime: { name: string; user: number; id: number; token: string };
};

type Props = NativeStackScreenProps<TeamStackParamList, 'TeamTime'>;
import * as Clipboard from 'expo-clipboard';
import { shareUri } from '../store/team';

export default function TeamTime({ route }: Props) {
	const { dates, uri, postDatesPrepare } = useSelector(
		({ timetable, login }: RootState) => ({
			dates: timetable.dates,
			uri: login.uri,
			postDatesPrepare: timetable.postDatesPrepare,
		})
	);
	// navigation
	const { name, id, user, token } = route.params;

	const navigation = useNavigation();
	const goLeft = useCallback(() => {
		navigation.goBack();
	}, []);

	// URI 찾아오기 로직
	useEffect(() => {
		dispatch(findURI(name));
	}, [name]);
	// 그룹인지 아닌지
	const [isGroup, setGroupMode] = useState(true);
	const dispatch = useDispatch();
	//modal
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('normal');
	// initial
	const onPressPlus = useCallback(() => {
		setMode('startMode');
		dispatch(setStartHour(0));
		dispatch(setStartMin(0));
		dispatch(setEndHour(0));
		dispatch(setEndMin(0));
	}, []);
	useEffect(() => {
		dispatch(makeInitialTimetable());
	}, [uri]);
	// 공유하기 버튼
	const onShareURI = useCallback(() => {
		uri && dispatch(shareUri({ id: id, user: user, token: token, uri: uri }));
	}, [id, user, token, uri]);
	// useEffect(() => {
	// 	dispatch(cloneDates(defaultDates));
	// }, []);
	return (
		<SafeAreaView style={{ backgroundColor: Colors.white }}>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader
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
						Right={() =>
							isGroup ? (
								<MIcon
									name="check-bold"
									size={27}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={onPressPlus}
								/>
							) : (
								<MIcon
									name="plus"
									size={27}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={() => setMode('startMode')}
								/>
							)
						}
						secondRight={() => (
							<FontAwesome
								name="user-plus"
								size={20}
								color={Colors.white}
								style={{ paddingTop: 3 }}
								onPress={onShareURI}
							/>
						)}
					/>
					<View style={styles.viewHeight}>
						<View style={styles.rowButtonView}>
							{mode === 'normal' && (
								<View style={{ flexDirection: 'column' }}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-evenly',
										}}
									>
										<TouchableOpacity
											style={styles.touchableBoxView}
											onPress={() => setGroupMode(true)}
										>
											{/* <View
												style={[
													styles.boxButtonView,
													{
														backgroundColor: isGroup
															? Colors.blue400
															: Colors.white,
													},
												]}
											/> */}
											<MIcon
												name={
													isGroup
														? 'checkbox-marked-outline'
														: 'checkbox-blank-outline'
												}
												size={24}
												color={Colors.blue600}
											/>
											<Text style={styles.iconText}>그룹</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[styles.touchableBoxView, { marginLeft: 70 }]}
											onPress={() => setGroupMode(false)}
										>
											<MIcon
												name={
													isGroup
														? 'checkbox-blank-outline'
														: 'checkbox-marked-outline'
												}
												size={23}
												color={Colors.blue600}
											/>
											<Text style={styles.iconText}>개인</Text>
										</TouchableOpacity>
									</View>
									<View style={{ flexDirection: 'row' }}>
										<View
											style={[
												styles.boxView,
												{ backgroundColor: Colors.blue400 },
											]}
										/>
										<Text style={styles.infoText}>가능 일정</Text>
										<View
											style={[
												styles.boxView,
												{ backgroundColor: Colors.grey300 },
											]}
										/>
										<Text style={styles.infoText}>개인 일정</Text>
										<View
											style={[
												styles.boxView,
												{ backgroundColor: Colors.white },
											]}
										/>
										<Text style={styles.infoText}>비어있는 일정</Text>
									</View>
								</View>
							)}
							{mode === 'startMode' && (
								<>
									<Text style={styles.stepText}>
										{'[1] 일정 시작 시간을 터치해주세요'}
									</Text>
								</>
							)}
							{mode === 'startMinute' && (
								<>
									<Text style={styles.stepText}>[2] 일정 시작 분 설정</Text>
								</>
							)}
							{mode === 'endMode' && (
								<>
									<Text style={styles.stepText}>
										[3] 종료 시간 입력해주세요
									</Text>
								</>
							)}
						</View>
					</View>
					<Timetable
						mode={mode}
						setMode={setMode}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						isGroup={isGroup}
						dates={dates}
						uri={uri}
						postDatesPrepare={postDatesPrepare}
					/>
				</View>
			</ScrollEnabledProvider>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowButtonView: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
		alignSelf: 'center',
	},
	viewHeight: {
		height: 80,
	},
	touchableBoxView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		// height: 20,
	},
	modeDescriptionText: {
		// width: '100%',
		flexDirection: 'row',
		// justifyContent: 'space-around',
		// alignContent: 'space-around',
		alignSelf: 'center',
		// marginTop: 35,
		// marginLeft: '30%',
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
		textAlignVertical: 'center',
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		// marginTop: 24,
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		textAlign: 'center',
		letterSpacing: -1,

		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	boxButtonView: {
		width: 15,
		height: 15,
		borderWidth: 0.3,
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.3,
		marginTop: 1,
		alignSelf: 'center',
	},
	titleText: {
		fontSize: 17,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 12,
		letterSpacing: -1,
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
	},
});
