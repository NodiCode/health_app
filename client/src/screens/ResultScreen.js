
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import {
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  IconButton,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResultScreen = ({ route, navigation }) => {
  const { symptoms, diagnosis } = route.params;
  const [savedToHistory, setSavedToHistory] = useState(false);

  useEffect(() => {
    saveDiagnosisToHistory();
  }, []);

  const saveDiagnosisToHistory = async () => {
    try {
      const historyData = {
        date: new Date().toISOString(),
        symptoms,
        diagnosis: diagnosis.text,
        id: Date.now().toString(),
      };

      const existingHistory = await AsyncStorage.getItem('diagnosisHistory');
      const history = existingHistory ? JSON.parse(existingHistory) : [];
      
      history.unshift(historyData);
      // Храним максимум 50 записей
      const limitedHistory = history.slice(0, 50);
      
      await AsyncStorage.setItem('diagnosisHistory', JSON.stringify(limitedHistory));
      setSavedToHistory(true);
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  const renderSection = (title, content, icon) => {
    if (!content || content.length === 0) return null;

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Icon name={icon} size={24} color="#007AFF" />
            <Title style={styles.sectionTitle}>{title}</Title>
          </View>
          <Divider style={styles.divider} />
          {Array.isArray(content) ? (
            content.map((item, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listItemText}>{item}</Text>
              </View>
            ))
          ) : (
            <Paragraph style={styles.contentText}>{content}</Paragraph>
          )}
        </Card.Content>
      </Card>
    );
  };

  const openInBrowser = () => {
    const query = encodeURIComponent(`Симптомы: ${symptoms}`);
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };

  if (!diagnosis || !diagnosis.text) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={60} color="#FF5252" />
          <Text style={styles.errorText}>
            Не удалось получить результаты анализа
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Вернуться назад
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const isFormatted = diagnosis.formatted && diagnosis.sections;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Симптомы */}
        <Card style={styles.symptomsCard}>
          <Card.Content>
            <View style={styles.symptomsHeader}>
              <Icon name="assignment" size={24} color="#007AFF" />
              <Title style={styles.symptomsTitle}>Ваши симптомы</Title>
            </View>
            <Text style={styles.symptomsText}>{symptoms}</Text>
          </Card.Content>
        </Card>

        {/* Результаты анализа */}
        {isFormatted ? (
          <View>
            {renderSection(
              'Возможные диагнозы',
              diagnosis.sections.possibleDiagnoses,
              'local-hospital'
            )}
            
            {renderSection(
              'Описание',
              diagnosis.sections.descriptions,
              'description'
            )}
            
            {renderSection(
              'Рекомендации',
              diagnosis.sections.recommendations,
              'lightbulb'
            )}
            
            {diagnosis.sections.urgentCare && (
              <Card style={[styles.sectionCard, styles.urgentCard]}>
                <Card.Content>
                  <View style={styles.urgentHeader}>
                    <Icon name="priority-high" size={24} color="#FF5252" />
                    <Title style={[styles.sectionTitle, styles.urgentTitle]}>
                      Когда обратиться к врачу срочно
                    </Title>
                  </View>
                  <Divider style={styles.divider} />
                  <Paragraph style={styles.urgentText}>
                    {diagnosis.sections.urgentCare}
                  </Paragraph>
                </Card.Content>
              </Card>
            )}
          </View>
        ) : (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Icon name="description" size={24} color="#007AFF" />
                <Title style={styles.sectionTitle}>Анализ симптомов</Title>
              </View>
              <Divider style={styles.divider} />
              <Paragraph style={styles.contentText}>
                {diagnosis.text}
              </Paragraph>
            </Card.Content>
          </Card>
        )}

        {/* Дисклеймер */}
        <Card style={styles.disclaimerCard}>
          <Card.Content>
            <View style={styles.disclaimerHeader}>
              <Icon name="warning" size={24} color="#FF9800" />
              <Title style={styles.disclaimerTitle}>Важное уведомление</Title>
            </View>
            <Paragraph style={styles.disclaimerText}>
              {isFormatted && diagnosis.sections.disclaimer 
                ? diagnosis.sections.disclaimer 
                : '⚠️ Этот анализ носит информационный характер и не заменяет профессиональную медицинскую консультацию. Всегда обращайтесь к квалифицированному врачу для точной диагностики и лечения.'}
            </Paragraph>
          </Card.Content>
        </Card>

        {/* Действия */}
        <View style={styles.actionsSection}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('Diagnosis')}
            style={styles.actionButton}
            icon="autorenew"
          >
            Новый анализ
          </Button>

          <Button
            mode="outlined"
            onPress={openInBrowser}
            style={styles.actionButton}
            icon="search"
          >
            Поиск в Google
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.navigate('Home')}
            style={[styles.actionButton, styles.homeButton]}
            icon="home"
          >
            На главную
          </Button>
        </View>

        {savedToHistory && (
          <Chip
            icon="check-circle"
            style={styles.savedChip}
            textStyle={styles.savedChipText}
          >
            Сохранено в истории
          </Chip>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  symptomsCard: {
    margin: 15,
    backgroundColor: '#E8F5E9',
    elevation: 2,
  },
  symptomsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  symptomsTitle: {
    marginLeft: 10,
    fontSize: 18,
    color: '#2E7D32',
  },
  symptomsText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1B5E20',
  },
  sectionCard: {
    margin: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 18,
    color: '#333',
  },
  divider: {
    marginBottom: 15,
    backgroundColor: '#E0E0E0',
  },
  listItem: {
    marginBottom: 8,
    paddingLeft: 15,
  },
  listItemText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  urgentCard: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  urgentTitle: {
    color: '#FF5252',
  },
  urgentText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#C62828',
  },
  disclaimerCard: {
    margin: 15,
    backgroundColor: '#FFF3E0',
    elevation: 2,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  disclaimerTitle: {
    marginLeft: 10,
    fontSize: 16,
    color: '#F57C00',
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#E65100',
  },
  actionsSection: {
    margin: 15,
    marginTop: 30,
  },
  actionButton: {
    marginVertical: 5,
    borderRadius: 25,
  },
  homeButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
  },
  savedChip: {
    alignSelf: 'center',
    backgroundColor: '#E8F5E9',
    marginTop: 20,
  },
  savedChipText: {
    color: '#2E7D32',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginTop: 15,
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#007AFF',
  },
});

export default ResultScreen;