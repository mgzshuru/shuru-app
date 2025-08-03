import { Credentials } from "./types";
import axios from "axios";
import { getStrapiURL } from "./utils";
import { verifySession } from "./dal";

const STRAPI_BASE_URL = getStrapiURL();


export const signUpRequest = async (credentials: Credentials) => {
  try {
    const PATH = "/auth/local/register";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(
      url.toString(),
      {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      }
    );

    return response;
  } catch (error: any) {
    return error?.response?.data?.error?.message || "Error signing up";
  }
};

export const confirmEmailRequest = async (email: string) => {
  try {

    const PATH = "/auth/send-email-confirmation";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(
      url.toString(),
      {
        email,
      }
    );

    return response;
  } catch (error: any) {
    return (
      error?.response?.data?.error?.message ||
      "Error sending confirmation email"
    );
  }
};

export const signInRequest = async (credentials: Credentials) => {
  try {
    const PATH = "/auth/local";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(url.toString(), {
      identifier: credentials.identifier,
      password: credentials.password,
    });

    return response;
  } catch (error: any) {
    return error?.response?.data?.error?.message || "Error signing in";
  }
};

export const forgotPasswordRequest = async (email: string) => {
  try {
    const PATH = "/auth/forgot-password";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(
      url.toString(),
      {
        email, // user's email
      }
    );

    return response;
  } catch (error: any) {
    return (
      error?.response?.data?.error?.message ||
      "Error sending reset password email"
    );
  }
};

export const resetPasswordRequest = async (credentials: Credentials) => {
  try {
    const PATH = "/auth/reset-password";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(
      url.toString(),
      {
        code: credentials?.code,
        password: credentials?.password,
        passwordConfirmation: credentials?.confirmPassword,
      }
    );

    return response;
  } catch (error: any) {
    return error?.response?.data?.error?.message || "Error resetting password";
  }
};

export const changePasswordRequest = async (credentials: Credentials) => {
  try {
    const {
      session: { jwt },
    }: any = await verifySession();

    const PATH = "/auth/change-password";
    const url = new URL(PATH, STRAPI_BASE_URL);
    const response = await axios.post(
      url.toString(),
      {
        currentPassword: credentials.password,
        password: credentials.newPassword,
        passwordConfirmation: credentials.confirmPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    return response;
  } catch (error: any) {
    return error?.response?.data?.error?.message || "Error resetting password";
  }
};