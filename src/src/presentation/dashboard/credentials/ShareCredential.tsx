import React, { Fragment } from "react";
import { FlatList, SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native";

import NavigationHeaderStyle from "../../common/NavigationHeaderStyle";
import commonStyles from "../../resources/commonStyles";
import { DidiText } from "../../util/DidiText";
import NavigationEnabledComponent from "../../util/NavigationEnabledComponent";
import { DocumentCredentialCard } from "../common/documentToCard";

import { CredentialDocument } from "../../../model/CredentialDocument";
import { DerivedCredential } from "../../../model/DerivedCredential";
import { didiConnect } from "../../../store/store";
import strings from "../../resources/strings";
import themes from "../../resources/themes";

import { ShareMicroCredentialProps } from "./ShareMicroCredential";
import { ShareSpecificCredentialProps } from "./ShareSpecificCredential";

export type ShareCredentialProps = {};
interface ShareCredentialInternalProps extends ShareCredentialProps {
	credentials: Array<DerivedCredential<CredentialDocument>>;
}

type ShareCredentialState = {};

export interface ShareCredentialNavigation {
	ShareMicroCredential: ShareMicroCredentialProps;
	ShareSpecificCredential: ShareSpecificCredentialProps;
}

class ShareCredentialScreen extends NavigationEnabledComponent<
	ShareCredentialInternalProps,
	ShareCredentialState,
	ShareCredentialNavigation
> {
	static navigationOptions = NavigationHeaderStyle.withTitle("Compartir");

	render() {
		return (
			<Fragment>
				<StatusBar backgroundColor={themes.darkNavigation} barStyle="light-content" />
				<SafeAreaView style={commonStyles.view.area}>
					<FlatList
						style={{ width: "100%" }}
						contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8 }}
						data={this.props.credentials}
						keyExtractor={(_, index) => index.toString()}
						renderItem={item => this.renderCard(item.item)}
						ListEmptyComponent={
							<View style={commonStyles.view.body}>
								<DidiText.Explanation.Normal>
									{strings.credentialShare.noCredentialsAvailable}
								</DidiText.Explanation.Normal>
							</View>
						}
						ListHeaderComponent={
							<DidiText.Explanation.Emphasis>{strings.credentialShare.whichFull}</DidiText.Explanation.Emphasis>
						}
					/>
				</SafeAreaView>
			</Fragment>
		);
	}

	private renderCard(document: DerivedCredential<CredentialDocument>) {
		return (
			<TouchableOpacity onPress={() => this.doShare(document)}>
				<DocumentCredentialCard preview={false} document={document} />
			</TouchableOpacity>
		);
	}

	private doShare(document: DerivedCredential<CredentialDocument>) {
		if (document.sources.length === 1) {
			this.navigate("ShareSpecificCredential", { document: document.sources[0] });
		} else {
			this.navigate("ShareMicroCredential", {
				credentials: document.sources.sort((l, r) => {
					const ax = Object.values(l.content.claims);
					const bx = Object.values(r.content.claims);
					const a = Object.keys(ax[0] as object).length;
					const b = Object.keys(bx[0] as object).length;
					return b - a;
				})
			});
		}
	}
}

export default didiConnect(
	ShareCredentialScreen,
	(state): ShareCredentialInternalProps => {
		return {
			credentials: state.credentials
		};
	}
);
