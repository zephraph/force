import React from "react"
import { createRefetchContainer, RelayRefetchProp, graphql } from "react-relay"
import { useRouter } from "v2/Artsy/Router/useRouter"
import { BaseArtworkFilter } from "v2/Components/v2/ArtworkFilter"
import { updateUrl } from "v2/Components/v2/ArtworkFilter/Utils/urlBuilder"
import {
  ArtworkFilterContextProvider,
  SharedArtworkFilterContextProps,
} from "v2/Components/v2/ArtworkFilter/ArtworkFilterContext"
import { MediumFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/MediumFilter"
import { PriceRangeFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/PriceRangeFilter"
import { WaysToBuyFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/WaysToBuyFilter"
import { GalleryFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/GalleryFilter"
import { SizeFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/SizeFilter"
import { SizeFilter2 } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/SizeFilter2"
import { TimePeriodFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/TimePeriodFilter"
import { ColorFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/ColorFilter"
import { ArtistsFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/ArtistsFilter"
import { GeneArtworkFilter_gene } from "v2/__generated__/GeneArtworkFilter_gene.graphql"
import { MaterialsFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/MaterialsFilter"
import { ArtworkLocationFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/ArtworkLocationFilter"
import { ArtistNationalityFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/ArtistNationalityFilter"
import { AttributionClassFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/AttributionClassFilter"
import { getENV } from "v2/Utils/getENV"
import { PartnersFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/PartnersFilter"
import { InstitutionFilter } from "v2/Components/v2/ArtworkFilter/ArtworkFilters/InstitutionFilter"
import { useSystemContext } from "v2/Artsy"

interface GeneArtworkFilterProps {
  gene: GeneArtworkFilter_gene
  relay: RelayRefetchProp
}

const GeneArtworkFilter: React.FC<GeneArtworkFilterProps> = ({
  gene,
  relay,
}) => {
  const { match } = useRouter()
  const {
    filtered_artworks: { counts },
    sidebarAggregations,
  } = gene

  const { relayEnvironment, user } = useSystemContext()

  const showNewFilters = getENV("ENABLE_NEW_ARTWORK_FILTERS")

  // TODO: fix me - the ArtistsFilter will fetch followed artists only for fairs
  const Filters = (
    <>
      <ArtistsFilter relayEnvironment={relayEnvironment} user={user} />
      <MediumFilter expanded />
      {showNewFilters && <MaterialsFilter expanded />}
      <PriceRangeFilter />
      <AttributionClassFilter expanded />
      {showNewFilters ? <SizeFilter2 /> : <SizeFilter />}
      <WaysToBuyFilter />
      {showNewFilters && <ArtworkLocationFilter expanded />}
      {showNewFilters && <ArtistNationalityFilter expanded />}
      <TimePeriodFilter />
      <ColorFilter />
      {showNewFilters ? (
        <PartnersFilter />
      ) : (
        <>
          <GalleryFilter />
          <InstitutionFilter />
        </>
      )}
    </>
  )

  return (
    <ArtworkFilterContextProvider
      onChange={updateUrl}
      filters={match && match.location.query}
      sortOptions={[
        { text: "Default", value: "-decayed_merch" },
        { text: "Price (desc.)", value: "-has_price,-prices" },
        { text: "Price (asc.)", value: "-has_price,prices" },
        { text: "Recently updated", value: "-partner_updated_at" },
        { text: "Recently added", value: "-published_at" },
        { text: "Artwork year (desc.)", value: "-year" },
        { text: "Artwork year (asc.)", value: "year" },
      ]}
      aggregations={
        sidebarAggregations.aggregations as SharedArtworkFilterContextProps["aggregations"]
      }
      counts={counts}
    >
      <BaseArtworkFilter
        relay={relay}
        viewer={gene as any} // TODO
        Filters={Filters}
      />
    </ArtworkFilterContextProvider>
  )
}

export const GeneArtworkFilterRefetchContainer = createRefetchContainer(
  GeneArtworkFilter,
  {
    gene: graphql`
      fragment GeneArtworkFilter_gene on Gene
        @argumentDefinitions(
          input: { type: "FilterArtworksInput" }
          aggregations: { type: "[ArtworkAggregation]" }
          shouldFetchCounts: { type: "Boolean!", defaultValue: false }
        ) {
        slug
        internalID
        sidebarAggregations: filterArtworksConnection(
          aggregations: $aggregations
          first: 1
        ) {
          aggregations {
            slice
            counts {
              name
              value
              count
            }
          }
        }
        filtered_artworks: filterArtworksConnection(first: 30, input: $input) {
          id
          counts @include(if: $shouldFetchCounts) {
            followedArtists
          }
          ...ArtworkFilterArtworkGrid_filtered_artworks
        }
      }
    `,
  },
  graphql`
    query GeneArtworkFilterQuery($slug: String!, $input: FilterArtworksInput) {
      gene(id: $slug) {
        ...GeneArtworkFilter_gene @arguments(input: $input)
      }
    }
  `
)
