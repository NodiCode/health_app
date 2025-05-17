import axios from 'axios';
import { Platform } from 'react-native';

// Замените YOUR_API_KEY на ваш реальный API ключ из Google AI Studio
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyAHhpJldughwEcIY5w0evRgRIz-unZ7-wE';
// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;
const GEMINI_API_URL = Platform.OS === 'web'
  ? 'http://localhost:5000/api/gemini'
  : `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;


  const createMedicalPrompt = (symptoms) => {
    return `Проанализируйте следующие симптомы: ${symptoms}
  
  Пожалуйста, предоставьте анализ в следующем формате:
  
  1. Возможные диагнозы (3-5 наиболее вероятных)
  2. Краткое описание каждого диагноза
  3. Рекомендованные действия
  4. Когда следует немедленно обратиться к врачу
  
  ВАЖНО: 
  - Укажите, что это предварительный анализ
  - Подчеркните важность консультации с врачом
  - Не ставьте окончательный диагноз
  - Используйте простой и понятный язык
  - Форматируйте ответ структурированно`;
  };
  
//   export const analyzeSymptoms = async (symptoms) => {
//     try {
//       const prompt = createMedicalPrompt(symptoms);
      
//       // Убедитесь, что формат запроса соответствует API Gemini
//       const requestBody = {
//         contents: [{
//           parts: [{
//             text: prompt
//           }]
//         }],
//         generationConfig: {
//           temperature: 0.7,
//           topK: 40,
//           topP: 0.95,
//           maxOutputTokens: 2048,
//         }
//       };
      
//       console.log('Отправляемый запрос:', JSON.stringify(requestBody, null, 2));
      
//       const response = await axios.post(GEMINI_API_URL, requestBody, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         timeout: 30000,
//       });
      
//       // Для отладки
//       console.log('Ответ получен');
      
//       if (Platform.OS === 'web') {
//         // Если это прокси-ответ
//         if (response.data.error) {
//           throw new Error(response.data.error);
//         }
//       }
      
//       // Проверяем структуру ответа
//       if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
//         console.error('Некорректный формат ответа:', JSON.stringify(response.data, null, 2));
//         throw new Error('Некорректный формат ответа от сервера');
//       }
      
//       const text = response.data.candidates[0].content.parts[0].text;
      
//       const disclaimer = '\n\n⚠️ ВАЖНО: Этот анализ носит информационный характер и не заменяет профессиональную медицинскую консультацию. Всегда обращайтесь к квалифицированному врачу для точной диагностики и лечения.';
      
//       const finalText = text.includes('ВАЖНО') || text.includes('консультацию с врачом') 
//         ? text 
//         : text + disclaimer;
      
//       return formatDiagnosisResponse(finalText);
//     } catch (error) {
//       console.error('Gemini API Error:', error);
      
//       if (error.response) {
//         console.error('Error response:', error.response.data);
//         console.error('Error status:', error.response.status);
//       }
      
//       throw new Error('Не удалось получить анализ. Проверьте подключение к интернету.');
//     }
//   };



const formatDiagnosisResponse = (rawText) => {
    // Пытаемся структурировать ответ для лучшего отображения
    const sections = {
      possibleDiagnoses: [],
      descriptions: [],
      recommendations: [],
      urgentCare: '',
      disclaimer: ''
    };
  
    // Разбиваем текст на секции
    const lines = rawText.split('\n').filter(line => line.trim());
    
    let currentSection = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.toLowerCase().includes('возможные диагнозы') || 
          trimmedLine.match(/^\d+\.\s*возможные/i)) {
        currentSection = 'diagnoses';
        continue;
      } else if (trimmedLine.toLowerCase().includes('описание') || 
                 trimmedLine.match(/^\d+\.\s*краткое описание/i)) {
        currentSection = 'descriptions';
        continue;
      } else if (trimmedLine.toLowerCase().includes('рекомендован') || 
                 trimmedLine.match(/^\d+\.\s*рекомендован/i)) {
        currentSection = 'recommendations';
        continue;
      } else if (trimmedLine.toLowerCase().includes('немедленно обратиться') || 
                 trimmedLine.match(/^\d+\.\s*когда следует/i)) {
        currentSection = 'urgent';
        continue;
      } else if (trimmedLine.includes('ВАЖНО') || trimmedLine.includes('⚠️')) {
        currentSection = 'disclaimer';
      }
      
      // Добавляем контент в соответствующую секцию
      if (currentSection === 'diagnoses' && trimmedLine.match(/^[-\*\d]/)) {
        sections.possibleDiagnoses.push(trimmedLine);
      } else if (currentSection === 'descriptions' && trimmedLine.match(/^[-\*\d]/)) {
        sections.descriptions.push(trimmedLine);
      } else if (currentSection === 'recommendations' && trimmedLine.match(/^[-\*\d]/)) {
        sections.recommendations.push(trimmedLine);
      } else if (currentSection === 'urgent' && trimmedLine) {
        sections.urgentCare += trimmedLine + '\n';
      } else if (currentSection === 'disclaimer' && trimmedLine) {
        sections.disclaimer += trimmedLine + ' ';
      }
    }
    
    // Если структурированный анализ не получился, возвращаем исходный текст
    if (sections.possibleDiagnoses.length === 0 && sections.recommendations.length === 0) {
      return {
        formatted: false,
        text: rawText,
        sections: null
      };
    }
    
    return {
      formatted: true,
      text: rawText,
      sections: sections
    };
  };

  export const analyzeSymptoms = async (symptoms) => {
    try {
      const prompt = createMedicalPrompt(symptoms);
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };
      
      console.log('Отправляемый запрос:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post(GEMINI_API_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      console.log('Ответ получен');
      
      // Проверяем структуру ответа
      if (!response.data || !response.data.candidates || response.data.candidates.length === 0) {
        console.error('Некорректный формат ответа:', JSON.stringify(response.data, null, 2));
        throw new Error('Некорректный формат ответа от сервера');
      }
      
      const text = response.data.candidates[0].content.parts[0].text;
      
      const disclaimer = '\n\n⚠️ ВАЖНО: Этот анализ носит информационный характер и не заменяет профессиональную медицинскую консультацию. Всегда обращайтесь к квалифицированному врачу для точной диагностики и лечения.';
      
      const finalText = text.includes('ВАЖНО') || text.includes('консультацию с врачом') 
        ? text 
        : text + disclaimer;
      
      // Используем функцию форматирования для структурирования ответа
      return formatDiagnosisResponse(finalText);
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Для отладки
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      // Если мы на веб-платформе и произошла ошибка,
      // вернем мок-данные для продолжения разработки интерфейса
      if (Platform.OS === 'web') {
        console.log('Используем мок-данные для веб-версии из-за ошибки');
        
        if (symptoms.toLowerCase().includes('глаз')) {
          return {
            formatted: true,
            text: `Анализ симптомов: ${symptoms}\n\n1. Возможные диагнозы\n- Аллергический конъюнктивит\n- Синдром сухого глаза\n- Блефарит\n- Инфекционный конъюнктивит\n\n2. Описание\n- Аллергический конъюнктивит - воспаление глаз в ответ на аллергены, характеризуется зудом, покраснением и слезотечением\n- Синдром сухого глаза - недостаточное увлажнение поверхности глаза, что вызывает дискомфорт, зуд и раздражение\n- Блефарит - воспаление век, часто сопровождающееся зудом, покраснением и чешуйками на ресницах\n- Инфекционный конъюнктивит - бактериальная или вирусная инфекция, вызывающая воспаление конъюнктивы\n\n3. Рекомендации\n- Избегайте трения глаз\n- Используйте холодные компрессы\n- Проконсультируйтесь с врачом о возможности применения антигистаминных препаратов\n- Используйте искусственные слезы\n\n4. Когда следует немедленно обратиться к врачу\nНемедленно обратитесь к офтальмологу, если зуд сопровождается сильной болью, нарушением зрения, гнойным отделяемым или светобоязнью.\n\n⚠️ ВАЖНО: Это предварительный анализ. Для точной диагностики и лечения обязательно обратитесь к врачу.`,
            sections: {
              possibleDiagnoses: [
                "- Аллергический конъюнктивит",
                "- Синдром сухого глаза",
                "- Блефарит",
                "- Инфекционный конъюнктивит"
              ],
              descriptions: [
                "- Аллергический конъюнктивит - воспаление глаз в ответ на аллергены, характеризуется зудом, покраснением и слезотечением",
                "- Синдром сухого глаза - недостаточное увлажнение поверхности глаза, что вызывает дискомфорт, зуд и раздражение",
                "- Блефарит - воспаление век, часто сопровождающееся зудом, покраснением и чешуйками на ресницах",
                "- Инфекционный конъюнктивит - бактериальная или вирусная инфекция, вызывающая воспаление конъюнктивы"
              ],
              recommendations: [
                "- Избегайте трения глаз",
                "- Используйте холодные компрессы",
                "- Проконсультируйтесь с врачом о возможности применения антигистаминных препаратов",
                "- Используйте искусственные слезы"
              ],
              urgentCare: "Немедленно обратитесь к офтальмологу, если зуд сопровождается сильной болью, нарушением зрения, гнойным отделяемым или светобоязнью.",
              disclaimer: "⚠️ ВАЖНО: Это предварительный анализ. Для точной диагностики и лечения обязательно обратитесь к врачу."
            }
          };
        } else {
          // Генерация мок-данных для других симптомов...
          return {
            formatted: true,
            text: `Анализ симптомов: ${symptoms}\n\n1. Возможные диагнозы\n- Вирусная инфекция\n- Аллергическая реакция\n- Переутомление\n- Стресс\n\n2. Описание\n- Вирусная инфекция - заболевание, вызванное вирусами\n- Аллергическая реакция - иммунный ответ организма на аллерген\n- Переутомление - состояние, вызванное чрезмерной физической или умственной нагрузкой\n- Стресс - реакция организма на психологическое напряжение\n\n3. Рекомендации\n- Обеспечьте достаточный отдых\n- Пейте больше жидкости\n- Избегайте возможных аллергенов\n- Практикуйте техники релаксации\n\n4. Когда следует немедленно обратиться к врачу\nНемедленно обратитесь к врачу, если симптомы быстро ухудшаются, появилась высокая температура или есть затруднение дыхания.\n\n⚠️ ВАЖНО: Этот анализ носит информационный характер и не заменяет профессиональную медицинскую консультацию.`,
            sections: {
              possibleDiagnoses: [
                "- Вирусная инфекция",
                "- Аллергическая реакция",
                "- Переутомление",
                "- Стресс"
              ],
              descriptions: [
                "- Вирусная инфекция - заболевание, вызванное вирусами",
                "- Аллергическая реакция - иммунный ответ организма на аллерген",
                "- Переутомление - состояние, вызванное чрезмерной физической или умственной нагрузкой",
                "- Стресс - реакция организма на психологическое напряжение"
              ],
              recommendations: [
                "- Обеспечьте достаточный отдых",
                "- Пейте больше жидкости",
                "- Избегайте возможных аллергенов",
                "- Практикуйте техники релаксации"
              ],
              urgentCare: "Немедленно обратитесь к врачу, если симптомы быстро ухудшаются, появилась высокая температура или есть затруднение дыхания.",
              disclaimer: "⚠️ ВАЖНО: Этот анализ носит информационный характер и не заменяет профессиональную медицинскую консультацию."
            }
          };
        }
      }
      
      throw new Error('Не удалось получить анализ. Проверьте подключение к интернету.');
    }
  };