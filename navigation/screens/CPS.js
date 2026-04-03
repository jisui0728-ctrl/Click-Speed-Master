//[최종 백업일 : 2025/10/08 4:13:00 (pm)]

import React, { useState, useEffect, useRef } from 'react';
import { View, Switch, TextInput, TouchableOpacity, Text, StyleSheet, StatusBar, Alert, Dimensions, Animated , Vibration ,} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import History from './history';

// 데이터 저장 함수  //(11 ~ 29 코드 : Win,Lose,Draw,Play_1vs1,Play_Single 횟수 저장,불러오기 함수)
export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value.toString());
  } catch (error) {
    console.error('AsyncStorage 저장 오류:', error);
  }
};

// 데이터 불러오기 함수
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('AsyncStorage 불러오기 오류:', error);
    return 0;  // 오류 발생 시 기본값 반환
  }
};

const { width, height } = Dimensions.get('window'); //반응형 화면

// 비율 기반 크기 계산 함수
const wp = (percent) => (width * percent) / 100;   // width percent
const hp = (percent) => (height * percent) / 100; // height percent

// CPS_Main 컴포넌트
const CPS_Main = ({ navigation }) => {
  const [time, setTime] = useState('');
  const [highScore, setHighScore] = useState(0);

  const fetchHighScore = async () => {
    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore !== null) {
        setHighScore(parseFloat(storedHighScore));
      }
    } catch (error) {
      console.error('Failed to fetch high score:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchHighScore();
    }, [])
  );

  const handleTimeChange = (input) => {
    let sanitizedInput = input.replace(/[^0-9]/g, '');
    if (sanitizedInput.length >= 1 && sanitizedInput[0] === '0') {
      sanitizedInput = sanitizedInput.replace(/^0+/, '');
    }
    if (sanitizedInput.length > 3) {
      sanitizedInput = sanitizedInput.slice(0,3);
    }
    setTime(sanitizedInput);
  };

  const handlePlayPress = () => { //Single Play
    if (time === '') {
      Alert.alert('Invalid input', 'Not entered.');
      return;
    } else if (time > 120) {
        Alert.alert('Over input', 'Enter Time (1s ~ 120s)');
    } else {
        navigation.navigate('CPS_Game', { time });
        console.log("Success to input time! [Single Play]");
    }
  };

  const handlePlayVsAI = () => { //1vs1(Ai) Play
    if (time === '') {
      Alert.alert('Invalid input', 'Not entered.');
      return;
    } else if (time > 120) {
        Alert.alert('Over input', 'Enter Time (1s ~ 120s)');
    } else {
        navigation.navigate('CPS_GameVsAI', { time });
        console.log("Success to input time! [1vs1(Ai) Play]");
    }
  };

  const handlePlayVsMulti = () => { //Multi Play
    Alert.alert('Coming Soon!!!!', 'It will be released as a multi-version app!!');
  };
  
  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e1e2eff" />

      <View style={styles.logoContainer}>
        <Text style={styles.title}>CPS</Text>
        <Text style={styles.subtitle}>(Clicks Per Second)</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Time (1s ~ 120s)"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={time}
        onChangeText={handleTimeChange}
      />

      <View style={styles.buttonContainer}>
        <Text style={styles.highScore}>High Score Average CPS : {highScore.toFixed(2)}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.buttonPrimary} onPress={handlePlayPress}>
            <Text style={styles.buttonText}>Single Play 🗡️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.buttonSecondary} onPress={handlePlayVsAI}>
          <Text style={styles.buttonText}>1vs1(AI) Play 💻🗡️</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonWide} onPress={handlePlayVsMulti}>
            <Text style={styles.buttonText_multi}>Multi Play ⚔️ (Coming Soon..)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.historyButton} onPress={handleHistoryPress}>
          <Text style={styles.historyButtonText}>View Records 📜</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// CPS_Game 컴포넌트
const CPS_Game = ({ route, navigation }) => {
  const { time } = route.params;

  const [clickCount, setClickCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(parseInt(time, 10));
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [updatedHighScore, setUpdatedHighScore] = useState(0);
  const [currentCPS, setCurrentCPS] = useState('0.00');
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isVibration, setIsVibration] = useState(true);
  const [showClickPrompt, setShowClickPrompt] = useState(true);
  const [Play_number_Single, setPlay_number_Single] = useState(0);

  const clickTimes = useRef([]);

  const [time_Date, setTime_Date] = useState(new Date());  
  
  //시간 막대기 효과
  const ProgressBar = ({ progress }) => {
  return (
    <View style={styles2.progressBackground}>
      <View style={[styles2.progressFill, { width: `${progress}%` }]} />
    </View>
  ); bn                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
};
  useEffect(() => {
    const interval = setInterval(() => {
      setTime_Date(new Date());
    }, 1000); // 1초마다 시간 업데이트

    // 컴포넌트가 언마운트될 때 interval을 클리어하여 메모리 누수 방지
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadVibrationSetting = async () => {
      try {
        const value = await AsyncStorage.getItem('@vibration_setting');
        if (value !== null) {
          setIsVibration(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to load the vibration setting from storage');
      }
    };
    loadVibrationSetting();
  }, []);

  useEffect(() => {
    let countdownTimer;
    if (isCountdownActive && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
      setTimeout(() => {
        setGameStarted(true);
        console.log("Success to start Game! [Single Play]");
      }, 700); // 지연 시간 추가
    }

    return () => clearTimeout(countdownTimer);
  }, [isCountdownActive, countdown]);

  useEffect(() => {
    let timerId;
    if (gameStarted && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        updateCPS(); // 1초마다 CPS 업데이트
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setGameStarted(false);
      setShowResult(true);
      handleGameEnd();
    }

    return () => clearInterval(timerId);
  }, [gameStarted, timeLeft]);

  useEffect(() => { //Play_Single 횟수 실시간 업데이트 함수
    //Play_Count_Single
    const loadStoredPlay_Count_Single = async () => { 
      const storedPlay_Count_Single = await getData('Play_Count_Single');
      if (storedPlay_Count_Single !== null) {
        setPlay_number_Single(storedPlay_Count_Single);
      }
    };
    loadStoredPlay_Count_Single();
  }, []);
  
  const handleClick = () => {
    if (gameStarted) {
      setClickCount((prevCount) => prevCount + 1);
      setShowClickPrompt(false); // 첫 클릭 시 문구 사라지게 설정
      clickTimes.current.push(new Date().getTime());
      console.log(`Clicked!! [Single Play]`);
    }
  };

  const updateCPS = () => {
    const now = new Date().getTime();
    const oneSecondAgo = now - 1000;

    // 최근 1초 동안의 클릭 시간만 유지
    clickTimes.current = clickTimes.current.filter(time => time > oneSecondAgo);

    // 최근 1초 동안의 클릭 수를 CPS로 설정
    setCurrentCPS((clickTimes.current.length).toFixed(2)); // 소수점 2자리로 포맷
  };
  
  const handleGameEnd = async () => {
    const cps = (clickCount / parseInt(time, 10)).toFixed(2);

    setCurrentCPS(cps); // 현재 CPS 저장
    try { 
      const storedHighScore = await AsyncStorage.getItem('highScore');
      const highScoreValue = storedHighScore !== null ? parseFloat(storedHighScore) : 0;
  
      if (parseFloat(cps) > highScoreValue) {
        await AsyncStorage.setItem('highScore', cps.toString());
        setUpdatedHighScore(parseFloat(cps));
        setIsNewHighScore(true);
      } else {
        setUpdatedHighScore(highScoreValue);
        setIsNewHighScore(false);
      }
      
      try {
        const newPlay_number_Single = Play_number_Single + 1;
        setPlay_number_Single(newPlay_number_Single);
        await storeData('Play_Count_Single', newPlay_number_Single);
      } catch (error) {
        console.error('Failed to save Play_Count_Single:', error)
      }
      
      const record = {
        time,
        clickCount,
        cps: parseFloat(cps),
        type: 'Single Play',
        Date_time: formatTime(time_Date),
      };
      
      const storedRecords = await AsyncStorage.getItem('records');
      const records = storedRecords ? JSON.parse(storedRecords) : [];
      records.unshift(record); // 최신 기록을 맨 앞에 추가
      await AsyncStorage.setItem('records', JSON.stringify(records));
      
      console.log('Success to save high score and records! [Single Play]');
    } catch (error) {
      console.error('Failed to save high score or records [Single Play] :', error);
    }
  };

  const formatTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear()

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // 12시간 형식
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${month}/${day}/${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const handleStopPress = () => {
    setGameStarted(false);
    setShowResult(false);
    navigation.navigate('CPS_Main');
  };

  return (
    <TouchableOpacity
      style={styles2.container}
      onPress={handleClick}
      activeOpacity={1}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {!showResult && (
        <View style={styles2.topBar}>
          <TouchableOpacity onPress={handleStopPress}>
            <Text style={styles2.stopButton}>Stop 🚫</Text>
          </TouchableOpacity>
        </View>
      )}

      {isCountdownActive && (
        <Text style={styles2.counter}>
          {countdown > 0 ? countdown : "START!"}
        </Text>
      )}

      {!isCountdownActive && gameStarted && !showResult && (
        <View style={styles2.counterContainer}>
          <Text style={styles2.counter}>
            {timeLeft}s
          </Text>
          <ProgressBar progress={(timeLeft / time) * 100} />
          
          <Text style={styles2.counter_clicks}>* User (You) *</Text>
          {showClickPrompt && (
            <Text style={styles2.counter3}>Click Screen!! (You)</Text>
          )}
          {!showClickPrompt && (
            <>
              <Text style={styles2.counter_clicks}>Clicks : {clickCount}</Text>
              <Text style={styles2.counter_cps}>
                CPS (1s) : {currentCPS}
              </Text>
            </>
          )}
        </View>
      )}

      {/* 결과창 */}
      {showResult && (
        <View style={styles2.resultContainer}>
          <Text style={styles2.resultTitle}>Result</Text>
          <View style={styles2.resultBox}>
            <Text style={styles2.resultText}>
              Time: {time}s
            </Text>
            <Text></Text>
            <Text style={styles2.resultText_single}>* User (You) *</Text>
            <Text style={styles2.resultText_single}>
              Clicks: {clickCount}
            </Text>
            <Text style={styles2.resultText_single}>
              Average CPS : {currentCPS}
            </Text>
          </View>

          {/* 하이스코어 */}
          <Text
            style={[
              styles2.resultTextHighScore,
              {
                color: isNewHighScore ? "#f43f5e" : "#a5b4fc",
              },
            ]}
          >
            High Score Average CPS : {updatedHighScore.toFixed(2)}
          </Text>

          {/* 뒤로가기 */}
          <View style={styles2.topBar_goback}>
            <TouchableOpacity onPress={() => navigation.navigate("CPS_Main")}>
              <Text style={styles2.stopButton_goback}>← Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

// CPS_GameVsAI 컴포넌트
const CPS_GameVsAI = ({ route, navigation }) => {
  const { time } = route.params;

  const [userClickCount, setUserClickCount] = useState(0);
  const [aiClickCount, setAIClickCount] = useState(0);
  const [userCPS, setUserCPS] = useState('0.00'); // 사용자 CPS
  const [aiCPS, setAICPS] = useState('0.00'); // AI CPS
  const [timeLeft, setTimeLeft] = useState(parseInt(time, 10));
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownActive, setIsCountdownActive] = useState(false); //게임 시작 카운트 화면
  const [isaiClickSpeedChoiceWindowActive,setIsaiClickSpeedChoiceWindowActive] = useState(true);//ai 클릭 속도 선택창
  const [aiClickSpeed_min,setaiClickSpeed_min] = useState(null); //ai 클릭 속도 범위에서의 최솟값
  const [aiClickSpeed_Max,setaiClickSpeed_Max] = useState(null); //ai 클릭 속도 범위에서의 최댓값
  const [whatkindofaiClickSpeed,setIswhatkindofaiClickSpeed] = useState(null); //난이도 유형
  const [showResult, setShowResult] = useState(false);
  const [isVibration, setIsVibration] = useState(true);
  const [isNewHighScore, setIsNewHighScore] = useState(false); // 새 최고 기록 여부
  const [updatedHighScore, setUpdatedHighScore] = useState(0); // 업데이트된 최고 기록
  const [showClickPrompt, setShowClickPrompt] = useState(true);
  const [aiShowClickPrompt,setaiShowClickPrompt] = useState(true);
  const [AiUser_winorloseordraw,setAiUser_winorloseordraw] = useState(false);
  const [Win_number , setWin_number] = useState(0);
  const [Lose_number , setLose_number] = useState(0);
  const [Draw_number , setDraw_number] = useState(0);
  const [Play_number_1vs1 , setPlay_number_1vs1] = useState(0);
  
  const userClickTimes = useRef([]);
  const aiClickTimes = useRef([]);
  const aiClickInterval = useRef(null);

  const [time_Date, setTime_Date] = useState(new Date());

  const ProgressBar = ({ progress }) => {
  return (
    <View style={styles2.progressBackground}>
      <View style={[styles2.progressFill, { width: `${progress}%` }]} />
    </View>
  );
};

  useEffect(() => {
    const interval = setInterval(() => {
      setTime_Date(new Date());
    }, 1000); // 1초마다 시간 업데이트

    // 컴포넌트가 언마운트될 때 interval을 클리어하여 메모리 누수 방지
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const loadVibrationSetting = async () => {
      try {
        const value = await AsyncStorage.getItem('@vibration_setting');
        if (value !== null) {
          setIsVibration(JSON.parse(value));
        }
      } catch (e) {
        console.error('Failed to load the vibration setting from storage');
      }
    };
    loadVibrationSetting();
  }, []);

  useEffect(() => {
    let countdownTimer;
    if (isCountdownActive && countdown > 0) {
      countdownTimer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsCountdownActive(false);
      setTimeout(() => {
        setGameStarted(true);
        console.log("Success to start Game! [1vs1(Ai) Play]");
      }, 700); // 지연 시간 추가
    }

    return () => clearTimeout(countdownTimer);
  }, [isCountdownActive, countdown]);

  useEffect(() => {
    let timerId;
    if (gameStarted && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
        updateUserCPS(); // 1초마다 사용자 CPS 업데이트
        updateAICPS(); // 1초마다 AI CPS 업데이트
      }, 1000);
    } else if (timeLeft === 0 && gameStarted) {
      setAiUser_winorloseordraw(true);
      clearInterval(aiClickInterval.current); // AI 클릭 정지
      handleGameEnd(); // 게임 종료 처리(값 변동 방지를 위해 데이터 상수화)
      AiUserWinorLoseorDraw();
    }

    return () => clearInterval(timerId);
  }, [gameStarted, timeLeft]);

  useEffect(() => {
    if (gameStarted && !showResult) {
      aiClickInterval.current = setInterval(() => {
        setAIClickCount((prevCount) => prevCount + 1);
        setaiShowClickPrompt(false);
        aiClickTimes.current.push(new Date().getTime());
      }, Math.floor(Math.random() * (aiClickSpeed_Max - aiClickSpeed_min + 1)) + aiClickSpeed_min); // AI 클릭 간격을 조정합니다.
      //최댓값:aiClickSpeed_Max,최솟값:aiClickSpeed_min --> aiClickSpeed_min 에서 aiClickSpeed_Max 사이의 수를 정한다. 
      //수가 작아질수록 ai가 빨리 클릭한다. 

      return () => clearInterval(aiClickInterval.current);
    }
  }, [gameStarted, showResult]);

  useEffect(() => { //Win,Lose,Draw,Play_1vs1 횟수 실시간 업데이트 함수
    //Win_Count
    const loadStoredWin_Count = async () => { 
      const storedWin_Count = await getData('Win_Count');
      if (storedWin_Count !== null) {
        setWin_number(storedWin_Count);
      }
    };
    
    //Lose_Count
    const loadStoredLose_Count = async () => { 
      const storedLose_Count = await getData('Lose_Count');
      if (storedLose_Count !== null) {
        setLose_number(storedLose_Count);
      }
    };

    //Draw_Count
    const loadStoredDraw_Count = async () => { 
      const storedDraw_Count = await getData('Draw_Count');
      if (storedDraw_Count !== null) {
        setDraw_number(storedDraw_Count);
      }
    };

    //Play_Count_1vs1
    const loadStoredPlay_Count_1vs1 = async () => { 
      const storedPlay_Count_1vs1 = await getData('Play_Count_1vs1');
      if (storedPlay_Count_1vs1 !== null) {
        setPlay_number_1vs1(storedPlay_Count_1vs1);
      }
    };

    loadStoredWin_Count();
    loadStoredLose_Count();
    loadStoredDraw_Count();
    loadStoredPlay_Count_1vs1();
  }, []);

  useEffect(() => { //ai 클릭 속도 난이도 판별 업데이트 함수 
    const loadStoredkindofaiClickSpeed = async () => {
      const storedkindofaiClickSpeed = await getData('kindofaiClickSpeed');
      if (storedkindofaiClickSpeed !== null) {
        setIswhatkindofaiClickSpeed(storedkindofaiClickSpeed);
      }
    };

    loadStoredkindofaiClickSpeed();
  }, []);

  const aiClickSpeedChoice_Easy = async () => { //ai클릭 속도 선택 화면에서 클릭시(Easy) 
    console.log("Easy!");
    setIsaiClickSpeedChoiceWindowActive(false);
    setIsCountdownActive(true);
    
    //ai 클릭 속도 설정 [81 ~ 120]
    setaiClickSpeed_min(81); //1초에 12번 클릭 (12[c/s])
    setaiClickSpeed_Max(120); //1초에 8번 클릭 (8[c/s])
    setIswhatkindofaiClickSpeed('Easy');

    try {
      await storeData('kindofaiClickSpeed', whatkindofaiClickSpeed);
    } catch (error) {
      console.error('Failed to save kindofaiClickSpeed:', error)
    }
  }

  const aiClickSpeedChoice_Normal = async () => { //ai클릭 속도 선택 화면에서 클릭시(Normal) 
    console.log("Normal!");
    setIsaiClickSpeedChoiceWindowActive(false);
    setIsCountdownActive(true);

    //ai 클릭 속도 설정 [61 ~ 76]
    setaiClickSpeed_min(61); //1초에 16번 클릭 (16[c/s])
    setaiClickSpeed_Max(76); //1초에 13번 클릭 (13[c/s])
    setIswhatkindofaiClickSpeed('Normal');

    try {
      await storeData('kindofaiClickSpeed', whatkindofaiClickSpeed);
    } catch (error) {
      console.error('Failed to save kindofaiClickSpeed:', error)
    }
  }

  const aiClickSpeedChoice_Hard = async () => { //ai클릭 속도 선택 화면에서 클릭시(Hard) 
    console.log("Hard!");
    setIsaiClickSpeedChoiceWindowActive(false);
    setIsCountdownActive(true);

    //ai 클릭 속도 설정 [37 ~ 58]
    setaiClickSpeed_min(37); // 1초에 27번 클릭 (27[c/s])
    setaiClickSpeed_Max(58); // 1초에 17번 클릭 (17[c/s])
    setIswhatkindofaiClickSpeed('Hard');

    try {
      await storeData('kindofaiClickSpeed', whatkindofaiClickSpeed);
    } catch (error) {
      console.error('Failed to save kindofaiClickSpeed:', error)
    }
  }
  const handleClick = () => {
    if (gameStarted && !AiUser_winorloseordraw) {
      setUserClickCount((prevCount) => prevCount + 1);
      userClickTimes.current.push(new Date().getTime());
      setShowClickPrompt(false);
      console.log(`Clicked!! [1vs1(ai) Play]`);
    }
  };

  const updateUserCPS = () => {
    const now = new Date().getTime();
    const oneSecondAgo = now - 1000;

    userClickTimes.current = userClickTimes.current.filter(time => time > oneSecondAgo);

    setUserCPS((userClickTimes.current.length).toFixed(2));
  };
  
  const updateAICPS = () => {
    const now = new Date().getTime();
    const oneSecondAgo = now - 1000;

    aiClickTimes.current = aiClickTimes.current.filter(time => time > oneSecondAgo);

    setAICPS((aiClickTimes.current.length).toFixed(2));
  };
  
  const handleGameEnd = async () => {
    const userCPS = parseFloat((userClickCount / time)).toFixed(2);
    const aiCPS = parseFloat((aiClickCount / time)).toFixed(2);

    try {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      const highScoreValue = storedHighScore !== null ? parseFloat(storedHighScore) : 0;

      if (((parseFloat(userCPS)).toFixed(2)) > highScoreValue) {
        await AsyncStorage.setItem('highScore', userCPS.toString());
        setUpdatedHighScore(parseFloat(userCPS));
        setIsNewHighScore(true);
      } else {
        setUpdatedHighScore(highScoreValue);
        setIsNewHighScore(false);
      }
      
      console.log('Success to save high score and records! [1vs1(Ai) Play]');
    } catch (error) {
      console.error('Failed to save high score or records [1vs1(Ai) Play] :', error);
    }
    
    try {
      if (userClickCount > aiClickCount) {
        const newWin_number = Win_number + 1;
        setWin_number(newWin_number);
        
        await storeData('Win_Count', newWin_number);
      
      } else if (userClickCount < aiClickCount) {
        const newLose_number = Lose_number + 1;
        setLose_number(newLose_number);
        
        await storeData('Lose_Count', newLose_number); 
        
      } else {
        const newDraw_number = Draw_number + 1;
        setDraw_number(newDraw_number);
        
        await storeData('Draw_Count', newDraw_number);
      }
    } catch (error) {
      console.error('Failed to save Win_Count or Lose_Count or Draw_Count:', error)
    }

    try {
      const newPlay_number_1vs1 = Play_number_1vs1 + 1;
      setPlay_number_1vs1(newPlay_number_1vs1);
      
      await storeData('Play_Count_1vs1', newPlay_number_1vs1);
    
    } catch (error) {
      console.error('Failed to save Play_Count_1vs1:', error)
    }
    
    const record = {
      user: {
        time: time,
        clickCount: userClickCount,
        cps: parseFloat(userCPS),
      },
      ai: {
        time: time,
        clickCount: aiClickCount,
        cps: parseFloat(aiCPS),
      },
      type: 'VS AI',
      Date_time: formatTime(time_Date),
      KindofClickSpeed: whatkindofaiClickSpeed,
    };
     
    const storedRecordsVsAI = await AsyncStorage.getItem('records_vsAI');
    const recordsVsAI = storedRecordsVsAI ? JSON.parse(storedRecordsVsAI) : [];
    
    recordsVsAI.unshift(record); // 최신 기록을 맨 앞에 추가
    
    await AsyncStorage.setItem('records_vsAI', JSON.stringify(recordsVsAI));
  
  };
  const WinORLoseORDraw_Title = () => { //user
    if (userClickCount > aiClickCount) {
      return '-- Win !';
    } else if (userClickCount === aiClickCount) {
      return '-- Draw !';
    } else {
      return '-- Lose !';
    }
  };

  const WinORLoseORDraw_Title_ai = () => { //ai
    if (userClickCount < aiClickCount) {
      return '-- Win !';
    } else if (userClickCount === aiClickCount) {
      return '-- Draw !';
    } else {
      return '-- Lose !';
    }
  };
  
  const WinORLoseORDraw_Color = () => { //user
    if (userClickCount > aiClickCount) {
      return 'green';
    } else if (userClickCount === aiClickCount) {
      return '#A52A2A';
    } else {
      return 'red';
    }
  };

  const WinORLoseORDraw_Color_ai = () => { //ai
    if (userClickCount < aiClickCount) {
      return 'green';
    } else if (userClickCount === aiClickCount) {
      return '#A52A2A';
    } else {
      return 'red';
    }
  };

  const AiUserWinorLoseorDraw = () => {
    setTimeout(() => {
      setAiUser_winorloseordraw(false);
      setGameStarted(false);
      setShowResult(true);
    }, 2000);
  }

  const EasyORNormalORHard_Color = () => {
    if (whatkindofaiClickSpeed == "Easy") {
      return 'green';
    } else if (whatkindofaiClickSpeed == "Normal") {
      return '#f1c40f';
    } else {
      return 'red';
    }
  }

  const formatTime = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // 12시간 형식
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${month}/${day}/${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const handleStopPress = () => {
    setGameStarted(false);
    setShowResult(false);
    navigation.navigate('CPS_Main');
  };

  return (
    <TouchableOpacity style={styles3.container} onPress={handleClick} activeOpacity={1}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      {/* 상단 Stop 버튼 */}
      {!showResult && !isaiClickSpeedChoiceWindowActive && (
        <View style={styles2.topBar}>
          <TouchableOpacity onPress={handleStopPress}>
            <Text style={styles2.stopButton}>Stop 🚫</Text>
          </TouchableOpacity>
        </View>
      )}
      {isaiClickSpeedChoiceWindowActive && (
        <>
        <View style={styles3.container_aiClickSpeedChoiceWindow}>
          <Text style={styles3.logoText_aiClickSpeedChoiceWindow}>-- Difficulty --</Text>
          <TouchableOpacity onPress={aiClickSpeedChoice_Hard} style={[styles3.button_aiClickSpeedChoiceWindow, styles3.hard, { width: width * 0.8, paddingVertical: height * 0.02 }]}>
            <Text style={styles3.buttonText_aiClickSpeedChoiceWindow}>Hard [ Ai CPS (1s): 17 ~ 27 ]</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={aiClickSpeedChoice_Normal} style={[styles3.button_aiClickSpeedChoiceWindow, styles3.normal, { width: width * 0.8, paddingVertical: height * 0.02 }]}>
            <Text style={styles3.buttonText_aiClickSpeedChoiceWindow}>Normal [ Ai CPS (1s): 13 ~ 16 ]</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={aiClickSpeedChoice_Easy} style={[styles3.button_aiClickSpeedChoiceWindow, styles3.easy, { width: width * 0.8, paddingVertical: height * 0.02 }]}>
            <Text style={styles3.buttonText_aiClickSpeedChoiceWindow}>Easy [ Ai CPS (1s): 8 ~ 12 ]</Text>
          </TouchableOpacity>
        </View>
        </>
      )}
      {isCountdownActive && (
        <Text style={styles3.counter}>{countdown > 0 ? countdown : 'START!'}</Text>
      )}
      {!isCountdownActive && gameStarted && !showResult && (
        <View style={styles3.counterContainer}>
          <View style={styles3.topSection}>
            <Text style={styles3.counter_3}>* Ai (Enemy) *</Text>
            {aiShowClickPrompt && !AiUser_winorloseordraw &&<Text style={styles2.counter3}>Not click (Enemy)</Text>}
            {!aiShowClickPrompt && !AiUser_winorloseordraw && (
              <>
                <Text style={styles3.counter_3}>Ai Clicks : {aiClickCount}</Text>
                <Text style={styles3.counter_cps_2}>Ai CPS (1s) : {aiCPS}</Text>
              </>
            )}
            {AiUser_winorloseordraw && (
              <Text style={[styles3.counter_AiUserwinorloseordraw,
              {
                color : WinORLoseORDraw_Color_ai(), 
              }
              ]}>{WinORLoseORDraw_Title_ai()}</Text>
              
            )}
          </View>
          {!AiUser_winorloseordraw && (
            <>
              <Text style={styles3.counter}>{timeLeft}s</Text>
              <ProgressBar progress={(timeLeft / time) * 100} />
            </>   
          )}
          {AiUser_winorloseordraw && <Text style={styles3.counter}>Game Over!!</Text>}
          <View style={styles3.bottomSection}>
            <Text style={styles3.counter_2}>* User (You) *</Text>
            {showClickPrompt && !AiUser_winorloseordraw && <Text style={styles2.counter3}>Click Screen!! (You)</Text>}
            {!showClickPrompt && !AiUser_winorloseordraw && (
              <>
                <Text style={styles3.counter_2}>Your Clicks : {userClickCount}</Text>
                <Text style={styles3.counter_cps_1}>Your CPS (1s) : {userCPS}</Text>
              </>
            )}
            {AiUser_winorloseordraw && (
              <Text style={[styles3.counter_AiUserwinorloseordraw,
              {
                color : WinORLoseORDraw_Color(), 
              }
              ]}>{WinORLoseORDraw_Title()}</Text>
              
            )}
          </View>
        </View>
      )}
      {showResult && !AiUser_winorloseordraw && (
  <View style={styles3.resultContainer}>
    <Text style={styles3.resultTitle}>Result</Text>

    <View style={styles3.resultBox}>
      {/* Time & Difficulty */}
      <View style={{ alignItems: 'center', marginBottom: hp(2) }}>
        <Text style={styles3.resultText}>Time: {time}s</Text>
        <Text style={[styles3.resultText_Difficulty, { color: EasyORNormalORHard_Color() }]}>
          Difficulty: {whatkindofaiClickSpeed}
        </Text>
      </View>

      {/* Ai Stats */}
      <View style={{ alignItems: 'center', marginBottom: hp(2) }}>
        <Text style={styles3.resultText_2}>* Ai (Enemy) *</Text>
        <Text style={styles3.resultText_2}>Ai Clicks: {aiClickCount}</Text>
        <Text style={styles3.resultText_2}>Ai Average CPS: {(aiClickCount / time).toFixed(2)}</Text>
        <Text style={[styles3.resultText_2, { color: WinORLoseORDraw_Color_ai() }]}>
          {WinORLoseORDraw_Title_ai()}
        </Text>
      </View>

      {/* User Stats */}
      <View style={{ alignItems: 'center', marginBottom: hp(2) }}>
        <Text style={styles3.resultText_1}>* User (You) *</Text>
        <Text style={styles3.resultText_1}>Your Clicks: {userClickCount}</Text>
        <Text style={styles3.resultText_1}>Your Average CPS: {(userClickCount / time).toFixed(2)}</Text>
        <Text style={[styles3.resultText_2, { color: WinORLoseORDraw_Color() }]}>
          {WinORLoseORDraw_Title()}
        </Text>
      </View>

      {/* High Score */}
      <Text style={[styles3.resultTextHighScore, { color: isNewHighScore ? '#f43f5e' : '#a5b4fc' }]}>
        High Score Average CPS: {updatedHighScore.toFixed(2)}
      </Text>
    </View>

    {/* Go Back Button */}
    <TouchableOpacity
      onPress={() => navigation.navigate('CPS_Main')}
    >
      <Text style={styles3.goBackButtonText}>← Go Back</Text>
    </TouchableOpacity>
    </View>
  )}
  </TouchableOpacity>
  );
};

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CPS_Main" component={CPS_Main} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="CPS_Game" component={CPS_Game} />
        <Stack.Screen name="CPS_GameVsAI" component={CPS_GameVsAI}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#1e1e2eff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp(3), // ✅ 살짝 줄임
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp(4),
  },
  title: {
    fontSize: wp(9),
    fontWeight: '800',
    color: '#00d8ff', // 포인트 블루
    textShadowColor: '#00d8ff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: wp(0.7),
  },
  subtitle: {
    fontSize: wp(4),
    color: '#ffffffb0',
    marginTop: hp(1),
  },
  input: {
    width: wp(80),
    height: hp(6),
    backgroundColor: '#1a1a1aff',
    borderRadius: wp(2),
    paddingHorizontal: wp(4),
    fontSize: wp(4),
    color: '#ffffff',
    marginBottom: hp(2.5),
    borderWidth: 1,
    borderColor: '#333333',
    shadowColor: '#333333',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  highScore: {
    fontSize: wp(4),
    color: '#ff4b5c',
    textShadowColor: '#ff0000dc',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: hp(2),
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(80),
    marginBottom: hp(1.5),
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#16a085',  
    paddingVertical: hp(2),
    marginHorizontal: wp(1),
    borderRadius: wp(2.5),
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#9ab929ff',
    paddingVertical: hp(2),
    marginHorizontal: wp(1),
    borderRadius: wp(2.5),
    alignItems: 'center',
    shadowColor: '#06b6d4',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonWide: {
    width: wp(80),
    backgroundColor: '#8644adff', // 보라 계열 (AI Play 강조)
    paddingVertical: hp(2),
    borderRadius: wp(2.5),
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: '#06b6d4',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  buttonText: {
    fontSize: wp(4),
    color: '#ffffff',
    fontWeight: '600',
  },
  buttonText_multi: {
    fontSize: wp(4),
    color: '#cccccc',
    fontWeight: '600',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  historyButton: {
    width: wp(80),
    paddingVertical: hp(1.8),
    borderRadius: wp(2),
    alignItems: 'center',
    backgroundColor: '#333333',
    shadowColor: '#333333',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
  },
  historyButtonText: {
    fontSize: wp(3.5),
    color: '#cccccc',
  },
});

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  topBar: {
    position: "absolute",
    top: hp(4),
    right: wp(5),
  },
  stopButton: {
    fontSize: wp(4.5),
    top: hp(2.5),
    color: "#f43f5e",
    fontWeight: "bold",
  },
  counterContainer: {
    alignItems: "center",
    gap: hp(1.5),
  },
  counter: {
    fontSize: wp(10),
    fontWeight: "bold",
    color: '#fff',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter_clicks: {
    fontSize: wp(7),
    color: "#a5b4fc",
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    fontWeight: "600",
  },
  counter_cps: {
    fontSize: wp(5.5),
    color: "#38bdf8",
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    fontWeight: "600",
  },
  counter3: {
    fontSize: wp(7),
    fontWeight: "bold",
    color: "#ff4b5c",
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  comboText: {
    fontSize: wp(6),
    fontWeight: "bold",
    color: "#f97316",
    marginTop: hp(1),
  },
  resultContainer: {
    alignItems: "center",
    backgroundColor: "#1e293b",
    padding: wp(5),
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  resultTitle: {
    fontSize: wp(8),
    fontWeight: "bold",
    color: "#a5b4fc",
    marginBottom: hp(2),
  },
  resultBox: {
    backgroundColor: "#0f172a",
    padding: wp(4),
    borderRadius: 10,
    marginBottom: hp(2),
    width: wp(80),
  },
  resultText: {
    fontSize: wp(4.5),
    color: "#e5e7eb",
  },
  resultText_single: {
    fontSize: wp(5),
    color: "#38bdf8",
    marginVertical: hp(0.5),
  },
  resultTextHighScore: {
    fontSize: wp(5),
    fontWeight: "bold",
    marginTop: hp(1),
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  topBar_goback: {
    marginTop: hp(3),
  },
  stopButton_goback: {
    fontSize: wp(5),
    color: "#3b82f6",
    fontWeight: "bold",
  },
  // 진행률 바
  progressBackground: {
    width: wp(80),
    height: hp(1.2),
    backgroundColor: "#1e293b",
    borderRadius: 5,
    overflow: "hidden",
    marginVertical: hp(1),
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
});

const styles3 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    width: '100%',
    height: '100%',
    padding: wp(2),
  },
  topBar: {
    position: 'absolute',
    top: hp(4),
    left: wp(5),
    zIndex: 1,
  },
  topBar_goback: {
    position: 'absolute',
    top: hp(4),
    left: wp(1),
    zIndex: 1,
  },
  stopButton: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: '#f43f5e',
  },
  stopButton_goback: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  counterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: hp(1.5),
    marginTop: hp(2),
  },
  counter: {
    fontSize: wp(10),
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter_2: {
    fontSize: wp(9),
    fontWeight: '600',
    color: '#a5b4fc',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter_3: {
    fontSize: wp(9),
    fontWeight: 'bold',
    color: '#ff4b5c',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter_cps_1: {
    fontSize: wp(7.5),
    fontWeight: '600',
    color: '#38bdf8',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter_cps_2: {
    fontSize: wp(7.5),
    fontWeight: '600',
    color: '#ff5050',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  counter3: {
    fontSize: wp(9),
    fontWeight: 'bold',
    color: '#ff4b5c',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  comboText: {
    fontSize: wp(6),
    fontWeight: 'bold',
    color: '#f97316',
    marginTop: hp(1),
  },
  resultContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
    padding: wp(5),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  resultTitle: {
    fontSize: wp(8),
    fontWeight: 'bold',
    color: '#a5b4fc',
    marginBottom: hp(2),
  },
  resultBox: {
    width: wp(80),
    backgroundColor: '#0f172a',
    borderRadius: 10,
    padding: wp(4),
    marginBottom: hp(2),
  },
  resultText: {
    fontSize: wp(4.5),
    color: '#e5e7eb',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  resultText_1: {
    fontSize: wp(4.5),
    color: '#66ccff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  resultText_2: {
    fontSize: wp(4.5),
    color: '#ff3333',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  resultText_Difficulty: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(1),
  },
  resultTextHighScore: {
    fontSize: wp(5),
    fontWeight: 'bold',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginTop: hp(1),
  },
  container_aiClickSpeedChoiceWindow: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText_aiClickSpeedChoiceWindow: {
    fontSize: wp(8.8),
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginVertical: hp(3),
  },
  button_aiClickSpeedChoiceWindow: {
    borderRadius: 8,
    marginVertical: hp(1),
    alignItems: 'center',
    width: wp(80),
    paddingVertical: hp(2),
  },
  buttonText_aiClickSpeedChoiceWindow: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: 'white',
  },
  counter_AiUserwinorloseordraw: {
    fontSize: wp(7),
    fontWeight: '600'
  },
  goBackButtonText: {
    fontSize: wp(5),
    color: "#3b82f6",
    fontWeight: "bold"
  },
  easy: {
    backgroundColor: 'green',
  },
  normal: {
    backgroundColor: '#f1c40f',
  },
  hard: {
    backgroundColor: 'red',
  },
  progressBackground: {
    width: wp(80),
    height: hp(1.2),
    backgroundColor: '#1e293b',
    borderRadius: 5,
    overflow: 'hidden',
    marginVertical: hp(1),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
});


export default App;