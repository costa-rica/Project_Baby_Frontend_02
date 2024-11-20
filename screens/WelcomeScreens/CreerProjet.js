import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Modal,
} from "react-native";
import TemplateViewNoNav from "../template/TemplateViewNoNav";
import { useState, useEffect } from "react";
import VwEchec from "../template/VwEchec";
import DateTimePicker from "react-native-modal-datetime-picker";

import { useDispatch } from "react-redux";
import { loginUser } from "../../reducers/user";
import { useSelector } from "react-redux";

export default function CreerProjetScreen({ navigation }) {
  console.log("CreerProjetScreen");
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.user.value);
  const [username, usernameSetter] = useState("");
  const [prenom, prenomSetter] = useState("");
  const [nomDeFamille, nomDeFamilleSetter] = useState("");
  const [dateDerniereMenstruation, dateDerniereMenstruationSetter] =
    useState("");
  const [dateDebutGrossesse, dateDebutGrossesseSetter] = useState("");
  const [email, emailSetter] = useState("");
  const [password, passwordSetter] = useState("");
  const [envoyerData, envoyerDataSetter] = useState(false);
  const [cachePassword, cachePasswordSetter] = useState(false);
  const [modalEchecVisible, setModalEchecVisible] = useState(false);
  const [messageError, messageErrorSetter] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const closeModal = () => setModalEchecVisible(false);
  // Affiche le sélecteur de date pour un champ donné
  const showDatePicker = (field) => {
    setCurrentField(field);
    setDatePickerVisible(true);
  };

  // Cache le sélecteur de date
  const hideDatePicker = () => setDatePickerVisible(false);

  // Gère la sélection de date
  const handleDatePicked = (pickedDate) => {
    const formattedDate = `${pickedDate.getDate()}-${
      pickedDate.getMonth() + 1
    }-${pickedDate.getFullYear()}`;
    if (currentField === "dateDerniereMenstruation") {
      dateDerniereMenstruationSetter(formattedDate);
    } else if (currentField === "dateDebutGrossesse") {
      dateDebutGrossesseSetter(formattedDate);
    }
    hideDatePicker();
  };

  const modalEchec = (
    <Modal visible={modalEchecVisible} animationType="fade" transparent={true}>
      <VwEchec closeModal={closeModal} messageError={messageError} />
    </Modal>
  );

  const chopperDateDerniereMenstruation = (datePickerDate) => {
    console.log(`date reçu: ${datePickerDate}`);
    dateDerniereMenstruationSetter(datePickerDate);
    console.log(dateDerniereMenstruation);
  };

  const pressedCreerProjet = () => {
    // console.log("- aller à LoginScreen 📢");
    console.log(`dateDerniereMenstruation: ${dateDerniereMenstruation}`);
    console.log(`dateDebutGrossesse: ${dateDebutGrossesse}`);
    envoyerDataSetter(true);
  };

  useEffect(
    () => {
      // <-- que une seul fois, quand le composant arriver
      console.log("-Mount 📌");
      // console.log(
      //   (process.env.EXPO_PUBLIC_API_URL = `${process.env.EXPO_PUBLIC_API_URL}`)
      // );
      if (envoyerData) {
        console.log("- envoyerData 🚀");
        const bodyObj = {
          prenom: prenom,
          nomDeFamille: nomDeFamille,
          username: username,
          dateDebutGrossesse: dateDebutGrossesse,
          derniereMenstruation: dateDerniereMenstruation,
          password: password,
          email: email,
        };

        fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/signupProject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(`--- bien reçu le reponse ✅ `);
            console.log(data);
            console.log(`reçu token: ${data.token}`);
            // console.log(`reducer token: ${userReducer.token}`);
            if (data.project?.token && password != "") {
              // console.log(`data.project?.token est Truey 🤗`);
              dispatch(
                loginUser({
                  username: username,
                  token: data.token,
                  projectId: data.project._id,
                  prenom: prenom,
                  email: email,
                  tokenProject: data.project.token, // tokenProject: data.token2,
                  role: data.role,
                })
              );
              navigation.navigate("TabNavigator");
            } else if (password == "") {
              messageErrorSetter("mot de pass est vide");
              setModalEchecVisible(true);
            } else {
              console.log(`data.project?.token est falsey 😱`);
              console.log(data?.error);
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
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentView}>
            <View style={styles.vwInstructions}>
              <Text style={styles.txtInstructions}>Créez votre compte</Text>
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
                onChangeText={(value) => prenomSetter(value)}
                placeholder="Prénom"
                placeholderTextColor="#555555" // Dark gray color for the placeholder
                value={prenom}
              />
            </View>

            <View style={styles.vwInput}>
              <TextInput
                style={styles.txtInput}
                onChangeText={(value) => nomDeFamilleSetter(value)}
                placeholder="Nom De Famille"
                placeholderTextColor="#555555" // Dark gray color for the placeholder
                value={nomDeFamille}
              />
            </View>
            <TouchableOpacity
              style={styles.vwInput}
              onPress={() => showDatePicker("dateDerniereMenstruation")}
            >
              <TextInput
                style={styles.txtInput}
                placeholder="date de la derniere menstruation"
                value={dateDerniereMenstruation}
                editable={false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.vwInput}
              onPress={() => showDatePicker("dateDebutGrossesse")}
            >
              <TextInput
                style={styles.txtInput}
                placeholder="Date de début de grossesse"
                value={dateDebutGrossesse}
                editable={false}
              />
            </TouchableOpacity>

            <View style={styles.vwInput}>
              <TextInput
                style={styles.txtInput}
                onChangeText={(value) => emailSetter(value)}
                placeholder="Email"
                placeholderTextColor="#555555" // Dark gray color for the placeholder
                value={email}
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
              <Text>Afficher le mot de passe</Text>
              <Switch
                value={cachePassword}
                onValueChange={(value) => cachePasswordSetter(value)}
              />
            </View>
            <View style={styles.vwBtn}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => pressedCreerProjet()}
              >
                <Text style={styles.btnText}>Créer Projet</Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDatePicked}
              onCancel={hideDatePicker}
            />
          </View>
        </ScrollView>
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
  vwInput: {
    display: "flex",
    width: Dimensions.get("screen").width * 0.8, // Full screen width
    paddingHorizontal: "10%", // Align content centrally
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#007ACC", // Blue outline
    margin: 5,
  },
  vwInputDatePicker: {
    display: "flex",
    width: Dimensions.get("screen").width * 0.8, // Full screen width
    paddingHorizontal: "10%", // Align content centrally
    // height: 100,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#007ACC", // Blue outline
    margin: 5,
  },
  txtInput: {
    width: "100%", // 80% of parent (vwInput)
    height: "100%", // Ensure the TextInput fills its container
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
