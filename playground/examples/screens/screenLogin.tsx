import { useContext } from 'react';
import { IconEmail, IconGoogleLogoFilled } from '@yoroll/rn-icon';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { YButton, darkTokens, loginBackdropStyles, loginFormStyles, useTheme } from '@yoroll/app-components';
import { sectionContext, useScreenArtwork } from './sectionContext';

const covers = [
  ['ellis-kaminski.jpg', 'beckett-hale-v9.jpg', 'corbin-rennick.jpg'],
  ['caio-barreto.jpg', 'caio-nunes.jpg', 'wystan-grimwade.jpg'],
  ['tilda-lowndes.jpg', 'silas-vandermeer.jpg', 'camillo-cortese.jpg'],
];

export function LoginBackdrop() {
  const { artworkBase } = useContext(sectionContext);
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: darkTokens.bgPrimary }]}>
    <View style={loginBackdropStyles.tilt}>
      <View style={loginBackdropStyles.row}>
        {covers.map((column, index) => <View key={index} style={index % 2 === 1 && { marginTop: -152.5 }}>
          {column.map((name) => <View key={name} style={loginBackdropStyles.coverWrap}>
            <Image source={artworkBase + 'login-covers/overseas/' + name} contentFit="cover" contentPosition="top"
              style={[StyleSheet.absoluteFill, loginBackdropStyles.coverImg]} />
          </View>)}
        </View>)}
      </View>
    </View>
    <LinearGradient colors={['rgba(255,140,86,0.24)', 'rgba(238,93,155,0.16)', 'rgba(145,91,222,0.08)', 'rgba(145,91,222,0)']}
      locations={[0, 0.12, 0.26, 0.46]} style={StyleSheet.absoluteFill} />
    <LinearGradient colors={['rgba(11,11,13,0)', 'rgba(11,11,13,0)', 'rgba(11,11,13,0.30)', 'rgba(11,11,13,0.78)', 'rgba(11,11,13,0.98)', '#0B0B0D']}
      locations={[0, 0.32, 0.48, 0.64, 0.82, 1]} style={StyleSheet.absoluteFill} />
  </View>;
}

export function LoginMethods() {
  const { announce } = useContext(sectionContext);
  const art = useScreenArtwork();
  const { fonts } = useTheme();
  return <View style={loginFormStyles.bottomGroup}>
    <View style={loginFormStyles.welcomeHeader}>
      <Text style={[loginFormStyles.welcomeText, { fontFamily: fonts.disp }]}>欢迎来到</Text>
      <Image source={art('logo')} contentFit="contain" accessibilityLabel="Yoroll" style={loginFormStyles.logo} />
    </View>
    <View style={loginFormStyles.primaryMethods}>
      <YButton size="xl" fullWidth label="使用 Google 继续" leftIcon={<IconGoogleLogoFilled size={18} />}
        onPress={() => announce('Google 登录')} style={loginFormStyles.methodBtn} textStyle={loginFormStyles.methodBtnText} />
      <YButton size="xl" fullWidth label="使用 Apple 继续" onPress={() => announce('Apple 登录')}
        style={loginFormStyles.methodBtn} textStyle={loginFormStyles.methodBtnText} />
    </View>
    <YButton size="xl" variant="ghost" fullWidth label="使用邮箱登录" leftIcon={<IconEmail size={18} color={loginFormStyles.emailBtnText.color} />}
      onPress={() => announce('邮箱登录')} style={[loginFormStyles.methodBtn, loginFormStyles.emailBtn]}
      textStyle={[loginFormStyles.methodBtnText, loginFormStyles.emailBtnText]} />
    <Text style={[loginFormStyles.legal, { color: darkTokens.textTertiary }]}>
      登录即代表同意 <Text style={[loginFormStyles.legalLink, { color: darkTokens.textPrimary }]}>服务条款</Text> 和{' '}
      <Text style={[loginFormStyles.legalLink, { color: darkTokens.textPrimary }]}>隐私政策</Text>
    </Text>
  </View>;
}
