import { getMessaging } from "firebase-admin/messaging";

export const sendNotification = async (
  token,
  title,
  body,
  data = {}
) => {

  const message = {
    token,
    notification: {
      title,
      body
    },
    data
  };

  return await getMessaging().send(message);
};