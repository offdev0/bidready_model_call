import axios from "axios";

export const detect = async (imageBase64: string) => {
  try {
    const response = await axios({
      method: "POST",
      url: "https://serverless.roboflow.com/mimexdetectraod1/1",
      params: {
        api_key: "ShBtUdx8mVaP10M9vPB9",
      },
      data: imageBase64,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data || error.message);
  }
};
