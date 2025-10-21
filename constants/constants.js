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
    BASE_URL: "https://prod.signaledge.teamsignal.com",
    EMAIL: "prod_email@example.com",
    PASSWORD: "prod_password",
  },
};

export const getEnvConfig = () => {
  const envName = process.env.ENV_NAME || "uat";
  return ENVIRONMENTS[envName];
};
