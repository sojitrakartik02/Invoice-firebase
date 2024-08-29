import React, { useState } from "react";
import "./dashboard.css";
import { auth, storage, db } from "../../firebase.js";
import { addDoc, collection, setDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const NweInvoice = () => {
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  //   const [product, setProduct] = useState([
  //     {
  //       id: 0,
  //       name: "Laptopp",
  //       price: 75000,
  //       quantity: 1,
  //     },
  //     {
  //       id: 1,
  //       name: "L1",
  //       price: 75000,
  //       quantity: 10,
  //     },
  //     {
  //       id: 2,
  //       name: "Laptopp2",
  //       price: 75000,
  //       quantity: 1,
  //     },
  //   ]);
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const addProduct = () => {
    setProduct([
      ...product,
      { id: product.length, name: name, price: price, quantity: quantity },
    ]);
    const t = quantity * price;
    setTotal(total + t);
    setName("");
    setPrice("");
    setQuantity(1);
  };

  const saveProduct = async () => {
    setIsLoading(true);
    console.log(to, phone, address);
    console.log(product);
    console.log(total);
    const data = await addDoc(collection(db, "invoice"), {
      to: to,
      phone: phone,
      address: address,
      product: product,
      total: total,
      uid: localStorage.getItem("uid"),
      date: Timestamp.fromDate(new Date()),
    });

    console.log(data);
    navigate("/dashboard/invoices");
    setIsLoading(false);
  };

  return (
    <div>
      <div className="header-row">
        <p className="new-invoice-heading">New Invoice</p>
        <button onClick={saveProduct} className="addbtn" type="button">
          {isLoading && <i className="fa-solid fa-spinner fa-spin-pluse"></i>}
          Save Data
        </button>
      </div>
      <form className="new-invoice-form">
        <div className="first-row">
          <input
            onChange={(e) => {
              setTo(e.target.value);
            }}
            placeholder="To"
            value={to}
          />
          <input
            onChange={(e) => {
              setPhone(e.target.value);
            }}
            placeholder="phone"
            value={phone}
          />
          <input
            onChange={(e) => {
              setAddress(e.target.value);
            }}
            placeholder="Address"
            value={address}
          />
        </div>
        <div className="first-row">
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Product Name"
            value={name}
          />
          <input
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            placeholder="price"
            value={price}
          />
          <input
            onChange={(e) => {
              setQuantity(e.target.value);
            }}
            placeholder="quantity"
            value={quantity}
            type="number"
          />
        </div>
        <button className="addbtn" type="button" onClick={addProduct}>
          {" "}
          Add Product
        </button>
      </form>
      {/* <p>Product List</p> */}
      {product.length > 0 && (
        <div className="product-wrapper">
          <div className="product-list">
            <p>Sr. No</p>
            <p>Product Name</p>
            <p> Price</p>
            <p>Quantity </p>
            <p>Total Price</p>
          </div>
          {product.map((data, index) => (
            <div className="product-list" key={index}>
              <p>{index + 1}</p>
              <p>{data.name}</p>
              <p> {data.price}</p>
              <p>{data.quantity} </p>
              <p>{data.price * data.quantity} </p>
            </div>
          ))}
          <div className="total-wrapper">
            <p>Total:{total}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NweInvoice;
