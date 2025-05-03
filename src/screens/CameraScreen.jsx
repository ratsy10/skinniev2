import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import CameraUploader from '../components/CameraUploader';
import { analyzeSkinImage } from '../services/skinAnalysis';
import { AuthContext } from '../App';
import { supabase } from '../lib/supabase';

const CameraContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: var(--deep-rose-red);
  margin-bottom: 10px;
`;

const AnalysisResult = styled.div`
  background-color: var(--off-white);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
`;

const SeverityScore = styled.div`
  font-size: 2rem;
  color: var(--deep-rose-red);
  text-align: center;
  margin: 20px 0;
  font-weight: bold;
`;

const Description = styled.p`
  color: var(--dark-maroon);
  margin: 10px 0;
  line-height: 1.5;
`;

const AffectedArea = styled.p`
  color: var(--dark-maroon);
  font-weight: 500;
  margin-top: 10px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  color: var(--deep-rose-red);
  margin: 20px 0;
`;

const ErrorMessage = styled.div`
  color: red;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
`;

const CameraScreen = () => {
  const { user } = useContext(AuthContext);
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageCapture = async (file) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Analyze the image
      const result = await analyzeSkinImage(file);
      
      // Store the analysis in Supabase
      const { error: dbError } = await supabase
        .from('skin_analyses')
        .insert({
          user_id: user.id,
          severity_score: result.severity_score,
          description: result.description,
          affected_area_percentage: result.affected_area_percentage,
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error storing analysis:', dbError);
        throw new Error('Failed to store analysis results');
      }

      setAnalysis(result);
    } catch (err) {
      console.error('Error in handleImageCapture:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CameraContainer>
      <Title>Skin Analysis</Title>
      <CameraUploader onImageCapture={handleImageCapture} isLoading={isLoading} />
      
      {isLoading && (
        <LoadingSpinner>Analyzing your skin...</LoadingSpinner>
      )}

      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}

      {analysis && (
        <AnalysisResult>
          <SeverityScore>{analysis.severity_score}/10</SeverityScore>
          <Description>{analysis.description}</Description>
          <AffectedArea>Affected area: {analysis.affected_area_percentage}%</AffectedArea>
        </AnalysisResult>
      )}
    </CameraContainer>
  );
};

export default CameraScreen;