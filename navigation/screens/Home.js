import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const { width, height } = Dimensions.get('window'); //반응형 화면

// 비율 기반 크기 계산 함수
const wp = (percent) => (width * percent) / 100;   // width percent
const hp = (percent) => (height * percent) / 100; // height percent


const Home = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    changeNavigationBarColor('#000000'); // 네비게이션 바 색상 변경
  }, []);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    changeNavigationBarColor('#0f172a', false);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} backgroundColor={'#0f172a'} />

      {/* 타이틀 */}
      <Animated.View
        style={[
          styles.titleContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.title}>
          <Text style={styles.textHighlight1}>Click{'\n'}</Text>
          <Text style={styles.textHighlight2}>Speed{'\n'}</Text>
          <Text style={styles.textHighlight3}>Master</Text>
        </Text>
      </Animated.View>

      {/* 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.playButton}
          onPress={() => navigation.navigate('CPS')}
        >
          <Text style={styles.buttonText}>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ✅ 반응형 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('6'),
  },
  titleContainer: {
    marginBottom: hp('4.5'),
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: '900',
    textAlign: 'left',
    fontSize: wp('18.5'), // 화면 너비의 15%
    lineHeight: hp('9.8'),
    letterSpacing: wp('0.7'),
    paddingLeft: wp(3),
  },
  textHighlight1: {
    color: '#22d3ee',
    textShadowColor: '#22d3ee',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  textHighlight2: {
    color: '#38bdf8',
    textShadowColor: '#38bdf8',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  textHighlight3: {
    color: '#a5f3fc',
    textShadowColor: '#a5f3fc',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  buttonContainer: {
    width: wp('80'),
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#16a085',
    width: '100%',
    paddingVertical: hp('2'),
    borderRadius: wp('4'),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: wp('6.5'),
    fontWeight: '700',
    letterSpacing: wp('0.4'),
  },
});

export default Home;