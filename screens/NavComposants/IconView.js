import { StyleSheet, Text, View } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";

export default function IconView(props) {
  return (
    <View style={styles.container}>
      <View
        style={
          props.focused ? styles.sousContainerFocused : styles.sousContainer
        }
      >
        <FontAwesome
          name={props.iconName}
          size={props.size}
          color={props.color}
        />
        <Text style={styles.textStyle}>{props.screenName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  sousContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sousContainerFocused: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    // opacity: 0.3,// <- ne puex pas utiliser opacity, sinon touts les elements dedans le View aurais le meme opacity
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 5,
  },
  textStyle: {
    color: "#FFFFFF",
    fontSize: 10,
  },
});
