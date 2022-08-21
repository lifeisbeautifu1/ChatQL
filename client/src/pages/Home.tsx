import { Navbar } from '../components';
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query {
    getUsers {
      username
    }
  }
`;

const Home = () => {
  const { data } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
