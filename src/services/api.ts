import axios from "axios";
import { deflateRawSync } from "zlib";

const api = axios.create({
  baseURL: "https://api.github.com",
});

export default api;
