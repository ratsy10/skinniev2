import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../App';
import { supabase } from '../lib/supabase';

const JournalContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--deep-rose-red);
  margin-bottom: 20px;
`;

const DataSourceSection = styled.div`
  margin-bottom: 24px;
  background-color: var(--off-white);
  padding: 20px;
  border-radius: 12px;
`;

const DataSourceTitle = styled.h3`
  font-size: 1.2rem;
  color: var(--deep-rose-red);
  margin-bottom: 12px;
`;

const DataSourceDescription = styled.p`
  color: var(--dark-maroon);
  margin-bottom: 16px;
  font-size: 0.9rem;
`;

const ConnectButton = styled.button`
  background-color: ${props => props.connected ? 'var(--light-rose)' : 'var(--deep-rose-red)'};
  color: ${props => props.connected ? 'var(--dark-maroon)' : 'white'};
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;

  &:hover {
    background-color: ${props => props.connected ? 'var(--blush-pink)' : 'var(--dark-maroon)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: var(--off-white);
  padding: 20px;
  border-radius: 12px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: var(--dark-maroon);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AutofillIndicator = styled.span`
  font-size: 0.8rem;
  color: var(--deep-rose-red);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid var(--light-rose);
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${props => props.isAutofilled ? 'var(--blush-pink)' : 'white'};

  &:focus {
    outline: none;
    border-color: var(--deep-rose-red);
  }
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid var(--light-rose);
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${props => props.isAutofilled ? 'var(--blush-pink)' : 'white'};

  &:focus {
    outline: none;
    border-color: var(--deep-rose-red);
  }
`;

const Button = styled.button`
  background-color: var(--deep-rose-red);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--dark-maroon);
  }

  &:disabled {
    background-color: var(--light-rose);
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  padding: 10px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: center;
  
  ${props => props.type === 'error' && `
    background-color: #ffe6e6;
    color: red;
  `}
  
  ${props => props.type === 'success' && `
    background-color: #e6ffe6;
    color: green;
  `}
`;

const WatchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="3" />
    <path d="M9 22v2h6v-2" />
    <path d="M9 0v2h6V0" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const AutofillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
  </svg>
);

const JournalScreen = () => {
  const { user } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [autofilledData, setAutofilledData] = useState({});
  const [formData, setFormData] = useState({
    sleep_hours: '',
    diet: 'balanced',
    stress: 'low',
    weather: 'sunny',
    sunlight_minutes: ''
  });

  useEffect(() => {
    // Check if watch is connected in local storage
    const watchStatus = localStorage.getItem('appleWatchConnected');
    if (watchStatus === 'true') {
      setIsWatchConnected(true);
      fetchHealthData();
    }
  }, []);

  const fetchHealthData = async () => {
    // Simulate fetching data from Apple Watch
    // In a real implementation, this would use the Apple HealthKit API
    try {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulated health data
      const healthData = {
        sleep_hours: Math.floor(Math.random() * 4) + 6, // 6-9 hours
        stress: ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)],
        activity_minutes: Math.floor(Math.random() * 60) + 30 // 30-90 minutes
      };

      setAutofilledData(healthData);
      setFormData(prev => ({
        ...prev,
        sleep_hours: healthData.sleep_hours,
        stress: healthData.stress,
        sunlight_minutes: healthData.activity_minutes
      }));
    } catch (error) {
      console.error('Error fetching health data:', error);
      setMessage({ type: 'error', text: 'Failed to fetch health data from Apple Watch' });
    }
  };

  const handleWatchConnection = () => {
    if (isWatchConnected) {
      // Disconnect watch
      localStorage.removeItem('appleWatchConnected');
      setIsWatchConnected(false);
      setAutofilledData({});
    } else {
      // Connect watch
      localStorage.setItem('appleWatchConnected', 'true');
      setIsWatchConnected(true);
      fetchHealthData();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('lifestyle_habits')
        .insert({
          user_id: user.id,
          sleep_hours: parseInt(formData.sleep_hours),
          diet: formData.diet,
          stress: formData.stress,
          weather: formData.weather,
          sunlight_minutes: parseInt(formData.sunlight_minutes),
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Journal entry saved successfully!' });
      if (!isWatchConnected) {
        setFormData({
          sleep_hours: '',
          diet: 'balanced',
          stress: 'low',
          weather: 'sunny',
          sunlight_minutes: ''
        });
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setMessage({ type: 'error', text: 'Failed to save journal entry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <JournalContainer>
      <Title>Daily Journal</Title>
      
      <DataSourceSection>
        <DataSourceTitle>Connect Apple Watch</DataSourceTitle>
        <DataSourceDescription>
          Connect your Apple Watch to automatically fetch sleep, stress, and activity data.
          You can still manually adjust the values after importing.
        </DataSourceDescription>
        <ConnectButton 
          onClick={handleWatchConnection}
          connected={isWatchConnected}
        >
          <WatchIcon />
          {isWatchConnected ? 'Disconnect Apple Watch' : 'Connect Apple Watch'}
        </ConnectButton>
      </DataSourceSection>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>
            Hours of Sleep
            {autofilledData.sleep_hours && (
              <AutofillIndicator>
                <AutofillIcon /> Auto-filled
              </AutofillIndicator>
            )}
          </Label>
          <Input
            type="number"
            name="sleep_hours"
            value={formData.sleep_hours}
            onChange={handleChange}
            min="0"
            max="24"
            required
            isAutofilled={autofilledData.sleep_hours}
          />
        </FormGroup>

        <FormGroup>
          <Label>Diet Quality</Label>
          <Select
            name="diet"
            value={formData.diet}
            onChange={handleChange}
            required
          >
            <option value="balanced">Balanced</option>
            <option value="healthy">Very Healthy</option>
            <option value="unhealthy">Unhealthy</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            Stress Level
            {autofilledData.stress && (
              <AutofillIndicator>
                <AutofillIcon /> Auto-filled
              </AutofillIndicator>
            )}
          </Label>
          <Select
            name="stress"
            value={formData.stress}
            onChange={handleChange}
            required
            isAutofilled={autofilledData.stress}
          >
            <option value="low">Low</option>
            <option value="moderate">Moderate</option>
            <option value="high">High</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Weather</Label>
          <Select
            name="weather"
            value={formData.weather}
            onChange={handleChange}
            required
          >
            <option value="sunny">Sunny</option>
            <option value="cloudy">Cloudy</option>
            <option value="rainy">Rainy</option>
            <option value="snowy">Snowy</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>
            Minutes of Sun Exposure
            {autofilledData.activity_minutes && (
              <AutofillIndicator>
                <AutofillIcon /> Auto-filled
              </AutofillIndicator>
            )}
          </Label>
          <Input
            type="number"
            name="sunlight_minutes"
            value={formData.sunlight_minutes}
            onChange={handleChange}
            min="0"
            max="1440"
            required
            isAutofilled={autofilledData.activity_minutes}
          />
        </FormGroup>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </Button>
      </Form>

      {message && (
        <Message type={message.type}>{message.text}</Message>
      )}
    </JournalContainer>
  );
};

export default JournalScreen;