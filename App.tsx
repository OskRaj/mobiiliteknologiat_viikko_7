import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from './config';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    main: string;
  }>;
  wind: {
    speed: number;
  };
}

export default function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(
        `${WEATHER_API_BASE_URL}/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError('Failed to fetch weather. Check city name or API key.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        onSubmitEditing={fetchWeather}
      />
      
      <TouchableOpacity style={styles.button} onPress={fetchWeather}>
        <Text style={styles.buttonText}>Get Weather</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}

      {weatherData && !loading && (
        <View style={styles.weatherContainer}>
          <Text style={styles.cityName}>{weatherData.name}</Text>
          <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
          <Text style={styles.description}>
            {weatherData.weather[0].description}
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}>
              Feels like: {Math.round(weatherData.main.feels_like)}°C
            </Text>
            <Text style={styles.detail}>
              Humidity: {weatherData.main.humidity}%
            </Text>
            <Text style={styles.detail}>
              Wind: {weatherData.wind.speed} m/s
            </Text>
          </View>
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  weatherContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  temperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 10,
  },
  description: {
    fontSize: 20,
    color: '#666',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  detail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
});
