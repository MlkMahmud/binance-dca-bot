import { ChakraProvider } from "@chakra-ui/react";
import { render, RenderOptions } from "@testing-library/react";
import React from "react";

const Wrapper: React.FC = ({ children }) => {
  return <ChakraProvider>{children}</ChakraProvider>;
};

function customRender(
  element: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(element, { wrapper: Wrapper, ...options });
}

export * from "@testing-library/react";
export { customRender as render };
