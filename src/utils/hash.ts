import { Base64 } from "js-base64";

const PREFIX = "secret-santa";

export const encodeAssignmentHash = ({
  giver,
  receiver,
}: {
  giver: string;
  receiver: string;
}) => {
  const payload = JSON.stringify({ giver, receiver, prefix: PREFIX });
  return encodeURIComponent(Base64.encodeURL(payload));
};

export const decodeAssignmentHash = (hash: string) => {
  try {
    const decoded = Base64.decode(decodeURIComponent(hash));
    const payload = JSON.parse(decoded) as {
      giver: string;
      receiver: string;
      prefix: string;
    };
    if (payload.prefix !== PREFIX) {
      return null;
    }
    return { giver: payload.giver, receiver: payload.receiver };
  } catch (error) {
    console.error("Failed to decode assignment hash", error);
    return null;
  }
};
