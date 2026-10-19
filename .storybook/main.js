

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
  "staticDirs": ["../fixtures"],
  "framework": "@storybook/react-vite"
};
export default config;