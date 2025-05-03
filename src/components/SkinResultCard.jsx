import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: var(--off-white);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  font-size: 1.1rem;
  color: var(--deep-rose-red);
  margin-bottom: 15px;
`;

const Score = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--deep-rose-red);
  text-align: center;
  margin: 20px 0;
`;

const AnalysisList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AnalysisItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  background-color: var(--soft-cream);
  border-radius: 8px;
`;

const Icon = styled.span`
  color: var(--deep-rose-red);
  font-weight: bold;
`;

const Text = styled.p`
  color: var(--dark-maroon);
  margin: 0;
  flex: 1;
`;

const SkinResultCard = ({ score, analysisItems }) => {
  return (
    <Card>
      <Title>Latest Skin Analysis</Title>
      <Score>{score}/10</Score>
      <AnalysisList>
        {analysisItems.map((item, index) => (
          <AnalysisItem key={index}>
            <Icon>{item.icon}</Icon>
            <Text>{item.text}</Text>
          </AnalysisItem>
        ))}
      </AnalysisList>
    </Card>
  );
};

export default SkinResultCard;