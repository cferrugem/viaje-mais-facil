// CSS Module declarations
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Tailwind CSS support
declare module 'tailwindcss' {
  const content: any;
  export default content;
}
