import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. Your FastAPI server
  schema: 'http://127.0.0.1:8000/graphql', 
  
  generates: {
    './src/shared/graphql.ts': {
      plugins: ['typescript'],
      config: {
        useTypeImports: true,
      },
    },
  },
};

export default config;
