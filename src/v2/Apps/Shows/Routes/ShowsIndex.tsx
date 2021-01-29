import { Box, Column, GridColumns, Text } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { ShowsIndex_featuredShows } from "v2/__generated__/ShowsIndex_featuredShows.graphql"
import { ShowsIndex_viewer } from "v2/__generated__/ShowsIndex_viewer.graphql"
import { ShowsFeaturedShowFragmentContainer } from "../Components/ShowsFeaturedShow"
import { ShowsHeaderFragmentContainer } from "../Components/ShowsHeader"
import { ShowsMeta } from "../Components/ShowsMeta"

interface ShowsIndexProps {
  featuredShows: ShowsIndex_featuredShows
  viewer: ShowsIndex_viewer
}

export const ShowsIndex: React.FC<ShowsIndexProps> = ({
  featuredShows,
  viewer,
}) => {
  return (
    <>
      <ShowsMeta />

      <Box my={3}>
        <ShowsHeaderFragmentContainer viewer={viewer} />

        <Text as="h1" variant="largeTitle" my={3}>
          {featuredShows.name}
        </Text>

        <GridColumns mb={6} gridRowGap={6}>
          {featuredShows.items.map((show, i) => {
            return (
              <Column key={show.id} span={i < 2 ? 6 : 4}>
                <ShowsFeaturedShowFragmentContainer
                  show={show}
                  size={i < 2 ? "large" : "small"}
                />
              </Column>
            )
          })}
        </GridColumns>

        <Text as="h2" variant="largeTitle" my={3}>
          Current Museum & Gallery Shows
        </Text>

        {/* TODO */}
      </Box>
    </>
  )
}

export const ShowsIndexFragmentContainer = createFragmentContainer(ShowsIndex, {
  viewer: graphql`
    fragment ShowsIndex_viewer on Viewer {
      ...ShowsHeader_viewer
    }
  `,
  featuredShows: graphql`
    fragment ShowsIndex_featuredShows on OrderedSet {
      name
      items {
        ... on Show {
          id
          ...ShowsFeaturedShow_show
        }
      }
    }
  `,
})
