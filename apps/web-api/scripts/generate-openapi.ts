import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import app from '@/interfaces/http/server/app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateOpenAPI() {
  try {
    const response = await app.request('/openapi.json');
    const spec = await response.json();

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
