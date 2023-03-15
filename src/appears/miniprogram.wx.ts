import { LogQueueItem } from '../interface.common';

declare global {
  let wx: any;
}

export const appear = (log: LogQueueItem[], server: string) => {
  wx.request({
    url: server,
    data: log,
    method: 'POST',
    header: {
      'content-type': 'application/json',
    },
  });
};
