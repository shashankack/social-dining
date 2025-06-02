import { useEffect } from "react";
import api from "./api";
import { useLoading } from "../context/LoadingContext";

export const useAttachLoaderInterceptor = () => {
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    const reqId = api.interceptors.request.use((config) => {
      console.log("→ [Loader] startLoading for:", config.url);
      startLoading();
      return config;
    });

    const resId = api.interceptors.response.use(
      (response) => {
        console.log("← [Loader] stopLoading for:", response.config.url);
        stopLoading();
        return response;
      },
      (error) => {
        console.log("← [Loader] stopLoading (error) for:", error.config?.url);
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
