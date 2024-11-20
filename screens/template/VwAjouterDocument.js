import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  sauvgaurderDocumentInfos,
  documentModalRestOuvert,
} from "../../reducers/document";
import { useFocusEffect } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function VwAjouterDocument(props) {
  const documentRedux = useSelector((state) => state.document.value);
  const userRedux = useSelector((state) => state.user.value);
  const [nom, setNom] = useState("");
  const [practicien, setPracticien] = useState("");
  const [notes, setNotes] = useState("");
  const dispatch = useDispatch();

  let imagesArr = [];

  useFocusEffect(
    useCallback(() => {
      console.log("- VwAjouterDocument > useFocusEffect > useCallback");
      setNom(documentRedux.nom);
      setPracticien(documentRedux.practicien);
      setNotes(documentRedux.notes);
    }, [])
  );

  // photosArr.map((elem, index) => {
  documentRedux.photos.map((elem, index) => {
    console.log("documentRedux.photos elem: ", index);
    console.log(elem);

    const imgElem = (
      <View key={index} style={styles.photoContainer}>
        <TouchableOpacity onPress={() => dispatch(removePhoto(data))}>
          <FontAwesome name="times" size={20} color="red" />
        </TouchableOpacity>

        <Image source={{ uri: elem }} style={styles.imgElemStyle} />
      </View>
    );
    imagesArr.push(imgElem);
  });

  const appuyerCamera = () => {
    dispatch(documentModalRestOuvert());

    payloadObj = {
      nom: nom,
      practicien: practicien,
      notes: notes,
    };
    dispatch(sauvgaurderDocumentInfos(payloadObj));

    props.fermerModalSansEffacer();
    props.navigation.navigate("Camera");
  };

  const appuyerSoumettre = () => {
    const bodyObj = {
      token: userRedux.token,
      tokenProject: userRedux.tokenProject,
      nom: nom,
      practicien: practicien,
      notes: notes,
      url: documentRedux.photos,
    };
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/document/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyObj),
    })
      .then((response) => response.json())
      .then((resJson) => {
        if (resJson.result) {
          props.fetchDocumentsData();
          props.fermerModal();
        }
      });
  };

  return (
    <ScrollView>
      <View style={styles.modalOverlayScroll}>
        <View style={styles.modalBackground}>
          <View style={styles.vwHaut}>
            <Text style={styles.txtTitre}>Ajouter une document</Text>
          </View>

          <View style={styles.vwAuMileu}>
            <View style={styles.vwInputSuper}>
              <View style={styles.vwInput}>
                <TextInput
                  style={styles.listItem}
                  onChangeText={(value) => {
                    setNom(value);
                  }}
                  placeholder="Nom"
                  placeholderTextColor="#555555"
                  value={nom}
                />
              </View>
            </View>

            <View style={styles.vwInputSuper}>
              <View style={styles.vwInput}>
                <TextInput
                  style={styles.listItem}
                  onChangeText={(value) => {
                    setPracticien(value);
                  }}
                  placeholder="Practicien"
                  placeholderTextColor="#555555"
                  value={practicien}
                />
              </View>
            </View>
            <View style={styles.vwInputSuperNotes}>
              <View style={styles.vwInputNotes}>
                <TextInput
                  style={styles.listItem}
                  onChangeText={(value) => {
                    setNotes(value);
                  }}
                  placeholder="Notes"
                  placeholderTextColor="#555555"
                  value={notes}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          {imagesArr.length > 0 && (
            <View style={styles.vwInputPhotos}>{imagesArr}</View>
          )}
          <View style={styles.vwButonsEnBas}>
            <TouchableOpacity
              onPress={() => appuyerCamera()}
              style={styles.btnAjouter}
              activeOpacity={0.8}
            >
              <Text style={styles.btnAjouterText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => appuyerSoumettre()}
              style={styles.btn}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Soumettre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={props.fermerModal}
              style={styles.btn}
              activeOpacity={0.8}
            >
              <Text style={styles.btnText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
    // </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalOverlayScroll: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    height: Dimensions.get("screen").height * 1.5,
    width: Dimensions.get("screen").width,
  },

  modalBackground: {
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.8,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  txtTitre: {
    fontSize: 20,
    width: "100%",
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },

  btnModal: {
    display: "flex",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderColor: "pink",
    borderRadius: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  btnModalFermer: {
    display: "flex",
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 20,
  },
  textButtonX: {
    fontSize: 20,
    fontWeight: "700",
  },
  vwHaut: {
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.8,
  },
  vwAuMileu: {
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.8,
  },
  vwInputSuper: {
    display: "flex",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  vwInput: {
    display: "flex",
    width: "80%",
    height: 50,
    borderRadius: 12,
    margin: 5,
  },
  txtInput: {
    height: "100%",
    padding: 10,
    fontSize: 16,
  },
  vwInputSuperNotes: {
    display: "flex",
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  vwInputNotes: {
    width: "80%",
    borderRadius: 12,
  },
  txtInputNotes: {
    padding: 10,
    fontSize: 16,
  },
  vwInputPhotos: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  imgElemStyle: {
    width: 100,
    height: 100,
  },
  photoContainer: {
    alignItems: "flex-end",
    margin: 5,
  },

  vwButonsEnBas: {
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.8,
    justifyContent: "flex-end",
    paddingBottom: 20,
    marginTop: 20,
  },
  btnAjouter: {
    backgroundColor: "pink",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
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
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});
