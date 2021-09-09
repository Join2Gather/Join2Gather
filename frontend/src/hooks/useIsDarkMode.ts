import { useTheme } from '@react-navigation/native';
import { Colors } from 'react-native-paper';

export function useIsDarkMode(): {
	isDark: boolean;
	backgroundColor: string;
	textColor: string;
} {
	const isDark = useTheme().dark;
	const backgroundColor = isDark ? Colors.black : '#EDF3F7';
	const textColor = isDark ? Colors.white : Colors.grey800;

	return { isDark, backgroundColor, textColor };
}