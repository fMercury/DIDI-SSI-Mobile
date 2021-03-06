import { Alert } from "react-native";
import strings from "../resources/strings";

export const DataAlert = {
	alert: (title: string, message: string, onClose?: () => void, onOk?: () => void) => {
		let buttons = [{ text: strings.buttons.ok, onPress: onClose }];

		if (onOk) {
			buttons = [
				{ text: strings.buttons.back, onPress: onClose },
				{ text: strings.buttons.acceptAlternative, onPress: onOk }
			];
		}

		Alert.alert(title, message, buttons, {
			onDismiss: onClose
		});
	}
};
