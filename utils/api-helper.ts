import { APIResponse, APIRequestContext } from '@playwright/test';

export interface SafeApiResponse {
    response: APIResponse;
    status: number;
    headers: Record<string, string>;
    isSuccess: boolean;
    isClientError: boolean;
    isServerError: boolean;
}

const defaultJsonHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

/**
 * Safely executes an API request and returns a wrapped response
 */
export async function safeApiRequest(
    requestFn: () => Promise<APIResponse>
): Promise<SafeApiResponse> {
    try {
        const response = await requestFn();
        const status = response.status();
        const headers = response.headers();

        return {
            response,
            status,
            headers,
            isSuccess: status >= 200 && status < 300,
            isClientError: status >= 400 && status < 500,
            isServerError: status >= 500,
        };
    } catch (error) {
        throw new Error(`API request failed: ${error}`);
    }
}

export async function safeGetJson(response: APIResponse): Promise<any> {
    try {
        return await response.json();
    } catch (error) {
        const text = await response.text();
        console.error('Failed to parse JSON. Response text:', text);
        throw new Error(`Failed to parse JSON: ${error}`);
    }
}

export async function safeGetText(response: APIResponse): Promise<string> {
    try {
        return await response.text();
    } catch (error) {
        throw new Error(`Failed to get text: ${error}`);
    }
}

export class SafeApiClient {
    constructor(private context: APIRequestContext) {}

    async get(url: string, options?: any): Promise<SafeApiResponse> {
        return safeApiRequest(() => this.context.get(url, options));
    }

    async post(url: string, options?: any): Promise<SafeApiResponse> {
        return safeApiRequest(() => this.context.post(url, options));
    }

    async put(url: string, options?: any): Promise<SafeApiResponse> {
        return safeApiRequest(() => this.context.put(url, options));
    }

    async delete(url: string, options?: any): Promise<SafeApiResponse> {
        return safeApiRequest(() => this.context.delete(url, options));
    }

    async patch(url: string, options?: any): Promise<SafeApiResponse> {
        return safeApiRequest(() => this.context.patch(url, options));
    }
}

export class ProfileApiHelpers {
    constructor(private client: SafeApiClient) {}

    async getProfile(): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const result = await this.client.get('/users/profile');
            if (!result.isSuccess) {
                return {
                    success: false,
                    error: `GET /users/profile → HTTP ${result.status}: ${await safeGetText(result.response)}`
                };
            }

            const data = await safeGetJson(result.response);
            return { success: true, data };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    async updateProfile(profileData: Record<string, any>): Promise<{ success: boolean; data?: any; error?: string }> {
        try {
            const result = await this.client.put('/users/profile', {
                data: JSON.stringify(profileData),
                headers: defaultJsonHeaders
            });

            if (!result.isSuccess) {
                return {
                    success: false,
                    error: `PUT /users/profile → HTTP ${result.status}: ${await safeGetText(result.response)}`
                };
            }

            const text = await safeGetText(result.response);
            return { success: true, data: text };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }
}
