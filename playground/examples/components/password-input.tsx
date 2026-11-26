import { YTextInput } from '@yoroll/app-components';

export default function PasswordInput() {
  return (
    <YTextInput
      style={{ width: '100%', maxWidth: 280 }}
      accessibilityLabel="密码"
      placeholder="输入密码"
      defaultValue="yoroll"
      password
      showPasswordLabel="显示密码"
      hidePasswordLabel="隐藏密码"
      error="请输入至少 8 个字符"
    />
  );
}
