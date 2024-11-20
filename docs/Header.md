# HeaderView

- ficher: screens/NavComposants/Header.js
- arguemnts:
  - navigation (optional, navigation object)
  - cacheProfilevwProfil (optional: Boolean)
  - afficherArriére (optional: Boolean)

## Comment utilsizer

1. utilser avec profil icon et aucune navigation arrière:
   - exemple: AcceuilScreen.js

```jsx
<HeaderView navigation={navigation} />
```

2. utilsier sans profile et navigation arrière:
   - exemple: CreerProjet.js

```jsx
<HeaderView
  cacheProfilevwProfil={true}
  navigation={props.navigation}
  afficherArriére={true}
/>
```

## Implémentation du code

### Implémentation du navigation dans Header

1. verifie que le Screen Composant est dedans the bon Navigation

```jsx
<NavigationContainer>
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="CreerProjet" component={CreerProjetScreen} />
    <Stack.Screen name="Profil" component={ProfilScreen} />
  </Stack.Navigator>
</NavigationContainer>
```

2. passer `navigation={navigation}` dans le object qui utiliser le HeaderView
