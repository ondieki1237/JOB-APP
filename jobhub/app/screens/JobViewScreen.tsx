import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Job } from '../types/job';
import { mockJobs } from '../data/mockJobs';
import { useBookmarks } from '../context/BookmarkContext';

const { width } = Dimensions.get('window');

interface JobViewProps {
  jobId: string;
}

export default function JobViewScreen({ jobId }: JobViewProps) {
  const router = useRouter();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  
  const bookmarked = isBookmarked(jobId);

  const job = mockJobs[jobId] || mockJobs['1'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.push('/(app)/home')}
          >
            <Ionicons name="home-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => toggleBookmark(jobId)}
          >
            <Ionicons 
              name={bookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Job Header Section */}
        <LinearGradient
          colors={['#4630EB', '#5E47F2']}
          style={styles.jobHeader}
        >
          <View style={styles.companyLogo}>
            <MaterialCommunityIcons name="domain" size={40} color="#fff" />
          </View>
          <Animated.Text 
            entering={FadeInDown.delay(200)}
            style={styles.jobTitle}
          >
            {job.title}
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(300)}
            style={styles.companyName}
          >
            {job.company}
          </Animated.Text>
          
          <View style={styles.jobMetaContainer}>
            <View style={styles.jobMetaItem}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#fff" />
              <Text style={styles.jobMetaText}>{job.location}</Text>
            </View>
            <View style={styles.jobMetaItem}>
              <MaterialCommunityIcons name="currency-usd" size={20} color="#fff" />
              <Text style={styles.jobMetaText}>{job.salary}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#4630EB" />
            <Text style={styles.statValue}>{job.type}</Text>
            <Text style={styles.statLabel}>Type</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="account-group" size={24} color="#4630EB" />
            <Text style={styles.statValue}>{job.applicants}</Text>
            <Text style={styles.statLabel}>Applicants</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="briefcase-outline" size={24} color="#4630EB" />
            <Text style={styles.statValue}>{job.experience}</Text>
            <Text style={styles.statLabel}>Experience</Text>
          </View>
        </View>

        {/* Job Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.sectionText}>{job.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Responsibilities</Text>
          {job.responsibilities.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <MaterialCommunityIcons name="circle-small" size={20} color="#4630EB" />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <MaterialCommunityIcons name="circle-small" size={20} color="#4630EB" />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits</Text>
          {job.benefits.map((item, index) => (
            <View key={index} style={styles.bulletItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#4630EB" />
              <Text style={styles.bulletText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {job.company}</Text>
          <Text style={styles.sectionText}>{job.companyInfo.about}</Text>
          <View style={styles.companyDetails}>
            <View style={styles.companyDetailItem}>
              <MaterialCommunityIcons name="web" size={20} color="#666" />
              <Text style={styles.companyDetailText}>{job.companyInfo.website}</Text>
            </View>
            <View style={styles.companyDetailItem}>
              <MaterialCommunityIcons name="office-building" size={20} color="#666" />
              <Text style={styles.companyDetailText}>{job.companyInfo.industry}</Text>
            </View>
            <View style={styles.companyDetailItem}>
              <MaterialCommunityIcons name="calendar" size={20} color="#666" />
              <Text style={styles.companyDetailText}>Founded {job.companyInfo.founded}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply and Chat Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity 
          style={styles.chatButton}
          onPress={() => router.push(`/chat/${job.id}`)}
        >
          <MaterialCommunityIcons name="message-text-outline" size={20} color="#4630EB" />
          <Text style={styles.chatButtonText}>Chat with Employer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: 60,
    backgroundColor: '#4630EB',
  },
  backButton: {
    padding: 8,
  },
  bookmarkButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  jobHeader: {
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  companyLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 16,
  },
  jobMetaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  jobMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  jobMetaText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -30,
    marginHorizontal: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  companyDetails: {
    marginTop: 16,
  },
  companyDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  companyDetailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  actionContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4630EB',
    gap: 8,
  },
  chatButtonText: {
    color: '#4630EB',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#4630EB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
}); 