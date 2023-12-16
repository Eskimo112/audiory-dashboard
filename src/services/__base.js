import axios, { AxiosHeaders } from 'axios';
import https from 'https';

export function convertHeaderToAxiosHeaders(reqHeaders) {
  if (!reqHeaders) {
    return undefined;
  }
  const axiosHeaders = new AxiosHeaders();
  Object.entries(reqHeaders).forEach(([k, v]) => {
    axiosHeaders?.set(k, v);
  });
  return axiosHeaders;
}

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

export const request = async ({
  url,
  method,
  payload,
  params,
  requestHeaders,
  returnOriginalResponse,
}) => {
  const axiosHeaders = convertHeaderToAxiosHeaders({
    ...requestHeaders,
    // 'Content-Security-Policy': 'upgrade-insecure-requests',
  });

  const baseURL = process.env.API;
  const res = await axiosInstance.request({
    url: baseURL + url,
    method,
    params,
    data: payload,
    headers: axiosHeaders,
  });
  if (res.status !== 200) {
    throw res.data.message;
  }
  return returnOriginalResponse ? res : res.data ?? null;
};
