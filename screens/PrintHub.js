import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';

const getDayColor = (day) => {
  const defaultColor = '#808080';
  const currentDayColor = '#3498db'; // Grey
  const systemDay = moment().format('ddd');
  return day === systemDay ? currentDayColor : defaultColor;
};

const Button = ({ day, onPress, isSelected }) => {
  const buttonColor = getDayColor(day);

  return (
    <TouchableOpacity
      onPress={() => onPress(day)}
      style={[
        styles.buttonContainer,
        { backgroundColor: buttonColor },
        isSelected ? { borderColor: 'green', borderWidth: 2 } : null,
      ]}
    >
      <Text style={styles.button}>{day}</Text>
    </TouchableOpacity>
  );
};

const CardSection = ({ time, period, cardTitle, cardText, color, onDelete }) => {
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
        <View style={cardStyles}>
          <Text style={styles.cardHeader}>Header</Text>
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{cardTitle}</Text>
            <Text style={styles.cardText}>{cardText}</Text>
          </View>
        </View>
      </View>
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdminApp = () => {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState(moment().format('ddd'));
  const [day, setDay] = useState('');
  const [time, setTime] = useState('');
  const [period, setPeriod] = useState('');
  const [subject, setSubject] = useState('');
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);

  useEffect(() => {
    fetchTimetableData();
  }, [selectedDay]);

  const fetchTimetableData = async () => {
    try {
      const response = await axios.get(`http://192.168.43.112:8001/api/teacher/timetable?day=${selectedDay}`);
      const fetchedTimetable = response.data;
      setTimetable(fetchedTimetable);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
    }
  };

  const updateTimetable = async (id, updatedData) => {
    try {
      await axios.put(`http://192.168.43.112:8001/api/teacher/timetable/${id}`, updatedData);
      console.log(`Timetable entry with ID ${id} updated`);
      fetchTimetableData();
    } catch (error) {
      console.error('Error updating timetable entry:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.43.112:8001/api/teacher/timetable/${id}`);
      console.log(`Timetable entry with ID ${id} deleted`);
      fetchTimetableData();
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!day || !time || !period || !subject) {
        console.error('Please fill in all compulsory fields');
        return;
      }

      const formData = {
        time,
        period,
        subject,
        moduleno: module,
        description,
        color: getDayColor(selectedDay), // Set color based on the current day
      };

      const existingEntry = timetable.find((item) => item.day === selectedDay);

      if (existingEntry) {
        updateTimetable(existingEntry._id, formData);
      } else {
        await axios.post('http://192.168.43.112:8001/api/teacher/timetable', {
          day: selectedDay,
          ...formData,
        });

        console.log('Timetable entry posted');
        fetchTimetableData();
      }

      // Clear form fields after submitting
      setDay('');
      setTime('');
      setPeriod('');
      setSubject('');
      setModule('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting timetable data:', error);
    }
  };

  const openDaySheet = () => {
    daySheetRef.current.open();
  };

  const openPeriodSheet = () => {
    periodSheetRef.current.open();
  };

  const openTimeSheet = () => {
    timeSheetRef.current.open();
  };

  const selectDay = (selectedDay) => {
    setSelectedDay(selectedDay);
    setDay(selectedDay);
    daySheetRef.current.close();
  };

  const selectPeriod = (selectedPeriod) => {
    setPeriod(selectedPeriod);
    periodSheetRef.current.close();
  };

  const selectTime = (selectedTime) => {
    setTime(selectedTime);
    timeSheetRef.current.close();
  };

  const showTimePicker = () => {
    setTimePickerVisible(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisible(false);
  };

  const handleTimeConfirm = (selectedTime) => {
    selectTime(moment(selectedTime).format('hh:mm A'));
    hideTimePicker();
  };

  const selectModule = (selectedModule) => {
    setModule(selectedModule);
    moduleSheetRef.current.close();
  };

  const daySheetRef = useRef();
  const periodSheetRef = useRef();
  const timeSheetRef = useRef();
  const moduleSheetRef = useRef();

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.header}>Admin Interface</Text>

      <View style={styles.buttonRow}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Button
            key={day}
            day={day}
            onPress={selectDay}
            isSelected={selectedDay === day}
          />
        ))}
      </View>

      <View style={styles.formContainer}>
        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Day:</Text>
            <TouchableOpacity style={styles.formInput} onPress={openDaySheet}>
              <Text>{day || 'Select day'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Time:</Text>
            <TouchableOpacity onPress={showTimePicker} style={styles.formInput}>
              <Text>{time || 'Select time'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Period:</Text>
            <TouchableOpacity
              style={styles.formInput}
              onPress={openPeriodSheet}
            >
              <Text>{period || 'Select period'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Subject:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter subject"
              value={subject}
              onChangeText={(text) => setSubject(text)}
            />
          </View>
        </View>

        <View style={styles.gridContainer}>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Module:</Text>
            <TouchableOpacity
              style={styles.formInput}
              onPress={() => moduleSheetRef.current.open()}
            >
              <Text style={module ? styles.boldText : ''}>
                {module || 'Select Module'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.formLabel}>Description:</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Enter description"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSubmit}
        >
          <Text style={styles.button}>Submit</Text>
        </TouchableOpacity>
      </View>

      {timetable.map((entry, index) => (
        <CardSection
          key={index}
          time={entry.time}
          period={entry.period}
          cardTitle={`Subject: ${entry.subject}`}
          cardText={`Module: ${entry.moduleno || ''}\nDescription: ${entry.description}`}
          color={entry.color}
          onDelete={() => handleDelete(entry._id)} // Assuming _id is the unique identifier for the entry
        />
      ))}

      <RBSheet
        ref={daySheetRef}
        closeOnDragDown={true}
        height={400}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
      >
        <View style={styles.sheetContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => selectDay(day)}
            >
              <Text style={styles.sheetItem}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>

      <RBSheet
        ref={periodSheetRef}
        closeOnDragDown={true}
        height={500}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
      >
        <View style={styles.sheetContainer}>
          {[...Array(8).keys()].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => selectPeriod(`Lecture ${num + 1}`)}
            >
              <Text style={styles.sheetItem}>{`Lecture ${num + 1}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>

      <RBSheet
        ref={moduleSheetRef}
        closeOnDragDown={true}
        height={400}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          },
        }}
      >
        <View style={styles.sheetContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => selectModule(`Module ${num}`)}
            >
              <Text style={styles.sheetItem}>{`Module ${num}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
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
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    borderRadius: 5,
    backgroundColor: '#3498db',
    borderWidth: 2,
    borderColor: 'transparent', // Initially transparent
  },
  button: {
    fontFamily: 'Poppins',
    color: 'white',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  formInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
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
    maxWidth: 300,
    borderRadius: 5,
    borderWidth: 2.5,
    borderColor: '#E0E1E4',
    padding: 10,
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
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
  },
  sheetContainer: {
    padding: 20,
  },
  sheetItem: {
    fontSize: 18,
    paddingVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '65%',
    alignItems: 'center', // Align text to center within the button
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminApp;

