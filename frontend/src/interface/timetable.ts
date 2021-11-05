export interface timetable {
	dates: make_days[];
	teamDates: make_days[];
	startTime: number;
	endTime: number;
	startMinute: number;
	endMinute: number;
	selectTime: selectDay;
	day: string;
	dayIdx: number;
	weekIndex: weekIndex;
	postIndividualDates: postIndividualDates;
	error: string;
}

export type weekIndex = Array<string>;

export interface changeColorType {
	idx: number;
	time: number;
}

export interface selectDay {
	sun: Array<number>;
	mon: Array<number>;
	tue: Array<number>;
	wed: Array<number>;
	thu: Array<number>;
	fri: Array<number>;
	sat: Array<number>;
	// 인덱스 시그니처
	[prop: string]: any;
}

export interface days {
	sun: Array<Number>;
	mon: Array<Number>;
	tue: Array<Number>;
	wed: Array<Number>;
	thu: Array<Number>;
	fri: Array<Number>;
	sat: Array<Number>;
	club: string;
	is_temporary_reserved: boolean;
}
export interface default_dates {}

export interface time {
	timeText: string;
	time: number;
	color: string;
}
export interface make_days {
	day: string;
	times: Array<state_time>;
}

export interface state_time {
	time: number;
	color: string;
	isFullTime: boolean;
	startPercent: number;
	endPercent: number;
	mode: string;
	isEveryTime: boolean;
}

export interface postIndividualDates {
	sun: post_time[];
	mon: post_time[];
	tue: post_time[];
	wed: post_time[];
	thu: post_time[];
	fri: post_time[];
	sat: post_time[];
	[prop: string]: any;
}

// 개별 일정 받아오기
export interface requestIndividualDatesAPI {
	id: number;
	uri: string;
	user: number;
	token: string;
}

// 팀 일정 받아오기
export interface requestGroupDatesAPI {
	user: number;
	uri: string;
	id: number;
	token: string;
}

// 개별 일정 보내기
export interface postIndividualDatesAPI {
	dates: postIndividualDates;
	id: number;
	user: number;
	uri: string;
	token: string;
}

export interface post_time {
	starting_hours: number;
	starting_minutes: number;
	end_hours: number;
	end_minutes: number;
}
