import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Default chart options
export const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      font: {
        family: 'Inter, system-ui, sans-serif'
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11
        },
        color: '#6B7280'
      }
    },
    y: {
      grid: {
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        font: {
          family: 'Inter, system-ui, sans-serif',
          size: 11
        },
        color: '#6B7280'
      }
    }
  }
};

// Color palette for charts
export const colors = {
  primary: {
    main: '#0EA5E9',
    light: '#38BDF8',
    dark: '#0284C7',
    gradient: ['#0EA5E9', '#38BDF8']
  },
  success: {
    main: '#22C55E',
    light: '#4ADE80',
    dark: '#16A34A'
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706'
  },
  danger: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626'
  },
  purple: {
    main: '#8B5CF6',
    light: '#A78BFA',
    dark: '#7C3AED'
  },
  gray: {
    main: '#6B7280',
    light: '#9CA3AF',
    dark: '#4B5563'
  }
};