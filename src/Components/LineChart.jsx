import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement
);

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const LineChart = ({
  selectedfeature,
  data,
  selectedGender,
  selectAgeGroup,
  selecttDate,
}) => {
  const uniqueDates = new Set();
  const labelTimeValue = {};
  data.analyticsData &&
    data.analyticsData.forEach((element) => {
      const { feature, timeSpent, date, gender, ageGroup } = element;
      if (
        feature === selectedfeature &&
        (!selectedGender || selectedGender === gender) &&
        (!selectAgeGroup || selectAgeGroup === ageGroup) &&
        (!selecttDate || formatDate(selecttDate) === date)
      ) {
        uniqueDates.add(date);
        if (!labelTimeValue[date]) {
          labelTimeValue[date] = 0;
        }
        labelTimeValue[date] += timeSpent;
      }
    });
  const chartData = {
    labels: Array.from(uniqueDates) || [],
    datasets: [
      {
        label: "Time Spent",
        data: Object.values(labelTimeValue) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: { type: "category", title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Time Spent" } },
    },
  };

  return (
    <div>
      <h3>Time Trend for {selectedfeature}</h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
