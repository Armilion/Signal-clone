import { data } from 'browserslist';
import React, {useState, useEffect} from 'react'
import { StyleSheet, View } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { db } from '../firebase';

const ConversationList = ({ id, chatName, enterChat }) => {
    const [lastMessage, setLastMessage ] = useState("");

    useEffect(() => {
        const unsubscribe = db.collection('chats').doc(id).collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((snapshot) => {
            setLastMessage(snapshot.docs[0].data())
        })
        return () => {
            unsubscribe();
        };
    }, [])


    return (
        <View>
            <ListItem key={id} bottomDivider onPress={() => enterChat(id, chatName)}>
                <Avatar source={{ uri: lastMessage?.photoURL || "https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png" }} />
                <ListItem.Content>
                    <ListItem.Title>{chatName}</ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">{lastMessage?.displayName} : {lastMessage?.message}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        </View>
    )
}

export default ConversationList

const styles = StyleSheet.create({})
