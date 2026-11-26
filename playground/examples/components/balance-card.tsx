import { Image } from 'expo-image';
import { YBalanceCard } from '@yoroll/app-components';

export default function Example() {
  return (
    <YBalanceCard title="Treats 余额" amount="1,280" detail="可用于聊天和互动内容。"
      artwork={<Image source="./artwork/originals/assets/membership/treat-packs/treat-single-v1.webp" contentFit="contain" style={{ width: '100%', height: '100%' }} />} />
  );
}
