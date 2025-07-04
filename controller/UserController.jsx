import axios from "axios";
import { API } from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

// user register
export const UserRegister = async (formData) => {
  const response = await axios.post(`${API.api_url}user/register`, formData);
  return response.data;
};

// user login
export const UserLogin = async (formData) => {
  const data_to_send = {
    email_or_mobile: formData.email,
    password: formData.password,
  };
  const response = await axios.post(`${API.api_url}user/login`, data_to_send);
  return response.data;
};

// user details
export const UserDetails = async () => {
  const token = await AsyncStorage.getItem("token");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API.api_url}user/user-details`,
    {},
    axiosConfig
  );
  return response.data;
};

// feed data
export const GetFeedData = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    page: page,
    email: email,
  };

  const response = await axios.post(
    `${API.api_url}user/feed-data`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// check user existing
export const CheckUserExisting = async (email, mobile) => {
  const data_to_send = {
    email: email,
    mobile: mobile,
  };
  const response = await axios.post(
    `${API.api_url}user/check-user-details`,
    data_to_send
  );
  return response.data;
};

// send otp
export const SendOtp = async (email) => {
  const data_to_send = {
    email: email,
  };
  const response = await axios.post(
    `${API.api_url}user/send-otp`,
    data_to_send
  );
  console.log(response.data);
  return response.data;
};

// otp verification
export const VerifyOtp = async (email, otp) => {
  const data_to_send = {
    email: email,
    otp: otp,
  };
  const response = await axios.post(
    `${API.api_url}user/verify-otp`,
    data_to_send
  );
  return response.data;
};

// forget password
export const ForgetPassword = async (email, password, token) => {
  const data_to_send = {
    email: email,
    password: password,
    token: token,
  };
  const response = await axios.post(
    `${API.api_url}user/forget-password`,
    data_to_send
  );
  return response.data;
};

// token check
export const CheckToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    const email = await AsyncStorage.getItem("email");
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data_to_send = {
      email: email,
    };
    const response = await axios.post(
      `${API.api_url}user/token-check`,
      data_to_send,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// reset password
export const ResetPassword = async (old_password, password) => {
  try {
    const email = await AsyncStorage.getItem("email");
    const token = await AsyncStorage.getItem("token");
    const axiosConfig = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const data_to_send = {
      old_password: old_password,
      password: password,
      email: email,
    };
    const response = await axios.post(
      `${API.api_url}user/reset-password`,
      data_to_send,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
