import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import { encode as atob } from 'base-64';
import axios from 'axios';


const { height } = Dimensions.get('window');

const plantas = [
    {
        id: 1,
        name: 'Mango',
        image: require('../assets/avatars/mango.png'),
        backgroundColor: "#DCE7D6",
    },
    {
        id: 2,
        name: 'Banana',
        image: require('../assets/avatars/banana.png'),
        backgroundColor: "#fdf9c4",
    },
    {
        id: 3,
        name: 'Tomate',
        image: require('../assets/avatars/tomate.png'),
        backgroundColor: "#fabfb7",
    },
];


const sendFileToAPI = async (selectedFileUri, planta) => {

  const formData = new FormData();
  
  formData.append('file', {
    uri: selectedFileUri,
    type: 'image/jpeg', 
    name: 'photo.jpg', 
  });
  formData.append('planta', planta);

  try {
    const response = await axios({
      method: 'post',
      url: 'http://192.168.100.132:8000/predict/', // Asegúrate de que la URL es correcta y apunta al endpoint adecuado
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data', // Esto es importante para el correcto procesamiento del archivo en el servidor
      },
    });

    if (response.status === 200) {
      console.log('Archivo enviado con éxito', response.data);
      return response.data;
    } else {
      console.error('Error al enviar el archivo', response);
    }
  } catch (error) {
    console.error('Error en la solicitud', error);
  }
};


const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
}


const PantallaPlantas = ({ route }) => {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(null); // Usa esto para controlar la visualización del mensaje de éxito
    const [image, setImage] = useState(null); // Usa esto para guardar la imagen seleccionada [1

    useEffect(() => {
        (async () => {
            const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasGalleryPermission(galleryStatus.status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
            base64: true,
        });
    
        if (result.cancelled) {
            return;
        }
    
        setImage(result.assets[0].base64);
    
        const imageBlob = b64toBlob(result.assets[0].base64, 'image/jpeg');
        const file = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' });
    
        if (!file) {
            alert('Please select a file first!');
            return;
        }

        const response = await sendFileToAPI(result.assets[0].uri, 'banana');
    };



    const { plantaNombre } = route.params;
    const planta = plantas.find(p => p.name === plantaNombre);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={styles.container}>

                <View style={[styles.header, { backgroundColor: planta ? planta.backgroundColor : '#DCE7D6' }]}>
                    <View style={styles.headerContent}>
                        <Text style={[styles.text, styles.headerText]}>{plantaNombre}</Text>
                        <Text style={styles.text}>Tipo:</Text>
                        <Text style={styles.text}>Tipo Planta:</Text>
                    </View>
                    {planta && (
                        <Image source={planta.image} style={styles.plantaImage} />
                    )}
                </View>
                <ScrollView >
                    <View style={styles.informationContainer}>
                        <Text style={styles.informationTitle}>Información</Text>
                        <View style={styles.genericTextContainer}>
                            <Text style={[styles.genericText, styles.justifyText]}>
                                La banana es un pilar clave de la economía ecuatoriana, siendo uno de los principales productos de exportación del país. Cultivada principalmente en las regiones costeras como El Oro y Los Ríos, Ecuador destaca por sus variedades de alta calidad, como el Cavendish "Gran Enano" y el "Valery". Este cultivo no solo genera empleo en áreas rurales, sino que también impulsa el crecimiento económico nacional gracias a su demanda global.
                            </Text>
                        </View>
                        <View style={styles.percentageContainer}>
                            <Text style={styles.percentageText}>50%</Text>
                        </View>
                        <View style={styles.diseasesContainer}>
                            <Text style={styles.diseaseTitle}>Enfermedad Detectada</Text>
                        </View>
                        <View style={styles.predictionContainer}>
                            <Text style={styles.predictionTitle}>Recomendaciones:</Text>
                            <Text style={styles.detectedDiseaseTitle}>Enfermedad Dectectada</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Text style={styles.photoButtonText}>Elegir Foto</Text>

                            </TouchableOpacity>
                            <Image
                                                            source={{ uri: 'data:image/jpeg;base64,' + image }}
                                                            style={{ width: 200, height: 200 }}
/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    successMessageContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    successMessageText: {
        fontSize: 16,
        color: '#2ecc71',
    },

    header: {
        height: height * 0.35,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        borderBottomLeftRadius: 50,
        backgroundColor: '#DCE7D6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    headerContent: {
        flex: 1,
        paddingTop: 20,
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    plantaImage: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
    },
    informationContainer: {
        padding: 20,
        justifyContent: 'space-between',

    },
    informationTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    diseasesContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    diseaseTitle: {
        fontSize: 18,
        padding: 10,
        borderRadius: 10,
        color: '#34A853',
    },
    predictionContainer: {
        justifyContent: 'center',
        alignItems: 'right',
        marginBottom: 20,
    },
    predictionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    detectedDiseaseTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    photoButton: {
        backgroundColor: '#2ecc71',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    photoButtonText: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    percentageContainer: {
        alignItems: 'center',
        marginBottom: -10,
    },
    percentageText: {
        fontSize: 18,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',

    },
    genericText: {
        textAlign: 'justify',
    },
    justifyText: {
        textAlign: 'justify',
    },
    genericTextContainer: {
        flex: 1,
        marginBottom: 20,
    },
    scrollView: {
        flex: 1,
    },

});

export default PantallaPlantas;
