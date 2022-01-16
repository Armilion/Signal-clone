import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import { TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Keyboard } from 'react-native';
import firebase from 'firebase/app';
import { db, auth } from '../firebase';
import { SnapshotViewIOS } from 'react-native';

const ChatScreen = ({ navigation, route }) => {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        const unsubscribe = db.collection('chats').doc(route.params.id).collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() })));
        })
        return unsubscribe;
    }, [route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "#fff", opacity: 0.9 },
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Avatar rounded source={{ uri: messages?.[0]?.data.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png"}} />
                    <Text style={{ marginLeft: 10, fontWeight: "400", fontSize: 20 }}>{route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity style={{ marginLeft: 20 }} activeOpacity={0.5} onPress={() => navigation.goBack()} >
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 20, width: 80 }}>
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )
        });
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();
        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: message,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })
            .catch(error => alert(error));

        setMessage('');
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar theme="light" />
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "iOS" ? "padding" : "height"} keyboardVerticalOffset={90}>
                <View style={{ flex: 1, padding: 15 }}>
                    <ScrollView>
                        {messages.map(({ id, data }, index) => {
                            let upperRightRadius = 20;
                            let bottomRightRadius = 20;
                            let elemMarginBottom = 2;
                            if (index > 0) {
                                if (messages[index - 1].data.email === data.email) upperRightRadius = 5;
                            }
                            if (index + 1 < messages.length) {
                                if (messages[index + 1].data.email === data.email) bottomRightRadius = 5;
                                else elemMarginBottom = 15;

                            }
                            return (
                                data.email === auth.currentUser.email ? (
                                    <View key={id} style={[styles.receiverContainer, { borderTopRightRadius: upperRightRadius, borderBottomRightRadius: bottomRightRadius, marginBottom: elemMarginBottom }]}>
                                        <Text style={styles.receiverText}>{data.message}</Text>
                                    </View>
                                ) : (
                                    <View key={id} style={[styles.senderContainer, { borderTopLeftRadius: upperRightRadius, borderBottomLeftRadius: bottomRightRadius, marginBottom: elemMarginBottom }]}>
                                        <Text style={styles.senderText}>{data.message}</Text>
                                    </View>
                                )
                            )
                        })}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput style={styles.textInput} onSubmitEditing={sendMessage} placeholder="Signal message" value={message} onChangeText={(text) => setMessage(text)} />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                            <MaterialIcons name="send" size={24} color="#2B68E6" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView >
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "#ECECEC",
        padding: 10,
        color: 'grey',
        borderRadius: 30
    },
    senderContainer: {
        padding: 15,
        backgroundColor: "#ECECEC",
        marginBottom: 5,
        maxWidth: "80%",
        alignSelf: "flex-start",
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20
    },
    receiverContainer: {
        padding: 15,
        backgroundColor: "#2C6BED",
        marginBottom: 1,
        maxWidth: "80%",
        alignSelf: "flex-end",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20
    },
    senderText: {
        color: "#000",
        fontWeight: "500",
        fontSize: 15
    },
    receiverText: {
        color: "#fff",
        fontWeight: "500",
        fontSize: 15
    }
})
