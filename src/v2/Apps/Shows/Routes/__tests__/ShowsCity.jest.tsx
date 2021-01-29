import React from "react"
import { ShowsCityFragmentContainer } from "../ShowsCity"
import { setupTestWrapper } from "v2/DevTools/setupTestWrapper"
import { graphql } from "react-relay"
import { ShowsCity_Test_Query } from "v2/__generated__/ShowsCity_Test_Query.graphql"
import { MockBoot } from "v2/DevTools"
import moment from "moment"

jest.unmock("react-relay")

jest.mock("v2/Artsy/Router/useRouter", () => ({
  useRouter: () => ({ router: { push: () => {} } }),
}))

const { getWrapper } = setupTestWrapper<ShowsCity_Test_Query>({
  Component: props => {
    return (
      <MockBoot>
        <ShowsCityFragmentContainer {...props} />
      </MockBoot>
    )
  },
  query: graphql`
    query ShowsCity_Test_Query {
      viewer {
        ...ShowsCity_viewer
      }
      city(slug: "example") {
        ...ShowsCity_city
      }
    }
  `,
})

describe("ShowsCity", () => {
  it("renders correctly", () => {
    const wrapper = getWrapper({
      City: () => ({ name: "Sunnydale" }),
      Show: () => ({ name: "Example Show", startAt: moment().toISOString() }),
      ShowConnection: () => ({ totalCount: 44 }),
    })

    expect(wrapper.find("h2")).toHaveLength(3)
    expect(wrapper.find("h2").map(node => node.text())).toEqual([
      "Opening This Week",
      "Current Shows in Sunnydale (44)",
      "Past Shows in Sunnydale",
    ])
  })
})
