import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import HeaderView from "./NavComposants/Header";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function AcceuilScreen({ navigation }) {
  const user = useSelector((state) => state.user.value);
  const username = user.username;
  const projectToken = user.tokenProject;
  const [selectedDate, setSelectedDate] = useState(""); // Date sélectionnée sur le calendrier
  const [agendaModalVisible, setAgendaModalVisible] = useState(false);
  const [rendezVousDuJour, setRendezVousDuJour] = useState([]); // Rendez-vous pour la date sélectionnée
  const closeAgendaModal = () => {
    setAgendaModalVisible(false); // Ferme le modal de l'agenda
    setRendezVousDuJour([]); // Réinitialise les rendez-vous quotidiens
  };
  const [mamanModalVisible, setMamanModalVisible] = useState(false);
  const [babyModalVisible, setBabyModalVisible] = useState(false);
  //hook for update the modal and open the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [role, setrole] = useState("lecteur");
  const [link, setlink] = useState("link");
  const [markedDates, setMarkedDates] = useState({}); // Dates marquées sur le calendrier
  const [idArray, setIdArray] = useState([]); // L'id du rendez-vous
  const [rendezVous, setRendezVous] = useState({ rdv: [] }); // Liste des rendez-vous récupérés

  const guideNutritionMaman = [
    "Les besoins nutritionnels lors de la grossesse sont bien spécifiques : les besoins en énergie augmentent dès le 2e trimestre et surtout lors du 3e et des besoins spécifiques apparaissent : besoins supplémentaires en fer, en calcium et en vitamines.",
    "Une alimentation équilibrée et énergétique essentielle pour le bon développement du bébé.",
    "L'apport énergétique par l'alimentation ne doit pas être inférieur à 1 600 kcal/jour au risque d'avoir une répercussion sur la croissance du fœtus. Pour couvrir les besoins nutritionnels, l'alimentation doit être diversifiée et équilibrée.",
    "Une alimentation équilibrée, c'est manger :cinq fruits et légumes par jour",
    "du pain, des céréales et d'autres sucres lents (légumineuses) à chaque repas selon votre appétit",
    "des produits laitiers trois fois par jour",
    "des protéines (viande, poisson ou œufs), chaque jour ;",
    "de l'eau à volonté.",
    "Il est important également de limiter sa consommation de matières grasses, de sel et de produits sucrés. Pour ces derniers, privilégiez les sucres lents (féculents, céréales, pain, légumes secs) et prenez l'habitude de les intégrer à tous vos repas.",
  ];
  const guideNutritionBebe = [
    "Le lait constitue l’aliment essentiel et unique du bébé de sa naissance à l’âge de 6 mois. Il contient tous les nutriments nécessaires à sa croissance et à la prévention des infections. Que ce soit au sein ou au biberon, la tétée est un moment d'échange privilégié avec votre enfant.",
    "Les bénéfices de l'allaitement maternel pour le bébé Outre le lien relationnel mère-enfant, l'allaitement apporte au nourrisson tout ce dont il a besoin pour se développer.",
    "Même si l'allaitement ne dure que quelques semaines, il est bénéfique à votre enfant. En effet, le lait maternel est facile à digérer et il est vite assimilé. Le lait maternel est riche en anticorps, vitamines, sels minéraux, oligo-éléments, sucres, graisses, protéines... Tout ce dont votre bébé a besoin pour bien démarrer dans la vie.",
    "L'allaitement maternel est également bénéfique pour la maman car il :permet une perte de poids plus rapide dans les 6 premiers mois après l'accouchement,diminue le risque de survenue ultérieure d'un diabète de type 2,réduit à long terme le risque de cancer du sein ou de l'ovaire avant la ménopause,aurait également un rôle dans la prévention de l'ostéoporose après la ménopause.",
  ];
  const directionalimentation = () => setMamanModalVisible(true); // Ouvre le modal des guides nutritions de la mère
  const closeguideMamanModal = () => setMamanModalVisible(false); // ferme le modal des guides nutritions de la mère
  const directionalimentationBebe = () => setBabyModalVisible(true); //Ouvre le modal des guides nutritions de la mère
  const closeguideBabyModal = () => setBabyModalVisible(false);

  const handleSubmit = () => {
    if (user.role !== "propriétaire") {
      return alert("c'est chitos mon acces est bloqué");
    } else {
      setModalVisible(true);
      // console.log(projectToken);
      // console.log(user);
    }
  };
  // useEffect to recover data at mount of component
  useEffect(() => {
    if (projectToken) {
      fetch(
        // Fait une requête pour récupérer les rendez-vous de l'utilisateur
        `${process.env.EXPO_PUBLIC_API_URL}/rdv/${projectToken}`
      )
        .then((response) => response.json()) // Transforme la réponse en JSON
        .then((data) => {
          if (data.rdv) {
            for (const elem of data.rdv) {
              setIdArray([...idArray, elem._id]);
            }
            // Si des rendez-vous sont trouvés
            setRendezVous({ rdv: data.rdv }); // Stocke les rendez-vous récupérés
            initializeMarkedDates(data.rdv);

            // Initialise les dates marquées avec les rendez-vous récupérés
          } else {
            setRendezVous({ rdv: [] }); // Sinon, définit les rendez-vous comme vide
            setMarkedDates({}); // Réinitialise les dates marquées
          }
        })
        .catch(
          (
            error // Gère les erreurs de requête
          ) =>
            console.error("Erreur lors de la récupération des données :", error)
        );
    }
  }, [projectToken]);

  const initializeMarkedDates = (appointments) => {
    const newMarkedDates = {};
    if (Array.isArray(appointments)) {
      for (const appointment of appointments) {
        const date = appointment.date.split("T")[0];
        newMarkedDates[date] = { marked: true, dotColor: "blue" };
      }
    }
    setMarkedDates(newMarkedDates);
  };

  //function for set and choose the acces for invite
  const toggleSwitch = () => {
    setrole(role === "lecteur" ? "editeur" : "lecteur");

    // console.log(role);
  };
  const generateCode = () => {
    const bodyObj = {
      token: projectToken,
      roles: role,
    };
    if (bodyObj) {
      const inviteLink = `${projectToken}/${role}`;
      // console.log(bodyObj);
      setlink(inviteLink);
      // console.log("test1", inviteLink);
    }
  };
  //function to get the page for guide

  const handleClose = () => {
    setlink("");
    setModalVisible(false);
  };
  // function trigger when select date in calendar
  const handleDayPress = (day) => {
    const dateKey = day.dateString; // Récupère la date sous forme de chaîne
    setSelectedDate(dateKey); // Définit la date sélectionnée

    if (Array.isArray(rendezVous.rdv)) {
      // Vérifie que rendezVous.rdv est un tableau
      const rendezVousDuJour = rendezVous.rdv.filter(
        (rdv) => rdv.date.split("T")[0] === dateKey // Filtre les rendez-vous pour la date sélectionnée
      );

      if (rendezVousDuJour.length > 0) {
        // Si des rendez-vous sont trouvés
        setRendezVousDuJour(rendezVousDuJour); // Met à jour les rendez-vous du jour
        setAgendaModalVisible(true); // Ouvre le modal de l'agenda
      }
    } else {
      console.error("Le format des rendez-vous est incorrect:", error); // Gère les erreurs de format
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/projectbaby-background.jpg")}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <HeaderView navigation={navigation} />
        </View>

        <Text style={styles.title}>Bienvenue {username} sur BabyProject!</Text>

        <View style={styles.div_btn}>
          <TouchableOpacity style={styles.btn} onPress={() => handleSubmit()}>
            <Text>Inviter un proche</Text>
          </TouchableOpacity>
        </View>

        {/* Modal pour l'invitation */}
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                placeholder={"lien d'invitation"}
                value={link}
                style={styles.input}
              />
              <Text style={styles.textrole}>{role}</Text>
              <View style={styles.switchContainer}>
                <Text>Assigner un role</Text>
                <Switch
                  style={styles.toggle}
                  thumbColor={role === "lecteur" ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="black"
                  onValueChange={toggleSwitch}
                  value={role === "lecteur"}
                />
              </View>
              <TouchableOpacity
                onPress={() => generateCode()}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}> Generer le code</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleClose()}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Section du calendrier */}
        <View>
          <Text style={styles.title}>
            Voici le calendrier actualisé de votre Projet!
          </Text>
          <Calendar
            style={styles.calendar}
            onDayPress={handleDayPress}
            minDate={"2024-10-31"}
            maxDate={"2035-12-31"}
            markedDates={markedDates}
          />
        </View>

        {/* Modal pour l'agenda */}
        <Modal visible={agendaModalVisible} animationType="slide" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalListView}>
              <Text style={styles.modalTitle}>Agenda</Text>
              <ScrollView style={styles.scrollView}>
                <Text style={styles.modalTitle}>
                  Rendez-vous pour le {selectedDate}
                </Text>
                {rendezVousDuJour.length > 0 &&
                  rendezVousDuJour.map((rdv, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text>Pour : {rdv.pourQui}</Text>
                      <Text>Praticien : {rdv.practicien}</Text>
                      <Text>Lieu : {rdv.lieu}</Text>
                      <Text>Heure : {rdv.heure}</Text>
                      <Text>Notes : {rdv.notes}</Text>
                    </View>
                  ))}
              </ScrollView>
              <TouchableOpacity
                onPress={closeAgendaModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Section des guides */}
        <View style={styles.viewGuide}>
          <TouchableOpacity
            style={styles.alimentationBTN}
            onPress={() => directionalimentationBebe()}
          >
            <Text>Conseil alimentation bébé</Text>
          </TouchableOpacity>

          {/* Modal pour le guide bébé */}
          <Modal visible={babyModalVisible} animationType="slide" transparent>
            <View style={styles.centeredView}>
              <View style={styles.modalListView}>
                <Text style={styles.modalTitle}>Conseil nutrition bébé</Text>
                <ScrollView style={styles.scrollView}>
                  {guideNutritionBebe.map((rdv, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text>{rdv}</Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={closeguideBabyModal}
                  style={styles.btnModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButton}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={styles.alimentationBTN}
            onPress={() => directionalimentation()}
          >
            <Text>Conseil alimentation maman</Text>
          </TouchableOpacity>

          {/* Modal pour le guide maman */}
          <Modal visible={mamanModalVisible} animationType="slide" transparent>
            <View style={styles.centeredView}>
              <View style={styles.modalListView}>
                <Text style={styles.modalTitle}>Conseil nutrition maman</Text>
                <ScrollView style={styles.scrollView}>
                  {guideNutritionMaman.map((rdv, index) => (
                    <View key={index} style={styles.listItem}>
                      <Text>{rdv}</Text>
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  onPress={closeguideMamanModal}
                  style={styles.btnModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.textButton}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
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

  calendar: {
    borderWidth: 1,
    borderColor: "gray",
    height: 320,
    width: 380,
    marginBottom: 100,
    margin: "auto",
    borderRadius: 15,
  },
  title: {
    fontSize: 30,
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    fontFamily: "Caveat",
  },
  btn: {
    display: "flex",
    backgroundColor: "white",
    borderWidth: 1,
    width: 120,
    height: 30,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    margin: 5,
  },
  div_btn: {
    display: "flex",
    flexDirection: "row-reverse",
    marginBottom: 10,
  },
  header: {
    display: "flex",
    width: Dimensions.get("screen").width,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  btnModal: {
    display: "flex",
    backgroundColor: "pink",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  input: {
    width: 150,
    borderBottomColor: "#ec6e5b",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  toggle: {
    display: "flex",
    width: 120,
    marginTop: 10,
    justifyContent: "center",
  },
  alimentationBTN: {
    display: "flex",
    fontSize: 20,
    height: 50,
    width: 150,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    borderRadius: 20,
  },
  textrole: {
    fontSize: 20,
  },
  modalListView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "65%",
    maxHeight: "70%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollView: {
    width: "100%",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  switchContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  viewGuide: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
