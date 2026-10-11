export type MessageStatus = 'sending' | 'accepted' | 'sent' | 'delivered' | 'read' | 'failed';
export type Message = {
  id: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: 'incoming' | 'outgoing';
  status?: MessageStatus;
  error?: string;
};
