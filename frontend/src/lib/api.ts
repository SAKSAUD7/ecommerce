import { useAuthStore } from "@/store/authStore";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005/api";

// Custom fetch wrapper with JWT interceptors
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const { accessToken, refreshToken, setTokens, logout } = useAuthStore.getState();
  
  const headers = new Headers(options.headers || {});
  
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  
  headers.set("Content-Type", "application/json");

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized (Token Expiry)
  if (response.status === 401 && refreshToken) {
    try {
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setTokens(data.access, refreshToken);
        
        // Retry original request with new token
        headers.set("Authorization", `Bearer ${data.access}`);
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });
      } else {
        logout();
        window.location.href = "/auth/login";
      }
    } catch (err) {
      logout();
      window.location.href = "/auth/login";
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'API request failed');
  }

  return response.json();
}

// Data Fetching Functions
export async function fetchProducts() {
  return apiFetch('/products/items/', {
    next: { revalidate: 60 } // Next.js cache
  });
}

export async function fetchProductBySlug(slug: string) {
  return apiFetch(`/products/items/${slug}/`, {
    next: { revalidate: 60 }
  });
}

export async function createOrder(orderData: any) {
  return apiFetch('/orders/checkout/', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function fetchAnalytics() {
  return apiFetch('/analytics/dashboard/', {
    next: { revalidate: 60 }
  });
}

export async function fetchAdminPages() {
  return apiFetch('/cms/admin-pages/', {
    next: { revalidate: 60 }
  });
}

export async function fetchPages() {
  return apiFetch('/cms/pages/', {
    next: { revalidate: 60 }
  });
}

export async function fetchPageBySlug(slug: string) {
  return apiFetch(`/cms/pages/${slug}/`, {
    next: { revalidate: 60 }
  });
}
