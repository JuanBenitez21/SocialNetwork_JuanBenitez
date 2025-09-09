import { Redirect } from "expo-router";
import React from "react";

export default function EntryPoint() {
  return (
    <Redirect href={"/(auth)/login"}/>
  )
}

