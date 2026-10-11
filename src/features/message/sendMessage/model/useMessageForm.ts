import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema, type MessageValues } from './schema';

export function useMessageForm(onSend: (text: string) => void) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MessageValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: { text: '' },
  });
  const submit = handleSubmit(({ text }) => {
    onSend(text);
    reset();
  });
  return { register, errors, submit };
}
