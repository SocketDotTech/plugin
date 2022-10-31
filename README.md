<p align="center" style="align: center">
    <h1 align="center">Socket Plugin</h1>
    <p align="center">Seamless bridging experience into a single fully customizable React Component</p>
    <p align="center" style="align: center;"> 
        <a href="https://www.npmjs.com/package/@socket.tech/plugin">
            <img src="https://img.shields.io/npm/v/@socket.tech/plugin" alt="npm version"/>
        </a>
        <a href="https://npmtrends.com/@socket.tech/plugin">
            <img src="https://img.shields.io/npm/dm/@socket.tech/plugin" alt="Downloads" />
        </a>
        <a href="https://github.com/SocketDotTech/plugin/stargazers">
            <img src="https://img.shields.io/github/stars/SocketDotTech/plugin" alt="Github Stars" />
        </a>
        <a href="https://github.com/SocketDotTech/plugin/blob/main/license">
            <img src="https://img.shields.io/github/license/SocketDotTech/plugin" alt="License">
        </a>
    </p>
</p>

Socket Plugin is a React component that can be easily imported in any React (JS/TS) project. The plugin supports most features from [Bungee.exchange](https://bungee.exchange/). It brings the seamless bridging UX from Bungee to any DApp!

![Themes](https://user-images.githubusercontent.com/20141508/180805890-208eacd4-e841-4294-9a7f-65aa8e249a0c.png)

The plugin requires `provider` from user’s connected wallet & Socket’s `API_KEY` as props to initialise. [Optional props](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790) can be passed to customize the plugin’s color scheme, pre-select the chains/tokens & also customize token lists.

The full documentation for the plugin can be found [here](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)

## Installation

The plugin can be installed via NPM or Yarn.

**NPM :**

```bash
npm install @socket.tech/plugin
```

**Yarn :**

```bash
yarn add @socket.tech/plugin
```

**Note :** The plugin requires `react` (>=17.0.1) and `react-dom` (>=17.0.1) as peerDepencies.

## Initialization 

Copy the snippet below to get started! Pass the `API_KEY` from a .env file and `Provider` from user’s connected wallet.

```tsx
import { Bridge } from "@socket.tech/plugin";
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

That’s it! You’ve successfully plugged your DApp into Socket! 🔌  For further customising the plugin, check the plugin [docs](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790).

## Documentation

- [Initialisation](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)
- [Customisation](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)
- [API reference](https://www.notion.so/Socket-Widget-Docs-b905871870e343c6833169ebbd356790)

## Example App

Work In Progress 🛠

## More themes... 😎

![More Themes](https://user-images.githubusercontent.com/20141508/180805803-f2e85617-c082-4354-90d1-1838ab9ec722.png)
