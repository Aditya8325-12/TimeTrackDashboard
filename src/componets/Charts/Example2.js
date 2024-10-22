import React from "react";
import Chart from "react-apexcharts";
const Example2 = ({ leaveIn, leaveOut, leave, Totalusers }) => {
  const options = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total User",
            formatter: function (w) {
              return Totalusers;
            },
          },
        },
      },
    },
    labels: ["Total User", "Leave In ", "Leave Out", "Leave"],
  };

  const series = [Totalusers, leaveIn, leaveOut, leave];

  return (
    <div id="chart" className=" w-11/12">
      <Chart options={options} series={series} type="radialBar" height={400} />
    </div>
  );
};

export default Example2;
