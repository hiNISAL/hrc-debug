import { LogQueueItem } from '../interface.common';

export const appear = (log: LogQueueItem[], server: string) => {
  fetch(server, {
    body: JSON.stringify({
      console: log,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
