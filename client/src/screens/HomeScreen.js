import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Button, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Icon name="medical-services" size={80} color="#007AFF" />
          <Title style={styles.appTitle}>Health Diagnostic</Title>
          <Paragraph style={styles.subtitle}>
            Анализ симптомов с помощью AI
          </Paragraph>
        </View>

        <Card style={styles.disclaimerCard}>
          <Card.Content>
            <Paragraph style={styles.disclaimer}>
              ⚠️ Важно: Это приложение не заменяет профессиональную медицинскую консультацию. 
              Всегда обращайтесь к врачу для точной диагностики и лечения.
            </Paragraph>
          </Card.Content>
        </Card>

        <View style={styles.actionSection}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('Diagnosis')}
            style={styles.mainButton}
            contentStyle={styles.buttonContent}
            icon="search"
          >
            Начать диагностику
          </Button>

          <TouchableOpacity style={styles.featureCard}>
            <Icon name="history" size={30} color="#007AFF" />
            <Text style={styles.featureText}>История диагнозов</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard}>
            <Icon name="info" size={30} color="#007AFF" />
            <Text style={styles.featureText}>О приложении</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoItem}>
                <Icon name="speed" size={25} color="#4CAF50" />
                <Text style={styles.infoTitle}>Быстрый анализ</Text>
                <Text style={styles.infoDesc}>
                  Получите результаты за несколько секунд
                </Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoItem}>
                <Icon name="security" size={25} color="#4CAF50" />
                <Text style={styles.infoTitle}>Конфиденциально</Text>
                <Text style={styles.infoDesc}>
                  Ваши данные остаются у вас
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  appTitle: {
    fontSize: 28,
    color: '#333',
    marginTop: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  disclaimerCard: {
    margin: 15,
    backgroundColor: '#FFF3E0',
    elevation: 2,
  },
  disclaimer: {
    color: '#F57C00',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
  actionSection: {
    paddingHorizontal: 15,
    marginTop: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    marginBottom: 20,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  featureText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  infoSection: {
    paddingHorizontal: 15,
    marginTop: 30,
  },
  infoCard: {
    marginVertical: 5,
    backgroundColor: 'white',
    elevation: 1,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 5,
  },
  infoDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default HomeScreen;