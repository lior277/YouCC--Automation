import { APIRequestContext, APIResponse } from '@playwright/test';

export class ApiRequestHandler {
    private readonly context: APIRequestContext;
    private readonly baseUrl: string;
    private readonly headers: Record<string, string>;

    constructor(context: APIRequestContext, baseUrl: string, headers: Record<string, string> = {}) {
        this.context = context;
        this.baseUrl = baseUrl;
        // Set default headers and merge with provided headers
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...headers
        };
    }

    private async checkStatusCode(url: string, response: APIResponse, method: string, requestBody?: any): Promise<void> {
        if (!response.ok()) {
            const responseText = await response.text().catch(() => 'Unable to read response');
            const errorMessage = `
                API Request Failed:
                URL: ${url}
                Method: ${method}
                Status: ${response.status()} ${response.statusText()}
                Response Headers: ${JSON.stringify(response.headers())}
                Response Body: ${responseText}
                Request Body: ${requestBody ? JSON.stringify(requestBody) : 'N/A'}
            `;
            throw new Error(errorMessage);
        }
    }

    async executeGet(endpoint: string): Promise<APIResponse> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await this.context.get(url, { headers: this.headers });
        await this.checkStatusCode(url, response, 'GET');
        return response;
    }

    async executePost(endpoint: string, data?: any): Promise<APIResponse> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await this.context.post(url, {
            headers: this.headers,
            data
        });
        await this.checkStatusCode(url, response, 'POST', data);
        return response;
    }

    async executePut(endpoint: string, data?: any): Promise<APIResponse> {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await this.context.put(url, {
            headers: this.headers,
            data
        });
        await this.checkStatusCode(url, response, 'PUT', data);
        return response;
    }
}