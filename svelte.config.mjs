import preprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";

export default {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true
    }),
  ],
}
