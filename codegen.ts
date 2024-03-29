import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "https://api.monday.com/v2/get_schema?format=sdl&version=2024-04",
  documents: "src/**/*.graphql",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: ["typescript", "introspection", "typescript-react-apollo"],
    },
  },
};

export default config;
