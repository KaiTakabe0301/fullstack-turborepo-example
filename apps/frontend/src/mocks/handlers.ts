import { http, HttpResponse } from 'msw';

export const handlers = [
  // Example handler - replace with your actual API endpoints
  http.get('/api/hello', () => {
    return HttpResponse.json({
      message: 'Hello from MSW!',
    });
  }),
];
