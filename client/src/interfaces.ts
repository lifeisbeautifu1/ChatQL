export interface User {
  id: number;
  username: string;
  email: string;
  image_url?: string;
  latest_message?: IMessage;
}

export interface IMessage {
  id: number;
  from_user: string;
  to_user: string;
  content: string;
  created_at: string;
}
