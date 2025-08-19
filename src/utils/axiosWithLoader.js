import { useEffect } from "react";
import api from "./api";
import { useLoading } from "../context/LoadingContext";

export const useAttachLoaderInterceptor = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      startLoading();
      return config;
    });

    const resId = api.interceptors.response.use(
      (response) => {
        stopLoading();
        return response;
      },
      (error) => {
        stopLoading();
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [startLoading, stopLoading]);
};
