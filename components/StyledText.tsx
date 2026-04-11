import { Text, TextProps } from 'react-native';

interface StyledTextProps extends TextProps {
    weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extraBold';
}

/**
 * Reusable Text component that defaults to Poppins font.
 * Usage: <StyledText weight="bold">Hello World</StyledText>
 */
export default function StyledText(props: StyledTextProps) {
    const { style, weight = 'regular', ...rest } = props;

    const getFontFamily = () => {
        switch (weight) {
            case 'medium': return 'Poppins-Medium';
            case 'semibold': return 'Poppins-SemiBold';
            case 'bold': return 'Poppins-Bold';
            case 'extraBold': return 'Poppins-ExtraBold';
            default: return 'Poppins';
        }
    };

    return (
        <Text
            {...rest}
            style={[
                { fontFamily: getFontFamily() },
                style
            ]}
        />
    );
}
