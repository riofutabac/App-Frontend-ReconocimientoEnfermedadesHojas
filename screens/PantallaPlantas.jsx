import React, { useEffect, useState, useRef } from 'react';

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
        familia: "Anacardiaceae",
        enfermedadesInfo: `
            - Die back (Marchitez): Una enfermedad que causa el marchitamiento y muerte de las ramas, causada por diversos factores como hongos, bacterias o estrés ambiental.
            - Powdery Mildew (Oídio): Una enfermedad fúngica que forma un polvo blanco en las hojas y brotes nuevos, afectando la salud de la planta.
            - Anthracnose (Antracnosis): Otra enfermedad fúngica que causa manchas necróticas en las hojas y frutos del mango, disminuyendo la producción y calidad.
        `
    },
    {
        id: 2,
        name: 'Banana',
        image: require('../assets/avatars/banana.png'),
        backgroundColor: "#fdf9c4",
        familia: "Musaceae",
        enfermedadesInfo: `
            - Cordana (Mancha de Cordana): Una enfermedad fúngica que afecta las hojas del banano, causando manchas amarillas y necrosis.
            - Sigatoka (Sigatoka Negra): Otra enfermedad fúngica que causa manchas negras en las hojas, reduciendo la fotosíntesis y debilitando la planta.
            - Pestalotiopsis (Mancha Roja): Una enfermedad fúngica que causa manchas rojizas en las hojas y tallos, debilitando la planta.
        `
    },
    {
        id: 3,
        name: 'Tomate',
        image: require('../assets/avatars/tomate.png'),
        backgroundColor: "#fabfb7",
        familia: "Solanaceae",
        enfermedadesInfo: `
            - Powdery Mildew (Oídio): Al igual que en el mango, esta enfermedad fúngica afecta las hojas y brotes del tomate, formando un polvo blanco que reduce la fotosíntesis.
            - Early Blight (Tizón Temprano): Una enfermedad fúngica que provoca manchas oscuras en las hojas inferiores del tomate, extendiéndose gradualmente y afectando la planta en general.
        `
    }
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

    const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
    const [image, setImage] = useState(null);
    const [porcentaje, setPorcentaje] = useState("0%"); // Aquí declaras el estado del porcentaje
    const [enfermedadDetectada, setEnfermedadDetectada] = useState("Enfermedad Detectada"); // Aquí declaras el estado de la enfermedad detectada


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
                url: 'http://192.168.100.132:8000/predict/',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                console.log('Archivo enviado con éxito', response.data);
                const { confianza, enfermedad } = response.data;
                setPorcentaje(`${(confianza * 100).toFixed(2)}%`);
                setEnfermedadDetectada(enfermedad);
            } else {
                console.error('Error al enviar el archivo', response);
            }
        } catch (error) {
            console.error('Error en la solicitud', error);
        }
    };

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
        const response = await sendFileToAPI(result.assets[0].uri, plantaNombre.toLowerCase());
        console.log(plantaNombre);
    };



    const { plantaNombre } = route.params;
    const planta = plantas.find(p => p.name === plantaNombre);




    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
            <View style={styles.container}>
                <View style={[styles.header, { backgroundColor: planta ? planta.backgroundColor : '#DCE7D6' }]}>
                    <View style={styles.headerContent}>
                        <Text style={[styles.text, styles.headerText]}>{plantaNombre}</Text>
                        {planta && (
                            <>
                                <Text style={styles.text}>Familia: </Text>
                                <Text style={[styles.text, styles.familyText]}>{planta.familia}</Text>
                            </>
                        )}
                    </View>
                    {planta && (
                        <Image source={planta.image} style={styles.plantaImage} />
                    )}
                </View>
                <ScrollView>
                    <View style={styles.informationContainer}>
                        <Text style={styles.informationTitle}>Información</Text>
                        <View style={styles.genericTextContainer}>
                            {planta && planta.enfermedadesInfo.split('\n').map((info, index) => (
                                <Text key={index} style={[styles.genericText, styles.justifyText]}>
                                    {info.trim()}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.percentageContainer}>
                            <Text style={styles.percentageText}>{porcentaje}</Text>
                        </View>
                        <View style={styles.diseasesContainer}>
                            <Text style={styles.diseaseTitle}>{enfermedadDetectada}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                                <Text style={styles.photoButtonText}>Elegir Foto</Text>
                            </TouchableOpacity>
                            {image && (
                                <View>
                                    <Image
                                        source={{ uri: 'data:image/jpeg;base64,' + image }}
                                        style={styles.selectedImage}
                                    />
                                </View>
                            )}
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
    familyText: {
        fontWeight: 'bold', // Puedes ajustar los estilos según tus preferencias
        fontStyle: 'italic',
        color: '#333', // Color deseado
    },
    selectedImage: {
        width: 200,
        height: 200,
        borderRadius: 100, // Hace la imagen circular
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginBottom: 20,
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
        padding: 20, // Considera reducir este valor si es necesario
        justifyContent: 'space-between',
    },
    informationTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: -10, // Valor reducido para disminuir espacio
    },
    genericText: {
        textAlign: 'justify',
        lineHeight: 20, // Ajusta este valor según necesites
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
        marginBottom: 20,
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

    justifyText: {
        textAlign: 'justify',
    },
    genericTextContainer: {
        flex: 1,
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
    },

});

export default PantallaPlantas;
