/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IERC20,
  IERC20Interface,
} from "../../../contracts/AlphaPING.sol/IERC20";

const _abi = [
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IERC20__factory {
  static readonly abi = _abi;
  static createInterface(): IERC20Interface {
    return new Interface(_abi) as IERC20Interface;
  }
  static connect(address: string, runner?: ContractRunner | null): IERC20 {
    return new Contract(address, _abi, runner) as unknown as IERC20;
  }
}
