/// <reference types="vite/client" />

// Add support for importing .jinja files as raw text
declare module '*.jinja?raw' {
  const content: string;
  export default content;
}

declare module '*.jinja' {
  const content: string;
  export default content;
}
