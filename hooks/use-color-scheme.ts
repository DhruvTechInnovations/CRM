import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Colors } from '../constants/theme';
export { useColorScheme } from 'react-native';

export const AppLightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.light.tint,
        background: Colors.light.background,
        text: Colors.light.text,
        card: Colors.light.background,
        border: Colors.light.icon,
        notification: Colors.light.tint,
        tint: Colors.light.tint,
        icon: Colors.light.icon,
        link: Colors.light.link,
        tabIconDefault: Colors.light.tabIconDefault,
        tabIconSelected: Colors.light.tabIconSelected,
    },
};

export const AppDarkTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
        ...DarkTheme.colors,
        primary: Colors.dark.tint,
        background: Colors.dark.background,
        text: Colors.dark.text,
        card: Colors.dark.background,
        border: Colors.dark.icon,
        notification: Colors.dark.tint,
        tint: Colors.dark.tint,
        icon: Colors.dark.icon,
        link: Colors.dark.link,
        tabIconDefault: Colors.dark.tabIconDefault,
        tabIconSelected: Colors.dark.tabIconSelected,
    },
};
