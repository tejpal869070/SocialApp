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
