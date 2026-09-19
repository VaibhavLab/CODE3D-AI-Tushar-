/**
 * API Client connecting the CODE3D AI frontend to the Spring Boot REST backend.
 */

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/dsa/concepts`, { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchDsaConcepts() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/dsa/concepts`);
    if (!res.ok) throw new Error('Failed to fetch DSA concepts');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using local DSA concept catalog');
    return null;
  }
}

export async function executeProgram(code, conceptId = null, language = 'java') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, conceptId, language }),
    });
    if (!res.ok) throw new Error('Execution failed on backend');
    return await res.json();
  } catch (err) {
    console.warn('Backend execution unavailable:', err);
    return null;
  }
}

// Backward compatible alias
export const executeJavaProgram = executeProgram;

export async function analyzeCode(code, language = 'java') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    if (!res.ok) throw new Error('Analysis failed on backend');
    return await res.json();
  } catch (err) {
    console.warn('Backend analysis unavailable:', err);
    return null;
  }
}

// Backward compatible alias
export const analyzeJavaCode = analyzeCode;

export async function requestAiExplanation(code, lineNumber, stepNumber, queryType, level, language = 'java') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/explain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, lineNumber, stepNumber, queryType, level, language }),
    });
    if (!res.ok) throw new Error('AI explanation request failed');
    return await res.json();
  } catch (err) {
    console.warn('AI explanation unavailable:', err);
    return null;
  }
}

export async function fetchQuizQuestions(conceptId) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/quiz?conceptId=${encodeURIComponent(conceptId)}`);
    if (!res.ok) throw new Error('Quiz fetch failed');
    return await res.json();
  } catch (err) {
    console.warn('Quiz service unavailable:', err);
    return null;
  }
}

// User Authentication API
export async function loginUser(credentials) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (err) {
    console.warn('Login request failed:', err);
    return { success: false, message: 'Backend unreachable' };
  }
}

export async function registerUser(userData) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    console.warn('Registration request failed:', err);
    return { success: false, message: 'Backend unreachable' };
  }
}

export async function demoUserLogin() {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/auth/demo`, {
      method: 'POST',
    });
    return await res.json();
  } catch (err) {
    console.warn('Demo login request failed:', err);
    return {
      success: true,
      username: 'himanshu',
      fullName: 'Himanshu (Lead Architect)',
      role: 'Lead Architect',
      email: 'himanshu@code3d.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
  }
}

// AI Code Doctor & Auto-Correction API
export async function correctAndVisualizeCode(code, language = 'java') {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/code/correct-and-visualize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    if (!res.ok) throw new Error('Code correction failed');
    return await res.json();
  } catch (err) {
    console.warn('Code correction unavailable:', err);
    return null;
  }
}

