import axios from "axios";

interface PropsHistogram {
  file: File;
  type: "equalization" | "stretching" | "specification";
  params?: Record<string, number>;
}

export async function callHistogramAPI({ file, type, params }: PropsHistogram) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Nếu có parameters thì append vào formData
    if (params) {
      for (const key in params) {
        formData.append(key, String(params[key]));
      }
    }

    console.log("Path: ", `http://127.0.0.1:8000/histogram-${type}`)

    const response = await axios.post(
      `http://127.0.0.1:8000/histogram-${type}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error call API:", error);
    throw error;
  }
}
