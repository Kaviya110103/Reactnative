import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DateTimeCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const dayString = currentTime.toLocaleDateString([], { weekday: 'long' });

  return (
    <View style={styles.card}>
      {/* Left Side: Current Time with Seconds */}
      <Text style={styles.timeText}>{timeString}</Text>

      {/* Right Side: Date and Day */}
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{dateString}</Text>
        <Text style={styles.dayText}>{dayString}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    width: '100%', // Increased width to 95%
    alignSelf: 'center',
    marginVertical: 20,
  },
  timeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e7490',
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  dateText: {
    fontSize: 18,
    color: '#0891b2',
  },
  dayText: {
    fontSize: 16,
    color: '#334155',
  },
});

export default DateTimeCard;
