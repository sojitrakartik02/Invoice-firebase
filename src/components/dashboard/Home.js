import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import Chart from "chart.js/auto";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

const Home = () => {
  const [total, setTotal] = useState(0);
  const [totalInvoice, setTotalInvoice] = useState(1);
  const [totalMonth, setTotalMonth] = useState();
  const chartRef = useRef(null);
  const [invoices, setInvoices] = useState([]);

  const [recentData, setRecentData] = useState([]);

  const monthViseCollection = (data) => {
    const chartData = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };
    console.log(Object.keys(chartData));
    data.forEach((d) => {
      if (
        new Date(d.date.seconds * 1000).getFullYear() ===
        new Date().getFullYear()
      ) {
        // console.log("Cuurent year", d);
        // console.log(
        //   new Date(d.date.seconds * 1000).toLocaleString("default", {
        //     month: "long",
        //   })
        // );
        chartData[
          new Date(d.date.seconds * 1000).toLocaleString("default", {
            month: "short",
          })
        ] += d.total;
        console.log(chartData);
        createChart(chartData);
      }
    });
  };
  const createChart = (chartData) => {
    const ctx = document.getElementById("myChart");

    if (chartRef.current) {
      chartRef.current.destroy(); // Destroy the previous chart instance
    }

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: Object.keys(chartData),
        datasets: [
          {
            label: "Month vise Collection",
            data: Object.values(chartData),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };
  const getOverAllTotal = (invoiceList) => {
    let t = 0;
    invoiceList.forEach((data) => {
      t += data.total;
    });
    console.log(t);
    setTotal(t);
  };
  const getMonthTotal = (invoiceList) => {
    let mt = 0;
    invoiceList.forEach((data) => {
      if (
        new Date(data.date.seconds * 1000).getMonth() == new Date().getMonth()
      ) {
        console.log(data);
        mt += data.total;
      }
    });
    console.log(mt);
    setTotalMonth(mt);
  };

  const getData = async () => {
    const userId = localStorage.getItem("uid");
    const q = query(collection(db, "invoice"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInvoices(data);
    console.log("home", data);
    getOverAllTotal(data);
    getMonthTotal(data);
    monthViseCollection(data);
  };

  useEffect(() => {
    getData();
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <div>
      <div className="home-first-row">
        <div className="home-box box-1">
          <h1 className="box-header">Rs.{total}</h1>
          <p className="box-title">Overall</p>
        </div>
        <div className="home-box box-2">
          <h1 className="box-header">{invoices.length}</h1>
          <p className="box-title">Overall</p>
        </div>
        <div className="home-box box-3">
          <h1 className="box-header">Rs.{totalMonth}</h1>
          <p className="box-title">this month</p>
        </div>
      </div>
      <div className="home-second-row">
        <div className="chart-box">
          <canvas id="myChart"></canvas>
        </div>
        <div className="recent-invoice-list">
          <h1>Recent Invoice List</h1>
          <div>
            <p>Costmer Name</p>
            <p>Date</p>
            <p>total</p>
          </div>
          {invoices.slice(0, 6).map((data) => (
            <div>
              <p>{data.to}</p>
              <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
              <p>{data.total}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
