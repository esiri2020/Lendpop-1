import axios from "axios";

export default axios.create({
  baseURL: "http://35.239.244.63:60000/api/lending",
  headers: { "Content-Type": "application/json" }
});
