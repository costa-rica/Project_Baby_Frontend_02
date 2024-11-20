import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import TemplateView from "./template/TemplateView";
import { useEffect, useState } from "react";

import VwAjouterDocument from "./template/VwAjouterDocument";
import { useSelector, useDispatch } from "react-redux";
import {
  documentModalRestOuvert,
  doucumentModalResterFermer,
  sauvgaurderDocumentInfos,
  supprimerTousLesPhotos,
} from "../reducers/document";

export default function DocumentsScreen({ navigation }) {
  const userRedux = useSelector((state) => state.user.value);
  const documentRedux = useSelector((state) => state.document.value);
  const dispatch = useDispatch();
  const [documentsDonnes, setDocumentsDonnes] = useState([]);
  const [documentsDonnesRecherche, setDocumentsDonnesRecherche] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchModalVisible, setSearchModalVisible] = useState("");
  const [photoModalVisible, setPhotoModalVisible] = useState("");
  const [documentChoisi, setDocumentChoisi] = useState("");
  const [afficherRechercheScrollView, setAfficherRechercheScrollView] =
    useState(false);

  const fermerModalVwAjouterDoc = () => {
    dispatch(sauvgaurderDocumentInfos({ nom: "", practcien: "", notes: "" }));
    dispatch(supprimerTousLesPhotos());
    dispatch(doucumentModalResterFermer());
  };

  const cameraScreenFermerModalSansEffacerRedux = () => {
    dispatch(doucumentModalResterFermer());
  };

  const poubelleAppuyee = (elem) => {
    if (userRedux.role != "lecteur") {
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/document/${elem._id}`, {
        method: "DELETE",
      })
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
    } else {
      return alert("c'est chitos mon acces est bloqué");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/document/${userRedux.tokenProject}`
    )
      .then((response) => response.json())
      .then((data) => {
        let array = [];
        for (const elem of data.documentsData) {
          array.push(elem);
        }
        setDocumentsDonnes(array);
        setDocumentsDonnesRecherche(array);
      });
  };

  let cardArr = [];
  let cardArrRecherche = [];

  const createDocumentCard = (elem, index) => {
    return (
      <View key={elem._id} style={styles.card}>
        <View style={styles.cardRayon1}>
          <Text style={styles.txtDate}>{elem.dateAjoute.substring(0, 10)}</Text>
        </View>
        <View style={styles.cardRayon2}>
          <View style={styles.cardRayon2Sous}>
            <View style={styles.cardRayon2SousPracticien}>
              <Text style={styles.txtLabel}>Practicien: </Text>
              <Text style={styles.txtPracticien}>{elem.practicien}</Text>
            </View>
            <View style={styles.cardRayon2SousPracticien}>
              <Text style={styles.txtLabel}>Pour qui: </Text>
              <Text style={styles.txtNom}>{elem.nom}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.txtNotes}>{elem.notes}</Text>
        <View style={styles.vwInputPhotos}>
          <View key={index} style={styles.photoContainer}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => appuyerPhoto(elem)}
            >
              <Image
                source={{ uri: elem.url[0] }}
                style={styles.imgElemStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.vwButonSupprimer}>
          <TouchableOpacity
            style={styles.btnModal}
            onPress={() => poubelleAppuyee(elem)}
          >
            <Text style={{ color: "white" }}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  documentsDonnes.map((elem, index) => {
    const card = createDocumentCard(elem, index);
    cardArr.push(card);
  });

  documentsDonnesRecherche.map((elem, index) => {
    const card = createDocumentCard(elem, index);
    cardArrRecherche.push(card);
  });

  const searchDocuments = () => {
    setAfficherRechercheScrollView(true);
    const newDocumentsDonnes = [];
    const normalizedSearch = searchInput.trim().toLowerCase(); // Normalise l'entrée de recherche
    documentsDonnes.forEach((doc) => {
      const matchesSearch =
        doc.nom.toLowerCase().includes(normalizedSearch) ||
        doc.practicien?.toLowerCase().includes(normalizedSearch) ||
        doc.notes?.toLowerCase().includes(normalizedSearch) ||
        doc.dateAjoute?.toLowerCase().includes(normalizedSearch);
      if (matchesSearch) {
        newDocumentsDonnes.push(doc);
      }
    });
    setDocumentsDonnesRecherche(newDocumentsDonnes);
    console.log(
      "length documentsDonnesRecherche: ",
      documentsDonnesRecherche.length
    );
  };

  const appuyerPhoto = (doc) => {
    setDocumentChoisi(doc);
    setPhotoModalVisible(true);
  };

  return (
    <TemplateView navigation={navigation}>
      <View style={styles.vwInstructions}>
        <Text style={styles.txtInstructions}> Documents </Text>
      </View>
      <Modal
        visible={documentRedux.modalOuvert}
        animationType="fade"
        transparent={true}
      >
        <VwAjouterDocument
          fermerModal={fermerModalVwAjouterDoc}
          fermerModalSansEffacer={cameraScreenFermerModalSansEffacerRedux}
          navigation={navigation}
          fetchDocumentsData={fetchData}
        />
      </Modal>
      <Modal
        visible={searchModalVisible}
        animationType="fade"
        transparent={true}
      >
        <Modal
          visible={photoModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={styles.photoModalContainer}>
            {documentChoisi && (
              <Image
                source={{ uri: documentChoisi?.url[0] }}
                width={Dimensions.get("screen").width * 0.8}
                height={Dimensions.get("screen").height * 0.8}
              />
            )}
            <TouchableOpacity
              onPress={() => setPhotoModalVisible(false)}
              style={styles.btnModal}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.centeredView}>
          <View style={styles.modalListView}>
            <Text style={styles.modalTitle}>Rechercher</Text>
            <TextInput
              style={styles.listItem}
              placeholder="Rechercher vos documents"
              value={searchInput}
              onChangeText={(text) => setSearchInput(text)}
            ></TextInput>
            {afficherRechercheScrollView && (
              <ScrollView style={styles.scrollView}>
                {cardArrRecherche}
              </ScrollView>
            )}
            <View style={styles.vwRechercheButons}>
              <TouchableOpacity
                onPress={() => searchDocuments()}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>rechercher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setAfficherRechercheScrollView(false);
                  setSearchModalVisible(false);
                  setSearchInput("");
                }}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.container}>
        <View style={styles.vwHaut}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setSearchModalVisible(true)}
          >
            <Text>Rechercher un document</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              if (userRedux.role != "lecteur") {
                dispatch(documentModalRestOuvert());
              } else {
                alert("c'est chitos mon acces est bloqué");
              }
            }}
          >
            <Text>Ajoute un document</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TemplateView>
  );
}
const styles = StyleSheet.create({
  photoModalContainer: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  photoModalImageStyle: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vwInstructions: {
    padding: 20,
  },
  txtInstructions: {
    fontSize: 40,
    fontFamily: "Caveat",
  },
  vwHaut: {
    display: "flex",
    alignItems: "center",
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height * 0.5,
    justifyContent: "space-around",
  },
  btn: {
    display: "flex",
    backgroundColor: "white",
    width: 300,
    height: 50,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    margin: 5,
  },
  modalTitle: {
    fontSize: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  searchBar: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  btnModal: {
    backgroundColor: "pink",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
  },
  scrollView: {
    width: "100%",
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  vwRechercheButons: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "gray",
  },
  vwButonSupprimer: {
    width: "100%",
    alignItems: "center",
  },
  vwBas: {
    width: "100%",
  },
  card: {
    backgroundColor: "#fff", // Background color for the row
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 8,
    // width: Dimensions.get("screen").width * 0.8,
    // Shadow for Android
    elevation: 7,
    flex: 1,
    // backgroundColor: "gray",
  },
  cardRayon1: {
    alignItems: "flex-end",
    paddingBottom: 5,
  },
  txtDate: {
    color: "gray",
  },
  cardRayon2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardRayon2Sous: {},
  cardRayon2SousPracticien: {
    display: "flex",
    flexDirection: "row",
  },
  txtLabel: {
    fontWeight: "bold",
  },
  vwInputPhotos: {
    // backgroundColor: "gray",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
  },
  imgElemStyle: {
    // margin: 10,
    width: 100,
    height: 100,
  },
  photoContainer: {
    alignItems: "flex-end",
    margin: 5,
  },
});
