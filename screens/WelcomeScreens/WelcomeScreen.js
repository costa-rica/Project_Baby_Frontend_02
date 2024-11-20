import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import TemplateViewNoNav from "../template/TemplateViewNoNav";

export default function WelcomeScreen({ navigation }) {
  const pressedLogin = () => {
    // console.log("- aller à LoginScreen 📢");
    navigation.navigate("Login");
  };

  const pressedCreerProjet = () => {
    // console.log("- aller à pressedCreerProjet 📢");
    navigation.navigate("CreerProjet");
  };

  const pressedInviter = () => {
    console.log("- pressedInviter 📢");
    navigation.navigate("invite");
  };

  return (
    <TemplateViewNoNav>
      <View style={styles.container}>
        <View style={styles.vwBtn}>
          <TouchableOpacity style={styles.btn} onPress={() => pressedLogin()}>
            <Text style={styles.btnText}>Se connecter</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vwBtn}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => pressedCreerProjet()}
          >
            <Text style={styles.btnText}>Créer Projet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vwBtn}>
          <TouchableOpacity style={styles.btn} onPress={() => pressedInviter()}>
            <Text style={styles.btnText}>Compte inviter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TemplateViewNoNav>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vwBtn: {
    display: "flex",
    width: Dimensions.get("screen").width,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: Dimensions.get("screen").width * 0.8,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#007ACC", // Blue outline
    backgroundColor: "#FFFFFF", // White background
    alignItems: "center",
  },
  btnText: {
    fontFamily: "Caveat",
    fontSize: 30,
  },
});
