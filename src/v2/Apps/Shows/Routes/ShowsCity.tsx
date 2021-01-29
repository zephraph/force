import { Box, Column, GridColumns, Text } from "@artsy/palette"
import React, { useMemo } from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowsHeaderFragmentContainer } from "../Components/ShowsHeader"
import { ShowsCity_viewer } from "v2/__generated__/ShowsCity_viewer.graphql"
import { ShowsCity_city } from "v2/__generated__/ShowsCity_city.graphql"
import { ShowsMeta } from "../Components/ShowsMeta"
import { ShowsFeaturedShowFragmentContainer } from "../Components/ShowsFeaturedShow"
import moment from "moment"

interface ShowsCityProps {
  viewer: ShowsCity_viewer
  city: ShowsCity_city
}

type Shows = ShowsCity_city["upcomingShows"]["edges"]

export const ShowsCity: React.FC<ShowsCityProps> = ({ viewer, city }) => {
  const currentShows = city.currentShows?.edges
  const pastShows = city.pastShows?.edges

  const [openingThisWeek, upcomingShows] = useMemo(() => {
    return city.upcomingShows.edges.reduce(
      ([openingThisWeek, upcomingShows]: [Shows, Shows], edge) => {
        // Split upcomingShows into shows opening this week...
        if (moment(edge.node.startAt).isBefore(moment().add(7, "days"))) {
          return [[...openingThisWeek, edge], upcomingShows]
        }

        // ...and the remainder
        return [openingThisWeek, [...upcomingShows, edge]]
      },
      [[], []]
    )
  }, [city.upcomingShows.edges])

  return (
    <>
      <ShowsMeta cityName={city.name} />

      <Box my={3}>
        <ShowsHeaderFragmentContainer viewer={viewer} />

        {openingThisWeek.length > 0 && (
          <>
            <Text as="h2" variant="title" my={3}>
              Opening This Week
            </Text>

            <GridColumns gridRowGap={4}>
              {openingThisWeek.map(({ node }) => {
                return (
                  <Column key={node.internalID} span={4}>
                    <ShowsFeaturedShowFragmentContainer
                      show={node}
                      size="small"
                    />
                  </Column>
                )
              })}
            </GridColumns>
          </>
        )}

        <Text as="h2" variant="title" my={3}>
          Current Shows in {city.name}{" "}
          {city.currentShows.totalCount !== 0
            ? `(${city.currentShows.totalCount})`
            : ""}
        </Text>

        {currentShows.length === 0 && (
          <Text variant="title" color="black60" my={3}>
            There are currently no shows in {city.name} on Artsy
          </Text>
        )}

        {currentShows.length > 0 && (
          <GridColumns gridRowGap={4}>
            {currentShows.map(({ node }) => {
              return (
                <Column key={node.internalID} span={4}>
                  <ShowsFeaturedShowFragmentContainer
                    show={node}
                    size="small"
                  />
                </Column>
              )
            })}
          </GridColumns>
        )}

        {/* TODO: Pagination */}

        {upcomingShows.length > 0 && (
          <>
            <Text as="h2" variant="title" my={3}>
              Upcoming Shows
            </Text>

            <GridColumns gridRowGap={4}>
              {upcomingShows.map(({ node }) => {
                return (
                  <Column key={node.internalID} span={4}>
                    <ShowsFeaturedShowFragmentContainer
                      show={node}
                      size="small"
                    />
                  </Column>
                )
              })}
            </GridColumns>
          </>
        )}

        {openingThisWeek.length + upcomingShows.length + currentShows.length <
          6 &&
          pastShows.length > 0 && (
            <>
              <Text as="h2" variant="title" my={3}>
                Past Shows in {city.name}
              </Text>

              <GridColumns gridRowGap={4}>
                {pastShows.map(({ node }) => {
                  return (
                    <Column key={node.internalID} span={4}>
                      <ShowsFeaturedShowFragmentContainer
                        show={node}
                        size="small"
                      />
                    </Column>
                  )
                })}
              </GridColumns>
            </>
          )}
      </Box>
    </>
  )
}

export const ShowsCityFragmentContainer = createFragmentContainer(ShowsCity, {
  viewer: graphql`
    fragment ShowsCity_viewer on Viewer {
      ...ShowsHeader_viewer
    }
  `,
  city: graphql`
    fragment ShowsCity_city on City {
      name
      upcomingShows: showsConnection(first: 18, status: UPCOMING) {
        edges {
          node {
            internalID
            startAt
            ...ShowsFeaturedShow_show
          }
        }
      }
      currentShows: showsConnection(first: 18, status: CURRENT) {
        totalCount
        edges {
          node {
            internalID
            ...ShowsFeaturedShow_show
          }
        }
      }
      pastShows: showsConnection(first: 18, status: CLOSED) {
        edges {
          node {
            internalID
            ...ShowsFeaturedShow_show
          }
        }
      }
    }
  `,
})
