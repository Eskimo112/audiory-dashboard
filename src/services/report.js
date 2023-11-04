/* eslint-disable camelcase */
import { toFormData } from 'axios';

import { request } from './__base';

export default class ReportService {
  constructor(requestHeader) {
    this.requestHeader = requestHeader ?? undefined;
  }

  async getAll() {
    const url = 'reports';

    const response = await request({
      url,
      method: 'get',
      params: {
        page: 1,
        page_size: Number.MAX_SAFE_INTEGER,
      },
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return [];
    return response.data;
  }

  async getById(reportId) {
    const url = `reports/${reportId}`;

    const response = await request({
      url,
      method: 'get',
      requestHeaders: this.requestHeader,
    });
    if (!response.data) return null;
    return response.data;
  }

  async updateReport({
    reportId,
    aprroved_by,
    approved_date,
    rejected_by,
    rejected_date,
    report_status,
    response_message,
    form_file,
  }) {
    const url = `reports/${reportId}`;
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      ...this.requestHeader,
    };
    const body = {
      aprroved_by,
      approved_date,
      rejected_by,
      rejected_date,
      report_status,
      response_message,
      form_file,
    };
    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'put',
      payload: formData,
      requestHeaders,
    });
    if (!response.data) return null;
    return response.data;
  }

  async createReport({
    title,
    description,
    user_id,
    report_type,
    reported_id,
    form_file,
  }) {
    const url = `reports/`;
    const requestHeaders = {
      'Content-Type': 'multipart/form-data',
      ...this.requestHeader,
    };
    const body = {
      title,
      description,
      form_file,
      user_id,
      report_type,
      reported_id,
    };
    const formData = toFormData(body);
    const response = await request({
      url,
      method: 'post',
      payload: formData,
      requestHeaders,
    });
    if (!response.data) return null;
    return response.data;
  }
}
