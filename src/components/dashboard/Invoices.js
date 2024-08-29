import React, { useEffect, useState } from "react";
import { db } from "../../firebase.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);
  const navigate = useNavigate();
  const getData = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem("uid");
    const q = query(collection(db, "invoice"), where("uid", "==", userId));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(data);
    setInvoices(data);
    setIsLoading(false);
  };

  const deletebtn = async (id) => {
    console.log(id);
    const isSure = window.confirm("are you sure want to delte");
    if (isSure) {
      try {
        await deleteDoc(doc(db, "invoice", id));
        getData();
      } catch (error) {
        window.alert("Error in Deleting");
      }
    }
  };

  return (
    <div>
      {/* <p>Customer Name</p> */}
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          {" "}
          <i
            style={{ fontSize: "30px" }}
            className="fa-solid fa-spinner fa-spin-pluse"
          ></i>
        </div>
      ) : (
        <div>
          {invoices.map((data) => (
            <div className="boxs" key={data.id}>
              <p>{data.to}</p>
              <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
              <p>Rs.{data.total}</p>
              <button
                onClick={() => {
                  deletebtn(data.id);
                }}
                className="delete-btn"
              >
                <i className="fa-solid fa-trash"></i> Delete
              </button>
              <button
                onClick={() => {
                  navigate("/dashboard/invoice-details", { state: data });
                }}
                className="view-btn delete-btn"
              >
                <i className="fa-regular fa-eye"></i> View
              </button>
            </div>
          ))}
          {invoices.length < 1 && (
            <div className="no-invoice-wrapper">
              <p>No Invoices Found</p>
              <button onClick={() => navigate("/dashboard/newInvoice")}>
                Create New invoice
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Invoices;
