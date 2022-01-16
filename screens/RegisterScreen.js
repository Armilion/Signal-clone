import React from 'react';
import { useState, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, Image, Text } from 'react-native-elements';
import { KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';
import { validateRegister } from '../validators'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [imageURL, setImageURL] = useState('');

    // usefull only on iOS
    useLayoutEffect(() => {
        navigation.setOptions({
            headerBackTitle: 'Login'
        })
    }, [navigation]);

    const register = () => {
        let data = {
            name : name,
            email : email,
            password : password,
            confPassword : confPassword
        }

        const { valid, errors } = validateRegister(data);
        if(!valid){
            alert(errors.name);
            alert(errors.email);
            alert(errors.password);
            alert(errors.confPassword);
        }
        else{
            auth.createUserWithEmailAndPassword(email, password)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName:name,
                    photoURL : imageURL || 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png'
                })
            })
            .catch(error => alert(error.message))
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <Image source={{ uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png' }} style={styles.image} />
            <Text h3 style={styles.header}>Create a Signal account</Text>
            <View style={styles.inputContainer}>
                <Input type="text" autofocus placeholder="Full name" onChangeText={name => setName(name)} value={name} />
                <Input type="text" placeholder="Email" onChangeText={email => setEmail(email)} value={email} />
                <Input type="password" placeholder="Password" onChangeText={pass => setPassword(pass)} secureTextEntry={true} value={password} />
                <Input type="password" placeholder="Confirm password" onChangeText={confPass => setConfPassword(confPass)} secureTextEntry={true} value={confPassword} />
                <Input type="text" placeholder="Profile Image URL (optional)" onChangeText={url => setImageURL(url)} onSubmitEditing={register} value={imageURL} />
            </View>
            <Button raised containerStyle={styles.button} onPress={register} title='Register' />
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: "white"
    },
    inputContainer: {
        width: 300
    },
    image: {
        width: 150,
        height: 150
    },
    button: {
        width: 200,
        marginTop: 10
    },
    header: {
        marginTop: 20,
        marginBottom: 40
    }
})
