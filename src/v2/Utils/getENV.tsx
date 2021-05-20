import { GlobalData, data as sd } from "sharify"
import httpContext from "express-http-context"

export function getENV(ENV_VAR: keyof GlobalData) {
  let envVar
  if (typeof window === "undefined") {
    envVar = httpContext.get(ENV_VAR) || process.env[ENV_VAR]
  } else {
    envVar = sd[ENV_VAR]
  }

  return envVar
}
