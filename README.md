# Project Baby Frontend

![Project Baby Logo](/assets/images/logo128.png)

## Description

Project Baby est une application qui rassemblera une feuille de route des rendez-vous médicaux, un calendrier avec un agenda connecté afin de créer des rappels et un carnet pour noter les informations concernant l’enfant allant du début de grossesse jusqu’au 2ème anniversaire de l’enfant ainsi que des informations afin de rassurer les “jeunes” parents durant cette aventure...

## Installation

Suivez les étapes ci-dessous pour installer et configurer ce projet en local.

1. Clonez le dépôt :  
   Clonez le dépôt GitHub en utilisant la commande suivante :

```bash
git clone https://github.com/tybouddha/Project_Baby_Frontend.git
```

2. Installez les dépendances :
   Assurez-vous que toutes les dépendances du projet sont installées en exécutant la commande suivante : `yarn install`
3. Lancez le appli :
   Pour démarrer l’application en mode de développement, utilisez la commande suivante : `yarn start`

## Variables environnementales avec Expo

1. Crée un .env.local
2. dans .env.local utiliser le prefix: `EXPO_PUBLIC_`
   - exemple: `EXPO_PUBLIC_API_URL=http://<votre_IP_address_local>:3000`
3. Pour l'utilser: `process.env.EXPO_PUBLIC_API_URL`

- "The Expo CLI will automatically load environment variables with an EXPO*PUBLIC* prefix from .env files"
- source: [https://docs.expo.dev/guides/environment-variables/](https://docs.expo.dev/guides/environment-variables/)

## Git command

- créer un branch: ` git branch [nom_de_branch]`
- voir touts les branch: `git branch`
- pull branch direct `git pull origin [nom_de_branch]`
- suppreimer branch `git branch -d [nom_de_branch]`

## Installation de Navigation

le depart de ce projet est `npx create-expo-app@latest --template`

1. Navigation

```bash
yarn add @react-navigation/native@6
expo install react-native-screens react-native-safe-area-context
```

Stack navigation:
`yarn add @react-navigation/native-stack@6`
Tab navigation:
`yarn add @react-navigation/bottom-tabs@6`

2. FontAwesome
   `yarn add @fortawesome/react-native-fontawesome @fortawesome/fontawesome-svg-core react-native-svg`
   `yarn add @fortawesome/free-solid-svg-icons`

## Autres références de code

1. [Header](./docs/Header.md)
2. [Police](./docs/Police.md)
3. [AutresDetails](./docs/AutresDetails.md)

4. Les templates

   1. TemplateView
      - children est le nom (syntax) de propertié pour touts les trucs entre le balise `<TemplateView>{children}<TemplateView/>`
      - exemple: DocumentsScreen.js, CarenetBebeScreen.js
   2. TemplateViewNoNav
      - Les Propétiés:
        - navigation (navigation Object )
        - cacheProfilevwProfil (Boolean, true => cache le profil icon)
        - afficherArriére (Boolean, true => ajouter une flesh pour aller au derniér écran)
      - children est le nom (syntax) de propertié pour touts les trucs entre le balise `<TemplateViewNoNav>{children}<TemplateViewNoNav/>`
      - ce template n'ai pas de profil icon et peux avoir une flesh pour aller au dernieres écran.
      - exemple: CreerProjet.js, WelcomScreen.js

5. Ficher Chercher (est-il utiliser???)

   1. ajouter `yarn add react-native-fs`

6. DocumentScreen.js: useFocusEffect & useCallback()

   - le modal besoin de est overt et rempli avec les infos que le utilisteur a mis avant d'aller a le Camera. donc avec le document redux on sauvagard touts les donnes. Puis avec le useFocusEffect & useCallback() on re-afficher le modal et rempli avec les infos stocker dans le redux.
   - expliquir comment le useCallback() fonctionne
   - expliquir comment le useFocusEffect fonctionne

7. Camera

   - installer: `expo install expo-camera`
   - implementation voir: faceup-part3 / front

   - sdk 51 is no good
   - to use 52 it is perhaps possible with expo-camera/legacy: https://stackoverflow.com/questions/78651536/expo-camera-cannot-read-property-type-of-undefined
   - or

8. Redux

   - installer: `yarn add react-redux @reduxjs/toolkit`

9. Navigaur dans une autre Screen dans le Tab Navigation

   - `navigation.navigate("TabNavigator", { screen: "Settings" });`

## Recherche infos bebé

## Installation de Android Emulator dans MacOS

1. install watchman `brew install watchman`
2. install JDK `brew install --cask zulu@17`
3. telecharger Android Studio [https://developer.android.com/studio](https://developer.android.com/studio)
4. créer env variables:

```bash
export ANDROID_HOME=/Users/your-username/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

5. `yarn start`

### nettoyer le android dossier

1. dans le racine de le project il y a un android/. Dans ça fait `./gradlew clean`

```bash
cd android
./gradlew clean
```

2. re-install yarn env

```bash
rm -rf node_modules
rm -rf .expo
yarn install   # or `npm install` if you use npm
```
