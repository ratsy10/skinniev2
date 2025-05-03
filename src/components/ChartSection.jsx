import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AuthContext } from '../App';
import { supabase } from '../lib/supabase';

const ChartContainer = styled.div`
  background-color: var(--off-white);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h3`
  font-size: 1.1rem;
  color: var(--deep-rose-red);
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimeSelector = styled.div`
  display: flex;
  gap: 8px;
`;

const TimeButton = styled.button`
  background-color: ${props => props.active ? 'var(--deep-rose-red)' : 'transparent'};
  color: ${props => props.active ? 'var(--off-white)' : 'var(--deep-rose-red)'};
  border: 1px solid var(--deep-rose-red);
  border-radius: 15px;
  padding: 4px 10px;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'var(--deep-rose-red)' : 'var(--blush-pink)'};
  }
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background-color: var(--soft-cream);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
`;

const ChartLine = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  background: linear-gradient(transparent, transparent),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L100,40 L200,10 L300,30 L400,50 L500,20 L600,40 L700,60 L800,40 L900,70 L1000,30 L1100,50 L1200,40 L1200,120 L0,120 Z' fill='%23B23A48' opacity='0.5'/%3E%3C/svg%3E") no-repeat bottom;
  background-size: 100% 100px;
`;

const ChartDots = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const ChartDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--deep-rose-red);
  position: relative;
  top: ${props => props.value}px;
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  font-size: 0.8rem;
  color: var(--dark-maroon);
`;

const InsightText = styled.p`
  font-size: 0.9rem;
  color: var(--dark-maroon);
  background-color: var(--soft-cream);
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid var(--deep-rose-red);
`;

const LoadingText = styled.p`
  color: var(--dark-maroon);
  text-align: center;
  padding: 10px;
`;

const ChartSection = ({ title = "Skin Score Trend", timeRange = "week" }) => {
  const [activeRange, setActiveRange] = useState(timeRange);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    async function fetchAnalysisData() {
      if (!user) return;
      
      setLoading(true);
      try {
        let daysToFetch = 7;
        if (activeRange === 'month') daysToFetch = 30;
        if (activeRange === 'year') daysToFetch = 60; // We'll use our 60 days of data
        
        const { data, error } = await supabase
          .from('skin_analyses')
          .select('severity_score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(daysToFetch);
          
        if (error) throw error;
        
        setChartData(data.reverse()); // Reverse to show oldest to newest
      } catch (err) {
        console.error('Error fetching analysis data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAnalysisData();
  }, [user, activeRange]);
  
  const handleRangeChange = (range) => {
    setActiveRange(range);
  };
  
  const getLabels = () => {
    if (activeRange === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (activeRange === 'month') {
      return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    } else {
      // For our 60 days of data, we'll show months
      return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    }
  };
  
  const labels = getLabels();
  
  // Calculate insight text
  const getInsightText = () => {
    if (chartData.length < 2) return "Not enough data for insights yet.";
    
    const lastScore = chartData[chartData.length - 1]?.severity_score;
    const prevScore = chartData[chartData.length - 2]?.severity_score;
    
    if (!lastScore || !prevScore) return "Collecting more data for insights...";
    
    const change = ((lastScore - prevScore) / prevScore) * 100;
    const improvedOrWorsened = change < 0 ? "improved" : "increased";
    
    return `Your skin score has ${improvedOrWorsened} by ${Math.abs(change).toFixed(1)}% compared to the previous reading.`;
  };
  
  if (loading) {
    return (
      <ChartContainer>
        <Title>{title}</Title>
        <LoadingText>Loading chart data...</LoadingText>
      </ChartContainer>
    );
  }
  
  return (
    <ChartContainer>
      <Title>
        {title}
        <TimeSelector>
          <TimeButton 
            active={activeRange === 'week'}
            onClick={() => handleRangeChange('week')}
          >
            Week
          </TimeButton>
          <TimeButton 
            active={activeRange === 'month'}
            onClick={() => handleRangeChange('month')}
          >
            Month
          </TimeButton>
          <TimeButton 
            active={activeRange === 'year'}
            onClick={() => handleRangeChange('year')}
          >
            Year
          </TimeButton>
        </TimeSelector>
      </Title>
      
      <ChartPlaceholder>
        <ChartLine />
        <ChartDots>
          {chartData.map((item, index) => (
            <ChartDot 
              key={index} 
              value={100 - (item.severity_score || 0)} 
            />
          ))}
        </ChartDots>
      </ChartPlaceholder>
      
      <ChartLabels>
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </ChartLabels>
      
      <InsightText>
        Insight: {getInsightText()}
      </InsightText>
    </ChartContainer>
  );
};

export default ChartSection;