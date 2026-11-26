import { useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationBarMaterial, TREAT_TEXT_GRADIENT, YButton, motionTokens, useTheme } from '@yoroll/app-components';

export default function MaterialExample() {
  const { tokens } = useTheme();
  const range = motionTokens.navigationBackground.scrollDistance;
  const scrollY = useRef(new Animated.Value(range / 2)).current;
  return (
    <View style={{ width: '100%', maxWidth: 280, gap: 8 }}>
      <View style={{ height: 46, overflow: 'hidden', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
        <LinearGradient colors={TREAT_TEXT_GRADIENT} style={StyleSheet.absoluteFill} />
        <NavigationBarMaterial testID="navigation-material" scrollY={scrollY} />
        <Text style={{ color: tokens.textPrimary, backgroundColor: tokens.bgPrimary, paddingHorizontal: 6, borderRadius: 4 }}>导航栏</Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 4 }}>
        {[0, range / 2, range].map((offset) => (
          <YButton key={offset} label={`${offset} pt`} size="sm" variant="ghost" onPress={() => scrollY.setValue(offset)} />
        ))}
      </View>
    </View>
  );
}
