import React from "react";
import { StyleSheet, View, Linking } from "react-native";

import { DidiScreen } from "../../common/DidiScreen";
import NavigationHeaderStyle from "../../common/NavigationHeaderStyle";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";

import strings from "../../resources/strings";
import { DashboardScreenProps } from "../home/Dashboard";
import DidiButton from "../../util/DidiButton";
import colors from "../../resources/colors";
import { DidiText } from "../../util/DidiText";
import RondasLogo from "../../resources/images/rondasSplash.svg";
export type RoundsScreenProps = {};
export type RoundsScreenState = {};
export interface RoundsScreenNavigation {
	DashboardHome: DashboardScreenProps;
}
const { Small } = DidiText.Explanation;

export class RoundsScreen extends NavigationEnabledComponent<
	RoundsScreenProps,
	RoundsScreenState,
	RoundsScreenNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitleAndFakeBackButton<RoundsScreenNavigation, "DashboardHome">(
		strings.tabNames.rounds,
		"DashboardHome",
		{}
	);

	
	goToRonda = () => {
		Linking.openURL(`https://aidi.page.link/bAmq`);
	}

	render() {
		const title = "Empezá tu ronda";
		const subTitle = "Invita a las personas que quieras que se sumen a tu ronda.";
		const shortDescription = "Indica cuánto aporta cada persona de tu ronda y con qué frecuencia se harán los pagos.";
		return (
			<DidiScreen>
				<RondasLogo />
				<Small style={styles.modalText}>{title}</Small>
				<Small style={styles.modalText}>{subTitle}</Small>
				<Small style={styles.modalText}>{shortDescription}</Small>
				<View style={{ marginBottom: 15 }}>
					<DidiButton
						onPress={this.goToRonda}
						title="Ver Rondas"
					/>
				</View>
			</DidiScreen>
		);
	}
}

const styles = StyleSheet.create({
	body: {
		width: "100%"
	},
	scrollContent: {
		backgroundColor: "white",
		paddingVertical: 8
	},
	warningMessage: {
		fontSize: 18,
		marginTop: 20
	},
	renaperButton: {
		marginTop: 20,
		paddingVertical: 26
	},
	button: {
		marginTop: 30,
		paddingHorizontal: 20
	},
	buttonText: {
		fontSize: 16
	},
	logo: {
		height: 50,
		width: 50,
		marginVertical: 25
	},
	hidden: {
		display: "none"
	},
	smallText: {
		fontSize: 14,
		color: colors.textLight
	},
	modalText: {
		fontSize: 17,
		textAlign: "center"
	}
});
