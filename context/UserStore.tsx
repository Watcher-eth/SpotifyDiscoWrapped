import React from "react";
import create from "zustand";

// Define the type for the user store state
type UserStore = {
  userID: string;
  userName: string;
  userDiD: string;
  userAddress: string;
  setUserID: (id: string) => void;
  setUserName: (name: string) => void;
  setUserDiD: (diD: string) => void;
  setUserAddress: (address: string) => void;
};

// Create the Zustand store
export const useUserStore = create<UserStore>((set) => ({
  userID: "",
  userName: "",
  userDiD: "",
  userAddress: "",

  setUserID: (id) =>
    set((state) => ({
      userID: id,
    })),

  setUserName: (name) =>
    set((state) => ({
      userName: name,
    })),

  setUserDiD: (diD) =>
    set((state) => ({
      userDiD: diD,
    })),

  setUserAddress: (address) =>
    set((state) => ({
      userAddress: address,
    })),
}));
