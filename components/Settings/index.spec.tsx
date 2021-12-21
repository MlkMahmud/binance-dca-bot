/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Settings from ".";
import { render, screen } from "../../test-utils";
import { User } from "../../types";

const userConfig = {
  password: { enabled: false, isSet: false },
  slack: { enabled: true, url: "http:/slack-hook.com" },
  telegram: {
    botToken: "bot2345538:ZcsgfdZz-H8Z0iqG7PNE06W3qPZd0Dm6DB0k",
    chatId: "-618305579",
    enabled: true,
  },
  timezone: "Africa/Lagos",
};

const props = {
  isOpen: true,
  onClose: () => {},
  onUpdate: (_: User) => {},
  initialValues: userConfig,
};

describe("Settings", () => {
  it("should render user settings correctly", async () => {
    render(<Settings {...props} />);
    expect((await screen.findByLabelText("timezone")).nodeValue).toEqual(
      "Europe/London"
    );
  });
});
