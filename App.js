import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

const logo = require('./asstes/logo.jpeg');

const API_URL = 'https://api.openai.com/v1/completions'; // URL da API
const YOUR_API_KEY = 'YOUR_API_KEY'; // Chave da API
const MAX_TOKENS = 100; // Quantidade de tokens


export default function Example() {
    // Lista de mensagens
    const [messages, setMessages] = useState([]);

    // Mensagem inicial
    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Ola, como posso te ajudar?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: logo,
                },
            },
        ]);
    }, []);

    // Envia a mensagem para a API
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        );
        const value = messages[0].text;
        callApi(value);
    }, []);

    // Chama a API da OpenAI
    const callApi = async value => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:
                    `Bearer ${YOUR_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                prompt: value,
                max_tokens: MAX_TOKENS,
                temperature: 0,
            }),
        });

        const data = await res.json();

        if (data) {
            const value = data?.choices[0]?.text;
            addNewMessage(value);
            console.log('Data: ', value);
        }
    };

    // Adiciona a mensagem na lista
    const addNewMessage = data => {
        const value = {
            _id: Math.random(999999999999),
            text: data,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'React Native',
                avatar: logo,
            },
        };

        // Adiciona a mensagem na lista
        setMessages(previousMessages => GiftedChat.append(previousMessages, value));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        </SafeAreaView>
    );
}
