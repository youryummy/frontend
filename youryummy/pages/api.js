import axios from "axios";

const backendUrl = "http://localhost/api/v1/";
// const backendUrl = "youryummy-gateway-youryummy-maribelrb22.cloud.okteto.net/api/v1/");

async function apiGet(endpoint) {
  return await axios.get(`${backendUrl}${endpoint}`);
}

async function apiPut(endpoint, body) {
  return await axios.put(`${backendUrl}${endpoint}`, body);
}

async function apiPost(endpoint, body) {
  return await axios.post(`${backendUrl}${endpoint}`, body);
}

async function apiDelete(endpoint) {
  return await axios.delete(`${backendUrl}${endpoint}`);
}

export async function tokenExchange(code) {
  const endpoint = "https://oauth2.googleapis.com/token";
  const body = `code=${code}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_CLIENT_SECRET}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&grant_type=authorization_code`;
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const access_token = await axios.post(endpoint, body, headers);
  return access_token;
}

export async function syncWithCalendar(
  eventId,
  timestamp,
  synced,
  accessToken,
  refreshToken
) {
  const endpoint = "events";
  const body = {
    id: eventId,
    timestamp: timestamp,
    synced: synced,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
  return await apiPut(endpoint, body);
}
