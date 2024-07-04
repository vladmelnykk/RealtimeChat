import React from 'react';
import useStore, {User, messageType} from '../../core/store/store';
import MessageBubbleFriend from './MessageBubbleFriend';
import MessageBubbleMe from './MessageBubbleMe';

interface MessageBubbleProps {
  index: number;
  message: messageType;
  friend: User;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  friend,
  index,
  message,
}) => {
  const [showTyping, setShowTyping] = React.useState(false);
  const messageTyping = useStore(state => state.messageTyping);
  const setMessageTyping = useStore(state => state.setMessageTyping);

  React.useEffect(() => {
    if (index !== 0) return;

    if (messageTyping === null) {
      setShowTyping(false);
      return;
    }

    setShowTyping(true);
    const check = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - messageTyping.getTime();

      if (diff > 5000) {
        setShowTyping(false);
        setMessageTyping(null);
      }
    }, 1000);

    return () => {
      clearInterval(check);
    };
  }, [messageTyping]);

  if (index === 0) {
    if (showTyping) {
      return <MessageBubbleFriend friend={friend} typing={true} text="" />;
    }
    return null;
  }

  return message.is_me ? (
    <MessageBubbleMe text={message.text} />
  ) : (
    <MessageBubbleFriend friend={friend} text={message.text} />
  );
};

export default MessageBubble;
