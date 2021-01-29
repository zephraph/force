import {
  Box,
  BorderBox,
  Text,
  Join,
  SelectSmall,
  GridColumns,
  Column,
  space,
  color,
} from "@artsy/palette"
import { graphql } from "lib/graphql"
import React from "react"
import { createFragmentContainer } from "react-relay"
import styled from "styled-components"
import { RouterLink } from "v2/Artsy/Router/RouterLink"
import { useRouter } from "v2/Artsy/Router/useRouter"
import { ShowsHeader_viewer } from "v2/__generated__/ShowsHeader_viewer.graphql"

const City = styled(RouterLink)`
  &.active {
    color: ${color("purple100")};
  }
`

// TODO: Extract this pattern
const Overlay = styled(Box)<{ atEnd: boolean }>`
  position: relative;
  /* Fade-out gradient */
  &::after {
    display: block;
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 2px;
    width: ${space(6)}px;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 100%
    );
    /* Hide when scrolled all the way over */
    transition: opacity 250ms;
    opacity: ${({ atEnd }) => (atEnd ? 0 : 1)};
  }
`

const Viewport = styled(Box)`
  overflow-x: auto;
`

const Rail = styled(Box)`
  display: inline-flex;
  white-space: nowrap;
  min-width: 100%;
`

interface ShowsHeaderProps {
  viewer: ShowsHeader_viewer
}

const DEFAULT_CITIES = [
  { text: "All", value: "" },
  // { text: "Online Exclusive", value: "online" }, // TODO
]

export const ShowsHeader: React.FC<ShowsHeaderProps> = ({
  viewer: { featuredCities, allCities },
}) => {
  const { router } = useRouter()
  const handleSelect = (value: string) => {
    router.push(`/shows2/${value}`)
  }

  return (
    <BorderBox>
      <GridColumns>
        <Column span={10}>
          <Overlay atEnd={false}>
            <Viewport>
              <Rail>
                <Join separator={<Box mx={1} />}>
                  {[...DEFAULT_CITIES, ...featuredCities].map(city => {
                    return (
                      <Box
                        key={city.value}
                        display="inline-flex"
                        textAlign="center"
                      >
                        <City
                          to={`/shows2/${city.value}`}
                          noUnderline
                          exact
                          // @ts-ignore
                          activeClassName="active"
                        >
                          <Text>{city.text}</Text>
                        </City>
                      </Box>
                    )
                  })}
                </Join>
              </Rail>
            </Viewport>
          </Overlay>
        </Column>

        <Column span={2}>
          <SelectSmall
            width="100%"
            options={[...DEFAULT_CITIES, ...allCities] as any}
            onSelect={handleSelect}
          />
        </Column>
      </GridColumns>
    </BorderBox>
  )
}

export const ShowsHeaderFragmentContainer = createFragmentContainer(
  ShowsHeader,
  {
    viewer: graphql`
      fragment ShowsHeader_viewer on Viewer {
        allCities: cities {
          text: name
          value: slug
        }
        featuredCities: cities(featured: true) {
          text: name
          value: slug
        }
      }
    `,
  }
)
