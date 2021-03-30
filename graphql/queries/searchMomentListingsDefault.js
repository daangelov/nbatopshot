export const searchMomentListingsDefault = `query SearchMomentListingsDefault(
    $byPlayers: [ID]
    $byTagNames: [String!]
    $byTeams: [ID]
    $byPrice: PriceRangeFilterInput
    $orderBy: MomentListingSortType
    $byGameDate: DateRangeFilterInput
    $byCreatedAt: DateRangeFilterInput
    $byListingType: [MomentListingType]
    $bySets: [ID]
    $bySeries: [ID]
    $bySetVisuals: [VisualIdType]
    $byPrimaryPlayerPosition: [PlayerPosition]
    $bySerialNumber: IntegerRangeFilterInput
    $searchInput: BaseSearchInput!
    $userDapperID: ID
  ) {
    searchMomentListings(
      input: {
        filters: {
          byPlayers: $byPlayers
          byTagNames: $byTagNames
          byGameDate: $byGameDate
          byCreatedAt: $byCreatedAt
          byTeams: $byTeams
          byPrice: $byPrice
          byListingType: $byListingType
          byPrimaryPlayerPosition: $byPrimaryPlayerPosition
          bySets: $bySets
          bySeries: $bySeries
          bySetVisuals: $bySetVisuals
          bySerialNumber: $bySerialNumber
        }
        sortBy: $orderBy
        searchInput: $searchInput
        userDapperID: $userDapperID
      }
    ) {
      data {
        filters {
          byPlayers
          byTagNames
          byTeams
          byPrimaryPlayerPosition
          byGameDate {
            start
            end
            __typename
          }
          byCreatedAt {
            start
            end
            __typename
          }
          byPrice {
            min
            max
            __typename
          }
          bySerialNumber {
            min
            max
            __typename
          }
          bySets
          bySeries
          bySetVisuals
          __typename
        }
        searchSummary {
          count {
            count
            __typename
          }
          pagination {
            leftCursor
            rightCursor
            __typename
          }
          data {
            ... on MomentListings {
              size
              data {
                ... on MomentListing {
                  id
                  version
                  circulationCount
                  flowRetired
                  set {
                    id
                    flowName
                    setVisualId
                    flowSeriesNumber
                    __typename
                  }
                  play {
                    description
                    id
                    stats {
                      playerName
                      dateOfMoment
                      playCategory
                      teamAtMomentNbaId
                      teamAtMoment
                      __typename
                    }
                    __typename
                  }
                  assetPathPrefix
                  priceRange {
                    min
                    max
                    __typename
                  }
                  momentListingCount
                  listingType
                  userOwnedSetPlayCount
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
  }`
