/// <reference types="vite/client" />

// CSS Modules — imported as object with class name keys
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Vite ?inline query — returns raw CSS string
declare module '*.css?inline' {
  const content: string;
  export default content;
}
