const gql = require('graphql-tag')
const createTestServer = require('./helper')
const CREATE_POST = gql`
  mutation {
    createPost(input:{message: "hello"}){
      message
    }
  }
`

describe('mutations', () => {
  test('createPost', async () => {
    const {mutate} = createTestServer({
      models: {
        Post: {
          createOne(){
            return {
              message: "hello"
            }
          }
        },
        user: {id:1}
      }
    })
    //In this line it will run the query and give a response
    const res = await mutate({query: CREATE_POST})
    //Here we are checking the current result with snapshot whether it is exactly same or not.
    //Snapshot is saved in __snapshots__ folder.
    expect(res).toMatchSnapshot()
  })
})
