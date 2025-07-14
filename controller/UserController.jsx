import axios from "axios";
import { API } from "./Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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
    `${API.api_url}user/get-feed-data`,
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

// get all cities
export const GetCities = async () => {
  const response = await axios.post(`${API.api_url}user/get-cities`);
  return response.data;
};

// Upload image to server
export const uploadImageToServer = async (uri) => {
  const filename = uri.split("/").pop();
  const match = /\.(\w+)$/.exec(filename || "");
  const fileType = match ? `image/${match[1]}` : `image`;

  const email = await AsyncStorage.getItem("email");
  const token = await AsyncStorage.getItem("token");

  if (!email || !token) {
    throw new Error("Missing user credentials");
  }

  const formData = new FormData();
  formData.append("images", {
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
    name: filename,
    type: fileType,
  });
  formData.append("email", email);

  try {
    const response = await fetch(`${API.api_url}user/add-profile-images`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Upload failed:", data);
      throw new Error(data.message || "Upload failed.");
    }

    return { data };
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error.message || "Upload failed.");
  }
};

// Delete image from server
export const deleteImageFromServer = async (imgUrl) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email: email,
    imagePath: imgUrl,
  };

  const response = await axios.post(
    `${API.api_url}user/delete-profile-image`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// like a user
export const likeProfile = async (userId) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const data_to_send = {
    email: email,
    user_id: userId,
  };

  try {
    const response = await axios.post(
      `${API.api_url}user/like-dislike-a-profile`,
      data_to_send,
      axiosConfig
    );

    return response.data;
  } catch (error) {
    console.error("Error liking the profile:", error);
    throw error;
  }
};

// liked by me
export const getLikedByMe = async () => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API.api_url}user/users-liked-by-me`, {
    data_to_send,
    axiosConfig,
  });
  return response.data;
};

// who liked me
export const getWhoLikedMe = async () => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    user_id: userId,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API.api_url}user/users-who-liked-me`, {
    data_to_send,
    axiosConfig,
  });
  return response.data;
};

// single user detail
export const getSingleUserDetail = async (id) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    user_id: id,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API.api_url}user/get-user-profile`, {
    data_to_send,
    axiosConfig,
  });

  return response.data;
};
