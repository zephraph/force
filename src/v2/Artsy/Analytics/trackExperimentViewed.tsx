import { GlobalData } from "sharify"
import * as Schema from "v2/Artsy/Analytics"
import { getENV } from "v2/Utils/getENV"

export const trackExperimentViewed = (
  name: keyof GlobalData,
  trackingData = {}
) => {
  if (typeof window.analytics !== "undefined") {
    const variation = getENV(name)
    if (!Boolean(variation)) {
      return console.warn(`experiment value for ${name} not found, skipping`)
    }

    window.analytics.track(
      Schema.ActionType.ExperimentViewed,
      {
        experiment_id: name,
        experiment_name: name,
        variation_id: variation,
        variation_name: variation,
        nonInteraction: 1,
      },
      {
        page: {
          ...trackingData,
        },
      }
    )
  }
}
