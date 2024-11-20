import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import TemplateViewNoNav from "../template/TemplateViewNoNav";
import VwEchec from "../template/VwEchec";
import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { loginUser } from "../../reducers/user";
import { useSelector } from "react-redux";

export default function InviterScreen({ navigation }) {
  console.log("- dans inviterScreen");
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user.value);
  const [username, usernameSetter] = useState("");
  const [password, passwordSetter] = useState("");
  const [envoyerData, envoyerDataSetter] = useState(false);
  const [cachePassword, cachePasswordSetter] = useState(false);
  const [modalEchecVisible, setModalEchecVisible] = useState(false);
  const [messageError, messageErrorSetter] = useState("");
  const [link, setlink] = useState(null);
  const pressedLogin = () => {
    if (link && username && password) console.log("- aller à LoginScreen 📢");
    envoyerDataSetter(true);
  };

  const closeModal = () => setModalEchecVisible(false);

  const modalEchec = (
    <Modal visible={modalEchecVisible} animationType="fade" transparent={true}>
      <VwEchec closeModal={closeModal} messageError={messageError} />
    </Modal>
  );
  useEffect(
    () => {
      // <-- que une seul fois, quand le composant arriver
      if (envoyerData) {
        console.log(link);
        console.log("- envoyerData 🚀");
        const bodyObj = {
          username: username,
          password: password,
        };

        fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/user/invites/${link}`,
          // fetch("http://192.168.1.156:3000/user/signin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyObj),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("new user", data);
            if (data) {
              navigation.navigate("TabNavigator");
              dispatch(
                loginUser({
                  username: username,
                  token: data.data.tokenUser,
                  tokenProject: data.data.tokenProject,
                  role: data.data.role,
                })
              );
              // console.log("tokenproject", data);
            } else {
              console.log(`data.project?.token2 est falsey 😱`);
              messageErrorSetter(data?.error);
              setModalEchecVisible(true);
            }
          });
        envoyerDataSetter(false);
      }
    },
    [envoyerData] //<--- tableaux vide
  );

  return (
    <TemplateViewNoNav navigation={navigation} afficherArriére={true}>
      <View style={styles.container}>
        {modalEchecVisible ? modalEchec : null}
        <View style={styles.vwInstructions}>
          <Text style={styles.txtInstructions}>Invité</Text>
        </View>
        <View style={styles.vwInputSuper}>
          <View style={styles.vwInput}>
            <TextInput
              style={styles.txtInput}
              onChangeText={(value) => setlink(value)}
              placeholder="ajouter lien d'invitation"
              placeholderTextColor="#555555" // Dark gray color for the placeholder
              value={link}
            />
          </View>

          <View style={styles.vwInput}>
            <TextInput
              style={styles.txtInput}
              onChangeText={(value) => usernameSetter(value)}
              placeholder="Pseudonyme"
              placeholderTextColor="#555555" // Dark gray color for the placeholder
              value={username}
            />
          </View>

          <View style={styles.vwInput}>
            <TextInput
              style={styles.txtInput}
              onChangeText={(value) => passwordSetter(value)}
              placeholder="Mot de passe"
              secureTextEntry={!cachePassword} // cache le text dans le input
              placeholderTextColor="#555555" // Dark gray color for the placeholder
              value={password}
            />
          </View>

          <View style={styles.switchCachePassword}>
            <Text>Afficher mot de passe</Text>
            <Switch
              value={cachePassword}
              onValueChange={(value) => cachePasswordSetter(value)}
            />
          </View>
        </View>

        <View style={styles.vwBtn}>
          <TouchableOpacity style={styles.btn} onPress={() => pressedLogin()}>
            <Text style={styles.btnText}>connection</Text>
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
  contentView: {
    height: Dimensions.get("screen").height * 1.25,
    alignItems: "center",
  },
  vwInstructions: {
    padding: 20,
  },
  txtInstructions: {
    fontSize: 40,
    fontFamily: "Caveat",
  },
  vwInputSuper: {
    display: "flex",
    paddingBottom: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  vwInput: {
    display: "flex",
    width: Dimensions.get("screen").width * 0.8, // Full screen width
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#007ACC", // Blue outline
    margin: 5,
  },
  txtInput: {
    width: "100%",
    height: "100%",
    padding: 10,
    fontSize: 16,
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
  switchCachePassword: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    alignItems: "center",
    paddingRight: "10%",
  },
});
