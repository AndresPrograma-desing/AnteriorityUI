

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../screens/components/**/*.mdx",
    "../screens/components/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../playground/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "staticDirs": ["../fixtures"],
  "framework": "@storybook/react-vite",
  // Ruta base del sitio publicado (GitHub Pages sirve en /<repo>/). Se pasa por variable de entorno desde el workflow
  // `.github/workflows/storybook.yml`; en local queda vacía y Storybook sirve en la raíz.
  viteFinal: async (viteConfig) => {
    if (process.env.STORYBOOK_BASE) viteConfig.base = process.env.STORYBOOK_BASE;
    return viteConfig;
  }
};
export default config;