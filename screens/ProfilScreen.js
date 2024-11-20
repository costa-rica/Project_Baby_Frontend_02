import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import TemplateView from "./template/TemplateView";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../reducers/user";
import { logOutDocument } from "../reducers/document";
import DateTimePicker from "react-native-modal-datetime-picker";

export default function Profil({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value); // Données utilisateur dans le store
  const projectToken = user.tokenProject; // Récupère le token de projet de l'utilisateur
  const userToken = user.token;
  // console.log("token :", projectToken);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [grossesse, setGrossesse] = useState("");
  const [menstruation, setMenstruation] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const emailRegExp =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [passwordModalIsVisible, setPasswordModalIsVisible] = useState(false);
  const openPasswordModalIsVisible = () => setPasswordModalIsVisible(true);
  const closePasswordModalIsVisible = () => setPasswordModalIsVisible(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const showDatePicker = (field) => {
    setCurrentField(field);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => setDatePickerVisible(false);

  // Gère la sélection de date
  const handleDatePicked = (pickedDate) => {
    const formattedDate = `${pickedDate.getDate()}-${
      pickedDate.getMonth() + 1
    }-${pickedDate.getFullYear()}`;
    if (currentField === "menstruation") {
      setMenstruation(formattedDate);
    } else if (currentField === "grossesse") {
      setGrossesse(formattedDate);
    }
    hideDatePicker();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(
      // fait une requête pour récupérer les infos utilisateur
      `${process.env.EXPO_PUBLIC_API_URL}/user/${projectToken}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.user) {
          setUsername(data.user.username);
          setEmail(data.user.email);
          setGrossesse(data.user.dateDebutGrossesse);
          setMenstruation(data.user.derniereMenstruation);
        } else {
          res.json({ result: false, error: "no data" });
        }
      });
  };

  const handleUpdate = (userToken) => {
    // console.log("token de l'utilisateur à mettre à jour :", userToken);
    // Création d'un objet représentant le rendez-vous mis à jour avec les nouvelles informations

    const updatedUser = {
      username: username, // Nom utilisateur
      email: email, // Email
      derniereMenstruation: menstruation, // Dernière menstruation
      dateDebutGrossesse: grossesse, // Date de début de grossesse
    };

    // console.log(updatedUser);

    // Fait une requête PUT pour mettre à jour l'utilisateur avec les nouvelles informations
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/${projectToken}/${userToken}`,
      {
        method: "PUT", // Spécifie la méthode PUT pour la mise à jour
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser), // Convertit l'objet updatedUser en JSON pour l'envoyer
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si la mise à jour a été réussie
        if (data.result === true) {
        }
        // Met à jour l'état de l'utilisateur en remplaçant l'ancien par le nouveau mis à jour
        fetchData();
        // closeModifierModal();
      })
      .catch((error) =>
        // Affiche un message d'erreur en cas de problème lors de la mise à jour
        console.error("Erreur lors de la mise à jour :", error)
      );
  };
  // route to modify password
  const handleUpdatePassword = (userToken) => {
    // console.log("token de l'utilisateur à mettre à jour :", userToken);
    // Création d'un objet représentant le rendez-vous mis à jour avec les nouvelles informations

    const updatedUserPassword = {
      oldPassword: password,
      newPassword: newPassword,
    };

    // console.log(updatedUserPassword);

    // Fait une requête PUT pour mettre à jour l'utilisateur avec les nouvelles informations
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user/password/${projectToken}/${userToken}`,
      {
        method: "PUT", // Spécifie la méthode PUT pour la mise à jour
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserPassword), // Convertit l'objet updatedUser en JSON pour l'envoyer
      }
    )
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si la mise à jour a été réussie
        if (data.result === true) {
        }
        // Met à jour l'état de l'utilisateur en remplaçant l'ancien par le nouveau mis à jour
        fetchData();
        closePasswordModalIsVisible();
      })
      .catch((error) =>
        // Affiche un message d'erreur en cas de problème lors de la mise à jour
        console.error("Erreur lors de la mise à jour :", error)
      );
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(logOutDocument());
    navigation.navigate("Welcome");
  };

  return (
    <TemplateView navigation={navigation} afficherArriére>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.background}
      >
        <View style={styles.vwInstructions}>
          <Text style={styles.txtInstructions}> Profil utilisateur </Text>
        </View>
        <View style={styles.centeredView}>
          <Text>Pseudonyme</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.listItem}
              placeholder={username}
              value={username}
              onChangeText={(value) => setUsername(value)}
            />
          </View>
          <Text>Email</Text>
          <View style={styles.input}>
            <TextInput
              style={styles.listItem}
              placeholder={email}
              value={email}
              onChangeText={(value) => setEmail(value)}
            />
          </View>
          <TouchableOpacity
            style={styles.input}
            onPress={() => showDatePicker("menstruation")}
          >
            <TextInput
              style={styles.listItem}
              placeholder="date de la derniere menstruation"
              value={menstruation}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.input}
            onPress={() => showDatePicker("grossesse")}
          >
            <TextInput
              style={styles.listItem}
              placeholder="Date de début de grossesse"
              value={grossesse}
              editable={false}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={openPasswordModalIsVisible}
          >
            <Text>Mot de passe</Text>
          </TouchableOpacity>
          <Modal
            visible={passwordModalIsVisible}
            animationType="fade"
            transparent
          >
            <View style={styles.centeredView}>
              <View style={styles.modalListView}>
                <Text style={styles.modalTitle}>Ancien Mot de Passe</Text>
                <TextInput
                  style={styles.listItem}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                />
                <Text style={styles.modalTitle}>Nouveau Mot de Passe</Text>
                <TextInput
                  style={styles.listItem}
                  value={newPassword}
                  onChangeText={(text) => setNewPassword(text)}
                />
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => handleUpdatePassword(user.token)}
                >
                  <Text>Sauvegarder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btn}
                  onPress={closePasswordModalIsVisible}
                >
                  <Text>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleUpdate(user.token)}
            >
              <Text>Sauvegarder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => handleLogout()}>
              <Text>Deconnexion</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDatePicked}
          onCancel={hideDatePicker}
        />
      </KeyboardAvoidingView>
    </TemplateView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get("screen").width,
    heigth: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
  },
  vwInstructions: {
    padding: 50,
  },
  txtInstructions: {
    fontSize: 40,
    fontFamily: "Caveat",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalListView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 50,
    width: 300,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    borderBottom: 1,
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  btn: {
    backgroundColor: "pink",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
    flexWrap: "nowrap",
  },
  header: {
    marginBottom: 20,
  },
});
