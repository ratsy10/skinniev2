import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import kawaiiCharacter from '../assets/kawaii-skin-character.svg';
import { AuthContext } from '../App';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--soft-cream);
  padding: 20px;
  text-align: center;
`;

const CharacterImage = styled.img`
  width: 120px;
  height: 120px;
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`;

const AppTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--deep-rose-red);
  margin-bottom: 10px;
  font-weight: bold;
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: var(--off-white);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const FormTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--deep-rose-red);
  margin-bottom: 20px;
  text-align: center;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: var(--dark-maroon);
  margin-bottom: 8px;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid var(--blush-pink);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--dark-maroon);
  background-color: var(--off-white);
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--deep-rose-red);
  }
`;

const Button = styled.button`
  width: 100%;
  background-color: var(--deep-rose-red);
  color: var(--off-white);
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  
  &:hover {
    background-color: var(--dark-maroon);
  }
`;

const SwitchText = styled.p`
  font-size: 0.9rem;
  color: var(--dark-maroon);
  margin-top: 20px;
`;

const SwitchLink = styled.span`
  color: var(--deep-rose-red);
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: left;
`;

const AuthScreen = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { email, password } = formData;
      const result = isLogin 
        ? await auth.login(email, password)
        : await auth.signup(email, password);
      
      if (result.error) {
        setErrors({ submit: result.error.message });
      } else if (!isLogin) {
        // Show success message for signup
        setErrors({ submit: 'Please check your email to verify your account' });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <AuthContainer>
      <CharacterImage src={kawaiiCharacter} alt="AuraSkin Kawaii Character" />
      <AppTitle>AuraSkin</AppTitle>
      
      <FormContainer>
        <FormTitle>{isLogin ? 'Welcome Back!' : 'Create Account'}</FormTitle>
        
        <form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </InputGroup>
          
          {!isLogin && (
            <InputGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </InputGroup>
          )}
          
          {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Log In' : 'Sign Up')}
          </Button>
        </form>
        
        <SwitchText>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <SwitchLink onClick={toggleAuthMode}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </SwitchLink>
        </SwitchText>
      </FormContainer>
    </AuthContainer>
  );
};

export default AuthScreen;