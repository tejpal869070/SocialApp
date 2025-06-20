import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ProfileDetailsList = ({ profile }) => {
  const {
    dob,
    gender,
    phone,
    email,
    education,
    profession,
    eatingPreference,
    drinking,
    hobbies,
    relationshipGoal,
    lifestyle,
    city,
  } = profile;

  const details = [
    { label: 'Date of Birth', value: dob, icon: 'calendar-outline', iconType: 'Ionicons' },
    { label: 'Gender', value: gender, icon: 'male-female-outline', iconType: 'Ionicons' },
    { label: 'City', value: city, icon: 'location', iconType: 'Ionicons' },
    { label: 'Phone', value: phone, icon: 'call-outline', iconType: 'Ionicons' },
    { label: 'Email', value: email, icon: 'mail-outline', iconType: 'Ionicons' },
    { label: 'Education', value: education, icon: 'school-outline', iconType: 'Ionicons' },
    { label: 'Profession', value: profession, icon: 'briefcase-outline', iconType: 'Ionicons' },
    { label: 'Eating Preference', value: eatingPreference, icon: 'restaurant-outline', iconType: 'Ionicons' },
    { label: 'Drinking', value: drinking ? 'Yes' : 'No', icon: 'beer-outline', iconType: 'Ionicons' },
    { label: 'Relationship Goal', value: relationshipGoal, icon: 'heart-outline', iconType: 'Ionicons' },
    { label: 'Lifestyle', value: lifestyle, icon: 'walk-outline', iconType: 'Ionicons' },
    ...(hobbies?.length > 0 ? [{ label: 'Hobbies', value: hobbies.join(', '), icon: 'palette', iconType: 'FontAwesome5' }] : []),
  ];

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity activeOpacity={0.8}>
        <LinearGradient
          colors={['#ffffff', '#f1f5f9']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {item.iconType === 'Ionicons' ? (
            <Ionicons name={item.icon} size={28} color="#ff6f61" style={styles.icon} />
          ) : (
            <FontAwesome5 name={item.icon} size={28} color="#ff6f61" style={styles.icon} />
          )}
          <View style={styles.textContainer}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={details}
        keyExtractor={(item) => item.label}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: '#f8fafc',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 0.5,
    borderColor: 'rgba(255, 111, 97, 0.2)',
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#64748b', 
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
});

export default ProfileDetailsList;