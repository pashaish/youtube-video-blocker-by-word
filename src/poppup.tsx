import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Storage } from "./Storage";
import { Modal } from './Modal';

const root = document.querySelector("#root");

if (!root) {
    throw new Error("Root not found");
}

ReactDOM.render(
    <Modal />,
    root
)
