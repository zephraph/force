import { Box, Image, ResponsiveBox, Text } from "@artsy/palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components"
import { RouterLink } from "v2/Artsy/Router/RouterLink"
import { ShowsFeaturedShow_show } from "v2/__generated__/ShowsFeaturedShow_show.graphql"
import { ShowsShowDatesFragmentContainer } from "./ShowsShowDates"

const Overlay = styled(Box).attrs({ bg: "black100" })`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  opacity: 0;
  transition: opacity 250ms;
`

const Container = styled(RouterLink)`
  display: block;
  text-decoration: none;

  &:hover {
    ${Overlay} {
      opacity: 0.33;
    }
  }
`

interface ShowsFeaturedShowProps {
  show: ShowsFeaturedShow_show
  size: "large" | "small"
}

const ShowsFeaturedShow: React.FC<ShowsFeaturedShowProps> = ({
  show,
  size,
}) => {
  const image = show.coverImage[size]

  return (
    <Container to={show.href}>
      {image && (
        <ResponsiveBox
          aspectWidth={image.width}
          aspectHeight={image.height}
          maxWidth="100%"
        >
          <Overlay />

          <Image
            width="100%"
            height="100%"
            src={image.src}
            srcSet={image.srcSet}
            alt={show.coverImage.title ?? `Cover image for ${show.name}`}
            lazyLoad={size === "small"}
          />
        </ResponsiveBox>
      )}

      <Box mt={1}>
        {show.partner && <Text variant="mediumText">{show.partner.name}</Text>}
        <Text color="black60">{show.name}</Text>
        <ShowsShowDatesFragmentContainer show={show} />
      </Box>
    </Container>
  )
}

export const ShowsFeaturedShowFragmentContainer = createFragmentContainer(
  ShowsFeaturedShow,
  {
    show: graphql`
      fragment ShowsFeaturedShow_show on Show {
        ...ShowsShowDates_show
        id
        name
        href
        coverImage {
          title
          large: cropped(width: 550, height: 413) {
            width
            height
            src
            srcSet
          }
          small: cropped(width: 360, height: 270) {
            width
            height
            src
            srcSet
          }
        }
        partner {
          ... on Partner {
            name
          }
          ... on ExternalPartner {
            name
          }
        }
      }
    `,
  }
)
