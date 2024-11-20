import { StyleSheet, View, Dimensions, ImageBackground } from "react-native";

import HeaderView from "../NavComposants/Header";

export default function TemplateView(props) {
  return (
    <ImageBackground
      source={require("../../assets/images/projectbaby-background.jpg")}
      style={styles.background}
    >
      <View style={styles.vwHeader}>
        <HeaderView
          navigation={props.navigation}
          afficherArriére={props.afficherArriére}
        />
      </View>
      <View style={styles.vwMain}>{props.children}</View>
      {/* {props.children} sont touts les trucs de le vrai Screen */}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get("screen").width,
    heigth: Dimensions.get("screen").height,
  },
  vwHeader: {
    paddingTop: 20,
  },
  vwMain: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  vwFooter: {
    height: 60,
    backgroundColor: "#007ACC",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
