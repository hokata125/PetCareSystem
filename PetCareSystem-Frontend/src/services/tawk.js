import httpClient from "../configs/httpClient";

export const getTawkIdentity = async () => {
  const response = await httpClient.get("/users/tawk-identity");
  return response.data;
};

const runWhenTawkIsReady = (action) => {
  window.Tawk_API = window.Tawk_API || {};

  if (typeof window.Tawk_API.login === "function") {
    action();
    return;
  }

  window.Tawk_API.onLoad = action;
};

export const loginTawkUser = (tawkIdentity) => {
  runWhenTawkIsReady(() => {
    window.Tawk_API.login(
      {
        userId: tawkIdentity.user_id,
        hash: tawkIdentity.hash,
        name: tawkIdentity.name,
      },
      (error) => {
        if (!error) {
          window.Tawk_API.start({
            showWidget: true,
          });
        }
      },
    );
  });
};

export const logoutTawkUser = () => {
  runWhenTawkIsReady(() => {
    window.Tawk_API.hideWidget();
    window.Tawk_API.logout(() => {
      window.Tawk_API.shutdown();
    });
  });
};
