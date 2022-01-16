import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements/dist/input/Input'
import { TouchableOpacity } from 'react-native';
import { Entypo } from "@expo/vector-icons";
import { Icon, Button } from 'react-native-elements';
import { db } from '../firebase';

const AddChatScreen = ({ navigation }) => {

    const [chatName, setChatName] = useState("");

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Add a new chat'
        })
    }, [])

    const cancelIcon = (
        <View>
            <TouchableOpacity onPress={() => setChatName("")} activeOpacity={0.5}>
                <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )

    const createChat = async () => {
        await db.collection('chats').add({
            chatName: chatName
        })
            .then(() => {
                navigation.goBack();
            })
            .catch(error => alert(error));
    }

    return (
        <View style={styles.container}>
            <Input leftIcon={<Icon name="group" type="fontawesome" color="black" />} placeholder='Enter a chat name' value={chatName} onChangeText={(text) => setChatName(text)} rightIcon={chatName ? cancelIcon : <Text />} onSubmitEditing={createChat} />
            <Button title="Create chat" onPress={createChat} />
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        padding:30,
        height:"100%"
    }
})
