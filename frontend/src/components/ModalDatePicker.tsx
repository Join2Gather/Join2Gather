import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from 'react-native-paper';
import { RootState } from '../store';

import DatePicker from 'react-native-date-picker';
import { useIsDarkMode } from '../hooks';
import dayjs from 'dayjs';
import ko from 'dayjs/locale/ko';
import MakeAlarm from '../lib/util/MakeAlarm';
dayjs.locale('ko');
interface props {
	dateVisible: boolean;
	setDateVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalDatePicker({ dateVisible, setDateVisible }: props) {
	const { postConfirmSuccess } = useSelector(
		({ timetable, login, individual }: RootState) => ({
			postConfirmSuccess: timetable.postConfirmSuccess,
		})
	);
	const dispatch = useDispatch();
	// const [minute, setMinute] = useState(0);
	// const [hour, setHour] = useState(0);
	const [date, setDate] = useState(new Date());

	const onPressClose = useCallback(() => {
		setVisible(false);
		setDateVisible(false);
	}, []);

	// const add = MakeAlarm()
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		dateVisible && setVisible(true);
	}, [dateVisible]);
	const { isDark } = useIsDarkMode();
	return (
		<>
			<DatePicker
				modal
				open={visible}
				date={date}
				mode="date"
				onConfirm={(date) => {
					setDateVisible(false);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'iosClone'}
				minuteInterval={10}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={'알람 기한 설정'}
				confirmText="확인"
				cancelText="취소"
			/>
		</>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50,
	},
	modalView: {
		margin: 10,
		paddingBottom: 60,
		marginBottom: 60,
		backgroundColor: 'white',
		borderRadius: 13,
		padding: 15,
		alignItems: 'center',
		elevation: 10,
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 0.3,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,

		width: '94%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 18,
	},
	startTimeText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 17,
		marginBottom: 18,
	},
	textView: {
		width: '100%',
		//
	},
	hourText: {
		fontSize: 20,
		fontFamily: 'NanumSquareR',
		marginTop: 4,
	},
	textInput: {
		fontSize: 22,
		flex: 0.6,
		fontFamily: 'NanumSquareR',

		alignSelf: 'center',
		borderWidth: 0.3,
		padding: 2,
		textAlign: 'center',

		borderColor: Colors.blue300,
		borderRadius: 8,
	},
	textInputView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 0,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	closeButtonStyle: {
		borderRadius: 8,

		padding: 12,
		flex: 1,
	},
	acceptButtonStyle: {
		padding: 15,

		borderRadius: 10,
	},
	modalText: {
		textAlign: 'center',
	},
	verticalLine: {
		borderLeftWidth: 0.16,
		width: 1,
	},
	viewFlex1: {
		flex: 0.1,
	},
});
