import { Component, Fragment } from "react";
import { Text, View, Image, StyleSheet, ImageSourcePropType, StyleProp, TextStyle } from "react-native";
import React from "react";
import { FlatList } from "react-native-gesture-handler";

interface DidiCardProps {
	icon: ImageSourcePropType;
	image: ImageSourcePropType;
	category: string;
	title: string;
	timing: string;
	cardStyles?: StyleProp<TextStyle>;
	data: { label: string; value: string; id: string }[];
	showDataHorizontally?: boolean;
}

export default class DidiCard extends Component<DidiCardProps, {}> {
	private renderKeyValue() {
		return (
			<View style={{ marginTop: 20 }}>
				{this.props.showDataHorizontally ? this.renderKeyValueHorizontal() : this.renderKeyValueVerticel()}
			</View>
		);
	}

	private renderKeyValueHorizontal() {
		return (
			<FlatList
				data={this.props.data}
				numColumns={3}
				keyExtractor={item => item.id}
				renderItem={({ item }) => {
					return (
						<View style={styles.dataColumn}>
							<Text style={styles.dataColLabel}>{item.label}</Text>
							<Text style={styles.dataColValue}>{item.value}</Text>
						</View>
					);
				}}
			/>
		);
	}

	private renderKeyValueVerticel() {
		return (
			<FlatList
				data={this.props.data}
				keyExtractor={item => item.id}
				renderItem={({ item }) => {
					return (
						<View style={styles.dataRow}>
							<Text style={styles.dataRowLabel}>{item.label}</Text>
							<Text style={styles.dataRowValue}>{item.value}</Text>
						</View>
					);
				}}
			/>
		);
	}

	private renderTitle() {
		return (
			<View style={styles.headerData}>
				<Text style={styles.category}>{this.props.category}</Text>
				<Text style={styles.title}>{this.props.title}</Text>
				<Text style={styles.timing}>{this.props.timing}</Text>
			</View>
		);
	}

	private renderIcon() {
		return (
			<View style={styles.headerIconContainer}>
				<Image style={styles.icon} source={this.props.icon} />
			</View>
		);
	}

	render() {
		return (
			<Fragment>
				<View style={[styles.body, styles.card, this.props.cardStyles]}>
					<View style={styles.headerContainer}>
						{this.renderIcon()}
						<View
							style={{
								flexDirection: "column",
								flexGrow: 1,
								justifyContent: "space-between"
							}}
						>
							{this.renderTitle()}
							{this.renderKeyValue()}
						</View>
					</View>
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={this.props.image} />
					</View>
				</View>
			</Fragment>
		);
	}
}

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: "row",
		marginHorizontal: 25,
		marginVertical: 25,
		alignItems: "stretch",
		justifyContent: "flex-start",
		flexGrow: 1
	},
	card: {},
	data: {
		justifyContent: "center"
	},
	dataColumn: {
		width: "33%"
	},
	dataRow: {
		justifyContent: "center",
		flexDirection: "row"
	},
	dataColLabel: {
		fontSize: 14,
		color: "#FFF"
	},
	dataColValue: {
		fontWeight: "bold",
		fontSize: 14,
		color: "#FFF"
	},
	dataRowLabel: {
		fontSize: 14,
		color: "#FFF",
		flex: 1
	},
	dataRowValue: {
		fontWeight: "100",
		fontSize: 14,
		color: "#FFF",
		marginLeft: 10
	},
	body: {
		borderRadius: 10,
		flexDirection: "column",
		flex: 0
	},
	headerIconContainer: {
		justifyContent: "flex-start"
	},
	icon: {
		height: 30,
		width: 27,
		marginRight: 25
	},
	headerData: {
		textAlign: "left",
		justifyContent: "center"
	},
	category: {
		fontWeight: "100",
		fontSize: 12,
		color: "#FFF"
	},
	title: {
		fontWeight: "500",
		fontSize: 16,
		color: "#FFF"
	},
	timing: {
		fontSize: 12,
		color: "#FFF"
	},

	imageContainer: {
		position: "absolute",
		top: 10,
		right: 10
	},
	image: {
		height: 64,
		width: 64
	}
});
