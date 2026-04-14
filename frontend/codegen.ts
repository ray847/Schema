import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  // 1. Your FastAPI server
  schema: 'http://127.0.0.1:8000/graphql', 
  
  // 2. Scan your React code for queries
  documents: ['src/**/*.{ts,tsx}'], 
  ignoreNoDocuments: true, 
  
  generates: {
    // 3. THIS is the magic preset that writes TypeScript!
    './src/generated/': {
      preset: 'client',
      plugins: [],
    }
  },
};

export default config;
