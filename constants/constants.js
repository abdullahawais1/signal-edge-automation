// constants/constants.js

export const ENVIRONMENTS = {
  uat: {
    BASE_URL: "https://uat.signaledge.teamsignal.com",
    EMAIL: "Tracy@yopmail.com",
    PASSWORD: "Admin@123",
  },
  stage: {
    BASE_URL: "https://stage.edge.teamsignal.com/",
    EMAIL: "ali.tariq+fo@tkxel.io",
    PASSWORD: "Admin@123",
  },
  prod: {
    BASE_URL: "https://portal.teamsignal.com/",
    EMAIL: "oliver.ryan@yopmail.com",
    PASSWORD: "Admin@123",
  },
};

export const getEnvConfig = () => {
  const envName = process.env.ENV_NAME || "uat";
  return ENVIRONMENTS[envName];
};
