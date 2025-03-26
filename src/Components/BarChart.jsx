import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const BarChart = ({
  data,
  onBarClick,
  selectedGender,
  selectAgeGroup,
  selecttDate,
}) => {
  const uniqueLabels = new Set();
  const labelTimeValue = {};
  data.analyticsData &&
    data.analyticsData.forEach((element) => {
      const { feature, timeSpent, gender, ageGroup, date } = element;
      uniqueLabels.add(feature);
      if (
        (!selectedGender || selectedGender === gender) &&
        (!selectAgeGroup || selectAgeGroup === ageGroup) &&
        (!selecttDate || formatDate(selecttDate) == date)
      ) {
        if (!labelTimeValue[feature]) {
          labelTimeValue[feature] = 0;
        }
        labelTimeValue[feature] += timeSpent;
      }
    });
  const chartData = {
    labels: Object.keys(labelTimeValue) || [],
    datasets: [
      {
        label: "Total Time Spent",
        data: Object.values(labelTimeValue) || [],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedFeature = chartData.labels[index];
        onBarClick(selectedFeature);
      }
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
