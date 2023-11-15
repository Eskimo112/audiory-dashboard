import axios, { AxiosHeaders } from 'axios';

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

export const request = async ({
  url,
  method,
  payload,
  params,
  requestHeaders,
}) => {
  const axiosHeaders = convertHeaderToAxiosHeaders({
    ...requestHeaders,
    'Content-Security-Policy': 'upgrade-insecure-requests',
  });
  const baseURL = process.env.API;
  const res = await axios.request({
    url: baseURL + url,
    method,
    params,
    data: payload,
    headers: axiosHeaders,
  });
  if (res.status !== 200) {
    throw res.data.message;
  }
  return res.data ?? null;
};
