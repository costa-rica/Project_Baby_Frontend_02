import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import TemplateView from "./template/TemplateView";

export default function AgendaScreen({ navigation }) {
  const mamanRendezVousList = [
    "1er trimestre : Prendre rendez-vous avec un médecin généraliste, gynécologue ou sage-femme pour confirmer la grossesse.",
    "Déclarer la grossesse à la Caf et à l'assurance maladie.",
    "Planifier la 1ère échographie.",
    "Bilan prénatal de prévention avec une sage-femme pour les habitudes de vie.",
    "2ème trimestre : Planifier le 2ème examen prénatal.",
    "Planifier l'entretien prénatal précoce avec sage-femme ou médecin.",
    "3ème trimestre : Prévoir le rendez-vous avec l'anesthésiste.",
    "Déclarer la naissance à l'état civil dans les 5 jours suivant l'accouchement.",
    "Planifier les premiers examens de santé du bébé.",
    "Consulter une sage-femme pour un suivi postnatal.",
    "Prévoir la rééducation périnéale et abdominale.",
  ];

  const babyRendezVousList = [
    "Dans les 8 jours suivant la naissance",
    "Au cours de la 2ème semaine",
    "Avant la fin du 1er mois",
    "1 mois",
    "2 mois",
    "3 mois",
    "4 mois",
    "5 mois",
    "8 mois",
    "11 mois",
    "12 mois",
    "Entre 16 et 18 mois",
    "Entre 23 et 24 mois",
    "2 ans",
    "3 ans",
    "4 ans",
    "5 ans",
    "Entre 8 et 9 ans",
    "Entre 11 et 13 ans",
    "Entre 15 et 16 ans",
  ];
  // State for visibility of different modals
  const [modalVisible, setModalVisible] = useState(false);
  const [mamanModalVisible, setMamanModalVisible] = useState(false);
  const [babyModalVisible, setBabyModalVisible] = useState(false);
  const [agendaModalVisible, setAgendaModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [modifierModalVisible, setModifierModalVisible] = useState(false);
  const [svModalVisible, setSvModalVisible] = useState(false);

  // state to stock appointments's data
  const [selectedDate, setSelectedDate] = useState(""); // Date sélectionnée sur le calendrier
  const [pourQui, setPourQui] = useState(""); // Nom de la personne pour qui le rendez-vous est
  const [practicien, setPracticien] = useState(""); // Nom du praticien
  const [lieu, setLieu] = useState(""); // Lieu du rendez-vous
  const [heure, setHeure] = useState(""); // Heure du rendez-vous
  const [notes, setNotes] = useState(""); // Notes du rendez-vous
  const [pourQuiModif, setPourQuiModif] = useState(""); // Nom modif de la personne pour qui le rendez-vous est
  const [practicienModif, setPracticienModif] = useState(""); // Nom  du practicien modif
  const [lieuModif, setLieuModif] = useState(""); // Lieu modif du rendez-vous
  const [heureModif, setHeureModif] = useState(""); // Heure modif du rendez-vous
  const [notesModif, setNotesModif] = useState(""); // Notes modif du rendez-vous
  const [searchInput, setSearchInput] = useState(""); // Champ de recherche
  const [idArray, setIdArray] = useState([]); // L'id du rendez-vous
  const [rendezVous, setRendezVous] = useState({ rdv: [] }); // Liste des rendez-vous récupérés
  const [rendezVousDuJour, setRendezVousDuJour] = useState([]); // Rendez-vous pour la date sélectionnée
  const [markedDates, setMarkedDates] = useState({}); // Dates marquées sur le calendrier
  const [filteredRendezVous, setFilteredRendezVous] = useState({}); // Rendez-vous filtrés en fonction de la recherche

  // recover user data to reducer
  const user = useSelector((state) => state.user.value); // Données utilisateur dans le store
  const projectToken = user.tokenProject; // Récupère le token de projet de l'utilisateur
  console.log("token :", projectToken);

  // function to open and close modals
  const openModal = () => {
    if (user.role === "lecteur") {
      return alert("c'est chitos mon acces est bloqué");
    } else {
      setModalVisible(true);
    }
  }; // Ouvre le modal d'ajout de rendez-vous
  const closeModal = () => setModalVisible(false); // Ferme le modal d'ajout de rendez-vous
  const openMamanModal = () => setMamanModalVisible(true); // Ouvre le modal des rendez-vous de la mère
  const closeMamanModal = () => setMamanModalVisible(false); // Ferme le modal des rendez-vous de la mère
  const openBabyModal = () => setBabyModalVisible(true); // Ouvre le modal des rendez-vous du bébé
  const closeBabyModal = () => setBabyModalVisible(false); // Ferme le modal des rendez-vous du bébé
  const openAgendaModal = () => setAgendaModalVisible(true); // Ouvre le modal de l'agenda quotidien
  const closeAgendaModal = () => {
    setAgendaModalVisible(false); // Ferme le modal de l'agenda
    setRendezVousDuJour([]); // Réinitialise les rendez-vous quotidiens
  };
  const openSvModalVisible = () => setSvModalVisible(true); // Ouvre la ScrollView modal
  const closeSvModalVisible = () => setSvModalVisible(false); // Ferme la ScrollView modal
  const openSearchModal = () => setSearchModalVisible(true); // Ouvre le modal de recherche
  const closeSearchModal = () => {
    setSearchModalVisible(false); // Ferme le modal de recherche
    setFilteredRendezVous({}); // Réinitialise les rendez-vous filtrés
    setSearchInput(""); // Efface le champ de recherche
    console.log(user); // Affiche les informations utilisateur pour le débogage
  };
  const openModifierModal = (rdvData) => {
    if (user.role === "lecteur") {
      return alert("non non non, tu es simple lecteur");
    } else {
      // Ouvre la modal modifier
      setPourQuiModif(rdvData.pourQui);
      setPracticienModif(rdvData.practicien);
      setLieuModif(rdvData.lieu);
      setHeureModif(rdvData.heure);
      setNotesModif(rdvData.notes);
      setModifierModalVisible(true);
    }
  };
  const closeModifierModal = () => {
    // Ferme la modal modifier
    setModifierModalVisible(false);
    setPourQuiModif("");
    setPracticienModif("");
    setLieuModif("");
    setNotesModif("");
    setHeureModif("");
  };

  // useEffect to recover data at mount of component
  useEffect(() => {
    fetchData();
  }, []);

  //function to fetch data
  const fetchData = () => {
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
  };

  // function to init marker's date with recover appointment
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
        openSvModalVisible(); // Ouvre le modal de l'agenda
      } else {
        openModal(); // Ouvre le modal d'ajout de rendez-vous
      }
    } else {
      console.error("Le format des rendez-vous est incorrect:", error); // Gère les erreurs de format
    }
  };

  // function to create a new appointment
  const handleSubmit = () => {
    if (user.role === "lecteur") {
      return alert("Art or Not tu es bloqué");
    }
    const newRdv = {
      pourQui,
      practicien,
      lieu,
      notes,
      date: selectedDate,
      heure,
    };

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/rdv/${projectToken}`, {
      // Envoie une requête POST
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRdv), // Contenu de la requête en JSON
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        if (data.result === true) {
          // Vérifie que la création est réussie
          setRendezVous([...data.result, newRdv]);
          initializeMarkedDates([...data.result, newRdv]); // Met à jour les dates marquées
        }
        fetchData();
      })
      .catch((error) => console.error("Erreur lors de la requête :", error)); // Gère les erreurs

    closeModal();
    setPourQui("");
    setPracticien("");
    setLieu("");
    setNotes("");
    setHeure("");
  };

  // function to search appointment
  const handleSearch = () => {
    const normalizedSearch = searchInput.trim().toLowerCase(); // Normalise l'entrée de recherche
    console.log("Valeur de recherche :", searchInput); // Affiche la recherche pour débogage

    if (!Array.isArray(rendezVous.rdv)) {
      // Vérifie que les rendez-vous sont valides
      console.error("Données de rendez-vous manquantes ou incorrectes");
      setFilteredRendezVous({});
      return;
    }

    const structuredFilteredRdv = {}; // Initialisation d'un objet pour stocker les rendez-vous filtrés
    rendezVous.rdv.forEach((rdv) => {
      // Parcourt chaque rendez-vous
      const dateKey = rdv.date.split("T")[0]; // Extrait la date
      const matchesSearch =
        rdv.pourQui.toLowerCase().includes(normalizedSearch) ||
        rdv.practicien.toLowerCase().includes(normalizedSearch) ||
        rdv.lieu.toLowerCase().includes(normalizedSearch) ||
        rdv.notes.toLowerCase().includes(normalizedSearch); // Vérifie la correspondance avec la recherche

      if (matchesSearch) {
        // Si une correspondance est trouvée
        if (!structuredFilteredRdv[dateKey]) {
          structuredFilteredRdv[dateKey] = [];
        }
        structuredFilteredRdv[dateKey].push(rdv); // Ajoute le rendez-vous à la date correspondante
      }
    });
    setFilteredRendezVous(structuredFilteredRdv); // Met à jour les rendez-vous filtrés
  };

  // function to delete appointment
  const handleDelete = (rdvId) => {
    if (user.role === "lecteur") {
      return alert("ne fout pas ta merde, tu es simple lecteur");
    }
    console.log("Vérification de l'ID dans handleDelete:", rdvId);

    if (!rdvId) {
      console.error("L'identifiant du rendez-vous est manquant");
      return;
    }

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/rdv/${projectToken}/${rdvId}`, {
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
  };

  // Fonction pour mettre à jour un rendez-vous
  const handleUpdate = (rdvId) => {
    console.log("ID du rendez-vous à mettre à jour :", rdvId);
    // Création d'un objet représentant le rendez-vous mis à jour avec les nouvelles informations

    const updatedRdv = {
      pourQui: pourQuiModif, // Nom de la personne pour qui le rendez-vous est
      practicien: practicienModif, // Praticien
      lieu: lieuModif, // Lieu du rendez-vous
      notes: notesModif, // Notes supplémentaires
      heure: heureModif, // Nouvelle heure du rendez-vous
    };

    console.log(updatedRdv);

    // Fait une requête PUT pour mettre à jour le rendez-vous avec les nouvelles informations
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/rdv/${projectToken}/${rdvId}`, {
      method: "PUT", // Spécifie la méthode PUT pour la mise à jour
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRdv), // Convertit l'objet updatedRdv en JSON pour l'envoyer
    })
      .then((response) => response.json()) // Convertit la réponse en JSON
      .then((data) => {
        // Vérifie si la mise à jour a été réussie
        if (data.result === true) {
        }
        // Met à jour l'état des rendez-vous en remplaçant l'ancien par le nouveau rendez-vous mis à jour
        fetchData();
        closeModifierModal();
      })
      .catch((error) =>
        // Affiche un message d'erreur en cas de problème lors de la mise à jour
        console.error("Erreur lors de la mise à jour :", error)
      );
  };

  return (
    <TemplateView navigation={navigation}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.background}
      >
        <View style={styles.vwInstructions}>
          <Text style={styles.txtInstructions}> Agenda </Text>
        </View>
        <View style={styles.div_btn}>
          <TouchableOpacity style={styles.btn} onPress={openSearchModal}>
            <Text>Rechercher un rendez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={openAgendaModal}>
            <Text>Voir agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={openMamanModal}>
            <Text>Guide maman rendez-vous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn} onPress={openBabyModal}>
            <Text>Guide baby rendez-vous</Text>
          </TouchableOpacity>
        </View>
        <Modal visible={searchModalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalListView}>
              <Text style={styles.modalTitle}>Rechercher</Text>
              <TextInput
                style={styles.listItem}
                placeholder="Rechercher un rendez-vous"
                value={searchInput}
                onChangeText={(text) => setSearchInput(text)}
              />
              <ScrollView style={styles.scrollView}>
                {Object.keys(filteredRendezVous).map((date) => (
                  <View key={date} style={styles.listItem}>
                    <Text style={styles.dateText}>{date}</Text>
                    {filteredRendezVous[date].map((rdv, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text>Pour : {rdv.pourQui}</Text>
                        <Text>Praticien : {rdv.practicien}</Text>
                        <Text>Lieu : {rdv.lieu}</Text>
                        <Text>Heure : {rdv.heure}</Text>
                        <Text>Notes : {rdv.notes}</Text>
                        <TouchableOpacity
                          style={styles.btnModal}
                          title="Modifier"
                          onPress={() => openModifierModal(rdv)}
                        >
                          <Text>Modifier</Text>
                          <Modal
                            visible={modifierModalVisible}
                            animationType="fade"
                            transparent
                          >
                            <View style={styles.centeredView}>
                              <View style={styles.modalListView}>
                                <Text style={styles.modalTitle}>Modifier</Text>
                                <TextInput
                                  style={styles.listItem}
                                  value={pourQuiModif}
                                  onChangeText={(text) => setPourQuiModif(text)}
                                />
                                <TextInput
                                  style={styles.listItem}
                                  value={practicienModif}
                                  onChangeText={(text) =>
                                    setPracticienModif(text)
                                  }
                                />
                                <TextInput
                                  style={styles.listItem}
                                  value={lieuModif}
                                  onChangeText={(text) => setLieuModif(text)}
                                />
                                <TextInput
                                  style={styles.listItem}
                                  value={heureModif}
                                  onChangeText={(text) => setHeureModif(text)}
                                />
                                <TextInput
                                  style={styles.listItem}
                                  value={notesModif}
                                  onChangeText={(text) => setNotesModif(text)}
                                />
                                <TouchableOpacity
                                  style={styles.btnModal}
                                  title="Modifier"
                                  onPress={() => handleUpdate(rdv._id)}
                                >
                                  <Text>Modifier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.btnModal}
                                  title="Fermer"
                                  onPress={closeModifierModal}
                                >
                                  <Text>Fermer</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </Modal>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.btnModal}
                          title="Supprim er"
                          onPress={() => {
                            if (rdv._id) {
                              handleDelete(rdv._id);
                            } else {
                              console.error(
                                "L'ID du rendez-vous est manquant :",
                                rdv
                              );
                            }
                          }}
                        >
                          <Text>Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={handleSearch}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>rechercher</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeSearchModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={modalVisible} animationType="fade" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Nouveau Rendez-vous</Text>
              <Text>Date sélectionnée : {selectedDate}</Text>
              {rendezVous[selectedDate] &&
                rendezVous[selectedDate].length > 0 && (
                  <View>
                    <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                      Rendez-vous existants :
                    </Text>
                    {rendezVous[selectedDate].map((rdv, index) => (
                      <View key={index} style={styles.listItem}>
                        <Text>Pour : {rdv.pourQui}</Text>
                        <Text>Praticien : {rdv.practicien}</Text>
                        <Text>Lieu : {rdv.lieu}</Text>
                        <Text>Heure : {rdv.heure}</Text>
                        <Text>Notes : {rdv.notes}</Text>
                      </View>
                    ))}
                  </View>
                )}
              <TextInput
                placeholder="Pour Qui"
                style={styles.input}
                value={pourQui}
                onChangeText={(text) => setPourQui(text)}
              />
              <TextInput
                placeholder="Praticien"
                style={styles.input}
                value={practicien}
                onChangeText={(text) => setPracticien(text)}
              />
              <TextInput
                placeholder="Lieu"
                style={styles.input}
                value={lieu}
                onChangeText={(text) => setLieu(text)}
              />
              <TextInput
                placeholder="Heure"
                style={styles.input}
                value={heure}
                onChangeText={(text) => setHeure(text)}
              />
              <TextInput
                placeholder="Notes"
                style={styles.input}
                value={notes}
                onChangeText={(text) => setNotes(text)}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Sauvegarder</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={mamanModalVisible} animationType="slide" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalListView}>
              <Text style={styles.modalTitle}>Maman rendez-vous</Text>
              <ScrollView style={styles.scrollView}>
                {mamanRendezVousList.map((rdv, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text>{rdv}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={closeMamanModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={babyModalVisible} animationType="slide" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalListView}>
              <Text style={styles.modalTitle}>Baby rendez-vous</Text>
              <ScrollView style={styles.scrollView}>
                {babyRendezVousList.map((rdv, index) => (
                  <View key={index} style={styles.listItem}>
                    <Text>{rdv}</Text>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={closeBabyModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal visible={agendaModalVisible} animationType="slide" transparent>
          <View style={styles.centeredView}>
            <View style={styles.modalListView}>
              <Text style={styles.modalTitle}>Agenda</Text>
              <Calendar
                onDayPress={handleDayPress}
                style={{ borderRadius: 10, elevation: 4, margin: 40 }}
                minDate={"2024-10-31"}
                maxDate={"2035-12-31"}
                markedDates={markedDates}
              />
              <TouchableOpacity
                onPress={closeAgendaModal}
                style={styles.btnModal}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Fermer</Text>
              </TouchableOpacity>
              <Modal
                visible={svModalVisible}
                animationType="slides"
                transparent
              >
                <View style={styles.centeredView}>
                  <View style={styles.modalListView}>
                    <ScrollView style={styles.scrollView}>
                      <Text style={styles.modalTitle}>
                        Rendez-vous pour le {selectedDate}
                      </Text>
                      {rendezVousDuJour.length > 0 ? (
                        rendezVousDuJour.map((rdv, index) => (
                          <View key={index} style={styles.listItem}>
                            <Text>Pour : {rdv.pourQui}</Text>
                            <Text>Praticien : {rdv.practicien}</Text>
                            <Text>Lieu : {rdv.lieu}</Text>
                            <Text>Heure : {rdv.heure}</Text>
                            <Text>Notes : {rdv.notes}</Text>
                            <TouchableOpacity
                              style={styles.btnModal}
                              title="Modifier"
                              onPress={() => openModifierModal(rdv)}
                            >
                              <Text>Modifier</Text>
                              <Modal
                                visible={modifierModalVisible}
                                animationType="fade"
                                transparent
                              >
                                <View style={styles.centeredView}>
                                  <View style={styles.modalListView}>
                                    <Text style={styles.modalTitle}>
                                      Modifier
                                    </Text>
                                    <TextInput
                                      style={styles.listItem}
                                      value={pourQuiModif}
                                      onChangeText={(text) =>
                                        setPourQuiModif(text)
                                      }
                                    />
                                    <TextInput
                                      style={styles.listItem}
                                      value={practicienModif}
                                      onChangeText={(text) =>
                                        setPracticienModif(text)
                                      }
                                    />
                                    <TextInput
                                      style={styles.listItem}
                                      value={lieuModif}
                                      onChangeText={(text) =>
                                        setLieuModif(text)
                                      }
                                    />
                                    <TextInput
                                      style={styles.listItem}
                                      value={heureModif}
                                      onChangeText={(text) =>
                                        setHeureModif(text)
                                      }
                                    />
                                    <TextInput
                                      style={styles.listItem}
                                      value={notesModif}
                                      onChangeText={(text) =>
                                        setNotesModif(text)
                                      }
                                    />
                                    <TouchableOpacity
                                      style={styles.btnModal}
                                      title="Modifier"
                                      onPress={() => handleUpdate(rdv._id)}
                                    >
                                      <Text>Modifier</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      style={styles.btnModal}
                                      title="Fermer"
                                      onPress={closeModifierModal}
                                    >
                                      <Text>Fermer</Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </Modal>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.btnModal}
                              title="Ajouter"
                              onPress={openModal}
                            >
                              <Text>Ajouter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.btnModal}
                              title="Supprimer"
                              onPress={() => handleDelete(rdv._id)}
                            >
                              <Text>Supprimer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.btnModal}
                              title="Fermer"
                              onPress={closeSvModalVisible}
                            >
                              <Text>Fermer</Text>
                            </TouchableOpacity>
                          </View>
                        ))
                      ) : (
                        <Text>Aucun rendez-vous trouvé pour cette date.</Text>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </TemplateView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  div_btn: {
    display: "flex",
    width: 300,
    height: 500,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "space-around",
    margin: 30,
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
  modalView: {
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
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
  scrollView: {
    width: "100%",
  },
  listItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  btnModal: {
    backgroundColor: "pink",
    color: "white",
    borderWidth: 1,
    width: 120,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 5,
    flexWrap: "nowrap",
  },
  input: {
    width: 150,
    borderBottomColor: "pink",
    borderBottomWidth: 1,
    fontSize: 16,
  },
  textButton: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
});
