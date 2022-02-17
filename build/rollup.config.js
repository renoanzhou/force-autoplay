import eslint from '@rbnlffl/rollup-plugin-eslint'
import typescript from '@rollup/plugin-typescript'
import babel from '@rollup/plugin-babel'
import serve from 'rollup-plugin-serve'
import pkg from '../package.json'
import { terser } from 'rollup-plugin-terser'
import address from 'address'

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.browser, format: 'umd', name: 'forceAutoplay' },
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    serve({
      open: true,
      openPage: '/example/index.html',
      host: address.ip()
    }),
    // 直接用@rollup/rollup-plugin-eslint 会有问题，好像是这个插件的依赖的eslint版本比较旧了
    eslint({
      throwOnError: true
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    babel({ babelHelpers: 'bundled' }),
    terser()
  ]
}
