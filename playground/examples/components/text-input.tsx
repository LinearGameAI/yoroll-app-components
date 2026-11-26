import { YTextInput } from '@yoroll/app-components';

export default function EmailInput() {
  return (
    <YTextInput
      style={{ width: '100%', maxWidth: 280 }}
      accessibilityLabel="邮箱"
      placeholder="输入邮箱"
      keyboardType="email-address"
      autoCapitalize="none"
      hint="用于接收通知"
    />
  );
}
