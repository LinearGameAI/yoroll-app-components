import { View } from 'react-native';
import { TREAT_TEXT_GRADIENT, YButton, useTheme } from '@yoroll/app-components';

export default function ButtonGradient() {
  const { tokens } = useTheme();
  const gradient = {
    colors: TREAT_TEXT_GRADIENT,
    start: { x: 0, y: 0.5 },
    end: { x: 1, y: 0.5 },
  };
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
      <YButton label="渐变背景" backgroundGradient={gradient} textStyle={{ color: tokens.dark }} />
      <YButton label="渐变文字" variant="outline" labelGradient={gradient} />
    </View>
  );
}
