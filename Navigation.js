import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
// Importa Main en lugar de HomeScreen

import MainStackNavigator from './StackNavigator.js';
const Tab = createBottomTabNavigator();

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#ffffff', 
                    borderBottomWidth: 0, 
                    elevation: 0, 
                },
                headerTintColor: '#34A853', 
                headerTitleStyle: {
                    fontWeight: 'bold', 
                },
                tabBarActiveTintColor: '#34A853', 
                tabBarStyle: {
                    display: 'flex',
                    borderTopWidth: 0, 
                },
            }}
        >
            <Tab.Screen
                name="HomeStack"
                component={MainStackNavigator}
                options={{
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialCommunityIcons name="flower-outline" size={35} color="#34A853" />
                            <Text style={{ marginLeft: 10, fontWeight: 'bold', fontSize: 25, color: '#34A853' }}>Doctor Plantas</Text>
                        </View>
                    ),
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}


export default function Navigation() {
    return (
        <NavigationContainer style={{ backgroundColor: "#FFFFFF" }}>
            <MyTabs />
        </NavigationContainer>
    );
}
