import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { FloatingAction } from 'react-native-floating-action';

const MyComponent = () => {
  const [selectedTab, setSelectedTab] = useState('Attendance');
  const [messages, setMessages] = useState({
    Attendance: 'Welcome to the Attendance screen!',
    'Time-Table': 'Welcome to the Time Table screen!',
    Marks: 'Welcome to the Result screen!',
    Calculator: 'Welcome to the Calculator screen!',
  });
  const [isMessageVisible, setMessageVisibility] = useState(false);

  const actions = [
    {
      text: 'Attendance',
      icon: <Icon name="layout" size={20} color="white" />,
      name: 'btn_layers',
      position: 2,
    },
    {
      text: 'Time-Table',
      icon: <Icon name="clock" size={20} color="white" />,
      name: 'btn_clock',
      position: 1,
    },
    {
      text: 'Marks',
      icon: <Icon name="trending-up" size={20} color="white" />,
      name: 'btn_trending_up',
      position: 3,
    },
    {
      text: 'Calculator',
      icon: <Icon name="grid" size={20} color="white" />,
      name: 'btn_grid',
      position: 4,
    },
  ];

  useEffect(() => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedTab]: `Hello from the ${selectedTab} screen!`,
    }));
  }, [selectedTab]);

  const onActionPress = (name) => {
    console.log(`Button ${name} pressed`);
    setSelectedTab(name);
  };

  const toggleMessageVisibility = () => {
    setMessageVisibility((prevVisibility) => !prevVisibility);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.displayText}>{messages[selectedTab]}</Text>

      <FloatingAction
        actions={actions}
        onPressItem={(name) => onActionPress(name)}
        color="#4CAF50"
        distanceToEdge={{ vertical: 20, horizontal: 20 }}
        floatingIcon={<Icon name="layers" size={25} color="white" />}
      />

      {/* Button to show/hide message */}
      <TouchableOpacity
        style={styles.navigateButton}
        onPress={toggleMessageVisibility}
      >
        <Text style={styles.buttonText}>
          {isMessageVisible ? 'Hide Message' : 'Show Message'}
        </Text>
      </TouchableOpacity>

      {/* Message display */}
      {isMessageVisible && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{messages[selectedTab]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  navigateButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF5733',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  messageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
