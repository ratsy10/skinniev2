import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import HeaderWithDate from '../components/HeaderWithDate';
import SkinResultCard from '../components/SkinResultCard';
import { AuthContext } from '../App';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 2%;
  min-height: calc(100vh - 80px);
  max-width: 100%;
  margin: 0 auto;
`;

const Header = styled.div`
  width: 100%;
  margin-bottom: 8px;
`;

const LatestAnalysis = styled.div`
  width: 100%;
  margin-bottom: 16px;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 4fr 5fr;
  gap: 12px;
  width: 100%;
`;

const InsightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AnalysisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ChartCard = styled.div`
  background-color: var(--off-white);
  border-radius: 6px;
  padding: 12px;
  min-height: ${props => props.height || '300px'};
`;

const ChartTitle = styled.h3`
  font-size: 1rem;
  color: var(--deep-rose-red);
  margin-bottom: 8px;
`;

const StatsCard = styled.div`
  background-color: var(--off-white);
  border-radius: 6px;
  padding: 12px;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
`;

const StatCard = styled.div`
  background-color: var(--soft-cream);
  padding: 12px;
  border-radius: 4px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.4rem;
  color: var(--deep-rose-red);
  font-weight: bold;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--dark-maroon);
`;

const COLORS = ['#FF8042', '#00C49F', '#FFBB28', '#FF8042'];

const HomeScreen = () => {
  const { user } = useContext(AuthContext);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [analysisStats, setAnalysisStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [dietData, setDietData] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: analyses, error: analysesError } = await supabase
          .from('skin_analyses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (analysesError) throw analysesError;

        const { data: lifestyle, error: lifestyleError } = await supabase
          .from('lifestyle_habits')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });

        if (lifestyleError) throw lifestyleError;

        if (analyses?.length > 0) {
          setLatestAnalysis(analyses[analyses.length - 1]);
          setHasData(true);
        }

        if (lifestyle?.length > 0) {
          const stats = calculateStats(lifestyle, analyses);
          setAnalysisStats(stats);
          setHasData(true);

          // Prepare diet distribution data
          const dietCounts = lifestyle.reduce((acc, item) => {
            acc[item.diet] = (acc[item.diet] || 0) + 1;
            return acc;
          }, {});
          setDietData(Object.entries(dietCounts).map(([name, value]) => ({ name, value })));

          // Prepare weather distribution data
          const weatherCounts = lifestyle.reduce((acc, item) => {
            acc[item.weather] = (acc[item.weather] || 0) + 1;
            return acc;
          }, {});
          setWeatherData(Object.entries(weatherCounts).map(([name, value]) => ({ name, value })));

          // Prepare combined chart data
          const combinedData = lifestyle.map(life => {
            const matchingAnalysis = analyses.find(
              a => new Date(a.created_at).toDateString() === new Date(life.created_at).toDateString()
            );
            
            return {
              date: new Date(life.created_at).toLocaleDateString(),
              sleep: life.sleep_hours,
              stress: life.stress === 'high' ? 3 : life.stress === 'moderate' ? 2 : 1,
              sunlight: life.sunlight_minutes,
              score: matchingAnalysis?.severity_score
            };
          });

          setChartData(combinedData);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  const calculateStats = (lifestyleData, analysesData) => {
    if (!lifestyleData?.length) return null;

    const avgSleepHours = lifestyleData.reduce((acc, curr) => acc + curr.sleep_hours, 0) / lifestyleData.length;
    const avgSunlight = lifestyleData.reduce((acc, curr) => acc + curr.sunlight_minutes, 0) / lifestyleData.length;
    const highStressPercentage = (lifestyleData.filter(d => d.stress === 'high').length / lifestyleData.length) * 100;
    const healthyDietPercentage = (lifestyleData.filter(d => d.diet === 'healthy').length / lifestyleData.length) * 100;

    return {
      avgSleepHours: avgSleepHours.toFixed(1),
      avgSunlight: Math.round(avgSunlight),
      highStressPercentage: Math.round(highStressPercentage),
      healthyDietPercentage: Math.round(healthyDietPercentage)
    };
  };

  if (loading) return <div>Loading your skin data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <HomeContainer>
      <Header>
        <HeaderWithDate title={`Welcome Back, ${user?.email?.split('@')[0] || 'Skin Warrior'}!`} />
      </Header>

      {latestAnalysis && (
        <LatestAnalysis>
          <SkinResultCard 
            score={latestAnalysis.severity_score}
            analysisItems={[
              { icon: '✓', text: latestAnalysis.description },
              { icon: '!', text: `Affected area: ${latestAnalysis.affected_area_percentage}%` }
            ]}
          />
        </LatestAnalysis>
      )}

      <MainContent>
        <InsightSection>
          <StatsCard>
            <ChartTitle>Your Stats</ChartTitle>
            <StatGrid>
              <StatCard>
                <StatValue>{analysisStats?.avgSleepHours || '0'}</StatValue>
                <StatLabel>Avg Sleep (hrs)</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{analysisStats?.avgSunlight || '0'}</StatValue>
                <StatLabel>Avg Sun (min)</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{analysisStats?.highStressPercentage || '0'}%</StatValue>
                <StatLabel>High Stress Days</StatLabel>
              </StatCard>
              <StatCard>
                <StatValue>{analysisStats?.healthyDietPercentage || '0'}%</StatValue>
                <StatLabel>Healthy Diet Days</StatLabel>
              </StatCard>
            </StatGrid>
          </StatsCard>

          <ChartCard height="300px">
            <ChartTitle>Diet Distribution</ChartTitle>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={dietData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {dietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard height="300px">
            <ChartTitle>Weather Impact</ChartTitle>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weatherData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {weatherData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </InsightSection>

        <ChartsSection>
          <ChartCard height="350px">
            <ChartTitle>Sleep & Stress vs. Skin Health</ChartTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  yAxisId="left" 
                  domain={[0, 12]}
                  tick={{ fontSize: 9 }}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  domain={[0, 10]}
                  tick={{ fontSize: 9 }}
                />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '9px' }} />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="sleep" 
                  stroke="#8884d8" 
                  name="Sleep Hours"
                  strokeWidth={1.5}
                  dot={{ r: 1.5 }}
                />
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#ff7300" 
                  name="Stress Level"
                  strokeWidth={1.5}
                  dot={{ r: 1.5 }}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#82ca9d" 
                  name="Skin Score"
                  strokeWidth={1.5}
                  dot={{ r: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard height="300px">
            <ChartTitle>Sunlight Exposure</ChartTitle>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 9 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 9 }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sunlight" 
                  stroke="#ffc658" 
                  name="Minutes"
                  strokeWidth={1.5}
                  dot={{ r: 1.5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsSection>
      </MainContent>
    </HomeContainer>
  );
};

export default HomeScreen;