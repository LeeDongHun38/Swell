/**
 * API 클라이언트 유틸리티
 */
import { API_BASE_URL } from '../constants/api';

/**
 * 기본 fetch 래퍼
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // 토큰이 있으면 추가
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * GET 요청
 */
export function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'GET' });
}

/**
 * POST 요청
 */
export function post(endpoint, data, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 요청
 */
export function put(endpoint, data, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 요청
 */
export function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'DELETE' });
}

