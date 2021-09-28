export abstract class BaseClient {
  protected async getJson<T>(url: string): Promise<T> {
    const response = await this.sendRequest(url);
    return (await response.json()) as T;
  }

  protected async delete<T, TRet = T>(url: string, body?: Partial<T>): Promise<TRet> {
    const response = await this.sendRequest(url, body && JSON.stringify(body), 'delete');
    return (await response.json()) as TRet;
  }

  protected async deleteNoReturn(url: string): Promise<void> {
    await this.sendRequest(url, undefined, 'delete');
  }

  protected async postForm(url: string, body: FormData): Promise<string> {
    const response = await this.sendRequest(url, body);
    return await response.text();
  }

  protected async postJson<T, TRet = T>(url: string, body: Partial<T>): Promise<TRet> {
    const response = await this.sendRequest(url, JSON.stringify(body));
    return (await response.json()) as TRet;
  }

  protected async postJsonNoReturn<T>(url: string, body: Partial<T>): Promise<void> {
    await this.sendRequest(url, JSON.stringify(body));
  }

  protected async putJson<T>(url: string, body: Partial<T>): Promise<T> {
    const response = await this.sendRequest(url, JSON.stringify(body), 'put');
    return (await response.json()) as T;
  }

  protected abstract createHeaders(): Promise<Headers>;

  private async sendRequest(url: string, body?: string | FormData, method?: string) {
    const headers = await this.createHeaders();
    if (body && typeof body === 'string') {
      headers.append('Content-Type', 'application/json');
    }
    const response = await fetch(url, {
      method: method || (body ? 'post' : 'get'),
      headers,
      body: body,
    });
    if (!response.ok) {
      throw new Error(`[${response.status} - ${response.statusText}]: ${await response.text()}`);
    }
    return response;
  }
}
