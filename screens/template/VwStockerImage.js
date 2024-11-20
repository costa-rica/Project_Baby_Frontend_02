import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ajouterPhoto } from "../../reducers/document";

export default function VwStockerImage(props) {
  const dispatch = useDispatch();
  const documentRedux = useSelector((state) => state.document.value);

  const stockerPhoto = () => {
    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: props.photoCacheUri,
      name: `photo_${Date.now()}.jpg`,
      type: "image/jpeg",
    });

    fetch(`${process.env.EXPO_PUBLIC_API_URL}/document/uploadPhoto`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((resJson) => {
        dispatch(ajouterPhoto(resJson.url));
        props.fermerModalStockerImage();
        props.navigation.navigate("TabNavigator", { screen: "Documents" });
      });
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalBackground}>
        <Text style={styles.textMessage}>Vouliez-vous garder l'image? </Text>

        <View style={styles.photoContainer}>
          <Image
            source={{ uri: props.photoCacheUri }}
            style={styles.imgElemStyle}
          />
        </View>

        <TouchableOpacity
          onPress={() => stockerPhoto()}
          style={styles.btnModal}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Oui</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.fermerModalStockerImage}
          style={styles.btnModal}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Non</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalBackground: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.8,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  imgElemStyle: {
    width: Dimensions.get("screen").width * 0.6,
    height: Dimensions.get("screen").width * 0.6,
  },
  photoContainer: {
    alignItems: "flex-end",
    margin: 5,
  },
  btnModal: {
    display: "flex",
    backgroundColor: "pink",
    borderWidth: 1,
    width: Dimensions.get("screen").width * 0.4,
    padding: 10,
    alignItems: "center",
    borderRadius: 12,
    justifyContent: "space-between",
    marginTop: 10,
  },
  textMessage: {
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
