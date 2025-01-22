import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Platform,
  Dimensions,
  Animated,
  Modal,
  Alert,
  Switch,
  Linking,
  useColorScheme,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useBookmarks } from '../context/BookmarkContext';
import { mockJobs } from '../data/mockJobs';
import { FadeInDown } from 'react-native-reanimated';
import { useSearch } from '../context/SearchContext';
import { BarChart, LineChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userService } from '../services/userService';
import { jobService } from '../services/jobService';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  color: string;
}

const categories: Category[] = [
  { id: '1', name: 'Plumbing', icon: 'water-pump', type: 'MaterialCommunityIcons', color: '#4A90E2' },
  { id: '2', name: 'Electrical', icon: 'flash', type: 'Ionicons', color: '#F5A623' },
  { id: '3', name: 'Cleaning', icon: 'broom', type: 'MaterialCommunityIcons', color: '#7ED321' },
  { id: '4', name: 'Carpentry', icon: 'hammer', type: 'Ionicons', color: '#BD10E0' },
  { id: '5', name: 'Painting', icon: 'paint-roller', type: 'FontAwesome5', color: '#50E3C2' },
  { id: '6', name: 'Gardening', icon: 'flower', type: 'MaterialCommunityIcons', color: '#D0021B' },
  { id: '7', name: 'Moving', icon: 'truck-fast', type: 'MaterialCommunityIcons', color: '#9013FE' },
  { id: '8', name: 'More', icon: 'grid', type: 'Ionicons', color: '#4A4A4A' },
];

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  type: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  color: string[];
  onPress: () => void;
}

interface FeaturedService {
  id: string;
  title: string;
  icon: string;
  iconType: 'Ionicons' | 'MaterialCommunityIcons' | 'FontAwesome5';
  color: string;
  price: string;
  rating: number;
}

const featuredServices: FeaturedService[] = [
  {
    id: '1',
    title: 'Plumbing Services',
    icon: 'water-pump',
    iconType: 'MaterialCommunityIcons',
    color: '#4A90E2',
    price: 'KES 1,500/hr',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Electrical Repair',
    icon: 'flash',
    iconType: 'Ionicons',
    color: '#F5A623',
    price: 'KES 2,000/hr',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'House Cleaning',
    icon: 'broom',
    iconType: 'MaterialCommunityIcons',
    color: '#7ED321',
    price: 'KES 1,200/hr',
    rating: 4.7,
  },
  {
    id: '4',
    title: 'Carpentry Work',
    icon: 'hammer',
    iconType: 'Ionicons',
    color: '#BD10E0',
    price: 'KES 1,800/hr',
    rating: 4.6,
  },
];

interface Job {
  _id: string;
  title: string;
  companyDetails: {
    name: string;
  };
  locationName: string;
  budget: {
    min: number;
    max: number;
  };
  status: string;
  createdAt: string;
}

const renderIcon = (category: Category, size: number) => {
  switch (category.type) {
    case 'Ionicons':
      return <Ionicons name={category.icon as any} size={size} color="#fff" />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={category.icon as any} size={size} color="#fff" />;
    case 'FontAwesome5':
      return <FontAwesome5 name={category.icon as any} size={size} color="#fff" />;
  }
};

const renderServiceIcon = (service: FeaturedService) => {
  switch (service.iconType) {
    case 'Ionicons':
      return <Ionicons name={service.icon as any} size={24} color={service.color} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={service.icon as any} size={24} color={service.color} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={service.icon as any} size={24} color={service.color} />;
  }
};

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { bookmarkedJobs } = useBookmarks();
  const { searchQuery, setSearchQuery } = useSearch();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showMpesaForm, setShowMpesaForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isDashboardExpanded, setIsDashboardExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading simulation
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await userService.getUserProfile();
        if (response.success && response.user) {
          setUsername(response.user.username);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const response = await jobService.getJobs({ 
          limit: 5,
          status: ['Open'],
          sortBy: 'createdAt',
          order: 'desc'
        });
        setRecentJobs(response.jobs);
      } catch (error) {
        console.error('Error fetching recent jobs:', error);
      }
    };

    fetchRecentJobs();
  }, []);

  const mockTransactions = [
    {
      id: '1',
      date: '2024-03-10',
      type: 'Funds Received',
      amount: 5000,
      status: 'Successful',
      reference: 'ABC12345',
    },
    {
      id: '2',
      date: '2024-03-08',
      type: 'MPesa Transfer',
      amount: 2000,
      status: 'Successful',
      reference: 'DEF67890',
    },
    {
      id: '3',
      date: '2024-03-07',
      type: 'Funds Received',
      amount: 10000,
      status: 'Pending',
      reference: 'GHI11223',
    },
  ];

  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Post a Job',
      icon: 'briefcase-plus',
      type: 'MaterialCommunityIcons',
      color: ['#FF6B6B', '#FF8E8E'],
      onPress: () => router.push('/(app)/post-job'),
    },
    {
      id: '2',
      title: 'My Posted Jobs',
      icon: 'briefcase-check',
      type: 'MaterialCommunityIcons',
      color: ['#43E97B', '#38F9D7'],
      onPress: () => router.push('/(app)/my-posted-jobs'),
    },
    {
      id: '3',
      title: 'Active Jobs',
      icon: 'briefcase-check',
      type: 'MaterialCommunityIcons',
      color: ['#43E97B', '#38F9D7'],
      onPress: () => router.push('/(app)/active-jobs'),
    },
    {
      id: '4',
      title: 'Wallet',
      icon: 'wallet',
      type: 'MaterialCommunityIcons',
      color: ['#FA709A', '#FEE140'],
      onPress: () => setShowWalletModal(true),
    },
    {
      id: '5',
      title: 'Messages',
      icon: 'message-text',
      type: 'MaterialCommunityIcons',
      color: ['#9C27B0', '#BA68C8'],
      onPress: () => router.push('/(app)/messages'),
    },
  ];

  const renderQuickAction = (action: QuickAction) => (
    <TouchableOpacity 
      key={action.id} 
      style={styles.quickActionItem}
      onPress={action.onPress}
    >
      <LinearGradient
        colors={action.color}
        style={styles.quickActionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {renderIcon({ ...action, color: '#fff' }, 24)}
      </LinearGradient>
      <Text style={[styles.quickActionText, isDark && styles.darkText]}>{action.title}</Text>
    </TouchableOpacity>
  );

  const renderBookmarkedJobs = () => {
    if (bookmarkedJobs.length === 0) return null;

    return (
      <View style={styles.bookmarkedSection}>
        <View style={styles.bookmarkedHeader}>
          <View style={styles.bookmarkedTitleContainer}>
            <MaterialCommunityIcons name="bookmark" size={24} color="#4630EB" />
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Bookmarked Jobs
            </Text>
          </View>
          {bookmarkedJobs.length > 0 && (
            <Text style={styles.bookmarkedCount}>
              {bookmarkedJobs.length} saved
            </Text>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bookmarkedList}
        >
          {bookmarkedJobs.map(jobId => {
            const job = mockJobs[jobId];
            return (
              <Animated.View
                key={job.id}
                entering={FadeInDown.springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.bookmarkedCard,
                    isDark && styles.darkCard,
                  ]}
                  onPress={() => router.push(`/job/${job.id}`)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={['rgba(70, 48, 235, 0.1)', 'rgba(70, 48, 235, 0.05)']}
                    style={styles.bookmarkedGradient}
                  >
                    <View style={styles.bookmarkedHeader}>
                      <Text style={[styles.bookmarkedTitle, isDark && styles.darkText]} numberOfLines={1}>
                        {job.title}
                      </Text>
                      <MaterialCommunityIcons name="bookmark" size={20} color="#4630EB" />
                    </View>

                    <View style={styles.bookmarkedCompanyContainer}>
                      <MaterialCommunityIcons name="domain" size={16} color="#666" />
                      <Text style={styles.bookmarkedCompany} numberOfLines={1}>
                        {job.company}
                      </Text>
                    </View>

                    <View style={styles.bookmarkedDetails}>
                      <View style={styles.bookmarkedDetail}>
                        <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                        <Text style={styles.bookmarkedDetailText} numberOfLines={1}>
                          {job.location}
                        </Text>
                      </View>
                      <View style={styles.bookmarkedDetail}>
                        <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
                        <Text style={styles.bookmarkedDetailText} numberOfLines={1}>
                          {job.salary}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.bookmarkedFooter}>
                      <View style={styles.bookmarkedTag}>
                        <Text style={styles.bookmarkedTagText}>{job.type}</Text>
                      </View>
                      <Text style={styles.bookmarkedPosted}>{job.posted}</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderWalletModal = () => {
    if (!showWalletModal) return null;

    const totalFunds = mockTransactions.reduce((sum, transaction) => 
      transaction.status === 'Successful' ? sum + transaction.amount : sum, 0
    );

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWalletModal}
        onRequestClose={() => setShowWalletModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Wallet</Text>
              <TouchableOpacity 
                onPress={() => setShowWalletModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <View style={styles.fundsCard}>
                <Text style={styles.fundsLabel}>Available Funds</Text>
                <Text style={styles.fundsAmount}>KES {totalFunds.toLocaleString()}</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => setShowMpesaForm(true)}
                  >
                    <MaterialCommunityIcons name="cash-fast" size={24} color="#4630EB" />
                    <Text style={styles.actionButtonText}>Send to MPesa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <MaterialCommunityIcons name="history" size={24} color="#4630EB" />
                    <Text style={styles.actionButtonText}>Transaction History</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {showMpesaForm && (
                <View style={styles.mpesaForm}>
                  <Text style={styles.formTitle}>Send to MPesa</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number (254...)"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Description (Optional)"
                    value={description}
                    onChangeText={setDescription}
                  />
                  <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={handleSendToMpesa}
                  >
                    <Text style={styles.sendButtonText}>Send Money</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.transactionsContainer}>
                <Text style={styles.sectionTitle}>Transaction History</Text>
                {mockTransactions.map((transaction) => (
                  <View key={transaction.id} style={styles.transactionCard}>
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionType}>{transaction.type}</Text>
                      <Text 
                        style={[
                          styles.transactionStatus,
                          { color: transaction.status === 'Successful' ? '#4CAF50' : '#FFC107' }
                        ]}
                      >
                        {transaction.status}
                      </Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionAmount}>
                        KES {transaction.amount.toLocaleString()}
                      </Text>
                      <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                    <Text style={styles.transactionReference}>
                      Ref: {transaction.reference}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const handleSendToMpesa = () => {
    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid Kenyan phone number starting with 254');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Confirm Transfer',
      `Send KES ${amount} to ${phoneNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send',
          onPress: () => {
            Alert.alert('Success', 'Transfer initiated successfully');
            setShowMpesaForm(false);
            setPhoneNumber('');
            setAmount('');
            setDescription('');
          }
        },
      ]
    );
  };

  const navigateToJobs = () => {
    router.push('/(app)/job-list');
  };

  const navigateToWorkers = () => {
    router.push('/(app)/workers');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          {isLoading ? (
            <ActivityIndicator 
              size="large" 
              color="#4630EB"
              style={styles.loadingSpinner}
            />
          ) : (
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          )}
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="person-circle" size={40} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, isDark && styles.darkText]}>
          Welcome back, {username || 'User'}!
        </Text>
      </View>

      <View style={styles.headerControls}>
        <TouchableOpacity 
          style={styles.messageButton}
          onPress={() => router.push('/(app)/messages')}
        >
          <MaterialCommunityIcons 
            name="message-text" 
            size={24} 
            color={isDark ? '#fff' : '#000'} 
          />
          <View style={styles.messageBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.darkModeSwitch}>
          <Ionicons 
            name={isDark ? 'moon' : 'sunny'} 
            size={20} 
            color={isDark ? '#fff' : '#000'} 
          />
          <Switch
            value={isDark}
            onValueChange={() => {
              // Toggle dark mode logic here
            }}
            trackColor={{ false: '#767577', true: '#4630EB' }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, isDark && styles.darkSearchContainer]}>
        <Ionicons name="search" size={20} color={isDark ? '#fff' : '#666'} style={styles.searchIcon} />
        <TextInput
          placeholder="Search for services..."
          placeholderTextColor={isDark ? '#999' : '#666'}
          style={[styles.searchInput, isDark && styles.darkSearchInput]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={() => router.push('/(app)/job-list')}
          returnKeyType="search"
        />
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => router.push('/(app)/job-list')}
        >
          <MaterialCommunityIcons name="tune-vertical" size={20} color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        {quickActions.map(renderQuickAction)}
      </View>

      {/* Job Stats */}
      <View style={styles.statsContainer}>
        <TouchableOpacity 
          onPress={navigateToJobs}
          style={styles.statsCardWrapper}
        >
          <LinearGradient
            colors={isDark ? ['#4630EB', '#6B4EFF'] : ['#4630EB', '#5E47F2']}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsIconContainer}>
            <MaterialCommunityIcons 
                name="briefcase-outline" 
                size={32} 
                color="#fff"
              />
          </View>
            <View style={styles.statsTextContainer}>
              <Text style={styles.statsTitle}>Active Jobs</Text>
              <Text style={styles.statsCount}>Over 100 jobs daily</Text>
            </View>
            <View style={styles.arrowButton}>
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={24} 
                color="#fff"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={navigateToWorkers}
          style={styles.statsCardWrapper}
        >
          <LinearGradient
            colors={isDark ? ['#4630EB', '#6B4EFF'] : ['#4630EB', '#5E47F2']}
            style={styles.statsCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsIconContainer}>
            <MaterialCommunityIcons 
                name="account-group-outline" 
                size={32} 
                color="#fff"
              />
          </View>
            <View style={styles.statsTextContainer}>
              <Text style={styles.statsTitle}>Workers</Text>
              <Text style={styles.statsCount}>Over 200 employees daily</Text>
        </View>
            <View style={styles.arrowButton}>
              <MaterialCommunityIcons 
                name="arrow-right" 
                size={24} 
                color="#fff"
              />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, isDark && styles.darkText]}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={[styles.categoryItem, { width: width * 0.22 }]}
              onPress={() => router.push(`/(app)/job-list`)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                {renderIcon(category, 24)}
              </View>
              <Text style={[styles.categoryText, isDark && styles.darkText]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Services */}
      <View style={styles.featuredContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Featured Services
          </Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(app)/services')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons 
              name="arrow-right" 
              size={20} 
              color="#4630EB" 
            />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContent}
        >
          {featuredServices.map((service) => (
            <TouchableOpacity 
              key={service.id}
              style={[styles.featuredCard, isDark && styles.darkFeaturedCard]}
              onPress={() => router.push(`/(app)/service/${service.id}`)}
            >
              <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}15` }]}>
                {renderServiceIcon(service)}
              </View>
              <View style={styles.featuredInfo}>
                <Text style={[styles.featuredTitle, isDark && styles.darkText]}>
                  {service.title}
                </Text>
                <Text style={styles.featuredPrice}>{service.price}</Text>
                <View style={styles.featuredRating}>
                  <MaterialCommunityIcons name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{service.rating} (50+ reviews)</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recent Jobs */}
      <View style={styles.recentJobsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Recent Jobs
          </Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(app)/active-jobs')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#4630EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.jobsList}>
          {recentJobs.map((job) => (
            <TouchableOpacity
              key={job._id}
              style={[styles.jobCard, isDark && styles.darkCard]}
              onPress={() => router.push(`/job/${job._id}`)}
            >
              <View style={styles.jobHeader}>
                <View style={styles.jobInfo}>
                  <Text style={[styles.jobTitle, isDark && styles.darkText]} numberOfLines={1}>
                    {job.title}
                  </Text>
                  <Text style={styles.companyName} numberOfLines={1}>
                    {job.companyDetails.name}
                  </Text>
                </View>
                <View style={[
                  styles.statusBadge, 
                  { backgroundColor: job.status === 'Open' ? '#4CAF50' : '#FFA000' }
                ]}>
                  <Text style={styles.statusText}>{job.status}</Text>
                </View>
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" />
                  <Text style={styles.detailText}>{job.locationName || 'Location not specified'}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MaterialCommunityIcons name="currency-usd" size={16} color="#666" />
                  <Text style={styles.detailText}>
                    KES {job.budget?.min?.toLocaleString() || 0} - {job.budget?.max?.toLocaleString() || 0}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {renderBookmarkedJobs()}
      {renderWalletModal()}

      <TouchableOpacity
        style={[styles.dashboardButton, isDark && styles.darkDashboardButton]}
        onPress={() => setIsDashboardExpanded(!isDashboardExpanded)}
      >
        <View style={styles.dashboardHeader}>
          <Text style={[styles.dashboardTitle, isDark && styles.darkText]}>
            Dashboard
          </Text>
          <Ionicons 
            name={isDashboardExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color={isDark ? '#fff' : '#000'} 
          />
        </View>
      </TouchableOpacity>

      {isDashboardExpanded && (
        <View style={[styles.dashboardContent, isDark && styles.darkDashboardContent]}>
          <Text style={[styles.chartTitle, isDark && styles.darkText]}>Monthly Jobs</Text>
          <LineChart
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [{
                data: [20, 45, 28, 80, 99, 43]
              }]
            }}
            width={width - 40}
            height={220}
            chartConfig={{
              backgroundColor: isDark ? '#2a2a2a' : '#fff',
              backgroundGradientFrom: isDark ? '#2a2a2a' : '#fff',
              backgroundGradientTo: isDark ? '#2a2a2a' : '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => isDark ? 
                `rgba(255, 255, 255, ${opacity})` : 
                `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* Add Blog Section */}
      <View style={styles.blogSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
            Latest Blog Posts
        </Text>
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.push('/(app)/blog')}
          >
            <Text style={styles.viewAllText}>View All</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#4630EB" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.blogList}
        >
          {/* Blog Cards */}
          <TouchableOpacity 
            style={[styles.blogCard, isDark && styles.darkCard]}
            onPress={() => router.push('/(app)/blog/1')}
          >
            <View style={styles.blogIconContainer}>
              <MaterialCommunityIcons name="newspaper" size={24} color="#4630EB" />
            </View>
            <Text style={[styles.blogTitle, isDark && styles.darkText]} numberOfLines={2}>
              How to Find the Perfect Job Match
            </Text>
            <Text style={styles.blogMeta}>5 min read • Career Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.blogCard, isDark && styles.darkCard]}
            onPress={() => router.push('/(app)/blog/2')}
          >
            <View style={styles.blogIconContainer}>
              <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#4630EB" />
            </View>
            <Text style={[styles.blogTitle, isDark && styles.darkText]} numberOfLines={2}>
              Top Skills in Demand for 2024
            </Text>
            <Text style={styles.blogMeta}>3 min read • Industry Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.blogCard, isDark && styles.darkCard]}
            onPress={() => router.push('/(app)/blog/3')}
          >
            <View style={styles.blogIconContainer}>
              <MaterialCommunityIcons name="account-group" size={24} color="#4630EB" />
        </View>
            <Text style={[styles.blogTitle, isDark && styles.darkText]} numberOfLines={2}>
              Building Your Professional Network
        </Text>
            <Text style={styles.blogMeta}>4 min read • Networking</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(app)/active-jobs')}
          >
            <MaterialCommunityIcons name="briefcase-clock" size={24} color="#4630EB" />
            <Text style={styles.actionButtonText}>Active Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(app)/my-posted-jobs')}
          >
            <MaterialCommunityIcons name="briefcase-check" size={24} color="#4630EB" />
            <Text style={styles.actionButtonText}>My Posted Jobs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 8,
  },
  headerText: {
    fontSize: 24,
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  headerTextBold: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  darkText: {
    color: '#fff',
  },
  profileButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
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
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  darkSearchContainer: {
    backgroundColor: '#2a2a2a',
  },
  darkSearchInput: {
    backgroundColor: '#2a2a2a',
    color: '#fff',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  filterButton: {
    padding: 4,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  categoriesContainer: {
    marginTop: 12,
  },
  categoriesContent: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
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
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
    }),
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#4630EB',
    fontWeight: '600',
  },
  recentJobsContainer: {
    flex: 1,
  },
  jobsContent: {
    paddingBottom: 20,
  },
  placeholder: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'System', android: 'Roboto' }),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 32,
    gap: 16,
  },
  statsCardWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
        shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    height: 100,
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statsTextContainer: {
    flex: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statsCount: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    letterSpacing: 0.3,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContainer: {
    marginBottom: 32,
  },
  featuredContent: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkFeaturedCard: {
    backgroundColor: '#2d2d2d',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredInfo: {
    gap: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  featuredPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4630EB',
  },
  featuredRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: '#666',
  },
  logoContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  logoImage: {
    width: 200,
    height: 60,
  },
  loadingSpinner: {
    width: 50,
    height: 50,
  },
  searchStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bookmarkedSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  bookmarkedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bookmarkedTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookmarkedCount: {
    fontSize: 14,
    color: '#666',
  },
  bookmarkedList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookmarkedCard: {
    width: width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  bookmarkedGradient: {
    padding: 16,
  },
  bookmarkedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookmarkedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  bookmarkedCompanyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  bookmarkedCompany: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bookmarkedDetails: {
    gap: 8,
    marginBottom: 16,
  },
  bookmarkedDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookmarkedDetailText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  bookmarkedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookmarkedTag: {
    backgroundColor: 'rgba(70, 48, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookmarkedTagText: {
    color: '#4630EB',
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkedPosted: {
    fontSize: 12,
    color: '#666',
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  fundsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  fundsLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  fundsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  mpesaForm: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#4630EB',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
  },
  transactionReference: {
    fontSize: 12,
    color: '#666',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  messageButton: {
    position: 'relative',
    padding: 8,
  },
  messageBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  darkModeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dashboardButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  darkDashboardButton: {
    backgroundColor: '#2a2a2a',
  },
  dashboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  dashboardContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  darkDashboardContent: {
    backgroundColor: '#2a2a2a',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4630EB',
    fontWeight: '600',
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  blogSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  blogList: {
    paddingRight: 16,
    gap: 16,
  },
  blogCard: {
    width: width * 0.7,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  darkCard: {
    backgroundColor: '#2d2d2d',
  },
  blogIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(70, 48, 235, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  blogMeta: {
    fontSize: 12,
    color: '#666',
  },
  recentJobsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  jobsList: {
    gap: 12,
  },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  jobDetails: {
    gap: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
}); 