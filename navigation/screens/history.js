//[최종 백업일 : 2025/10/08 4:13:00 (pm)]

import React, { useState, useEffect } from 'react';
import { View, Text,StyleSheet, ScrollView, Dimensions, TouchableOpacity,StatusBar, Alert ,Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { unix } from 'moment-timezone';

const { width, height } = Dimensions.get('window');

// 비율 기반 크기 계산 함수
const wp = (percent) => (width * percent) / 100;   // width percent
const hp = (percent) => (height * percent) / 100; // height percent

const History = () => {
  const [records, setRecords] = useState([]);
  const [recordsVsAI, setRecordsVsAI] = useState([]);
  const [highScore, setHighScore] = useState(null);
  const [filter, setFilter] = useState('single'); // Default to 'single' filter
  const [win_count , setwin_count] = useState(null);
  const [lose_count , setlose_count] = useState(null);
  const [draw_count , setdraw_count] = useState(null);
  const [play_count_1vs1 , setplay_count_1vs1] = useState(null);
  const [play_Count_Single , setplay_count_Single] = useState(null);
  const [kocs,setkocs] = useState(null); //ai 클릭 속도 난이도 (kocs: kind of click speed)
  
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const storedRecords = await AsyncStorage.getItem('records');
        if (storedRecords !== null) {
          setRecords(JSON.parse(storedRecords));
        }
      } catch (error) {
        console.error('Failed to fetch records:', error);
      }
    };

    const fetchRecordsVsAI = async () => {
      try {
        const storedRecordsVsAI = await AsyncStorage.getItem('records_vsAI');
        if (storedRecordsVsAI !== null) {
          setRecordsVsAI(JSON.parse(storedRecordsVsAI));
        }
      } catch (error) {
        console.error('Failed to fetch records vs AI:', error);
      }
    };

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

    const fetchFilter = async () => {
      try {
        const storedFilter = await AsyncStorage.getItem('filter');
        if (storedFilter !== null) {
          setFilter(storedFilter);
        }
      } catch (error) {
        console.error('Failed to fetch filter:', error);
      }
    };

    const fetchWin_Count = async () => {
      try {
        const storedWin_Count = await AsyncStorage.getItem('Win_Count');
        if (storedWin_Count !== null) {
          setwin_count(storedWin_Count);
        } else {
          setwin_count(0);
        }
      } catch (error) {
        console.error('Failed to fetch Win_Count:', error);
      }
    }

    const fetchLose_Count = async () => {
      try {
        const storedLose_Count = await AsyncStorage.getItem('Lose_Count');
        if (storedLose_Count !== null) {
          setlose_count(storedLose_Count);
        } else {
          setlose_count(0);
        }
      } catch (error) {
        console.error('Failed to fetch Lose_Count:', error);
      }
    }

    const fetchDraw_Count = async () => {
      try {
        const storedDraw_Count = await AsyncStorage.getItem('Draw_Count');
        if (storedDraw_Count !== null) {
          setdraw_count(storedDraw_Count);
        } else {
          setdraw_count(0);
        }
      } catch (error) {
        console.error('Failed to fetch Draw_Count:', error);
      }
    }
    
    const fetchPlay_Count_1vs1 = async () => {
      try {
        const storedPlay_Count_1vs1 = await AsyncStorage.getItem('Play_Count_1vs1');
        if (storedPlay_Count_1vs1 !== null) {
          setplay_count_1vs1(storedPlay_Count_1vs1);
        } else {
          setplay_count_1vs1(0);
        }
      } catch (error) {
        console.error('Failed to fetch Play_Count_1vs1:', error);
      }
    }

    const fetchPlay_Count_Single = async () => {
      try {
        const storedPlay_Count_Single = await AsyncStorage.getItem('Play_Count_Single');
        if (storedPlay_Count_Single !== null) {
          setplay_count_Single(storedPlay_Count_Single);
        } else {
          setplay_count_Single(0);
        }
      } catch (error) {
        console.error('Failed to fetch Play_Count_1vs1:', error);
      }
    }

    fetchRecords();
    fetchRecordsVsAI();
    fetchHighScore();
    fetchFilter();
    fetchWin_Count();
    fetchLose_Count(); 
    fetchDraw_Count();
    fetchPlay_Count_1vs1();
    fetchPlay_Count_Single();
  }, []);

  useEffect(() => {
    const fetchKindofClickSpeed = async () => {
      try {
        const storedKindofClickSpeed = await AsyncStorage.getItem('kindofaiClickSpeed');
        if (storedKindofClickSpeed !== null) {
          setkocs(storedKindofClickSpeed);
        } else {
          setkocs(null);
        }
      } catch (error) {
        console.error('Failed to fetch KindofClickSpeed:', error);
      }
    };

    fetchKindofClickSpeed();
  }, [])

  const saveFilter = async (newFilter) => {
    try {
      await AsyncStorage.setItem('filter', newFilter);
    } catch (error) {
      console.error('Failed to save filter:', error);
    }
  };

  //Delete 버튼
  const confirmDelete = (index, type) => {
    if (type == 'single') {
      Alert.alert(
        'Delete Record',
        'Are you sure you want to delete this Single Play record?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => deleteRecord(index, type) },
        ],
        { cancelable: true }
      );
    } else {
        Alert.alert(
          'Delete Record',
          'Are you sure you want to delete this 1vs1(Ai) Play record?',
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => deleteRecord(index, type) },
          ],
          { cancelable: true }
        );
    }
  };
  
  //all delete 버튼
  const allconfirmDelete = (type) => {
    if (type == 'single') {
      if (records.length != 0) {
        Alert.alert(
          `Delete all Single Play Record`,
          `Are you sure you want to delete all Single Play record?`,
          [
            { text: 'No', style: 'cancel' },
            { text: 'Yes', onPress: () => alldeleteRecord(type) },
          ],
          { cancelable: true }
        );
      } else {
        Alert.alert('No Single Play records found','Single Play records has already been deleted or not.')
      }
    } else {
        if (recordsVsAI.length != 0) {
          Alert.alert(
            `Delete all 1vs1(Ai) Play Record`,
            `Are you sure you want to delete all 1vs1(Ai) Play record?`,
            [
              { text: 'No', style: 'cancel' },
              { text: 'Yes', onPress: () => alldeleteRecord(type) },
            ],
            { cancelable: true }
          );
        } else {
          Alert.alert('No 1vs1(Ai) Play records found','1vs1(Ai) Play records has already been deleted or not.')
        }
        
    }
  };
  
  const deleteRecord = async (index, type) => {
    try {
      if (type === 'single') {
        const updatedRecords = [...records];
        
        updatedRecords.splice(index, 1);
        setRecords(updatedRecords);
        
        await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
      } else if (type === 'vsAI') {
          const updatedRecordsVsAI = [...recordsVsAI];
          
          updatedRecordsVsAI.splice(index, 1);
          setRecordsVsAI(updatedRecordsVsAI);
          
          
          await AsyncStorage.setItem('records_vsAI', JSON.stringify(updatedRecordsVsAI));
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
    
  };
  
  const alldeleteRecord = async (type) => {
    try {
      if (type === 'single') {
        const updatedRecords = [...records];
        
        updatedRecords.splice(0,updatedRecords.length);
        setRecords(updatedRecords);
        
        await AsyncStorage.setItem('records', JSON.stringify(updatedRecords));
      } else if (type === 'vsAI') {
          const updatedRecordsVsAI = [...recordsVsAI];
          
          updatedRecordsVsAI.splice(0,updatedRecordsVsAI.length);
          setRecordsVsAI(updatedRecordsVsAI);
          
          await AsyncStorage.setItem('records_vsAI', JSON.stringify(updatedRecordsVsAI));
      }   
    } catch (error) {
      console.error('Failed to All delete record:', error);
    }
    
  };
  
  const getFilteredRecords = () => {
    let filteredRecords = [];
    if (filter === 'single') {
      filteredRecords = [...records];
    } else if (filter === 'vsAI') {
      filteredRecords = [...recordsVsAI];
    } else {
      filteredRecords = [...records, ...recordsVsAI];
    }
    return filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  };
  
  const getResultText = (userClicks, aiClicks) => {
    if (userClicks > aiClicks) {
      return <Text style={styles.resultTextWin}>-- Result : Win !</Text>;
    } else if (userClicks === aiClicks) {
      return <Text style={styles.resultTextDraw}>-- Result : Draw !</Text>;
    } else {
      return <Text style={styles.resultTextLose}>-- Result : Lose !</Text>;
    }
  };

  const getResultText_ai = (userClicks, aiClicks) => {
    if (userClicks < aiClicks) {
      return <Text style={styles.resultTextWin}>-- Result : Win !</Text>;
    } else if (userClicks === aiClicks) {
      return <Text style={styles.resultTextDraw}>--Result : Draw !</Text>;
    } else {
      return <Text style={styles.resultTextLose}>-- Result : Lose !</Text>;
    }
  };

  const getkocsText = (Kocs) => {
    if (Kocs == 'Easy') {
      return <Text style={styles.recordText_Difficulty_Easy}># Difficulty : Easy</Text>
    } else if (Kocs == 'Normal') {
      return <Text style={styles.recordText_Difficulty_Normal}># Difficulty : Normal</Text>
    } else {
      return <Text style={styles.recordText_Difficulty_Hard}># Difficulty : Hard</Text>
    }
  };

  return (    
    <View style={styles.outerContainer}>
      <StatusBar barStyle='light-content' backgroundColor='#1e1e2e' />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('CPS_Main')}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
        {highScore !== null ? (
          <Text style={styles.highScoreText}>High Score Average CPS : {highScore.toFixed(2)}</Text>
        ) : (
          <Text style={styles.highScoreText}>High Score Average CPS : 0.00</Text>
        )}
        {filter === 'single' && ( /**단축평가 (AND연산) */
          <></>
          //아무것도 표시 안함
        )}
        {filter === 'vsAI' && (
          <>
          <Text style={styles.PWLD_Text}> [ Win : {win_count} / Draw : {draw_count} / Lose : {lose_count} ] </Text>
          </>
          //1. 기록을 삭제할때 마다 플레이 횟수,승리,패배,무승부 등 같이 줄어드는 기능 추가 여부
          //--> ex.all delete 하면 싹다 0으로 표시 [보류]
          //[보류]
        )}
      </View>
      <View style={styles.buttonsContainer}>
        {/* 🔽 기존 Single / 1vs1 필터 버튼 → 모던 체크박스 스타일로 변경 */}
        <TouchableOpacity
          style={[styles.filterOption, filter === 'single' && styles.activeFilterOption]}
          onPress={() => {
            setFilter('single');
            saveFilter('single');
          }}
        >
          <View style={[styles.checkbox, filter === 'single' && styles.activeCheckbox_single]} />
          <Text style={filter === 'single' ? styles.activeFilterText : styles.filterText}>
            Single Play
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterOption, filter === 'vsAI' && styles.activeFilterOption]}
          onPress={() => {
            setFilter('vsAI');
            saveFilter('vsAI');
          }}
        >
          <View style={[styles.checkbox, filter === 'vsAI' && styles.activeCheckbox_1vs1]} />
          <Text style={filter === 'vsAI' ? styles.activeFilterText : styles.filterText}>
            1vs1(Ai) Play
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.all_delete_records}
          onPress={() => {
            allconfirmDelete(filter);

          }}
        >
          <Text style={styles.all_delete_records_text}>All Delete 🗑️</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true} indicatorStyle = "#ffffff" persistentScrollbar={Platform.OS === 'android'}>
        {getFilteredRecords().length === 0 ? ( //기록이 없는 경우
          <Text style={styles.noRecordsText}>No records found</Text>
        ) : (
          getFilteredRecords().map((record, index) => (
            <View key={index} style={[styles.recordContainer,{borderColor: filter == 'single' ? '#16a085' : '#9ab929ff',}]}>
              {filter === 'single' && ( //Single Play 기록
                <> 
                  <Text style={styles.recordText_main_single}>== Single Play 🗡️==</Text>
                  <Text></Text> 
                  <Text style={styles.recordText_main_single_Date}>[ Date : {record.Date_time} ]</Text>
                  <Text></Text>
                  <Text style={styles.recordText}># Time : {record.time}s</Text>
                  <Text></Text>
                  <Text style={styles.recordText_single}>* User (You) *</Text>
                  <Text style={styles.recordText_single}>-- Clicks : {record.clickCount || 0}</Text>
                  <Text style={styles.recordText_single}>
                    -- Average CPS : {typeof record.cps === 'number' ? record.cps.toFixed(2) : '0'}
                  </Text>
                </>
                //스크롤바 안보이는 현상 발생
              )} 
              {filter === 'vsAI' && ( //1vs1(Ai) Play 기록
                <>
                  <Text style={styles.recordText_main_1vs1}>== 1vs1(Ai) Play 💻🗡️==</Text>
                  <Text></Text>
                  <Text style={styles.recordText_main_1vs1_Date}>[ Date : {record.Date_time} ]</Text>
                  <Text></Text>
                  <Text style={styles.recordText_time}># Time : {record.user.time}s</Text>
                  {getkocsText(record.KindofClickSpeed)}
                  <Text></Text>
                  <Text style={styles.recordText_ai}>* Ai (Enemy) *</Text>
                  <Text style={styles.recordText_ai}>-- Ai Clicks : {record.ai.clickCount || 0}</Text>
                  <Text style={styles.recordText_ai}>-- Ai Average CPS : {typeof record.ai.cps === 'number' ? record.ai.cps.toFixed(2) : '0'}</Text>
                  {getResultText_ai(record.user.clickCount || 0, record.ai.clickCount || 0)}
                  <Text></Text> 
                  <Text style={styles.recordText_Your}>* User (You) *</Text>
                  <Text style={styles.recordText_Your}>-- Your Clicks : {record.user.clickCount || 0}</Text>
                  <Text style={styles.recordText_Your}>-- Your Average CPS : {typeof record.user.cps === 'number' ? record.user.cps.toFixed(2) : '0'}</Text>
                  {getResultText(record.user.clickCount || 0, record.ai.clickCount || 0)}
                  <Text></Text>
                  
                </>
                //스크롤바 안 보이는 현상 발생
              )}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmDelete(index, filter)}
              >
                <Text style={styles.deleteButtonText}>Delete 🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#1e1e2e',
    paddingTop: hp(4.5), // ↓ 5 → 4.5
    paddingHorizontal: wp(3.5), // ↓ 4 → 3.5
  },
  header: {
    marginBottom: hp(1.8), // ↓ 2 → 1.8
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: wp(42), // ↓ 45 → 42
    marginTop: wp(0),
    fontSize: wp(6), // ↓ 6.5 → 6
    color: '#ff4d4f',
    padding: wp(1.2), // ↓ 1.5 → 1.2
    fontWeight: 'bold',
  },
  highScoreText: {
    fontSize: wp(4.2), // ↓ 4 → 3.8
    fontWeight: '600',
    color: '#ff4b5c',
    marginTop: hp(4),
    marginBottom: hp(0.8), // ↓ 1 → 0.8
    textAlign: 'center',
  },
  PWLD_Text: {
    fontSize: wp(3.2), // ↓ 3.5 → 3.2
    color: '#bbbbbb',
    marginTop: hp(0.8), // ↓ 1 → 0.8
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp(2), // ↓ 2.5 → 2
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d3a',
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(5),
    marginHorizontal: wp(1.2),
    elevation: 2,
  },
  activeFilterOption: {
    backgroundColor: '#3e3e50',
  },
  checkbox: {
    width: wp(3.5),
    height: wp(3.5),
    borderRadius: wp(1),
    borderWidth: 2,
    borderColor: '#aaa',
    marginRight: wp(2),
  },
  activeCheckbox_single: {
    backgroundColor: '#16a085',
    borderColor: '#16a085',
  },
  activeCheckbox_1vs1: {
    backgroundColor: '#9ab929ff',
    borderColor: '#9ab929ff',
  },
  filterText: {
    color: '#cccccc',
    fontSize: wp(3.2),
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
    fontSize: wp(3.2),
    fontWeight: '700',
  },
  activeFilterButton_single: {
    backgroundColor: '#2d2d3a',
  },
  activeFilterButton_1vs1: {
    backgroundColor: '#2d2d3a',
  },
  filterButtonText: {
    color: '#cccccc',
    fontSize: wp(3.2), // ↓ 3.5 → 3.2
    fontWeight: '500',
  },
  activefilterButtonText: {
    color: '#fff',
    fontSize: wp(3.2),
    fontWeight: '700',
  },
  all_delete_records: {
    paddingVertical: hp(1.2),
    paddingHorizontal: wp(4.2),
    borderRadius: wp(7),
    backgroundColor: '#ff4d4f',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  all_delete_records_text: {
    color: '#fff',
    fontSize: wp(3.2),
    fontWeight: '700',
  },
  container: {
    paddingBottom: hp(8), // ↓ 10 → 8
  },
  recordContainer: {
    marginBottom: hp(2), // ↓ 2.5 → 2
    padding: wp(3.5), // ↓ 4 → 3.5
    borderRadius: wp(4.5), // ↓ 5 → 4.5
    borderWidth: 2,
    backgroundColor: '#2a2a3c',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  recordText_main_single: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#16a085',
    marginBottom: hp(0.8),
  },
  recordText_main_single_Date: {
    fontSize: wp(3),
    color: '#bbbbbb',
    marginBottom: hp(0.8),
  },
  recordText: {
    fontSize: wp(3.2),
    color: '#ffffff',
    marginBottom: hp(0.6),
    lineHeight: hp(2.2),
  },
  recordText_single: {
    fontSize: wp(3.2),
    color: '#90caf9',
    marginLeft: wp(1.5),
    marginBottom: hp(0.5),
    lineHeight: hp(2.2),
  },
  recordText_main_1vs1: {
    fontSize: wp(3.8),
    fontWeight: '700',
    color: '#9ab929ff',
    marginBottom: hp(0.8),
  },
  recordText_main_1vs1_Date: {
    fontSize: wp(3),
    color: '#bbbbbb',
    marginBottom: hp(0.8),
  },
  recordText_time: {
    fontSize: wp(3.2),
    color: '#ffffff',
    marginBottom: hp(0.6),
    lineHeight: hp(2.2),
  },
  recordText_Difficulty_Easy: {
    color: 'green',
    fontWeight: 'bold',
  },
  recordText_Difficulty_Normal: {
    color: '#f1c40f',
    fontWeight: 'bold',
  },
  recordText_Difficulty_Hard: {
    color: '#ff3333',
    fontWeight: 'bold',
  },
  resultTextWin: {
    color: 'green',
    fontWeight: 'bold',
  },
  resultTextDraw: {
    color: '#A52A2A',
    fontWeight: 'bold',
  },
  resultTextLose: {
    color: '#ff3333',
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  recordText_ai: {
    fontSize: wp(3.2),
    color: '#ff3333',
    marginLeft: wp(1.5),
    marginBottom: hp(0.5),
    lineHeight: hp(2.2),
  },
  recordText_Your: {
    fontSize: wp(3.2),
    color: '#66ccff',
    marginLeft: wp(1.5),
    marginBottom: hp(0.5),
    lineHeight: hp(2.2),
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: wp(4.5), // ↓ 5 → 4.5
    marginTop: hp(1.8),
  },
  deleteButton: {
    marginTop: hp(1.2),
    alignSelf: 'flex-end',
    backgroundColor: '#e53935',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3.5),
    borderRadius: wp(3.5),
    elevation: 2,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: wp(3.2),
  },
});


export default History;