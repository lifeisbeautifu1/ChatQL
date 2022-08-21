import { useAuthState } from '../context';
import { IMessage } from '../interfaces';

interface MessageProps {
  message: IMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { user } = useAuthState();
  const our = user?.username === message.from_user;
  return (
    <div className={our ? 'self-end' : 'self-start'}>
      <div
        className={`py-2 mb-2 px-3 rounded-full ${
          our
            ? 'bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200'
            : 'bg-blue-500 dark:bg-blue-800 text-white dark:text-gray-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default Message;
