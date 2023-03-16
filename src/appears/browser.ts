import { LogQueueItem, AppearData } from "../interface.common";

export const appear = (data: AppearData, server: string) => {
  fetch(server, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
