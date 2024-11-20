# Police

## Utiliser dans notre code

1. creer une style
2. syntax dans le style:

```jsx
  btnText: {
    fontFamily: "Caveat",// <--
    fontSize: 30,
  },
```

## Implémentation du code

- Type: Caveat

1. Telecharger police [Google Font Family Caveat](https://fonts.google.com/share?selection.family=Caveat:wght@400..700)
2. (peut-etre pas necessaire)`npx react-native-asset`
3. App.js - ajouter une useState et useEffect pour charger le police.

```jsx
import React, { useState, useEffect } from "react";
import * as Font from "expo-font";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Caveat: require("./assets/fonts/Caveat-VariableFont_wght.ttf"),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    console.log("--- font NOT loaded");
  } else {
    console.log("--- font loaded");
  }

  return <NavigationContainer></NavigationContainer>;
}
```

4. Pour l'utiliser:

```jsx
const styles = StyleSheet.create({
  btnText: {
    fontFamily: "Caveat",
    fontSize: 30,
  },
});
```
