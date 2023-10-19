/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const BASE_URL = "localhost:3000";
const ERROR_MESSAGE = "Error in API Call";

// Interfaces
export interface SignupParams {
  Name: string;
  Username: string;
  Password: string;
  PhoneNo: string;
  Designation: string;
  AvatarURL: string;
}

export interface LoginParams {
  Username: string;
  Password: string;
}

export interface ChannelParams {
  Name: string;
  Description: string;
}

export interface MessageParams {
  Content: string;
  ChannelId: string;
}

export interface Response {
  Payload?: any;
  Status: any;
}

const getConfig = () => {
  const token = sessionStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return config;
};

// API
const postSignup = async (params: SignupParams): Promise<Response> => {
  let status;
  await axios
    .post(BASE_URL + "/user/signup", {
      Name: params.Name,
      Password: params.Password,
      Username: params.Username,
      PhoneNo: params.PhoneNo,
      Designation: params.Designation,
      AvatarURL: params.AvatarURL,
    })
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err?.response?.status ?? 500;
    });
  const response: Response = {
    Status: status,
  };
  return response;
};

const postLogin = async (params: LoginParams): Promise<Response> => {
  let payload = "",
    status;
  await axios
    .post(BASE_URL + "/user/login", {
      Username: params.Username,
      Password: params.Password,
    })
    .then((res) => {
      payload = res.data?.token;
      sessionStorage.setItem("token", payload);
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };

  return response;
};

const postChannel = async (channelParams: ChannelParams): Promise<Response> => {
  const config = getConfig();

  const bodyParameters = {
    Name: channelParams.Name,
    Description: channelParams.Description,
  };

  let status;
  await axios
    .post(BASE_URL + "/channel", bodyParameters, config)
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Status: status,
  };

  return response;
};

const getChannels = async (): Promise<Response> => {
  const config = getConfig();

  let status, payload;
  const username = sessionStorage.getItem("username");
  await axios
    .get(BASE_URL + `/user/${username}/channels`, config)
    .then((res) => {
      payload = res.data;
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };
  return response;
};
const getAllChannels = async (): Promise<Response> => {
  const config = getConfig();

  let status, payload;

  await axios
    .get(BASE_URL + `/channels`, config)
    .then((res) => {
      payload = res.data;
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };
  return response;
};

const deleteChannel = async (channelId: string) => {
  const config = getConfig();

  let status;
  await axios
    .delete(BASE_URL + `/channel/${channelId}`, config)
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Status: status,
  };
  return response;
};

const getMessages = async (
  channelId: string,
  lastMessageAt: number
): Promise<Response> => {
  const config = getConfig();

  let status, payload;
  await axios
    .get(BASE_URL + `/channel/${channelId}/messages`, {
      ...config,
      params: { after_time: lastMessageAt },
    })
    .then((res) => {
      payload = res.data;
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };
  return response;
};

const postMessage = async (message: MessageParams): Promise<Response> => {
  const config = getConfig();

  const bodyParameters = {
    Content: message.Content,
    SentAt: +new Date(),
  };

  let status, payload;
  await axios
    .post(
      BASE_URL + `/channel/${message.ChannelId}/message`,
      bodyParameters,
      config
    )
    .then((res) => {
      payload = res.data;
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };
  return response;
};

const getUsers = async () => {
  const config = getConfig();

  let payload, status;

  await axios
    .get(BASE_URL + `/users`, config)
    .then((res) => {
      payload = res.data;
      status = res.status;
    })
    .catch((err) => {
      payload = err?.response?.data.error ?? ERROR_MESSAGE;
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Payload: payload,
    Status: status,
  };
  return response;
};

const postMembership = async (channelId: string): Promise<Response> => {
  const config = getConfig();

  let status;
  await axios
    .post(BASE_URL + `/channel/${channelId}/membership`, {}, config)
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Status: status,
  };
  return response;
};

const deleteMembership = async (channelId: string): Promise<Response> => {
  const config = getConfig();

  let status;
  await axios
    .delete(BASE_URL + `/channel/${channelId}/membership`, config)
    .then((res) => {
      status = res.status;
    })
    .catch((err) => {
      status = err?.response?.status ?? 500;
    });

  const response: Response = {
    Status: status,
  };
  return response;
};

export {
  postSignup,
  postLogin,
  postChannel,
  getChannels,
  deleteChannel,
  getMessages,
  postMessage,
  getUsers,
  postMembership,
  deleteMembership,
  getAllChannels,
};
