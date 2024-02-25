
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './src/Main.jsx'; 
import PantallaPlantas from './screens/PantallaPlantas.jsx'; 

const Stack = createStackNavigator();

function MainStackNavigator() {
  return (

    <Stack.Navigator>
      <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
      <Stack.Screen name="PantallaPlantas" component={PantallaPlantas} options={{ headerShown: false }}  />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
