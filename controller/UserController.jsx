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
  console.log(response.data)
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
      throw new Error(data.message || "Upload failed.");
    }

    return { data };
  } catch (error) { 
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

// make image at first
export const setProfileImageFirst = async (url) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email: email,
    imagePath: url,
  };
  const response = await axios.post(
    `${API.api_url}user/set-profile-image`,
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
    throw error;
  }
};

// liked by me
export const getLikedByMe = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    page: page,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API.api_url}user/users-liked-by-me`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// who liked me
export const getWhoLikedMe = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    page: page,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API.api_url}user/users-who-liked-me`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// single user detail
export const getSingleUserDetail = async (user_id) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    user_id: user_id,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API.api_url}user/get-user-profile`,
    data_to_send,
    axiosConfig
  );

  return response.data;
};

// add between cities trip detail
export const postTravelDetails = async (formData) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    travel_type: formData.travel_type,
    from_city:
      formData.travel_type === "between_cities"
        ? formData.from_city
        : formData.to_city,
    to_city: formData.to_city || "",
    travel_date: formData.travel_date,
    description: formData.description,
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${API.api_url}user/add-travel-details`,
    data_to_send,
    axiosConfig
  );
 
  return response.data;
};

// get between cities trips
export const getAllBetweenCitiesTrips = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    page: page,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API.api_url}user/get-all-between-cities-trip`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// get within cities trips
export const getAllWithinCitiesTrips = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const data_to_send = {
    email: email,
    page: page,
  };
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API.api_url}user/get-all-city-trip`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// change user details
export const changeUserDetails = async (userDetails) => { 
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const requestBody = {
    ...userDetails,
    email,
  };

  const response = await axios.post(
    `${API.api_url}user/update-profile`,
    requestBody,
    axiosConfig
  );
  return response.data;
};

// get all chats
export const getAllChats = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email: email,
    page: page,
  };
  const response = await axios.post(
    `${API.api_url}user/get-all-chats`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// send message request
export const sendMessageRequest = async (receiver_id, message) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email: email,
    message: message,
    receiver_id: receiver_id,
  };
  const response = await axios.post(
    `${API.api_url}user/send-message-requests`,
    data_to_send,
    axiosConfig
  ); 
  return response.data;
};

//  get all message requests
export const getAllMessageRequest = async (page) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email: email,
    page: page,
  };
  const response = await axios.post(
    `${API.api_url}user/get-message-requests`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};

// update message requests
export const updateMessageRequests = async (id, status) => {
  const token = await AsyncStorage.getItem("token");
  const email = await AsyncStorage.getItem("email");
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const data_to_send = {
    email,
    id,
    status,
  };
  const response = await axios.post(
    `${API.api_url}user/update-message-requests`,
    data_to_send,
    axiosConfig
  );
  return response.data;
};
