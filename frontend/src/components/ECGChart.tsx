// components/ECGChart.tsx
import React, { useState } from "react";
import { ScanEye } from "lucide-react";
import { Line } from "react-chartjs-2";
import { ModalProvider } from "./ui/modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
const leadNames = [
  "I",
  "II",
  "III",
  "aVR",
  "aVL",
  "aVF",
  "V1",
  "V2",
  "V3",
  "V4",
  "V5",
  "V6",
];

export const ECGChart: React.FC<ECGChartProps> = ({ data }) => {
  const [modalChart, setModalChart] = useState<{
    data: any;
    options: any;
  } | null>(null);
  if (!data || data.length === 0) return null;

  // Transpose the data to get [lead_index][time_step]
  const leadData = [];
  for (let leadIndex = 0; leadIndex < 12; leadIndex++) {
    leadData.push(data.map((timeStep) => timeStep[leadIndex]));
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
          position: "top" as const,
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
            text: "Time (samples)",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Amplitude (mV)",
          },
        },
      },
    };
    const chartView = () => {
      // alert("Chart view clicked for lead " + leadNames[index]);
      setModalChart({ data: chartData, options });
    };
    return (
      <div key={index} className="bg-white p-4 rounded-lg shadow-md">
        <ScanEye className="text-medical" onClick={chartView} />

        <Line data={chartData} options={options} />
      </div>
    );
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {charts}
      </div>
      {modalChart && (
        <ModalProvider>
          <div className="bg-white p-8 rounded-lg relative">
            <button
              onClick={() => setModalChart(null)}
              className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Line data={modalChart.data} options={modalChart.options} />
          </div>
        </ModalProvider>
      )}
    </>
  );
};
