import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import app from '@/interfaces/http/server/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOpenAPI() {
  try {
    // Provide mock environment for script context
    // This allows env(c) to work correctly without HTTP server bindings
    const mockEnv = {
      CORS_ORIGIN: 'http://localhost:3000',
      NODE_ENV: 'test',
      AUTH0_DOMAIN: 'mock.auth0.com',
      AUTH0_AUDIENCE: 'mock-audience',
    };

    const response = await app.request('/openapi.json', {}, mockEnv);

    // Check if response is successful
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`❌ Failed to generate OpenAPI spec: HTTP ${response.status}`);
      console.error('Error response:', errorBody);
      process.exit(1);
    }

    const spec = (await response.json()) as { openapi?: string };

    // Validate that we got a proper OpenAPI spec
    if (!spec.openapi) {
      console.error('❌ Invalid OpenAPI spec: missing "openapi" field');
      console.error('Received:', JSON.stringify(spec, null, 2));
      process.exit(1);
    }

    const outputDir = join(__dirname, '../');
    const outputPath = join(outputDir, 'openapi.json');

    mkdirSync(outputDir, { recursive: true });

    writeFileSync(outputPath, JSON.stringify(spec, null, 2));

    console.log('✅ OpenAPI spec generated successfully');
    console.log(`📄 Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to generate OpenAPI spec:', error);
    process.exit(1);
  }
}

void generateOpenAPI();
