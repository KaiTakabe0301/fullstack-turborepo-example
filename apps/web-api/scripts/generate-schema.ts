import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { AppModule } from '../src/modules/app/app.module';

async function generateSchema() {
  // AppModuleからアプリケーションを作成
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  // アプリケーションを初期化してGraphQLモジュールを完全に起動
  await app.init();

  // GraphQLSchemaHostから生成されたスキーマを取得
  const schemaHost = app.get(GraphQLSchemaHost);
  const schema = schemaHost.schema;

  if (!schema) {
    console.error('❌ No GraphQL schema found');
    await app.close();
    process.exit(1);
  }

  // 出力ディレクトリを確保
  const schemaPath = join(process.cwd(), 'src/generated/schema.gql');
  mkdirSync(dirname(schemaPath), { recursive: true });
  
  // スキーマをファイルに書き込み
  const schemaString = printSchema(schema);
  writeFileSync(schemaPath, schemaString);

  console.log(`✅ GraphQL schema generated at: ${schemaPath}`);
  
  await app.close();
}

generateSchema().catch((error) => {
  console.error('❌ Failed to generate GraphQL schema:', error);
  process.exit(1);
});