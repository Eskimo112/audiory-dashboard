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

export const request = async (url, method, payload, params, requestHeaders) => {
  const axiosHeaders = convertHeaderToAxiosHeaders(requestHeaders);
  const baseURL = process.env.API;
  const res = await axios.request({
    url: baseURL + url,
    method,
    params,
    data: payload,
    headers: axiosHeaders,
  });

  return res?.data ?? null;
};
