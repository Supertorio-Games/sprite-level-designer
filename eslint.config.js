import stylistic from '@stylistic/eslint-plugin'
import vuetify from 'eslint-config-vuetify'

export default [
    stylistic.configs.customize({
        indent: 4,
        semi: false,
    }),
    vuetify()
]