"use server";

import axios from "axios";
import { GET_USER } from "./user.service";

type PayForRegistration = {
  courseId: string;
  amount: string;
};

export const CREATE_PAYMENT = async ({
  courseId,
  amount,
}: PayForRegistration) => {
  const transactionId = Math.floor(100000 + Math.random() * 900000).toString();

  const { userId } = await GET_USER();

  // Determine the base URL based on the environment
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://educonnect-omega.vercel.app"
      : "http://localhost:3000";

  try {
    const res = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", {
      store_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      cus_name: "Imtiaz Akil",
      cus_email: "imtiaz.akil@softbd.com",
      cus_phone: "01870762472",
      cus_add1: "53, Gausul Azam Road, Sector-14, Dhaka, Bangladesh",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      amount: amount,
      tran_id: transactionId,
      currency: "BDT",
      success_url: `${baseUrl}/api/payment/success?courseId=${courseId}&userId=${userId}`,
      fail_url: `${baseUrl}/api/payment/cancel`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      desc: "Lend Money",
      type: "json",
    });
    return {
      url: res.data?.payment_url,
    };
  } catch (error) {
    console.log(error);
  }
};
