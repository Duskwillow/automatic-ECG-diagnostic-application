// components/ECGChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ECGChartProps {
  data: number[][]; // 2D array: [time_step][lead_index]
}

// Standard 12-lead ECG labels
const leadNames = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

export const ECGChart: React.FC<ECGChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Transpose the data to get [lead_index][time_step]
  const leadData = [];
  for (let leadIndex = 0; leadIndex < 12; leadIndex++) {
    leadData.push(data.map(timeStep => timeStep[leadIndex]));
  }

  const charts = leadData.map((leadValues, index) => {
    const chartData = {
      labels: Array.from({ length: leadValues.length }, (_, i) => i.toString()),
      datasets: [
        {
          label: leadNames[index],
          data: leadValues,
          borderColor: `hsl(${index * 30}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 30}, 70%, 50%, 0.1)`,
          borderWidth: 2,
          pointRadius: 0, // Hide points for cleaner ECG display
          tension: 0.1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: `Lead ${leadNames[index]}`,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time (samples)'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Amplitude (mV)'
          }
        },
      },
    };

    return (
      <div key={index} className="bg-white p-4 rounded-lg shadow-md">
        <Line data={chartData} options={options} />
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {charts}
    </div>
  );
};