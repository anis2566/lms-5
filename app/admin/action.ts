"use server";

import axios from "axios";

export const GENERATE_PLAYER = async (videoId: string) => {
  try {
    const res = await axios.post(
      `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
      {
        ttl: 300,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`,
        },
      },
    );
    return {
      otp: res.data?.otp,
      playbackInfo: res.data?.playbackInfo,
    };
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
