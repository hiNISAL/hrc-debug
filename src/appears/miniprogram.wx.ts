import { LogQueueItem } from '../interface.common';

declare global {
  let wx: any;
}

export const appear = (log: LogQueueItem[], server: string) => {
  wx.request({
    url: server,
    data: {
      console: log,
    },
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
  });
};
