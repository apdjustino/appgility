import React from "react";
import { UserAuth } from "../types/authentication";

export const AuthContext = React.createContext<UserAuth>({ accessToken: "", userId: "" });
