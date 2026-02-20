import axios from "axios";
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;

export async function APIFuncionUniversal(Method, Payload, Route , SetMsg) {
    if (!Method || !Route) {
      console.error("Method and Route are required parameters.");
      return null;
    }
  
    const storedAuth = JSON.parse(localStorage.getItem("auth"));
    const config = { headers: { Authorization: `Bearer ${storedAuth.accessToken}` } };
    const url = `${apiUrl}/${Route}`;
  
    try {
      let response;
  
      switch (Method.toLowerCase()) {
        case 'get':
          response = await axios.get(url, config);
          break;
        case 'post':
          if (!Payload) {
            console.error("Payload is required for POST request.");
            SetMsg("Payload is required for POST request.");
            return null;
          }
          response = await axios.post(url, Payload, config);
          break;
        case 'put':
          if (!Payload) {
            console.error("Payload is required for PUT request.");
            SetMsg("Payload is required for PUT request.");
            return null;
          }
          response = await axios.put(url, Payload, config);
          break;
        case 'delete':
          response = await axios.delete(url, config);
          break;
        default:
          console.error(`Unsupported HTTP method: ${Method}`);
          SetMsg(`Unsupported HTTP method: ${Method}`);
          return null;
      }
  
      return response.data;
    } catch (err) {
      console.error(`Error calling API [${Method.toUpperCase()} ${Route}]:`, err.message);
      if (SetMsg) {
        SetMsg(`Error: ${err.message}`);
      }
      return null;
    }
};  
