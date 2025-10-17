import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import API_BASE_URL from '../api-config';
import { AI_CONFIG, isAIConfigured, getProviderName } from '../ai-config';
import { useTheme } from '../contexts/ThemeContext';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  available: boolean;
};

type Symptom = {
  id: string;
  text: string;
  specialty: string;
  keywords: string[];
};

const symptomDatabase: Symptom[] = [
  { id: '1', text: 'Chest pain, shortness of breath, irregular heartbeat', specialty: 'Cardiology', keywords: ['chest', 'heart', 'breath', 'palpitation', 'cardiac'] },
  { id: '2', text: 'Skin rash, acne, eczema, skin irritation', specialty: 'Dermatology', keywords: ['skin', 'rash', 'acne', 'eczema', 'itchy', 'dermat'] },
  { id: '3', text: 'Joint pain, arthritis, bone fracture', specialty: 'Orthopedics', keywords: ['joint', 'bone', 'fracture', 'arthritis', 'orthoped', 'pain', 'leg', 'arm', 'back'] },
  { id: '4', text: 'Depression, anxiety, stress, mental health', specialty: 'Psychiatry', keywords: ['depression', 'anxiety', 'stress', 'mental', 'mood', 'psychiat'] },
  { id: '5', text: 'Pregnancy, menstrual issues, reproductive health', specialty: 'Gynecology', keywords: ['pregnancy', 'menstrual', 'period', 'gynec', 'reproductive', 'ovarian'] },
  { id: '6', text: 'Stomach pain, digestion issues, nausea', specialty: 'Gastroenterology', keywords: ['stomach', 'digest', 'nausea', 'gastro', 'abdomen', 'vomit', 'diarrhea'] },
  { id: '7', text: 'Fever, cough, cold, flu, infection', specialty: 'General Medicine', keywords: ['fever', 'cough', 'cold', 'flu', 'infection', 'general', 'headache'] },
  { id: '8', text: 'Eye problems, vision issues, cataracts', specialty: 'Ophthalmology', keywords: ['eye', 'vision', 'cataract', 'ophthalm', 'sight', 'blind'] },
  { id: '9', text: 'Ear, nose, throat issues, hearing problems', specialty: 'ENT', keywords: ['ear', 'nose', 'throat', 'ent', 'hearing', 'sinus'] },
  { id: '10', text: 'Diabetes, thyroid, hormonal imbalance', specialty: 'Endocrinology', keywords: ['diabetes', 'thyroid', 'hormone', 'endocrin', 'sugar', 'insulin'] },
  { id: '11', text: 'Kidney problems, urinary issues', specialty: 'Nephrology', keywords: ['kidney', 'urinary', 'nephro', 'urine', 'bladder'] },
  { id: '12', text: 'Breathing problems, asthma, lung issues', specialty: 'Pulmonology', keywords: ['lung', 'breath', 'asthma', 'pulmon', 'respiratory'] },
  { id: '13', text: 'Brain, nervous system, seizures, paralysis', specialty: 'Neurology', keywords: ['brain', 'nerve', 'seizure', 'paralysis', 'neuro', 'neurological'] },
  { id: '14', text: 'Cancer screening, tumors, oncology', specialty: 'Oncology', keywords: ['cancer', 'tumor', 'oncolog', 'chemotherapy'] },
  { id: '15', text: 'Child health, vaccination, pediatric care', specialty: 'Pediatrics', keywords: ['child', 'baby', 'pediatric', 'infant', 'vaccination', 'kid'] },
];

export default function AIChatbotScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [conversationStage, setConversationStage] = useState<'greeting' | 'symptoms' | 'recommendation'>('greeting');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchDoctors();
    const aiStatus = isAIConfigured() 
      ? `AI-powered by ${getProviderName()}` 
      : 'Using keyword matching (Configure AI in ai-config.ts for better results)';
    
    sendBotMessage(`Hello! I'm your LifeBridge AI Health Assistant. 👋\n\n${aiStatus}\n\nI'm here to help you find the right doctor based on your symptoms.\n\nPlease describe what symptoms or health concerns you're experiencing.`);
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/doctors`);
      if (response.ok) {
        const data: Doctor[] = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  const sendBotMessage = (text: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMessage]);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // NEW: Call AI API to analyze symptoms and recommend specialties
  const analyzeWithAI = async (symptoms: string): Promise<string[]> => {
    try {
      // Check if API key is configured
      if (!isAIConfigured()) {
        console.warn('AI API key not configured. Using fallback keyword matching.');
        Alert.alert(
          'AI Not Configured',
          `Currently using keyword matching. For better results, add your API key in ai-config.ts\n\nCurrent mode: ${getProviderName()}`,
          [{ text: 'OK' }]
        );
        return analyzeSymptomsFallback(symptoms);
      }

      const specialtiesList = symptomDatabase.map(s => s.specialty).join(', ');
      
      const systemPrompt = `You are a medical triage assistant. Based on the patient's symptoms, recommend up to 3 medical specialties from this list: ${specialtiesList}. 

Rules:
- Only respond with specialty names from the list, separated by commas
- Do NOT add explanations or extra text
- Be precise and relevant to the symptoms
- If symptoms match multiple specialties, list up to 3 most relevant ones
- For general symptoms like fever/cold, suggest "General Medicine"

Example responses:
"Cardiology, Pulmonology"
"Dermatology"
"General Medicine, Pulmonology"`;

      let response;
      let aiResponse = '';

      if (AI_CONFIG.provider === 'gemini') {
        // Gemini API format
        const geminiUrl = `${AI_CONFIG.apiUrl}?key=${AI_CONFIG.apiKey}`;
        response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${systemPrompt}\n\nPatient symptoms: ${symptoms}`
              }]
            }],
            generationConfig: {
              temperature: AI_CONFIG.temperature,
              maxOutputTokens: AI_CONFIG.maxTokens,
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API error:', response.status, errorText);
          Alert.alert(
            'AI Service Error',
            'Could not connect to Gemini AI service. Using fallback analysis.',
            [{ text: 'OK' }]
          );
          return analyzeSymptomsFallback(symptoms);
        }

        const data = await response.json();
        aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      } else {
        // OpenAI/Claude API format
        response = await fetch(AI_CONFIG.apiUrl!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
          },
          body: JSON.stringify({
            model: AI_CONFIG.model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Patient symptoms: ${symptoms}` }
            ],
            temperature: AI_CONFIG.temperature,
            max_tokens: AI_CONFIG.maxTokens,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('AI API error:', response.status, errorText);
          Alert.alert(
            'AI Service Error',
            'Could not connect to AI service. Using fallback analysis.',
            [{ text: 'OK' }]
          );
          return analyzeSymptomsFallback(symptoms);
        }

        const data = await response.json();
        aiResponse = data.choices[0]?.message?.content?.trim() || '';
      }
      
      // Parse AI response to extract specialties
      const recommendedSpecialties = aiResponse
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
        .slice(0, 3);

      return recommendedSpecialties.length > 0 ? recommendedSpecialties : analyzeSymptomsFallback(symptoms);
    } catch (error) {
      console.error('AI API call failed:', error);
      Alert.alert(
        'Connection Error',
        'Could not reach AI service. Using local analysis.',
        [{ text: 'OK' }]
      );
      return analyzeSymptomsFallback(symptoms);
    }
  };

  // Fallback keyword matching (used when AI API is not available)
  const analyzeSymptomsFallback = (userInput: string): string[] => {
    const lowercaseInput = userInput.toLowerCase();
    const matchedSpecialties: { specialty: string; score: number }[] = [];

    symptomDatabase.forEach(symptom => {
      let score = 0;
      symptom.keywords.forEach(keyword => {
        if (lowercaseInput.includes(keyword)) {
          score++;
        }
      });
      if (score > 0) {
        matchedSpecialties.push({ specialty: symptom.specialty, score });
      }
    });

    matchedSpecialties.sort((a, b) => b.score - a.score);
    const uniqueSpecialties = Array.from(new Set(matchedSpecialties.map(m => m.specialty)));
    
    return uniqueSpecialties.slice(0, 3);
  };

  const findDoctorsBySpecialty = (specialties: string[]): Doctor[] => {
    const availableDoctors: Doctor[] = [];
    
    specialties.forEach(specialty => {
      const matchingDoctors = doctors.filter(
        doc => doc.specialty.toLowerCase().includes(specialty.toLowerCase()) && doc.available
      );
      availableDoctors.push(...matchingDoctors);
    });

    // If no exact match, return all available doctors
    if (availableDoctors.length === 0) {
      return doctors.filter(doc => doc.available);
    }

    return availableDoctors;
  };

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Use AI to analyze symptoms
    try {
      const recommendedSpecialties = await analyzeWithAI(currentInput);
      const recommendedDoctors = findDoctorsBySpecialty(recommendedSpecialties);

      let response = '';

      if (recommendedDoctors.length > 0) {
        response = `Based on your symptoms, I recommend consulting with:\n\n`;
        
        recommendedDoctors.forEach((doctor, index) => {
          response += `${index + 1}. Dr. ${doctor.name}\n   Specialty: ${doctor.specialty}\n   Status: Available ✓\n\n`;
        });

        response += `Would you like to book an appointment with any of these doctors? You can tap the "Book Appointment" button below or go back to the home screen.`;
      } else {
        response = `I understand your concerns. While I couldn't find a specialist that exactly matches your symptoms in our current available doctors, I recommend:\n\n`;
        response += `1. Consulting with a General Medicine doctor for initial evaluation\n`;
        response += `2. Visiting the emergency room if symptoms are severe\n\n`;
        response += `You can check all our doctors by going back to the Doctor Consultation page.`;
      }

      setIsTyping(false);
      sendBotMessage(response);
      setConversationStage('recommendation');
    } catch (error) {
      setIsTyping(false);
      sendBotMessage('I apologize, but I encountered an error analyzing your symptoms. Please try again or consult with a doctor directly.');
      console.error('Error in symptom analysis:', error);
    }
  };

  const renderMessage = (message: Message) => {
    const isBot = message.sender === 'bot';
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isBot ? styles.botMessageContainer : styles.userMessageContainer,
        ]}
      >
        {isBot && (
          <View style={styles.botAvatar}>
            <Ionicons name="medical" size={20} color="#FFFFFF" />
          </View>
        )}
        <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
            {message.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#E0E0E0" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>AI Health Assistant</Text>
            <Text style={styles.headerSubtitle}>Symptom Analysis & Doctor Recommendation</Text>
          </View>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.chatContainer}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesScrollView}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            
            {isTyping && (
              <View style={[styles.messageContainer, styles.botMessageContainer]}>
                <View style={styles.botAvatar}>
                  <Ionicons name="medical" size={20} color="#FFFFFF" />
                </View>
                <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                  <ActivityIndicator size="small" color="#578FFF" />
                  <Text style={styles.typingText}>Analyzing...</Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Describe your symptoms..."
              placeholderTextColor="#B0B0B0"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, inputText.trim() === '' && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={inputText.trim() === ''}
            >
              <Ionicons name="send" size={24} color={inputText.trim() === '' ? '#666' : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Quick Actions */}
        {conversationStage === 'recommendation' && (
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push({
                pathname: '/doctor-consultation',
                params: { userId: Number(userId) }
              })}
            >
              <FontAwesome name="user-md" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2C2C2C',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E0E0E0',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  chatContainer: {
    flex: 1,
  },
  messagesScrollView: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
  botAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#578FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 18,
  },
  botBubble: {
    backgroundColor: '#2C2C2C',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#578FFF',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  botText: {
    color: '#E0E0E0',
  },
  userText: {
    color: '#FFFFFF',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  typingText: {
    marginLeft: 10,
    color: '#B0B0B0',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#2C2C2C',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    color: '#E0E0E0',
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#578FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#2C2C2C',
    borderTopWidth: 1,
    borderTopColor: '#3A3A3C',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#578FFF',
    paddingVertical: 15,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
