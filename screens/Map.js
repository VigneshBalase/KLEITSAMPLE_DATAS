import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const CalendarScreen = () => {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(getCurrentMonthDate());
  const [filteredEvents, setFilteredEvents] = useState([]);

  // Function to get the current date in "YYYY-MM-DD" format for the first day of the current month
  function getCurrentMonthDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  }

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://192.168.43.112:8001/kle/api/teacher/events');

      // Check if there is data available for the selected month
      const hasDataForSelectedMonth = response.data.some((event) => {
        const eventMonth = event.date.substring(0, 7);
        return eventMonth === selectedDate.substring(0, 7);
      });

      if (hasDataForSelectedMonth) {
        const eventsData = {};

        // Convert fetched events to the format expected by react-native-calendars
        response.data.forEach((event) => {
          eventsData[event.date] = {
            selected: true,
            selectedColor: event.color,
          };
        });

        setEvents(eventsData);
        setFilteredEvents(filterEventsByMonth(response.data, selectedDate));
      } else {
        // No data available for the selected month, clear events and filteredEvents
        setEvents({});
        setFilteredEvents([]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Fetch events on component mount and when selectedDate changes
  useEffect(() => {
    fetchEvents();

    // Set up a timer to fetch events every 5 minutes (300,000 milliseconds)
    const refreshTimer = setInterval(() => {
      fetchEvents();
    }, 5000);

    // Clear the timer on component unmount
    return () => clearInterval(refreshTimer);
  }, [selectedDate]); // Fetch events when selectedDate changes

  const filterEventsByMonth = (allEvents, date) => {
    const filtered = allEvents.filter((event) => {
      const eventMonth = event.date.substring(0, 7);
      return eventMonth === date.substring(0, 7);
    });
    return filtered;
  };

  // Function to handle month changes in the Calendar
  const handleMonthChange = (month) => {
    // Update the selectedDate state when the month changes
    const updatedDate = `${month.year}-${String(month.month).padStart(2, '0')}-01`;
    setSelectedDate(updatedDate);

    // Fetch events for the updated date
    fetchEvents();
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text ellipsizeMode='tail' style={styles.userName}>
          {item.date}
        </Text>
        <Text ellipsizeMode='tail' style={styles.userName}>
          {item.title}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <Calendar onDayPress={handleDateSelect} markedDates={events} onMonthChange={handleMonthChange} />
      </View>

      <FlatList
        data={filteredEvents}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
    padding: 10,
  },

  calendar: {
    marginBottom: 10,
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 4,
  },

  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 6,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    marginHorizontal: 4,
    marginVertical: 4,
    height: 40,
  },

  cardContent: {
    marginHorizontal: 28,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  userName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
