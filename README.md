<p align="center" style="align: center">
    <h1 align="center">Socket Widget</h1>
    <p align="center">Seamless bridging experience into a single fully customizable React Component</p>
    <p align="center" style="align: center;"> 
        <a href="https://www.npmjs.com/package/@socket.tech/widget">
            <img src="https://img.shields.io/npm/v/@socket.tech/widget" alt="npm version"/>
        </a>
        <a href="https://npmtrends.com/@socket.tech/widget">
            <img src="https://img.shields.io/npm/dm/@socket.tech/widget" alt="Downloads" />
        </a>
        <a href="https://github.com/SocketDotTech/widget/stargazers">
            <img src="https://img.shields.io/github/stars/SocketDotTech/widget" alt="Github Stars" />
        </a>
        <a href="https://github.com/SocketDotTech/widget/blob/main/license">
            <img src="https://img.shields.io/github/license/SocketDotTech/widget" alt="License">
        </a>
    </p>
</p>

Socket’s Widget is a React component that can be easily imported in any React (JS/TS) project. The widget supports most features from [Bungee.exchange](https://bungee.exchange/). It brings the seamless bridging UX from Bungee to any DApp!

![Socket Widget Examples](https://user-images.githubusercontent.com/20141508/180801529-49be06cd-1850-484b-979b-f694aeaa9285.png)

The widget requires `provider` from user’s connected wallet & Socket’s `API_KEY` as props to initialise. [Optional props](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790) can be passed to customize the widget’s color scheme, pre-select the chains/tokens & also customize token lists.

The full documentation for the widget can be found [here](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)

## Installation

The widget can be installed via NPM or Yarn.

**NPM :**

```bash
npm install @socket.tech/widget
```

**Yarn :**

```bash
yarn add @socket.tech/widget
```

**Note :** The widget requires `react` (>=17.0.1) and `react-dom` (>=17.0.1) as peerDepencies.

## Initialization 

Copy the snippet below to get started! Pass the `API_KEY` from a .env file and `Provider` from user’s connected wallet.

```tsx
import { Bridge } from "@socket.tech/widget";
import { Provider } from "./providerComponent"

function SocketBridge() {
    return (    
       <Bridge
	provider={Provider}
	API_KEY={process.env.SOCKET_API_KEY} 
	/>
    )
}

export default SocketBridge;
```

That’s it! You’ve successfully plugged your DApp into Socket! 🔌  For further customising the widget, check the widget [docs](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790).

## Documentation

- [Initialisation](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)
- [Customisation](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)
- [API reference](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)

## Example App

Work In Progress 🛠
