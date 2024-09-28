"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { SEND_NOTIFICATION } from "../action";

export const Notification = () => {
  const { mutate } = useMutation({
    mutationFn: SEND_NOTIFICATION,
    onError: (error) => {
      console.log(error);
    },
  });

  const handleClick = () => {
    mutate();
  };
  return <Button onClick={handleClick}>Send Notification</Button>;
};
