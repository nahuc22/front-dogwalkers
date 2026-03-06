import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  FlatList,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import Label from '../components/Label';
import { appColors } from '../utils/appColors';

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { contact } = route.params || {
    contact: {
      name: 'Alex Murray',
      status: 'online',
      image: require('../../assets/users/img-1.png')
    }
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Okay, I'm waiting for a call",
      sender: 'other',
      time: '12:30'
    },
    {
      id: 2,
      text: "Hi! That's great! Let me give you a call and we'll discuss all the details",
      sender: 'me',
      time: '12:30'
    },
    {
      id: 3,
      text: "Okay, I'm waiting for a call",
      sender: 'other',
      time: '12:30'
    }
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.messageBubble,
        item.sender === 'me' ? styles.myMessageBubble : styles.otherMessageBubble
      ]}>
        <Label 
          text={item.text} 
          style={[
            styles.messageText,
            item.sender === 'me' ? styles.myMessageText : styles.otherMessageText
          ]} 
        />
      </View>
      <Label text={item.time} style={styles.messageTime} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          {/* <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialIcons name="arrow-back" size={scale(24)} color="#000" />
          </TouchableOpacity> */}

          <Image 
            source={contact.image}
            style={styles.headerImage}
          />

          <View style={styles.headerInfo}>
            <Label text={contact.name} style={styles.headerName} bold />
            <Label text={contact.status} style={styles.headerStatus} />
          </View>
        </View>

        {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <View style={[styles.inputContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : scale(5) }]}>
        <TouchableOpacity style={styles.attachButton}>
          <MaterialIcons name="add" size={scale(24)} color="#FF7A59" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Aa"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity 
          style={styles.micButton}
          onPress={sendMessage}
        >
          <MaterialIcons 
            name={message.trim() ? "send" : "mic"} 
            size={scale(24)} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    paddingBottom: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: scale(12),
  },
  headerImage: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#E0E0E0',
    marginRight: scale(12),
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: scale(16),
    color: '#000',
  },
  headerStatus: {
    fontSize: scale(12),
    color: '#4CAF50',
  },
  messagesList: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: scale(16),
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderRadius: scale(20),
    marginBottom: scale(4),
  },
  myMessageBubble: {
    backgroundColor: '#FF7A59',
    borderBottomRightRadius: scale(4),
  },
  otherMessageBubble: {
    backgroundColor: '#FFF',
    borderBottomLeftRadius: scale(4),
  },
  messageText: {
    fontSize: scale(14),
    lineHeight: scale(20),
  },
  myMessageText: {
    color: '#FFF',
  },
  otherMessageText: {
    color: '#000',
  },
  messageTime: {
    fontSize: scale(11),
    color: '#999',
    marginHorizontal: scale(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: scale(16),
    paddingTop: scale(12),
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: scale(20),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    fontSize: scale(14),
    maxHeight: scale(100),
  },
  micButton: {
    marginLeft: scale(8),
  },
});
