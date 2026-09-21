/**
 * API Client connecting the CODE3D AI frontend to the Spring Boot REST backend.
 */

const LIVE_RENDER_URL = 'https://code3d-ai.onrender.com/api';
const LOCAL_URL = 'http://localhost:8080/api';

// When accessed from phone, GitHub Pages, or Vercel, always use the live Render backend!
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 
  (isLocalhost ? LOCAL_URL : LIVE_RENDER_URL);

async function smartFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, options);
    return res;
  } catch (err) {
    // If local fetch failed, fallback to live Render cloud backend
    if (BACKEND_BASE_URL !== LIVE_RENDER_URL) {
      try {
        console.warn(`Local backend unreachable at ${BACKEND_BASE_URL}. Falling back to live cloud backend...`);
        return await fetch(`${LIVE_RENDER_URL}${endpoint}`, options);
      } catch (fallbackErr) {
        console.warn('Live backend also unreachable:', fallbackErr);
      }
    }
    throw err;
  }
}

export async function checkBackendHealth() {
  try {
    const res = await smartFetch('/dsa/concepts', { method: 'GET' });
    return res.ok;
  } catch (err) {
    return false;
  }
}

export async function fetchDsaConcepts() {
  try {
    const res = await smartFetch('/dsa/concepts');
    if (!res.ok) throw new Error('Failed to fetch DSA concepts');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, using local DSA concept catalog');
    return null;
  }
}

export async function executeProgram(code, conceptId = null, language = 'java', input = null) {
  try {
    const res = await smartFetch('/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, conceptId, language, input }),
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
    const res = await smartFetch('/analyze', {
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
    const res = await smartFetch('/explain', {
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
    const res = await smartFetch(`/quiz?conceptId=${encodeURIComponent(conceptId)}`);
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
    const res = await smartFetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return await res.json();
  } catch (err) {
    console.warn('Login request failed:', err);
    return { success: false, message: 'Backend unreachable. Please check connection.' };
  }
}

export async function registerUser(userData) {
  try {
    const res = await smartFetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return await res.json();
  } catch (err) {
    console.warn('Registration request failed:', err);
    return { success: false, message: 'Backend unreachable. Please check connection.' };
  }
}

export async function demoUserLogin() {
  try {
    const res = await smartFetch('/auth/demo', {
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
    const res = await smartFetch('/code/correct-and-visualize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });
    return await res.json();
  } catch (err) {
    console.warn('AI Code Doctor unavailable:', err);
    return null;
  }
}
