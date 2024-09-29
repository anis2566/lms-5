import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_SECRET_KEY);

type SendNotification = {
  trigger: string;
  recipients: string[];
  actor: {
    id: string;
    name?: string;
  };
  data: {
    course?: string;
    redirectUrl?: string;
  };
};

export const sendNotification = async ({
  trigger,
  recipients,
  actor,
  data,
}: SendNotification) => {
  await knock.workflows.trigger(trigger, {
    recipients,
    actor,
    data,
  });
};
