import React, { Fragment } from "react";
import { Image, SafeAreaView, StatusBar, Text, View } from "react-native";

import DidiButton from "../../util/DidiButton";
import DidiTextInput from "../../util/DidiTextInput";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";
import commonStyles from "../resources/commonStyles";

import { DashboardScreenProps } from "../../dashboard/home/Dashboard";
import NavigationHeaderStyle from "../../resources/NavigationHeaderStyle";
import strings from "../../resources/strings";
import themes from "../../resources/themes";

interface ForgotPasswordNewPasswordState {
	key: string;
	keyDup: string;
}

export type ForgotPasswordNewPasswordProps = {};

export interface ForgotPasswordNewPasswordNavigation {
	Dashboard: DashboardScreenProps;
}

export class ForgotPasswordNewPasswordScreen extends NavigationEnabledComponent<
	ForgotPasswordNewPasswordProps,
	ForgotPasswordNewPasswordState,
	ForgotPasswordNewPasswordNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitle(strings.recovery.passwordChange.barTitle);

	private canPressContinueButton(): boolean {
		return this.state && this.state.key ? this.state.key.length > 0 && this.state.keyDup == this.state.key : false;
	}

	render() {
		return (
			<Fragment>
				<StatusBar backgroundColor={themes.darkNavigation} barStyle="light-content" />
				<SafeAreaView style={commonStyles.view.area}>
					<View style={commonStyles.view.body}>
						<Text style={commonStyles.text.emphasis}>{strings.recovery.passwordChange.messageHead}</Text>

						<Image source={require("../resources/images/recoverPassword.png")} style={commonStyles.image.image} />

						<DidiTextInput
							description={strings.recovery.passwordChange.newPassMessage}
							placeholder=""
							tagImage={require("../resources/images/key.png")}
							textInputProps={{
								secureTextEntry: true,
								onChangeText: text => this.setState({ key: text })
							}}
						/>

						<DidiTextInput
							description={strings.recovery.passwordChange.repeatNewPassMessage}
							placeholder=""
							tagImage={require("../resources/images/key.png")}
							textInputProps={{
								secureTextEntry: true,
								onChangeText: text => this.setState({ keyDup: text })
							}}
						/>

						<View />

						<DidiButton
							onPress={() => {
								this.navigate("Dashboard", {});
							}}
							disabled={!this.canPressContinueButton()}
							title={strings.accessCommon.recoverButtonText}
						/>
					</View>
				</SafeAreaView>
			</Fragment>
		);
	}
}
