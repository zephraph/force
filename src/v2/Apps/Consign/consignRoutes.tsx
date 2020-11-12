import loadable from "@loadable/component"
import { graphql } from "react-relay"

const ConsignApp = loadable(() => import("./ConsignApp"))
const OfferDetailApp = loadable(() => import("./OfferDetailApp"))
export const consignRoutes = [
  {
    path: "/consign2",
    getComponent: () => ConsignApp,
    prepare: () => {
      ConsignApp.preload()
    },
    query: graphql`
      query consignRoutes_ArtworkQuery {
        artist(id: "andy-warhol") @principalField {
          ...ConsignApp_artist
        }
      }
    `,
  },
  {
    path: "/consign/:submissionID/offer/:offerID",
    getComponent: () => OfferDetailApp,
    prepare: () => {
      OfferDetailApp.preload()
    },
    query: graphql`
      query consignRoutes_OfferDetailQuery($submissionID: ID!, $offerID: ID!) {
        submission(id: $submissionID) {
          ...OfferDetailApp_submission
        }
        offer(id: $offerID, gravityPartnerId: "ssshhhhh") {
          ...OfferDetailApp_offer
        }
      }
    `,
  },
]
