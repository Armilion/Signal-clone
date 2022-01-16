import React, { useLayoutEffect, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { FAB } from 'react-native-elements/dist/buttons/FAB';
import { auth, db } from '../firebase';
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import ConversationList from '../components/ConversationList';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { TouchableOpacity } from 'react-native';
import { HeaderBackButton } from '@react-navigation/stack';
import { Header } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState("");
    const [search, isSearching] = useState(false);
    const [chats, setChats] = useState([]);

    const signeOutUserRoute = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message));
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => header
        })
    }, []);

    useEffect(() => {
        navigation.setOptions({
            header: () => header
        })
    }, [search, searchText]); // Search text is necesary as well if not header input would not update onChangeText

    useEffect(() => {
        const unsubscribe = db.collection('chats').onSnapshot(snapshot => {
            setChats(snapshot.docs.map(doc => ({ id: doc.id, chatName: doc.data().chatName }))) // onSnaphost returns an unsubscribe function, get() doesn't (because it only retrieves data once, doesn't return a listener like onSnapshot())
        })

        /* Both get() and onSnapshot() retrieve data, but get() only retrieves data once while onSnapshot returns a listener that retrieves the data each time there is a modification on a document
        const unsubscribe = db.collection('chats').get()
        .then(data => {
            setChats(data.docs.map(doc => ({ id: doc.id, chatName: doc.data().chatName })))
        }) */
        return () => unsubscribe();
    }, []);

    const userPhoto = (
        <View style={{}}>
            <TouchableOpacity activeOpacity={0.5} onPress={signeOutUserRoute}>
                <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
            </TouchableOpacity>
        </View >
    );

    const searchIcon = (
        <View style={{}}>
            <TouchableOpacity onPress={() => isSearching(true)} activeOpacity={0.5}>
                <AntDesign name="search1" size={28} color="black" />
            </TouchableOpacity>
        </View>
    );

    const cancelIcon = (
        <View style={{}}>
            <TouchableOpacity onPress={() => setSearchText("")} activeOpacity={0.5}>
                <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )

    const goBackIcon = (
        <View>
            <TouchableOpacity activeOpacity={0.5}>
                <HeaderBackButton onPress={() => isSearching(false)} />
            </TouchableOpacity>
        </View>
    );

    const header = (
        <View>
            <Header style="light" placement="left" containerStyle={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: '#fff' }} barStyle="light-content">
                {search ? goBackIcon : userPhoto}
                {search ? <Input autofocus type="text" placeholder="Search" onChangeText={value => setSearchText(value)} value={searchText} rightIcon={searchText ? cancelIcon : <Text />} /> : { text: 'Signal', style: { fontSize: 24, justifyContent: "center" } }}
                {search ? <Text /> : searchIcon}
            </Header>

        </View>
    );

    const enterChat = (id, chatName) => {
        navigation.navigate('Chat', { id, chatName })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar theme="light" />
            <ScrollView style={styles.scrollContainer}>
                {chats.map(({ id, chatName }) => (
                    <ConversationList key={id} id={id} chatName={chatName} enterChat={enterChat} />
                ))}
            </ScrollView>
            <View style={styles.fabContainer}>
                <FAB onPress={() => alert("camera")} style={{ margin: 10 }} color="#fff" icon={<MaterialIcons name="photo-camera" size={26} color="black" />} />
                <FAB onPress={() => navigation.navigate('AddChat')} style={{ margin: 10 }} color="#2C6BED" icon={<MaterialIcons name="edit" size={26} color="white" />} />
            </View>
        </SafeAreaView>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        height: "100%"
    },
    fabContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: 'column'
    }
})
