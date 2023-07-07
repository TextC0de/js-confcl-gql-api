// _APP_ENV es una "variable" de entorno que se setea en el wrangler.toml
// A diferencia de las variables que se setean bajo el key [vars] (o [env.production.vars] / [env.staging.vars] )
// esta variable va a ser reemplazada por un string al momento de hacer build (build-time)
// Esto es útil para permitir al compiler, realizar ead-code-elimination en distintos environments.
export const APP_ENV = _APP_ENV;
