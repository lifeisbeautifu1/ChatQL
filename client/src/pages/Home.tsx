import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';

import { Navbar, Message } from '../components';
import { IMessage, User } from '../interfaces';

const GET_USERS = gql`
  query {
    getUsers {
      id
      username
      image_url
      latest_message {
        content
        created_at
      }
    }
  }
`;

const GET_MESSAGES = gql`
  query ($to: String!) {
    getMessages(to: $to) {
      id
      content
      from_user
      to_user
      created_at
    }
  }
`;

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<null | User>(null);
  const { data } = useQuery(GET_USERS, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const [fetchMessages, { data: messages }] = useLazyQuery(GET_MESSAGES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
  useEffect(() => {
    if (selectedUser) {
      fetchMessages({
        variables: { to: selectedUser.username },
      });
    }
  }, [selectedUser, fetchMessages]);
  return (
    <div className={`${darkMode && 'dark'} h-full`}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      {data && (
        <div className="bg-white dark:bg-gray-900 h-full text-black dark:text-gray-400">
          <div className="px-2.5 md:px-0 container mx-auto h-[600px]">
            <div className="flex rounded border border-gray-200 dark:border-gray-500 py-4 h-full">
              <div className="w-1/4 h-full  border-r border-gray-200 dark:border-gray-500 overflow-y-scroll scroll-none">
                <div className="px-4">
                  <div className="relative my-3">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-500"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="search-navbar"
                      className="block p-2 pl-10 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search..."
                    />
                  </div>
                </div>
                {data?.getUsers.map((user: User) => {
                  return (
                    <div
                      onClick={() => setSelectedUser(user)}
                      key={user.id}
                      className={`flex gap-2 border-b border-gray-200 dark:border-gray-500 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer px-4 ${
                        selectedUser === user && 'bg-gray-100 dark:bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-12 md:w-14 h-12 rounded-full overflow-hidden mx-auto`}
                      >
                        <img
                          src={user.image_url}
                          className="h-full w-full object-cover"
                          alt={user.username}
                        />
                      </div>
                      <div className="hidden md:block w-full text-sm">
                        <div className="flex justify-between items-center  w-full">
                          <h1 className="font-semibold">{user.username}</h1>
                          <span className="text-xs text-gray-500">{}</span>
                        </div>
                        <p className="text-gray-500 ">
                          {user?.latest_message?.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-4 h-full w-full flex flex-col-reverse overflow-y-scroll scroll-none">
                {messages &&
                  messages?.getMessages?.map((m: IMessage) => (
                    <Message key={m.id} message={m} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
