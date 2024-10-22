import React, { useState } from "react";
import Chart from "react-apexcharts";

const PieChart = ({ chartdata }) => {
  const [selectedData, setSelectedData] = useState({
    value: chartdata.Present || 0,
    label: "Present",
  });

  const series = [
    chartdata.Present || 0,
    chartdata["Week Off"] || 0,
    chartdata.Leave || 0,
    chartdata.Absent || 0,
  ];

  const options = {
    chart: {
      type: "pie",
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const selectedValue = series[config.dataPointIndex];
          const labels = ["Present", "Week Off", "Leave", "Absent"];
          const selectedLabel = labels[config.dataPointIndex];
          setSelectedData({
            value: selectedValue,
            label: selectedLabel,
          });
        },
      },
    },
    colors: ["#009FFF", "#93FCF8", "#BDB2FA", "#FFA5BA"],
    labels: ["Present", "Week Off", "Leave", "Absent"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div style={{ padding: "16px", borderRadius: "20px" }}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <Chart options={options} series={series} type="pie" />
        <div style={{ marginTop: "10px" }}>
          <h2 style={{ fontWeight: "bold" }}>{selectedData.value}</h2>
          <p>{selectedData.label}</p>
        </div>
      </div>
    </div>
  );
};

export default PieChart;
