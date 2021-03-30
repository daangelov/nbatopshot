export const getUserMomentListingsDedicated = `query GetUserMomentListingsDedicated($input: GetUserMomentListingsInput!) {
    getUserMomentListings(input: $input) {
      data {
        set {
          id
          flowName
          flowSeriesNumber
        }
        momentListings {
          id
          moment {
            id
            price
            flowSerialNumber
            owner {
              dapperID
              username
              profileImageUrl
            }
            setPlay {
              ID
              flowRetired
            }
          }
        }
        momentListingCount
      }
    }
  }`
