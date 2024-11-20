import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";

import FontAwesome from "react-native-vector-icons/FontAwesome";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AcceuilScreen from "./screens/AcceuilScreen";
import AgendaScreen from "./screens/AgendaScreen";
import DocumentsScreen from "./screens/DocumentsScreen";
import CarnetBebeScreen from "./screens/CarnetBebeScreen";
import WelcomeScreen from "./screens/WelcomeScreens/WelcomeScreen";
import CreerProjetScreen from "./screens/WelcomeScreens/CreerProjet";
import ProfilScreen from "./screens/ProfilScreen";
import LoginScreen from "./screens/WelcomeScreens/LoginScreen";
import CameraScreen from "./screens/CameraScreen";
import InviterScreen from "./screens/WelcomeScreens/InviterScreen";

import IconView from "./screens/NavComposants/IconView";

import { useState, useEffect } from "react";
import * as Font from "expo-font";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import user from "./reducers/user";
import document from "./reducers/document";

const store = configureStore({
  reducer: { user, document },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = "";
          let screenName = "";
          if (route.name === "Acceuil") {
            iconName = "home";
            screenName = "acceuil";
          } else if (route.name === "Agenda") {
            iconName = "calendar-alt";
            screenName = "agenda";
          } else if (route.name === "Documents") {
            iconName = "file-medical-alt";
            screenName = "documents";
          } else if (route.name === "CarnetBebe") {
            iconName = "baby"; // changee
            screenName = "carnet bebé";
          } else {
            iconName = "baby";
          }

          return (
            <IconView
              iconName={iconName}
              size={size}
              color={color}
              focused={focused}
              screenName={screenName}
            />
          );
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#007ACC",
          borderTopLeftRadius: 10, // Radius for top-left corner
          borderTopRightRadius: 10, // Radius for top-right corner
          height: 70,
          paddingTop: 10,
        },
      })}
    >
      <Tab.Screen name="Acceuil" component={AcceuilScreen} />
      <Tab.Screen name="Agenda" component={AgendaScreen} />
      <Tab.Screen name="Documents" component={DocumentsScreen} />
      <Tab.Screen name="CarnetBebe" component={CarnetBebeScreen} />
    </Tab.Navigator>
  );
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    console.log("--- font NOT loaded");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  } else {
    console.log("--- font loaded");
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="CreerProjet" component={CreerProjetScreen} />
          <Stack.Screen name="Profil" component={ProfilScreen} />
          <Stack.Screen name="Documents" component={DocumentsScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Camera" component={CameraScreen} />
          <Stack.Screen name="invite" component={InviterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
