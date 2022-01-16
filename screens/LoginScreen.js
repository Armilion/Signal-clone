import React from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Button, Input, Image } from 'react-native-elements';
import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';
import { validateLogin } from '../validators';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) navigation.replace('Home');
        });

        return () => unsubscribe(); //firebase doc, unsuscribe from the listener when cleaning up on onUnmount to avoid data leaks aka sending data for nothing
    }, []);
    const signIn = () => {
        let data = {
            email: email,
            password: password
        }

        let { valid, errors } = validateLogin(data);
        if (!valid) alert(errors)
        else {
            auth.signInWithEmailAndPassword(email, password)
                .catch(error => alert(error.message));
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />
            <Image source={{ uri: 'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png' }} style={styles.image} />
            <View style={styles.inputContainer}>
                <Input label="Email" autofocus placeholder="Email" onChangeText={value => setEmail(value)} value={email} leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#86939e' }} />
                <Input label="Password" placeholder="Password" onChangeText={value => setPassword(value)} secureTextEntry={true} value={password} leftIcon={{ type: 'font-awesome', name: 'lock', color: '#86939e' }} />
            </View>
            <Button containerStyle={styles.button} onPress={signIn} title='Login' />
            <Button containerStyle={styles.button} onPress={() => navigation.navigate('Register')} type='outline' title='Register' />
        </KeyboardAvoidingView>
    )
}

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
    }

})

export default LoginScreen;
