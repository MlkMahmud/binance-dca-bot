import React from "react";
import { Typography } from "antd";

const Index = (): JSX.Element => (
  <React.Fragment>
    <Typography.Title>This is the title</Typography.Title>
    <Typography.Text type="danger">Danger Text</Typography.Text>
    <Typography.Text type="success">Success Text</Typography.Text>
  </React.Fragment>
);

export default Index;
