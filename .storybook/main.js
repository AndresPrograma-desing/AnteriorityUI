

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  "stories": [
    "../screens/components/**/*.mdx",
    "../screens/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite"
};
export default config;