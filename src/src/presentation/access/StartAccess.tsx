import React, { Fragment } from "react";
import { StyleSheet } from "react-native";
import { RNUportHDSigner } from "react-native-uport-signer";

import NavigationHeaderStyle from "../common/NavigationHeaderStyle";
import DidiButton from "../util/DidiButton";
import NavigationEnabledComponent from "../util/NavigationEnabledComponent";

import { AppConfig } from "../../AppConfig";
import colors from "../resources/colors";
import strings from "../resources/strings";
import themes from "../resources/themes";
import { SplashContent } from "../SplashContent";

import { AccessSettingsProps } from "./AccessSettings";
import { LoginScreenProps } from "./login/LoginScreen";
import { RecoveryExplanationProps } from "./recovery/RecoveryExplanation";
import { SignupOnboardingProps } from "./signup/SignupOnboarding";
import { SignupWithResetProps } from "./signup/SignupWithReset";

export type StartAccessProps = {};

export interface StartAccessNavigation {
	Login: LoginScreenProps;
	SignupOnboarding: SignupOnboardingProps;
	SignupWithReset: SignupWithResetProps;
	RecoveryExplanation: RecoveryExplanationProps;
	AccessSettings: AccessSettingsProps;
}

export class StartAccessScreen extends NavigationEnabledComponent<StartAccessProps, {}, StartAccessNavigation> {
	static navigationOptions = NavigationHeaderStyle.gone;

	render() {
		return (
			<Fragment>
				<SplashContent>
					<DidiButton
						onPress={() => this.navigate("Login", {})}
						style={styles.secondaryButton}
						title={strings.recovery.startAccess.loginButton}
					/>
					<DidiButton
						onPress={this.goToSignup}
						style={styles.primaryButton}
						title={strings.recovery.startAccess.createButton}
					/>
					<DidiButton
						onPress={() => this.navigate("RecoveryExplanation", {})}
						style={styles.transparentButton}
						titleStyle={styles.transparentButtonText}
						title={strings.recovery.startAccess.recoveryButton + " >"}
					/>
				</SplashContent>
				{AppConfig.debug && (
					<DidiButton
						title="DEBUG"
						style={{ position: "absolute", top: 20, right: 20 }}
						onPress={() => this.navigate("AccessSettings", {})}
					/>
				)}
			</Fragment>
		);
	}

	private goToSignup = async () => {
		const hasSeed = await RNUportHDSigner.hasSeed();
		if (hasSeed) {
			this.navigate("SignupWithReset", {});
		} else {
			this.navigate("SignupOnboarding", {});
		}
	};
}

const styles = StyleSheet.create({
	transparentButton: {
		backgroundColor: "transparent"
	},
	transparentButtonText: {
		color: themes.foreground
	},
	primaryButton: {
		backgroundColor: colors.primaryShadow
	},
	secondaryButton: {
		backgroundColor: colors.secondary
	}
});
