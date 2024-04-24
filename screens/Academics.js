import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';
import axios from 'axios';

const App = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(moment().format('ddd'));
  const cardColors = [
    '#F5F5F5', // Light Gray
    '#F0F8FF', // Alice Blue
    '#FAFAD2', // Light Goldenrod Yellow
    '#FFE4B5', // Moccasin
    '#98FB98', // Pale Green
    '#FFDAB9', // Peach Puff
    '#E6E6FA', // Lavender
    '#FFFAF0', // Floral White
    '#D3D3D3', // Light Gray
  ];

  useEffect(() => {
    // Fetch timetable data using axios
    axios.get('http://192.168.43.112:8001/api/teacher/timetable')
      .then(response => {
        setTimetableData(response.data);
      })
      .catch(error => {
        console.error('Error fetching timetable data:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const getDayColor = (day) => {
    // Default color for all days
    const defaultColor = '#808080';

    // You can customize the color for the selected day
    const selectedDayColor = '#3498db'; // Grey

    // If the day matches the selected day, use the selected day color; otherwise, use the default color
    return day === selectedDay ? selectedDayColor : defaultColor;
  };

  const Button = ({ day }) => {
    const buttonColor = getDayColor(day);

    return (
      <TouchableOpacity
        onPress={() => setSelectedDay(day)}
        style={[styles.buttonContainer, { backgroundColor: buttonColor }]}
      >
        <Text style={styles.button}>{day}</Text>
      </TouchableOpacity>
    );
  };

  const CardSection = ({ time, period, subject, moduleno, description, color }) => {
    const cardStyles = {
      ...styles.card,
      backgroundColor: color,
    };

    return (
      <View style={styles.cardContainer}>
        <View style={styles.timeContainer}>
          <Text>{time}</Text>
          <View style={styles.hr} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.periodContainer}>
            <Text style={styles.cardPeriod}>{period}</Text>
          </View>
          <View style={[cardStyles, styles.ovalCard]}>
            <Text style={styles.cardHeader}>{subject}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{moduleno}</Text>
              <Text style={styles.cardText}>{description}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const filteredData = timetableData.filter(entry => entry.day === selectedDay);

  return (
    <ScrollView>
      <Text style={styles.header}>Hello, world!</Text>
      <View style={styles.buttonRow}>
        <Button day="Mon" />
        <Button day="Tue" />
        <Button day="Wed" />
        <Button day="Thu" />
        <Button day="Fri" />
        <Button day="Sat" />
      </View>
      {filteredData.length === 0 ? (
        <Text style={styles.noDataText}>No data available for {selectedDay}</Text>
      ) : (
        filteredData.map((entry, index) => (
          <CardSection
            key={index}
            time={entry.time}
            period={entry.period}
            subject={entry.subject}
            moduleno={entry.moduleno}
            description={entry.description}
            color={cardColors[index % cardColors.length]} // Use modulo to repeat colors if needed
          />
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  buttonContainer: {
    width: 60, // Set a fixed width for the buttons
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderRadius: 5,
  },
  button: {
    fontFamily: 'Poppins',
    color: 'white',
  },
  cardContainer: {
    marginVertical: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  hr: {
    flex: 1,
    height: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  periodContainer: {
    marginRight: 10,
  },
  card: {
    width: '78%',
    borderRadius: 20,
    borderWidth: 2.5,
    borderColor: '#E0E1E4',
    padding: 20,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    shadowOpacity: 0.2,
  },
  cardHeader: {
    marginBottom: 5,
  },
  cardBody: {},
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardPeriod: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
  },
  ovalCard: {
    borderRadius: 20, // Adjust the value as needed
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});

export default App;
