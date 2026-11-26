import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CarouselIndicatorDot, darkTokens } from '@yoroll/app-components';

export default function CarouselExample() {
  const [active, setActive] = useState(0);
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row', gap: 6, padding: 7, borderRadius: 10, backgroundColor: darkTokens.bgCard }}>
      {[0, 1, 2].map((index) => (
        <Pressable key={index} accessibilityRole="tab" accessibilityLabel={`预览第 ${index + 1} 页`}
          aria-selected={active === index} accessibilityState={{ selected: active === index }}
          onPress={() => setActive(index)} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <CarouselIndicatorDot active={active === index} />
        </Pressable>
      ))}
    </View>
  );
}
