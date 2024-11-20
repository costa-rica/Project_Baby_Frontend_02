import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";

export default function VwEchec(props) {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalBackground}>
        <Text style={styles.textMessage}>{props.messageError}</Text>
        <TouchableOpacity
          onPress={props.closeModal}
          style={styles.btnModal}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    alignItems: "center",
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
  modalBackground: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width * 0.6,
    height: Dimensions.get("screen").height * 0.3,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  textMessage: {
    padding: 10,
    fontSize: 16,
    textAlign: "center",
  },
});
