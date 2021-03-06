declare module "*.svg" {
	import { SvgProps } from "react-native-svg";
	const content: React.StatelessComponent<SvgProps>;
	export default content;
}

declare module "react-navigation-header-buttons/src/overflowMenuPressHandlers" {
	import { onOverflowMenuPressParams } from "react-navigation-header-buttons";
	export function defaultOnOverflowMenuPress(params: onOverflowMenuPressParams): void;
}

declare module "ethr-did-registry";
declare module "ethr-did-resolver";
declare module "react-native-bcrypt";
declare module "redux-persist-fs-storage";
declare module "ethjs-contract";
declare module "ethjs-provider-http";
declare module "ethjs-query";
