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

export async function fetchReturns() {
  return apiFetch('/orders/returns/');
}

export async function updateReturnStatus(id: number, data: any) {
  return apiFetch(`/orders/returns/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function createReturnRequest(data: any) {
  return apiFetch('/orders/returns/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function fetchAdminCollections() {
  return apiFetch('/products/admin-collections/');
}

export async function createAdminCollection(data: any) {
  return apiFetch('/products/admin-collections/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function deleteAdminCollection(id: number) {
  return apiFetch(`/products/admin-collections/${id}/`, {
    method: 'DELETE'
  });
}

export async function fetchPurchaseOrders() {
  return apiFetch('/inventory/purchase-orders/');
}

export async function createPurchaseOrder(data: any) {
  return apiFetch('/inventory/purchase-orders/', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updatePurchaseOrder(id: number, data: any) {
  return apiFetch(`/inventory/purchase-orders/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function fetchInventoryMovements() {
  return apiFetch('/inventory/movements/');
}

export async function updateProductVariant(id: number, data: any) {
  return apiFetch(`/products/admin-items/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}

export async function fetchInventoryLevels() {
  return apiFetch('/inventory/levels/');
}

export async function updateInventoryLevel(id: number, data: any) {
  return apiFetch(`/inventory/levels/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  });
}




