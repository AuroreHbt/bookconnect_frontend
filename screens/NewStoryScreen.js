import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addStory } from "../reducers/story";

// import de PermissionsAndroid & Platform pour gérer l'autorisation d'acces aux dossiers (Android)
// import de Pressable pour gérer les interactions tactiles (onPress, onLongPress etc)
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable
} from "react-native";

// import pour créer une case à cocher
import Checkbox from 'expo-checkbox';

// import pour faire un menu déroulant
import { Picker } from '@react-native-picker/picker';

// import pour utiliser le comoposant Icon de la bibliothèque react-native-vector-icons (/FontAwesome)
import Icon from 'react-native-vector-icons/FontAwesome';

// https://docs.expo.dev/versions/latest/sdk/font/
// https://docs.expo.dev/develop/user-interface/fonts/
// import pour utliser le hook useFonts pour charger la police
import { useFonts } from 'expo-font';

// import pour utiliser des dégradés linéaires (x,y)
import { LinearGradient } from 'expo-linear-gradient';

// import pour accéder aux dossiers du téléphone
// https://docs.expo.dev/versions/latest/sdk/document-picker/#using-with-expo-file-system
import * as DocumentPicker from 'expo-document-picker'

// import pour mettre un spinner de chargement lors du press sur le bouton pour le délai d'upload/publication
// https://github.com/SimformSolutionsPvtLtd/react-native-spinner-button/blob/master/README.md
import SpinnerButton from 'react-native-spinner-button';

// composant wrapper pour résoudre cette erreur :
// Warning: A props object containing a "key" prop is being spread into JSX: <Animated(View) key={someKey} {...props} />
const SafeSpinnerButton = React.forwardRef((props, ref) => {
  const { key, ...otherProps } = props;
  return <SpinnerButton ref={ref} {...otherProps} />;
});

const BACKEND_ADDRESS = process.env.EXPO_PUBLIC_BACKEND_ADDRESS


export default function NewStoryScreen({ navigation }) {

  // utilisation google fonts
  const [fontsLoaded] = useFonts({
    'Girassol-Regular': require('../assets/fonts/Girassol-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
  });

  // vérification du chargement de la font
  if (!fontsLoaded) {
    return null;
  };

  // https://reactnavigation.org/docs/navigation-object/#goback
  const goBack = () => navigation.goBack();


  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [description, setDescription] = useState('');

  const [storyFile, setStoryFile] = useState('');
  const [coverImage, setCoverImage] = useState('');

  const [titleError, setTitleError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [descError, setDescError] = useState('');
  const [fileError, setFileError] = useState('');

  const [categorySelected, setCategorySelected] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.value)
  const story = useSelector((state) => state.story.value)

  const dispatch = useDispatch();

  const handleSelectStoryFile = async () => {
    try {
      const document = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "text/plain"],
        copyToCacheDirectory: true,
      });
      setIsLoading(true); // Activer le spinner

      console.log("Résultat brut pour le fichier texte :", document);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (document.canceled || !document.assets || document.assets.length === 0) {
        console.log("Annulé par l'utilisateur");
        setIsLoading(false); // Arrêter le spinner
        return;
      }

      const selectedFile = document.assets[0];
      setStoryFile(selectedFile);
      console.log("Fichier texte sélectionné :", selectedFile.name);
    } catch (error) {
      console.error("Erreur lors de la sélection du fichier texte :", error);
    } finally {
      setIsLoading(false); // Arrêter le chargement une fois terminé
    }
  };

  // fonction qui permet d'accéder au téléphone
  const handleSelectCoverImage = async () => {
    try {
      const image = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png", "image/jpg"],
        copyToCacheDirectory: true,
      });
      setIsLoading(true); // Activer le spinner

      console.log("Résultat brut pour l'image :", image);

      // Vérifiez si l'utilisateur a annulé ou si `assets` est vide
      if (image.canceled || !image.assets || image.assets.length === 0) {
        console.log("Sélection annulée pour l'image.");
        setIsLoading(false); // Arrêter le spinner
        return;
      }
      const selectedImage = image.assets[0];
      setCoverImage(selectedImage);
      console.log("Image sélectionnée :", selectedImage.name);
    } catch (error) {
      console.error("Erreur lors de la sélection de l'image :", error);
    } finally {
      setIsLoading(false); // Arrêter le chargement une fois terminé
    }
  };

  const handlePostStory = async () => {
    console.log("Contenu actuel de story :", story);
    console.log("Titre :", title);
    console.log("Catégorie :", category);
    console.log("Contenu 18+ :", isAdult);
    console.log("Description :", description);
    console.log("Fichier texte :", storyFile);
    console.log("Image de couverture :", coverImage);

    setIsLoading(true); // Activer le spinner

    // validation des champs :
    let hasError = false

    if (!title) {
      setTitleError('Le titre est obligatoire')
      hasError = true
    } else {
      setTitleError('')
    }

    if (!category) {
      setCategoryError('La catégorie est obligatoire')
      hasError = true
    } else {
      setCategoryError('')
    }

    if (!description) {
      setDescError('La description est obligatoire')
      hasError = true
    } else {
      setDescError('')
    }

    if (!storyFile) {
      setFileError('Selectionnez un fichier texte')
      hasError = true
    } else {
      setFileError('')
    }

    // early return pour stopper le code si des erreurs sont détectées:
    if (hasError) {
      setIsLoading(false); // Désactiver le spinner si erreur
      return;
    }

    // création de l'objet formData pour l'envoi de fichiers et de données
    const formData = new FormData();
    formData.append('author', user.username)
    formData.append('title', title)
    formData.append('category', category)
    formData.append("isAdult", isAdult ? true : false)
    formData.append('description', description)
    formData.append('storyFile', {
      uri: storyFile.uri,
      name: storyFile.name,
      type: storyFile.mimeType
    });

    // ajout de la cover (optionnel)
    if (coverImage) {
      formData.append('coverImage', {
        uri: coverImage.uri,
        name: coverImage.name,
        type: coverImage.mimeType
      })
    }

    fetch(`${BACKEND_ADDRESS}/stories/addstory`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("réponse du serveur", data)
        if (data.result) {
          console.log("data.result: ", data.result)
          dispatch(addStory(data.story))
          // console.log("data.story: ", data.story);

          setTitle('')
          setCategory('')
          setIsAdult(false)
          setDescription('')
          setStoryFile('')
          setCoverImage('')
          setIsLoading(false)
          console.log('Histoire publiée avec succès!');
          navigation.navigate('MyPublishedStories')
        } else {
          console.log('erreur lors de la publication', data.error);
        }
      });
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text style={styles.title}>Votre histoire commence ici</Text>
      </View>

      <View style={styles.inputContainer}>

        <View style={styles.titleInputContainer}>
          <TextInput
            placeholder="Titre de votre histoire (obligatoire)"
            onChangeText={(value) => setTitle(value)}
            value={title}
          />
          {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
        </View>

        {/* Catégorie : liste de choix */}
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerText} >Choisir une catégorie (obligatoire) :</Text>
          <Pressable
            style={[
              styles.picker,
              categorySelected ? styles.categorySelected : null
            ]}
          // styles.picker est le style de base toujours appiqué. Si categorySelected est vrai (true=category sélectionné/pressé), styles.categorySelected sera appliqué, sinon null sera ajouté (donc pas de style supplémentaire)
          >
            <Picker
              selectedValue={category}
              onValueChange={(value) => { setCategory(value); setCategorySelected(value) }}
            >
              <Picker.Item label="Autre" value="autre" />
              <Picker.Item label="Autobiographie / Biographie" value="bio" />
              <Picker.Item label="Essai" value="essai" />
              <Picker.Item label="Poésie" value="poesie" />
              <Picker.Item label="Science-Fiction" value="sci-fi" />
              <Picker.Item label="Fantasy" value="fantasy" />
              <Picker.Item label="Romance" value="romance" />
              <Picker.Item label="Policier" value="policier" />
              {/* Ajouter d'autres catégories ici */}
            </Picker>
          </Pressable>
          {categoryError ? <Text style={styles.errorText}>{categoryError}</Text> : null}
        </View>

        <View style={isAdult ? styles.checkBoxTrue : styles.checkBoxContainer}>
          <Text style={styles.textCheckbox}>
            Contenu 18+
          </Text>
          <Checkbox
            value={isAdult}
            onValueChange={(value) => setIsAdult(value)}
            color={isAdult ? '#rgba(216, 72, 21, 0.8)' : undefined}
          />
        </View>

        <View style={styles.inputMultiline} >
          <TextInput
            placeholder="Description (obligatoire), 300 caractères max"
            maxLength={300}
            multiline
            numberOfLines={7}
            onChangeText={(value) => setDescription(value)}
            value={description}
          />
          {descError ? <Text style={styles.errorText}>{descError}</Text> : null}
        </View>

        <View style={styles.fileContainer}>
          <TouchableOpacity
            onPress={handleSelectStoryFile}
          >
            <Text style={styles.fileInput}>
              {storyFile ? storyFile.name : "Choisir un texte"}
            </Text>

            <Icon
              style={styles.iconContainer}
              name="file-text"
              size={24}
              color={storyFile ? 'rgba(216, 72, 21, 0.9)' : 'rgba(211, 211, 211, 1)'}
            />
          </TouchableOpacity>
          {fileError ? <Text style={styles.errorText}>{fileError}</Text> : null}
        </View>

        <View style={styles.fileContainer}>

          <TouchableOpacity
            onPress={handleSelectCoverImage}
          >
            <Text style={styles.fileInput}>
              {coverImage ? coverImage.name : "Choisir une image de couverture"}
            </Text>

            <Icon
              style={styles.iconContainer}
              name="image"
              size={24}
              color={coverImage ? 'rgba(216, 72, 21, 0.9)' : '#D3D3D3'}
            />
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.buttonContainer}>
        <View>
          <View style={styles.spinner}>
            {/* Pour matérialiser le chargement */}
            <SpinnerButton
              key="uniqueKeyForSpinnerButton"
              isLoading={isLoading}
              indicatorCount={10}
              spinnerColor="rgba(216, 72, 21, 0.9)"
              spinnerType="PacmanIndicator"
              buttonStyle={[styles.buttonContainer, styles.spinner]}
              animateHeight={40}
              size={40}
            >
            </SpinnerButton>
          </View>

          <LinearGradient
            colors={['rgba(255, 123, 0, 0.9)', 'rgba(216, 72, 21, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.7 }}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              onPress={handlePostStory}
              style={styles.button}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>Publier</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View>
          <TouchableOpacity
            onPress={goBack}
            style={styles.returnContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.textReturn}>Retour</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAvoidingView>
  );
}


// attention : le StyleSheet doit bien être en dehors de la fonction!
const styles = StyleSheet.create({

  container: {
    flex: 0.95,
    alignItems: "center",
    justifyContent: 'space-evenly',
    marginTop: 50,
    marginBottom: 50,
  },

  title: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontWeight: '400',
    fontSize: 28,
    marginBottom: 10,
    color: 'rgba(55, 27, 12, 0.9)', // #371B0C
    maxWidth: '75%',
  },

  pickerContainer: {
    width: '65%',
  },

  pickerText: {
    textAlign: 'left',
    fontFamily: 'sans-serif',
    fontSize: 16,
    marginBottom: 5,
  },

  categorySelected: {
    backgroundColor: "rgba(255, 123, 0, 0.3)",
    borderRadius: 5,
  },

  picker: {
    backgroundColor: 'rgba(238, 236, 232, 0.9)',
    borderRadius: 5,
  },

  inputContainer: {
    alignItems: 'center',
    width: '100%'
  },

  titleInputContainer: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  inputMultiline: {
    backgroundColor: "#EEECE8",
    paddingVertical: 5,
    borderRadius: 5,
    borderBottomWidth: 0.7,
    borderBottomColor: "rgba(55, 27, 12, 0.50)",
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  checkBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "rgba(238, 236, 232, 0.9)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "65%",
    margin: 10,
  },

  checkBoxTrue: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "rgba(255, 123, 0, 0.3)",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: "65%",
    margin: 10,
  },

  textCheckbox: {
    fontFamily: 'sans-serif',
    fontSize: 16,
    paddingLeft: 10,
  },

  checkBox: {
    paddingRight: 10,
    marginRight: 10,
    width: '60%',
  },

  fileContainer: {
    backgroundColor: "rgba(238, 236, 232, 0.9)", //  #EEECE8
    paddingVertical: 5,
    borderRadius: 5,
    width: "65%",
    paddingLeft: 5,
    margin: 10,
  },

  fileInput: {
    paddingTop: 5,
    paddingLeft: 10,
    height: 30,
  },

  iconContainer: {
    position: 'absolute', // position absolue pour superposer l'icone sur l'input
    top: 3,
    right: 10,
  },

  errorText: {
    textAlign: 'left',
    fontFamily: 'sans-serif',
    fontSize: 16,
    color: 'red',
  },

  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },

  spinner: {
    maxHeight: "5%",
    maxWidth: "50%",
    borderRadius: 15,
    padding: '5%',
    margin: 5,
    borderWidth: 1,
    borderColor: 'red',
  },

  gradientButton: {
    borderRadius: 15,
    alignItems: 'center',
  },

  button: {
    padding: 5,
    margin: 10,
    width: '45%',
  },

  textButton: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white', // 'rgba(55, 27, 12, 0.8)', // #371B0C
  },

  returnContainer: {
    backgroundColor: 'rgba(224, 210, 195, 0.7)', // "#E0D2C3",
    marginVertical: 35,
    borderRadius: 10,
    padding: 10,
    width: '40%',
  },

  textReturn: {
    textAlign: 'center',
    fontFamily: 'sans-serif',
    fontWeight: 'bold',
    fontSize: 16,
    color: "rgba(55, 27, 12, 0.7)",
  },

});


