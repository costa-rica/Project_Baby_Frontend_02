import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from "react-native";
import TemplateView from "./template/TemplateView";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DateTimePicker from "react-native-modal-datetime-picker";

export default function CarnetBebeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false); // action modal
  const [date, setdate] = useState(null); // date de la donnée
  const [coucher, setcoucher] = useState(null); //attendu heure dormi
  const [selle, setselle] = useState(null); //etat du caca
  const [couleur, setcouleur] = useState(null); //couleur du caca
  const [repas, setrepas] = useState(null); //quantite du repas
  const [note, setnote] = useState(null); // note bonus
  const [data, setdata] = useState(false);
  const [lastInfos, setlastInfos] = useState([]);
  const [docBebe, setdocBebe] = useState([]);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [currentField, setCurrentField] = useState(null);
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
    if (currentField === "date") {
      setdate(formattedDate);
    }
    hideDatePicker();
  };

  // const enfant = useSelector((state) => state.enfant.value);
  const user = useSelector((state) => state.user.value);
  const tokenProject = user.tokenProject;
  const username = user.username;
  useEffect(() => {
    fetchData();
  }, [username, tokenProject]);

  const fetchData = () => {
    console.log("new user:", user);
    console.log("tokenProject:", tokenProject);
    if (username && tokenProject) {
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/carnetbebe/${tokenProject}`)
        .then((response) => response.json())
        .then((carnetBebe) => {
          setdocBebe(carnetBebe);
          // console.log("carnetBebe:", carnetBebe);
          if (carnetBebe && carnetBebe.infos.length) {
            const lastCarnetBebe = carnetBebe.infos.reverse().slice(0, 3);
            setlastInfos(lastCarnetBebe);
          } else {
            response.json({ result: false, error: "no data" });
            console.log("Pas de données disponibles");
          }
          console.log(lastInfos);
        });
    }
  };

  const modalCarnetBebe = () => {
    if (user.role === "lecteur") {
      return alert("ny pense meme pas, tu na pas le droit");
    } else {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setdate("");
    setcoucher("");
    setcouleur("");
    setselle("");
    setrepas("");
    setnote("");
  };
  const saveInfos = () => setdata(true);

  useEffect(() => {
    // info recuperer de la modal
    if (data) {
      const bodyObj = {
        username: username,
        date: date,
        heureCoucher: coucher,
        repas: repas,
        selle: selle,
        couleurSelle: couleur,
        notes: note,
      };
      // fetch pour sauvegarder en BDD nouveau document carnet bebe
      fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/carnetbebe/ajout/${tokenProject}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        }
      )
        .then((response) => response.json())
        .then((newDocbebe) => {
          console.log("teste1", newDocbebe);
          setlastInfos([...lastInfos, newDocbebe.carnetBebe].reverse());
          console.log("test2", lastInfos);
        })
        .catch((error) => {
          console.error;
        });
      lastInfos.slice(0, 3);
      setdate("");
      setcoucher("");
      setcouleur("");
      setselle("");
      setrepas("");
      setnote("");
      setdata(false);
    }
  }, [data]);

  const handleDelete = (docBebe) => {
    if (user.role === "lecteur") {
      return alert("Va voir chez Polo Chino, si tu as acces");
    }
    console.log("Vérification de l'ID dans handleDelete:");

    if (!docBebe) {
      console.error("L'identifiant du rendez-vous est manquant");
      return;
    }

    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/carnetbebe/${tokenProject}/${docBebe}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.result) {
          fetchData();
        }
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression :", error)
      );
  };

  const lastInfosCard = lastInfos?.map((item, data) => {
    // console.log(item);

    return (
      <View key={item._id} style={styles.card}>
        <View>
          <Text>Date: {item.date} </Text>
          <Text>Coucher: {item.heureCoucher}</Text>
          <Text>Repas: {item.repas}</Text>
          <Text>Selle: {item.selle}</Text>
          <Text>Couleur Selle: {item.couleurSelle}</Text>
          <Text>Notes: {item.notes}</Text>
          <TouchableOpacity
            style={styles.btnModal2}
            title="Supprimer"
            onPress={() => {
              if (item._id) {
                handleDelete(item._id);
              } else {
                console.error(
                  "L'ID du rendez-vous est manquant :",
                  docBebe.infos_id
                );
              }
            }}
          >
            <Text>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });
  return (
    <TemplateView navigation={navigation}>
      {/* Commence propriété children */}
      <View>
        <View style={styles.vwInstructions}>
          <Text style={styles.txtInstructions}> Agenda </Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => modalCarnetBebe()}>
          <Text>Ajoute un document carnet Bebe</Text>
        </TouchableOpacity>

        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.btnModal} activeOpacity={0.8}>
                <TextInput
                  placeholder="Date"
                  style={styles.input}
                  value={date}
                  onPress={() => showDatePicker("date")}
                />
                <TextInput
                  placeholder="coucher"
                  style={styles.input}
                  value={coucher}
                  onChangeText={(value) => setcoucher(value)}
                />
                <TextInput
                  placeholder="selle"
                  style={styles.input}
                  value={selle}
                  onChangeText={(value) => setselle(value)}
                />
                <TextInput
                  placeholder="couleur selle"
                  style={styles.input}
                  value={couleur}
                  onChangeText={(value) => setcouleur(value)}
                />
                <TextInput
                  placeholder="repas"
                  style={styles.input}
                  value={repas}
                  onChangeText={(value) => setrepas(value)}
                />
                <TextInput
                  placeholder="note"
                  style={styles.input}
                  value={note}
                  onChangeText={(value) => setnote(value)}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => saveInfos()}
                style={styles.btnClose}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>enregistré modification</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => closeModal()}
                style={styles.btnClose}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Close</Text>
              </TouchableOpacity>
              <DateTimePicker
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleDatePicked}
                onCancel={hideDatePicker}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.blocinfos}>{lastInfosCard}</View>
      </View>
      {/* Fin propriété children */}
      {/* Fin propriété children */}
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
  vwPlusButton: {
    width: Dimensions.get("screen").width * 0.8,
    alignItems: "flex-end",
    justifyContent: "flex-end",
    margin: 10,
  },
  vwInstructions: {
    padding: 20,
  },
  txtInstructions: {
    fontSize: 40,
    fontFamily: "Caveat",
  },
  imageButon: {
    height: 50,
    aspectRatio: 1,
  },
  carnetBebeBtn: {
    display: "flex",
    fontSize: 20,
    height: 30,
    width: 300,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    borderRadius: 20,
    borderWidth: 1,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btnModal: {
    backgroundColor: "white",
    borderWidth: 1,
    width: 200,
    height: 300,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 2,
  },
  modalView: {
    backgroundColor: "white",
    justifyContent: "space-between",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnClose: {
    backgroundColor: "pink",
    borderWidth: 1,
    width: 220,
    height: 50,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
  },
  card: {
    display: "flex-wrap",
    width: Dimensions.get("screen").width,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: Dimensions.get("screen").width * 0.7,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#007ACC", // Blue outline
    backgroundColor: "#FFFFFF", // White background
    alignItems: "center",
    marginTop: 10,
    flexWrap: " wrap",
  },
  name: {
    fontSize: 18,
  },
  blocinfos: {
    flex: 1,
    alignItems: "center",
  },
  btnModal2: {
    backgroundColor: "pink",
    borderWidth: 1,
    width: 100,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
    flexWrap: "nowrap",
  },
  btn: {
    display: "flex",
    backgroundColor: "white",
    width: 250,
    height: 50,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    margin: 5,
  },
});
