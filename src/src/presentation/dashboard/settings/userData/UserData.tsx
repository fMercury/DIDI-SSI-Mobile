import React from "react";
import { ScrollView, StyleSheet, Text, View, ViewProps } from "react-native";

import NavigationHeaderStyle from "../../../common/NavigationHeaderStyle";
import DidiTextInput from "../../../util/DidiTextInput";
import DropdownMenu from "../../../util/DropdownMenu";
import NavigationEnabledComponent from "../../../util/NavigationEnabledComponent";
import { ValidationStateIcon } from "../../../util/ValidationStateIcon";

import { ValidatedIdentity, WithValidationState } from "../../../../store/selector/combinedIdentitySelector";
import { didiConnect } from "../../../../store/store";
import colors from "../../../resources/colors";
import strings from "../../../resources/strings";
import { EditProfileProps } from "../userMenu/EditProfile";
import { ShareProfileProps } from "../userMenu/ShareProfile";

import { ChangeEmailEnterEmailProps } from "./ChangeEmailEnterEmail";
import { ChangePhoneEnterScreenProps } from "./ChangePhoneEnterPhone";
import { UserHeadingComponent } from "./UserHeading";

export type UserDataProps = ViewProps;

interface UserDataInternalProps extends UserDataProps {
	identity: ValidatedIdentity;
}

type UserDataState = {};

export interface UserDataNavigation {
	ShareProfile: ShareProfileProps;
	ChangeEmailEnterEmail: ChangeEmailEnterEmailProps;
	ChangePhoneEnterPhone: ChangePhoneEnterScreenProps;
	EditProfile: EditProfileProps;
}

class UserDataScreen extends NavigationEnabledComponent<UserDataInternalProps, UserDataState, UserDataNavigation> {
	static navigationOptions = NavigationHeaderStyle.withTitleAndRightButtonActions<UserDataNavigation>("Mi perfil", [
		{
			actionTitle: strings.dashboard.userData.changeEmail.screenTitle,
			onPress: navigation => {
				navigation.navigate("ChangeEmailEnterEmail", {});
			}
		},
		{
			actionTitle: strings.dashboard.userData.changePhone.screenTitle,
			onPress: navigation => {
				navigation.navigate("ChangePhoneEnterPhone", {});
			}
		},
		{
			actionTitle: strings.dashboard.userData.share.barTitle,
			onPress: navigation => {
				navigation.navigate("ShareProfile", {});
			}
		},
		{
			actionTitle: strings.dashboard.userData.editProfile.barTitle,
			onPress: navigation => {
				navigation.navigate("EditProfile", {});
			}
		}
	]);

	getPersonalData(): Array<{ label: string; value?: WithValidationState<string> }> {
		return [
			{
				label: strings.dashboard.userData.editProfile.fullNameMessage,
				value: this.props.identity.personalData.fullName
			},
			{
				label: strings.dashboard.userData.editProfile.cellMessage,
				value: this.props.identity.personalData.cellPhone
			},
			{
				label: strings.dashboard.userData.editProfile.emailMessage,
				value: this.props.identity.personalData.email
			},
			{
				label: strings.dashboard.userData.editProfile.documentMessage,
				value: this.props.identity.personalData.document
			},
			{
				label: strings.dashboard.userData.editProfile.nationalityMessage,
				value: this.props.identity.personalData.nationality
			}
		];
	}

	getAddressData(): Array<{ label: string; value?: string }> {
		const address = this.props.identity.address;
		return [
			{
				label: strings.dashboard.userData.editProfile.streetMessage,
				value: address && address.street
			},
			{
				label: strings.dashboard.userData.editProfile.numberMessage,
				value: address && address.number
			},
			{
				label: strings.dashboard.userData.editProfile.departmentMessage,
				value: address && address.department
			},
			{
				label: strings.dashboard.userData.editProfile.floorMessage,
				value: address && address.floor
			},
			{
				label: strings.dashboard.userData.editProfile.neighborhoodMessage,
				value: address && address.neighborhood
			},
			{
				label: strings.dashboard.userData.editProfile.postCodeMessage,
				value: address && address.postCode
			}
		];
	}

	render() {
		return (
			<ScrollView>
				<UserHeadingComponent
					user={this.props.identity.visual.id}
					profileImage={this.props.identity.visual.image}
					backgroundImage={this.props.identity.visual.backgroundImage}
					allowEdit={true}
				/>

				<View>
					{this.renderPersonalData()}
					{this.renderAddressData()}
				</View>
			</ScrollView>
		);
	}

	private renderPersonalData() {
		return this.renderDropdown(strings.dashboard.userData.personalDataLabel, this.getPersonalData(), (data, index) => {
			return (
				<DidiTextInput
					key={index}
					description={data.label}
					placeholder={""}
					textInputProps={{
						editable: false,
						value: data.value ? data.value.value : "--"
					}}
					stateIndicator={
						data.value && data.value.state && <ValidationStateIcon validationState={data.value.state} useWords={true} />
					}
				/>
			);
		});
	}

	private renderAddressData() {
		return this.renderDropdown(strings.dashboard.userData.addressDataLabel, this.getAddressData(), (item, index) => {
			return (
				<DidiTextInput
					key={index}
					description={item.label}
					placeholder={""}
					textInputProps={{
						editable: false,
						value: item.value || "--"
					}}
				/>
			);
		});
	}

	private renderDropdown<T>(label: string, data: T[], renderOne: (item: T, index: number) => JSX.Element) {
		return (
			<DropdownMenu
				headerContainerStyle={{ backgroundColor: colors.primary }}
				headerTextStyle={{ color: colors.primaryText }}
				style={styles.personalDataDropdown}
				label={label}
			>
				<View style={styles.dropdownContents}>{data.map(renderOne)}</View>
			</DropdownMenu>
		);
	}
}

export default didiConnect(
	UserDataScreen,
	(state): UserDataInternalProps => ({
		identity: state.identity
	})
);

const styles = StyleSheet.create({
	personalDataDropdown: {
		marginVertical: 20,
		marginHorizontal: 10,
		borderRadius: 10,
		overflow: "hidden"
	},
	dropdownContents: {
		padding: 16,
		backgroundColor: colors.darkBackground
	}
});