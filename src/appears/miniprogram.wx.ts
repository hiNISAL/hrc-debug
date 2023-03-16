import { LogQueueItem, AppearData } from '../interface.common';

declare global {
  let wx: any;
}

export const appear = (data: AppearData, server: string): Promise<void> => {
  return new Promise((resolve) => {
    wx.request({
      url: server,
      data: data,
      method: 'POST',
      header: {
        'content-type': 'application/json',
      },
      success() {
        resolve();
      },
    });
  });
};
