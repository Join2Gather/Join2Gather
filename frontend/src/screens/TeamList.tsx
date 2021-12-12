import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
	SafeAreaView,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import Icons from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { initialError, setModalMode } from '../store/team';
import { ModalInput, Spinner } from '../components';
import { NavigationHeader } from '../theme';
import FontAweSome from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { findTeam, getUserMe } from '../store/login';
import { Colors } from 'react-native-paper';
import { makeTeamTime, setIsInTeamTime, setTeamName } from '../store/timetable';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { hexToRGB } from '../lib/util/hexToRGB';
const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
export default function TeamList() {
	const {
		user,
		id,
		clubs,
		token,
		loginURI,
		loginName,
		joinTeam,
		joinName,
		postTeamError,
		joinTeamError,
		loadingJoin,
		loadingChangeColor,
		teamColor,
		teamName,
		teamUri,
		teamMakeColor,
		joinUri,
		loadingUserMe,
		makeReady,
		modalMode,
		color,
		peopleCount,
		startHour,
		endHour,
		makeStartHour,
		makeEndHour,
		individualColor,
	} = useSelector(({ login, team, loading, timetable }: RootState) => ({
		user: login.user,
		id: login.id,
		clubs: login.clubs,
		token: login.token,
		loginURI: login.uri,
		loginName: login.name,
		joinTeam: team.joinTeam,
		joinName: team.joinName,
		joinTeamError: team.joinTeamError,
		postTeamError: team.postTeamError,
		loadingJoin: loading['team/JOIN_TEAM'],
		loadingChangeColor: loading['team/CHANGE_COLOR'],
		teamColor: timetable.color,
		teamMakeColor: team.teamColor,
		teamName: team.name,
		teamUri: team.joinUri,
		joinUri: team.joinUri,
		loadingUserMe: loading['login/USER_ME'],
		makeReady: timetable.makeReady,
		modalMode: team.modalMode,
		color: login.color,
		peopleCount: login.peopleCount,
		startHour: login.startHour,
		endHour: login.endHour,
		makeStartHour: team.startHour,
		makeEndHour: team.endHour,
		individualColor: login.individualColor,
	}));
	const [dimensions, setDimensions] = useState({ window, screen });
	const [sequence, setSequence] = useState([0, 1, 2, 3]);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('initial');
	const [makeName, setMake] = useState('');
	const navigation = useNavigation();
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	const dispatch = useDispatch();

	// useEffect
	useEffect(() => {
		dispatch(getUserMe({ id, token, user }));
	}, [joinTeam]);
	useEffect(() => {
		const result = hexToRGB(individualColor);
		result && setRGBColor(result);
	}, [individualColor]);
	useEffect(() => {
		dispatch(setModalMode('normal'));
	}, [joinTeamError]);
	// useCallback
	// Navigation 이동
	useEffect(() => {
		if (mode === 'next') {
			if (modalMode === 'make') {
				dispatch(
					makeTeamTime({
						color: teamMakeColor,
						peopleCount: 1,
						startHour: makeStartHour,
						endHour: makeEndHour,
					})
				);
				dispatch(setTeamName({ name: teamName, uri: teamUri }));
				setTimeout(() => {
					navigation.navigate('TeamTime', {
						user,
						id,
						token,
						modalMode,
					});
				}, 50);
				setMode('normal');
			} else {
				dispatch(makeTeamTime({ color, peopleCount, startHour, endHour }));
				dispatch(setTeamName({ name: loginName, uri: loginURI }));
				setTimeout(() => {
					navigation.navigate('TeamTime', {
						user,
						id,
						token,
						modalMode,
					});
				}, 50);
				setMode('normal');
			}
		}
	}, [modalMode, mode, teamMakeColor, makeStartHour, makeEndHour]);
	const goTeamTime = useCallback(
		(name?: string, uri?: string) => {
			if (modalMode === 'join') {
				dispatch(findTeam({ uri }));
				setMode('next');
			} else if (modalMode === 'normal') {
				dispatch(findTeam({ name }));
				setMode('next');
			} else if (modalMode === 'make') {
				name && setMake(name);
				setMode('next');
			}

			dispatch(initialError());
		},
		[modalMode]
	);
	// 모달 모드 분리
	const onMakeTeamTime = useCallback(() => {
		if (sequence.length !== 4) setSequence((sequence) => [...sequence, 3]);
		dispatch(setModalMode('make'));
		setModalVisible(true);
	}, [sequence]);
	const onJoinTeamTime = useCallback(() => {
		setSequence((sequence) => sequence.filter((idx) => idx !== 3));
		dispatch(setModalMode('join'));
		setModalVisible(true);
	}, [sequence]);
	const onReload = useCallback(() => {
		dispatch(getUserMe({ id, user, token }));
	}, []);
	return (
		<SafeAreaView
			style={{ backgroundColor: modalVisible ? Colors.white : individualColor }}
		>
			<View
				style={[
					styles.view,
					{ opacity: modalVisible ? 0.2 : 1, backgroundColor: Colors.white },
				]}
			>
				<NavigationHeader
					title="모임 목록"
					headerColor={individualColor}
					Left={() => (
						<FontAwesome5Icon
							name="redo-alt"
							size={25}
							color={Colors.white}
							style={{ paddingTop: 1 }}
							onPress={onReload}
						/>
					)}
					Right={() => (
						<FontAwesome5Icon
							name="plus"
							size={25}
							color={Colors.white}
							style={{ paddingTop: 1 }}
							onPress={onMakeTeamTime}
						/>
					)}
				/>
				<Text style={styles.headerUnderText}>Plan list</Text>
				{!clubs.length && (
					<TouchableView
						style={[
							styles.teamListTouchableView,
							{ width: '100%', justifyContent: 'space-between' },
						]}
					>
						<View style={styles.rowCircle} />
						<Text style={styles.teamTitle}>아직 아무런 모임이 없네요 😭</Text>
					</TouchableView>
				)}
				{/* <Spinner loading={loadingUserMe} /> */}
				<FlatList
					style={{
						height: dimensions.screen.height * 0.6,
						flexGrow: 0,
					}}
					data={clubs}
					renderItem={({ item }) => (
						<TouchableView
							onPress={() => goTeamTime(item.name)}
							style={[
								styles.teamListTouchableView,
								{
									width: '100%',
									justifyContent: 'space-between',
									opacity: 1,
								},
							]}
						>
							<View
								style={[styles.rowCircle, { backgroundColor: item.color }]}
							/>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={styles.teamTitle}
							>
								{item.name}
							</Text>
							<Icons size={15} name="right" style={styles.iconStyle} />
						</TouchableView>
					)}
					keyExtractor={(item, index) => String(item.id)}
				/>
				{/* <View
					style={[
						styles.blurView,
						{
							padding: dimensions.screen.width,
							backgroundColor: Colors.grey200,
							bottom: -10,
						},
					]}
				></View>
				<View
					style={[
						styles.blurView,
						{
							padding: dimensions.screen.width,
							backgroundColor: Colors.grey300,
							bottom: 0,
						},
					]}
				></View> */}
				{/* <View
					style={[styles.blurView, { padding: dimensions.screen.width }]}
				></View> */}
				<ModalInput
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					user={user}
					id={id}
					token={token}
					goTeamTime={goTeamTime}
					modalMode={modalMode}
					loadingJoin={loadingJoin}
					postTeamError={postTeamError}
					joinTeamError={joinTeamError}
					joinUri={joinUri}
					loadingChangeColor={loadingChangeColor}
					joinName={joinName}
					makeReady={makeReady}
					individualColor={individualColor}
					sequence={sequence}
				/>
				<TouchableView
					style={[
						styles.touchableView,
						{
							backgroundColor: `rgba(${RGBColor.r}, ${RGBColor.g}, ${RGBColor.b}, 2)`,
						},
					]}
					onPress={onJoinTeamTime}
				>
					<Text style={styles.loginText}>모임 참여</Text>
				</TouchableView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: { justifyContent: 'center', backgroundColor: Colors.white },
	headerUnderText: {
		fontFamily: 'NanumSquareR',
		fontSize: 16,
		marginTop: 13,
		marginBottom: 20,
		letterSpacing: -0.3,
		textAlign: 'center',
		backgroundColor: 'white',
	},

	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: Colors.white,
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowCircle: {
		// flexDirection: 'row',
		padding: 7,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',

		backgroundColor: '#017bff',
		borderRadius: 20,
		position: 'absolute',
		top: 12,
		left: 40,
	},
	teamTitle: {
		fontSize: 15,
		fontFamily: 'SCDream4',
		color: '#000',
		position: 'absolute',
		letterSpacing: -0.5,
		left: 70,
		overflow: 'hidden',
		maxWidth: 230,
	},
	iconStyle: {
		position: 'absolute',
		right: 40,
	},
	textView: { width: '100%', padding: 5, marginBottom: 30 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 50,
		marginBottom: 50,
		borderRadius: 10,
		width: '65%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: Colors.white,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		marginTop: 50,
		// position: 'absolute',
		// bottom: Platform.select({ ios: 10, android: 10 }), // -3-
		// marginBottom: 53,
	},
	teamListTouchableView: {
		flexDirection: 'row',
		height: 40,
		borderRadius: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: 'white',
		shadowOffset: {
			width: 1,
			height: 1,
		},
	},
	blurView: {
		paddingTop: 5,
		paddingBottom: 10,
		opacity: 0.5,
		backgroundColor: Colors.grey200,
		position: 'absolute',
		bottom: 10,
		height: 30,
	},
});
