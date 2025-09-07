"use client";

import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

interface MetricsData {
  runeDepth: string;
  runePriceUSD: string;
  swapVolume: string;
  swapCount24h: string;
  swapCount30d: string;
  swapCount: string;
  dailyActiveUsers: string;
  monthlyActiveUsers: string;
  addLiquidityVolume: string;
  withdrawVolume: string;
  addLiquidityCount: string;
  withdrawCount: string;
}

interface PoolData {
  asset: string;
  assetDepth: string;
  runeDepth: string;
  volume24h: string;
  poolAPY: string;
  status: string;
}

interface NetworkData {
  bondMetrics?: {
    totalActiveBond?: string;
    averageActiveBond?: string;
    medianActiveBond?: string;
    minimumActiveBond?: string;
    maximumActiveBond?: string;
    totalStandbyBond?: string;
    averageStandbyBond?: string;
    medianStandbyBond?: string;
    minimumStandbyBond?: string;
    maximumStandbyBond?: string;
  };
  activeBonds?: string[];
  standbyBonds?: string[];
  totalReserve?: string;
  totalAsgardian?: string;
  totalBond?: string;
}

const DynamicMetrics = () => {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [poolsData, setPoolsData] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('24H');
  const [, setNetworkData] = useState<NetworkData | null>(null);
  const [periodMetrics, setPeriodMetrics] = useState({
    volume: '0',
    transactions: '0',
    avgVolume: '0'
  });
  const chartRef = useRef<HTMLDivElement>(null);
  const metricsCardsRef = useRef<HTMLDivElement>(null);
  const additionalMetricsRef = useRef<HTMLDivElement>(null);

  const fetchMetricsData = async () => {
    try {
      setLoading(true);
      
      // Fetch global stats
      const statsResponse = await fetch('https://midgard.ninerealms.com/v2/stats');
      if (statsResponse.ok) {
        const contentType = statsResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const statsData = await statsResponse.json();
          setMetricsData(statsData);
        } else {
          console.warn('Stats API response is not JSON');
        }
      } else {
        console.warn('Stats API request failed:', statsResponse.status);
      }
      
      // Fetch pools data for TVL calculation
      const poolsResponse = await fetch('https://midgard.ninerealms.com/v2/pools?status=available');
      if (poolsResponse.ok) {
        const contentType = poolsResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const poolsData = await poolsResponse.json();
          setPoolsData(poolsData);
        } else {
          console.warn('Pools API response is not JSON');
        }
      } else {
        console.warn('Pools API request failed:', poolsResponse.status);
      }
      
      // Fetch network data for additional metrics
      const networkResponse = await fetch('https://midgard.ninerealms.com/v2/network');
      if (networkResponse.ok) {
        const contentType = networkResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const networkData = await networkResponse.json();
          setNetworkData(networkData);
        } else {
          console.warn('Network API response is not JSON');
        }
      } else {
        console.warn('Network API request failed:', networkResponse.status);
      }
      
    } catch (error) {
      console.error('Error fetching metrics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeriodData = async (period: string) => {
    try {
      console.log(`Fetching data for period: ${period}`);
      
      // Fetch historical data based on period
      const periodMap = {
        '24H': '1d',
        '7D': '7d', 
        '30D': '30d'
      };
      
      const interval = periodMap[period as keyof typeof periodMap];
      
      let volumeData = null;
      let earningsData = null;
      
      // Try to fetch volume history for the selected period
      try {
        const volumeResponse = await fetch(`https://midgard.ninerealms.com/v2/history/swaps?interval=${interval}&count=50`);
        
        // Check if response is ok and contains JSON
        if (volumeResponse.ok) {
          const contentType = volumeResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            volumeData = await volumeResponse.json();
          } else {
            console.warn('Volume API response is not JSON:', await volumeResponse.text());
          }
        } else {
          console.warn('Volume API request failed:', volumeResponse.status, volumeResponse.statusText);
        }
      } catch (volumeError) {
        console.warn('Volume API network error:', volumeError);
      }
      
      // Try to fetch earnings history 
      try {
        const earningsResponse = await fetch(`https://midgard.ninerealms.com/v2/history/earnings?interval=${interval}&count=50`);
        
        if (earningsResponse.ok) {
          const contentType = earningsResponse.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            earningsData = await earningsResponse.json();
          } else {
            console.warn('Earnings API response is not JSON:', await earningsResponse.text());
          }
        } else {
          console.warn('Earnings API request failed:', earningsResponse.status, earningsResponse.statusText);
        }
      } catch (earningsError) {
        console.warn('Earnings API network error:', earningsError);
      }
      
      // Update the chart data and metrics based on period
      if (volumeData && volumeData.intervals) {
        console.log(`✅ Using REAL THORChain data for ${period}`);
        updateChartData(volumeData);
        updatePeriodMetrics(volumeData, earningsData, period);
      } else {
        console.log(`🔄 No valid volume data for ${period}, using simulated data`);
        updateSimulatedData(period);
        updateSimulatedMetrics(period);
      }
      
      setActivePeriod(period);
      
    } catch (error) {
      console.error('Error fetching period data:', error);
      // Fallback to simulated data if API fails
      updateSimulatedData(period);
      updateSimulatedMetrics(period);
      setActivePeriod(period);
    }
  };

  const updateChartData = (volumeData: { intervals?: Array<{ totalVolume?: string; totalCount?: string }> }) => {
    // Update the SVG chart path based on real data
    const chartLine = chartRef.current?.querySelector('.chart-line') as SVGPathElement;
    const chartArea = chartRef.current?.querySelector('.chart-area') as SVGPathElement;
    const chartPoints = chartRef.current?.querySelectorAll('.chart-point');
    
    if (chartLine && volumeData?.intervals) {
      // Generate new path based on real volume data
      const intervals = volumeData.intervals.slice(-6); // Get last 6 data points
      let pathD = '';
      let areaD = '';
      
      intervals.forEach((interval, index: number) => {
        const x = 50 + (index * 140); // Distribute points across chart width
        const volume = parseFloat(interval.totalVolume || '0') / 100000000;
        const maxVolume = Math.max(...intervals.map((i) => parseFloat(i.totalVolume || '0') / 100000000));
        const y = 180 - ((volume / maxVolume) * 120); // Scale to chart height
        
        if (index === 0) {
          pathD = `M ${x} ${y}`;
          areaD = `M ${x} ${y}`;
        } else {
          pathD += ` L ${x} ${y}`;
          areaD += ` L ${x} ${y}`;
        }
        
        // Update chart points
        if (chartPoints && chartPoints[index]) {
          (chartPoints[index] as SVGCircleElement).setAttribute('cx', x.toString());
          (chartPoints[index] as SVGCircleElement).setAttribute('cy', y.toString());
        }
      });
      
      // Complete area path
      areaD += ` L 750 200 L 50 200 Z`;
      
      // Update chart paths
      chartLine.setAttribute('d', pathD);
      if (chartArea) {
        chartArea.setAttribute('d', areaD);
      }
    }
  };

  const updatePeriodMetrics = (volumeData: { intervals?: Array<{ totalVolume?: string; totalCount?: string }> }, earningsData: { intervals?: Array<{ totalEarnings?: string }> }, period: string) => {
    // Update the additional metrics based on period data
    if (volumeData?.intervals) {
      const intervals = volumeData.intervals;
      const totalVolume = intervals.reduce((sum: number, interval) => 
        sum + (parseFloat(interval.totalVolume || '0') / 100000000), 0
      );
      const totalTxs = intervals.reduce((sum: number, interval) => 
        sum + (parseInt(interval.totalCount || '0')), 0
      );
      const avgVolume = totalVolume / intervals.length;
      
      setPeriodMetrics({
        volume: formatLargeNumber(totalVolume),
        transactions: totalTxs.toLocaleString(),
        avgVolume: formatLargeNumber(avgVolume)
      });
      
      console.log(`${period} Period Metrics Updated:`, {
        volume: formatLargeNumber(totalVolume),
        transactions: totalTxs.toLocaleString(),
        avgVolume: formatLargeNumber(avgVolume)
      });
    } else {
      // Fallback to simulated metrics
      const simulatedMetrics = {
        '24H': { volume: '$12.5M', transactions: '1,234', avgVolume: '$2.1M' },
        '7D': { volume: '$85.2M', transactions: '8,567', avgVolume: '$12.2M' },
        '30D': { volume: '$342.8M', transactions: '32,145', avgVolume: '$11.4M' }
      };
      
      const metrics = simulatedMetrics[period as keyof typeof simulatedMetrics] || simulatedMetrics['24H'];
      setPeriodMetrics(metrics);
    }
  };

  const updateSimulatedData = (period: string) => {
    // Fallback: simulate different data for different periods
    const chartLine = chartRef.current?.querySelector('.chart-line') as SVGPathElement;
    const chartArea = chartRef.current?.querySelector('.chart-area') as SVGPathElement;
    const chartPoints = chartRef.current?.querySelectorAll('.chart-point');
    
    // Generate different chart patterns based on period
    let pathD = '';
    let areaD = '';
    
    const patterns = {
      '24H': [150, 120, 140, 100, 90, 70], // More volatile
      '7D': [140, 110, 130, 95, 85, 75],   // Medium volatility
      '30D': [130, 115, 125, 105, 95, 85]  // More stable
    };
    
    const yValues = patterns[period as keyof typeof patterns] || patterns['24H'];
    
    yValues.forEach((y, index) => {
      const x = 50 + (index * 140);
      
      if (index === 0) {
        pathD = `M ${x} ${y}`;
        areaD = `M ${x} ${y}`;
      } else {
        pathD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }
      
              // Update chart points
        if (chartPoints && chartPoints[index]) {
          (chartPoints[index] as SVGCircleElement).setAttribute('cx', x.toString());
          (chartPoints[index] as SVGCircleElement).setAttribute('cy', y.toString());
        }
    });
    
    // Complete area path
    areaD += ` L 750 200 L 50 200 Z`;
    
    // Update chart paths
    if (chartLine) chartLine.setAttribute('d', pathD);
    if (chartArea) chartArea.setAttribute('d', areaD);
  };

  const updateSimulatedMetrics = (period: string) => {
    // Fallback to simulated metrics when API fails
    console.log(`🔄 Using SIMULATED data for ${period} (API unavailable)`);
    
    const simulatedMetrics = {
      '24H': { volume: '$45.2M', transactions: '2,847', avgVolume: '$1.9M' },
      '7D': { volume: '$312.8M', transactions: '18,542', avgVolume: '$44.7M' },
      '30D': { volume: '$1.2B', transactions: '76,891', avgVolume: '$40.1M' }
    };
    
    const metrics = simulatedMetrics[period as keyof typeof simulatedMetrics] || simulatedMetrics['24H'];
    setPeriodMetrics(metrics);
  };

  useEffect(() => {
    fetchMetricsData();
    
    // Update every 5 minutes
    const interval = setInterval(fetchMetricsData, 300000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate Total Value Locked
  const calculateTVL = (): string => {
    if (!poolsData.length) return '0';
    
    const totalTVL = poolsData.reduce((sum, pool) => {
      const runeDepth = parseFloat(pool.runeDepth) / 100000000; // Convert from base units
      // const assetDepth = parseFloat(pool.assetDepth) / 100000000;
      return sum + (runeDepth * 2); // TVL = runeDepth * 2 (both sides of pool)
    }, 0);
    
    return formatLargeNumber(totalTVL);
  };

  // Format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatNumber = (numStr: string): string => {
    const num = parseFloat(numStr);
    return num.toLocaleString();
  };

  const formatVolume = (volumeStr: string): string => {
    const volume = parseFloat(volumeStr) / 100000000; // Convert from base units
    return formatLargeNumber(volume);
  };

  // GSAP Animations - The Magic Happens Here! ✨
  useGSAP(() => {
    if (!loading && chartRef.current && metricsCardsRef.current) {
      const tl = gsap.timeline();
      
      // 1. Animate metric cards entrance with stagger
      tl.fromTo('.metric-card', 
        { 
          y: 50, 
          opacity: 0, 
          scale: 0.9,
          rotationX: -15
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          rotationX: 0,
          duration: 0.8, 
          stagger: 0.15,
          ease: "back.out(1.7)"
        }
      );
      
      // 2. Chart container entrance
      tl.fromTo('.chart-container',
        { 
          y: 30, 
          opacity: 0, 
          scale: 0.95 
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.3"
      );
      
      // 3. Animate chart line drawing (SVG path animation)
      const chartLine = chartRef.current.querySelector('.chart-line') as SVGPathElement;
      if (chartLine) {
        const pathLength = chartLine.getTotalLength();
        gsap.set(chartLine, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        });
        
        tl.to(chartLine, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut"
        }, "-=0.2");
      }
      
      // 4. Animate chart area fill
      const chartArea = chartRef.current.querySelector('.chart-area') as SVGPathElement;
      if (chartArea) {
        gsap.set(chartArea, { opacity: 0 });
        tl.to(chartArea, {
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        }, "-=1.5");
      }
      
      // 5. Animate chart points with elastic effect
      const chartPoints = chartRef.current.querySelectorAll('.chart-point');
      gsap.set(chartPoints, { scale: 0, opacity: 0 });
      tl.to(chartPoints, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "elastic.out(1, 0.5)"
      }, "-=1");
      
      // 6. Animate additional metrics
      tl.fromTo('.additional-metrics .metric-item',
        { 
          x: 30, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.5"
      );
      
      // 7. Add hover animations for metric cards
      const metricCards = document.querySelectorAll('.metric-card');
      metricCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -8,
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(3, 26, 62, 0.15)",
            duration: 0.3,
            ease: "power2.out"
          });
          
          // Animate the icon
          const icon = card.querySelector('.metric-icon');
          if (icon) {
            gsap.to(icon, {
              rotation: 360,
              scale: 1.1,
              duration: 0.6,
              ease: "back.out(1.7)"
            });
          }
          
          // Animate the value with a counting effect
          const value = card.querySelector('.metric-value');
          if (value) {
            gsap.fromTo(value, 
              { scale: 1 },
              { 
                scale: 1.05,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
              }
            );
          }
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            boxShadow: "0 8px 25px rgba(3, 26, 62, 0.1)",
            duration: 0.3,
            ease: "power2.out"
          });
          
          const icon = card.querySelector('.metric-icon');
          if (icon) {
            gsap.to(icon, {
              rotation: 0,
              scale: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });
      });
      
      // 8. Add period button animations - FIXED!
      const periodBtns = document.querySelectorAll('.period-btn');
      periodBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const period = (e.target as HTMLElement).textContent || '24H';
          
          // Update active state
          periodBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          // Fetch new period data
          fetchPeriodData(period);
          
          // Animate chart refresh
          if (chartLine && chartPoints) {
            // Get path length inside the click handler
            const currentPathLength = chartLine.getTotalLength();
            
            gsap.to(chartLine, {
              strokeDashoffset: currentPathLength,
              duration: 0.5,
              ease: "power2.in",
              onComplete: () => {
                // Re-animate the line drawing
                gsap.to(chartLine, {
                  strokeDashoffset: 0,
                  duration: 1.5,
                  ease: "power2.out"
                });
              }
            });
            
            // Animate points out and back in
            gsap.to(chartPoints, {
              scale: 0,
              opacity: 0,
              duration: 0.3,
              stagger: 0.05,
              ease: "power2.in",
              onComplete: () => {
                gsap.to(chartPoints, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "elastic.out(1, 0.5)"
                });
              }
            });
          }
        });
      });
      
      // 9. Continuous subtle animations
      // Floating animation for chart points
      gsap.to(chartPoints, {
        y: -2,
        duration: 2,
        stagger: 0.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
      });
      
      // Pulse animation for metric values
      gsap.to('.metric-value', {
        scale: 1.01,
        duration: 3,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.5
      });
    }
  }, { dependencies: [loading], revertOnUpdate: true });

  if (loading) {
    return (
      <div className="dynamic-metrics-container">
        {/* Skeleton for top row with 3 main metrics */}
        <div className="metrics-top-row">
          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>

          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>

          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>

          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>
        </div>

        {/* Skeleton for chart section */}
        <div className="chart-section">
          <div className="chart-header">
            <div className="chart-title-section">
              <div className="skeleton-chart-title"></div>
              <div className="skeleton-chart-subtitle"></div>
            </div>
            <div className="period-buttons">
              <div className="skeleton-period-btn"></div>
              <div className="skeleton-period-btn"></div>
              <div className="skeleton-period-btn"></div>
            </div>
          </div>
          
          <div className="chart-container">
            <div className="skeleton-chart"></div>
          </div>
        </div>

        {/* Skeleton for bottom row with additional metrics */}
        <div className="metrics-bottom-row">
          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>

          <div className="metric-card skeleton-card">
            <div className="skeleton-icon"></div>
            <div className="metric-content">
              <div className="skeleton-title"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-change"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!metricsData) {
    return (
      <div className="dynamic-metrics-error">
        <p>Unable to load metrics data</p>
      </div>
    );
  }

  return (
    <div className="dynamic-metrics-container">
      {/* Top Metrics Row */}
      <div ref={metricsCardsRef} className="metrics-top-row">
        <div className="metric-card tvl-card">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Total Value Locked</h3>
            <p className="metric-value">{calculateTVL()}</p>
            <span className="metric-change positive">+2.5%</span>
          </div>
        </div>

        <div className="metric-card volume-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>24h Volume</h3>
            <p className="metric-value">{formatVolume(metricsData.swapVolume)}</p>
            <span className="metric-change positive">+15.3%</span>
          </div>
        </div>

        <div className="metric-card users-card">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Daily Active Users</h3>
            <p className="metric-value">{formatNumber(metricsData.dailyActiveUsers)}</p>
            <span className="metric-change positive">+8.7%</span>
          </div>
        </div>

        <div className="metric-card transactions-card">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Total Transactions</h3>
            <p className="metric-value">{formatNumber(metricsData.swapCount)}</p>
            <span className="metric-change positive">+12.1%</span>
          </div>
        </div>

        <div className="metric-card liquidity-card">
          <div className="metric-icon">💧</div>
          <div className="metric-content">
            <h3>Liquidity Added</h3>
            <p className="metric-value">{formatVolume(metricsData.addLiquidityVolume)}</p>
            <span className="metric-change positive">+7.8%</span>
          </div>
        </div>

        <div className="metric-card pools-card">
          <div className="metric-icon">🏊</div>
          <div className="metric-content">
            <h3>Active Pools</h3>
            <p className="metric-value">{poolsData.length}</p>
            <span className="metric-change positive">+2.3%</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="metrics-chart-section">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title-section">
              <h3>Transaction Volume ({activePeriod})</h3>
              <p className="chart-subtitle">
                Total: {periodMetrics.volume} | Avg: {periodMetrics.avgVolume} | Transactions: {periodMetrics.transactions}
              </p>
            </div>
            <div className="chart-period">
              <button className={`period-btn ${activePeriod === '24H' ? 'active' : ''}`}>24H</button>
              <button className={`period-btn ${activePeriod === '7D' ? 'active' : ''}`}>7D</button>
              <button className={`period-btn ${activePeriod === '30D' ? 'active' : ''}`}>30D</button>
            </div>
          </div>
          
          <div ref={chartRef} className="chart-area">
            {/* Animated SVG Chart - Will implement with GSAP */}
            <svg width="100%" height="200" viewBox="0 0 800 200">
              {/* Background Grid */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(152, 162, 179, 0.1)" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Sample Chart Line - Will be animated with GSAP */}
              <path
                d="M 50 150 Q 200 100 350 120 T 650 80 L 750 60"
                fill="none"
                stroke="#F8B30D"
                strokeWidth="3"
                className="chart-line"
              />
              
              {/* Chart Area Fill */}
              <path
                d="M 50 150 Q 200 100 350 120 T 650 80 L 750 60 L 750 200 L 50 200 Z"
                fill="url(#chartGradient)"
                className="chart-area"
              />
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F8B30D" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#F8B30D" stopOpacity="0.05"/>
                </linearGradient>
              </defs>
              
              {/* Data Points */}
              <circle cx="50" cy="150" r="4" fill="#F8B30D" className="chart-point"/>
              <circle cx="200" cy="100" r="4" fill="#F8B30D" className="chart-point"/>
              <circle cx="350" cy="120" r="4" fill="#F8B30D" className="chart-point"/>
              <circle cx="500" cy="90" r="4" fill="#F8B30D" className="chart-point"/>
              <circle cx="650" cy="80" r="4" fill="#F8B30D" className="chart-point"/>
              <circle cx="750" cy="60" r="4" fill="#F8B30D" className="chart-point"/>
            </svg>
          </div>
        </div>

        {/* Additional Metrics */}
        <div ref={additionalMetricsRef} className="additional-metrics">
          <div className="metric-item">
            <span className="metric-label">RUNE Price</span>
            <span className="metric-value">${parseFloat(metricsData.runePriceUSD).toFixed(4)}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">24h Swaps</span>
            <span className="metric-value">{formatNumber(metricsData.swapCount24h)}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Monthly Users</span>
            <span className="metric-value">{formatNumber(metricsData.monthlyActiveUsers)}</span>
          </div>
          
          <div className="metric-item">
            <span className="metric-label">Active Pools</span>
            <span className="metric-value">{poolsData.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicMetrics;
