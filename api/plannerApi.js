import axios from "axios";

const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"}/api/v1/`;

async function apiGet(endpoint) {
  return await axios.get(`${backendUrl}${endpoint}`, { withCredentials: true });
}

async function apiPut(endpoint, body) {
  return await axios.put(`${backendUrl}${endpoint}`, body, {
    withCredentials: true,
  });
}

async function apiPost(endpoint, body) {
  return await axios.post(`${backendUrl}${endpoint}`, body, {
    withCredentials: true,
  });
}

async function apiDelete(endpoint) {
  return await axios.delete(`${backendUrl}${endpoint}`, {
    withCredentials: true,
  });
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

export function editEvent(eventId, timestamp, synced) {
  const endpoint = "events";
  const body = {
    id: eventId,
    timestamp: timestamp,
    synced: synced,
  };
  return apiPut(endpoint, body);
}

export async function loginWithGoogle(refreshToken) {
  const endpoint = "events/sync";
  let body = {
    refreshToken: refreshToken,
  };
  return await apiPost(endpoint, body);
}

export async function getEvents() {
  const endpoint = "events";
  let response = await apiGet(endpoint);
  return response;
}

export async function deleteEvent(eventId) {
  const endpoint = `events/${eventId}`;
  return await apiDelete(endpoint);
}
