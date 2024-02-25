import React, { useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Main = () => {
    const navigation = useNavigation();
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

    const [searchText, setSearchText] = useState('');
    const [filteredPlants, setFilteredPlants] = useState(plantas);

    const handleSearch = (text) => {
        setSearchText(text);
        if (text) {
            const filtered = plantas.filter((item) => 
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPlants(filtered);
        } else {
            setFilteredPlants(plantas);
        }
    };

    const onePlant = ({ item }) => {
        return (
            <TouchableOpacity
                style={[styles.item, {backgroundColor: item.backgroundColor}]}
                onPress={() => navigation.navigate('PantallaPlantas', { plantaNombre: item.name })}
            >
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <View style={[styles.avatarContainer, item.imageStyle]}> 
                        <Image source={item.image} style={styles.avatar} />
                    </View>
                    <Text style={styles.name}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    

    const headerComponent = () => {
        return (
            <View style={styles.headerContainer}>
                <Ionicons name="leaf" size={24} color="#34A853" />
                <Text style={[styles.headerBase, styles.plantsHeader]}>Plantas</Text>
                <View style={styles.headerLine}></View>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF' }}>
            <SafeAreaView style={{ backgroundColor: '#FFF'}}/>
            <View style={styles.TextInputContainer}>
                <Ionicons name="search" size={24} color="#34A853" style={styles.searchIcon} />
                <TextInput 
                    placeholder="Buscar"
                    value={searchText}
                    onChangeText={handleSearch}
                    style={styles.TextInput}
                />
            </View>
            <SafeAreaView>
                <FlatList
                    ListHeaderComponent={headerComponent}
                    data={filteredPlants}
                    renderItem={onePlant}
                    ListEmptyComponent={<Text>No hay plantas</Text>}
                    keyExtractor={item => item.id.toString()} 
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    TextInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        margin: 20,
        borderRadius: 25,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },

    TextInput: {
        fontSize: 18,
        paddingVertical: 10,
        paddingLeft: 60,
        flex:1,
    },
    
    listHeader: {
        height: 90,
        justifyContent: "center",
        alignItems: "center",
    },

    item: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 25,
        marginHorizontal: 20,
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    searchIcon: {
        position: 'absolute',
        left: 20,
        top: '50%',
        transform: [{ translateY: -12 }],
        margin: 10,
    },

    avatar: {
        width: 80, 
        height: 80,
        position: 'absolute', 
        bottom: -10, 
        right: -30,
    },

    avatarContainer: {
        borderRadius: 100,
        height: 70, 
        width: 70,
        justifyContent: "center",
        alignItems: "center",
        overflow: 'visible', 
        marginRight: 15,
    },

    name: {
        fontWeight: "600",
        fontSize: 20,
        marginLeft: 40,
    },

    separator: {
        height: 1,
        width: "100%",
        backgroundColor: "#CCC",
    },

    headerBase: {
        paddingVertical: 20, 
        alignItems: "center",
        justifyContent: "center",
    },
    
   
    plantsHeader: {
        fontSize: 15, 
        color: "#34A853", 
        fontWeight: "bold",
    },

    headerLine: {
        height: 5, 
        width: "15%", 
        backgroundColor: "#34A853", 
        marginTop: -7,
    },

    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
    },
});

export default Main;
