import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  TextInput,
  Card,
  Chip,
  HelperText,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { analyzeSymptoms } from '../services/geminiApi';

const DiagnosisScreen = ({ navigation }) => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonSymptoms = [
    'головная боль',
    'температура',
    'кашель',
    'насморк',
    'тошнота',
    'боль в животе',
    'усталость',
    'головокружение',
    'боль в горле',
    'диарея',
    'боль в суставах',
    'сыпь',
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(item => item !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAnalyze = async () => {
    if (!symptoms.trim() && selectedTags.length === 0) {
      setError('Пожалуйста, введите симптомы или выберите из списка');
      return;
    }

    setError('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      const fullSymptoms = [
        ...symptoms.split(',').map(s => s.trim()),
        ...selectedTags,
      ].filter(Boolean).join(', ');

      const diagnosis = await analyzeSymptoms(fullSymptoms);
      
      navigation.navigate('Result', {
        symptoms: fullSymptoms,
        diagnosis: diagnosis,
      });
    } catch (err) {
      setError('Произошла ошибка при анализе. Попробуйте снова.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Card style={styles.instructionCard}>
            <Card.Content>
              <View style={styles.iconHeader}>
                <Icon name="edit" size={24} color="#007AFF" />
                <Text style={styles.cardTitle}>
                  Опишите ваши симптомы
                </Text>
              </View>
              <Text style={styles.instruction}>
                Введите ваши симптомы или выберите из списка ниже. 
                Будьте как можно более подробными.
              </Text>
            </Card.Content>
          </Card>

          <Card style={styles.inputCard}>
            <Card.Content>
              <TextInput
                label="Симптомы (разделите запятыми)"
                value={symptoms}
                onChangeText={setSymptoms}
                mode="outlined"
                multiline
                numberOfLines={4}
                placeholder="Например: головная боль, температура 38°C, усталость"
                style={styles.input}
                error={!!error}
              />
              <HelperText type="error" visible={!!error}>
                {error}
              </HelperText>
            </Card.Content>
          </Card>

          <View style={styles.tagsSection}>
            <Text style={styles.sectionTitle}>Часто встречающиеся симптомы:</Text>
            <View style={styles.tagsContainer}>
              {commonSymptoms.map((symptom) => (
                <Chip
                  key={symptom}
                  selected={selectedTags.includes(symptom)}
                  onPress={() => toggleTag(symptom)}
                  style={[
                    styles.chip,
                    selectedTags.includes(symptom) && styles.selectedChip,
                  ]}
                  textStyle={[
                    styles.chipText,
                    selectedTags.includes(symptom) && styles.selectedChipText,
                  ]}
                >
                  {symptom}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.bottomSection}>
            <Button
              mode="contained"
              onPress={handleAnalyze}
              loading={loading}
              disabled={loading}
              style={styles.analyzeButton}
              contentStyle={styles.buttonContent}
              icon={loading ? undefined : "search"}
            >
              {loading ? 'Анализируем...' : 'Анализировать симптомы'}
            </Button>

            <Text style={styles.note}>
              Анализ занимает обычно 5-10 секунд
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  instructionCard: {
    margin: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  inputCard: {
    margin: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 5,
  },
  tagsSection: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  chip: {
    margin: 4,
    backgroundColor: '#E8E8E8',
  },
  selectedChip: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    color: '#333',
  },
  selectedChipText: {
    color: 'white',
  },
  bottomSection: {
    margin: 15,
    marginTop: 30,
  },
  analyzeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    borderRadius: 25,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  note: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
});

export default DiagnosisScreen;