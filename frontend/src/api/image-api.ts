import { ProcessingParameters } from "@/context";
import axios from "axios";

interface PropsHistogram {
	file: File;
	type: string;
	params?: ProcessingParameters;
}

export async function callHistogramAPI({ file, type, params }: PropsHistogram) {
	try {
		console.log("IAPSDSADSJA: ", params);
		const formData = new FormData();
		formData.append("file", file);

		if (params) {
			if ("stretchMin" in params) {
				formData.append("a", String(params.stretchMin));
			}
			if ("stretchMax" in params) {
				formData.append("b", String(params.stretchMax));
			}
			if ("keepBackground" in params) {
				formData.append("keep_background", String(params.keepBackground));
			}
			if ("matchFile" in params && params.matchFile instanceof File) {
				formData.append("reference", params.matchFile);
			}
		}

		// Xem toàn bộ key-value
		for (const [key, value] of formData.entries()) {
			console.log(key, value);
		}

		// Nếu muốn xem tất cả value của 1 key cụ thể
		console.log(formData.getAll("file"));
		console.log(formData.getAll("reference"));
		console.log("Path: ", `http://127.0.0.1:8000/histogram-${type}/`);

		const response = await axios.post(
			`http://127.0.0.1:8000/histogram-${type}/`,
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
