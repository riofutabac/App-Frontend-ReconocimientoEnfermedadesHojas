import React, { useState } from 'react';
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
    const [photoUploaded, setPhotoUploaded] = useState(false); // Usa esto para controlar la visualización del mensaje de éxito
    const [image, setImage] = useState(null); // Usa esto para guardar la imagen seleccionada [1

    const takePhotoOrSelectFromGallery = async () => {
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
    
        setImage(result.base64); 

     
        const data = new FormData();
        data.append('file', `data:image/jpeg;base64,${result.base64}`);
        data.append('planta', plantaNombre); 
    
        // Envío de la solicitud a la API
        fetch('/predict', {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setPhotoUploaded(true);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
                            <TouchableOpacity style={styles.photoButton} onPress={takePhotoOrSelectFromGallery}>
                                <Text style={styles.photoButtonText}>Elegir Foto</Text>
                            </TouchableOpacity>
                            {photoUploaded && (
                                <View style={styles.successMessageContainer}>
                                    <Text style={styles.successMessageText}>Foto cargada con éxito</Text>
                                </View>
                            )}
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
