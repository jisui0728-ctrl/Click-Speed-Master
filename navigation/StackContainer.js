import React from "react";
import { View , Text, } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from './screens/Home'
import CPS from './screens/CPS';
import { NavigationContainer } from "@react-navigation/native";

const home = "Home";
const cps = "CPS";

const Stack = createStackNavigator();

export default function App() {
  return(
    <NavigationContainer independent = {true}>
      <Stack.Navigator>
        <Stack.Screen name = {home} component = {Home} options = {{headerShown : false}}/>
        <Stack.Screen name = {cps} component = {CPS} options = {{headerShown : false}}/>
      </Stack.Navigator>  
    </NavigationContainer>
  );
};