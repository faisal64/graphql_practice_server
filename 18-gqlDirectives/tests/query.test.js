const gql = require('graphql-tag')
const createTestServer = require('./helper')
const FEED = gql`
  {
    feed {
      id
      message
      createdAt
      likes
      views
    }
  }
`

describe('queries', () => {
  test('feed', async () => {
    const {query} = createTestServer({
      user: {id: 1},
      models: {
        Post: {
          findMany: jest.fn(() => [{id: 1, message: 'hello', createdAt: 12345839, likes: 20, views: 300}])
        }
      }
    })
    //In this line it will run the query and give a response
    const res = await query({query: FEED})
    //Here we are checking the current result with snapshot whether it is exactly same or not.
    //Snapshot is saved in __snapshots__ folder.
    expect(res).toMatchSnapshot()
  })
})
