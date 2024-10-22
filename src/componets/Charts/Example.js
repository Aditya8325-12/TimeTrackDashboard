import React from "react";
import Chart from "react-apexcharts";
const Example = ({ data }) => {
  
  const monthsArray = new Array(6).fill(0);

  data.forEach((item) => {
    const monthindex = item._id.month - 1;
    const pairIndex = Math.floor(monthindex / 2);
    monthsArray[pairIndex] += item.count;
  });
  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [
        "Jan-Feb",
        "Mar-Apr",
        "May-Jun",
        "Jul-Aug",
        "Sep-Oct",
        "Nov-Dec",
      ],
    },
    title: {
      text: "Users",
      align: "center",
    },
  };

  const series = [
    {
      name: "Sales",
      data: monthsArray,
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default Example;
