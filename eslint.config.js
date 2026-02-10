import stylistic from '@stylistic/eslint-plugin'
import vuetify from 'eslint-config-vuetify'
import pluginVue from 'eslint-plugin-vue'

export default [
    stylistic.configs.customize({
        indent: 4,
        semi: false,
    }),
    vuetify(),
    files: ["**/*.ts", "**/*.vue"],
    ...pluginVue.configs['flat/recommended'],
];
