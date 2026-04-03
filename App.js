import React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackContainer from "./navigation/StackContainer";
import mobileAds from 'react-native-google-mobile-ads';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

export default function App() {
  //구글 애드몹 앱 광고 ID [개발 중일때는 테스트 광고 사용(구글 정책)]
  const admobId = __DEV__ ? TestIds.BANNER :"ca-app-pub-1780484350762935/1729545919"; 
  
  if (__DEV__) {
    console.log("Developer Mode On");
  } else {
    console.log("Developer Mode Off [User Mode]");
  };

  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob SDK 광고 배치 및 로드 성공!");
      })
      .catch((error) => {
        console.error("AdMob SDK 초기화 및 광고 배치 실패:", error);
      });
    }, []);
  
  return(
    <NavigationContainer independent={true}>
      <StackContainer/>
      <BannerAd
      unitId={admobId}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      onAdFailedToLoad={(error) => console.error("광고 로드 실패:", error)}
      />
    </NavigationContainer>
  );
}