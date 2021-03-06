import React, { useState } from "react";
import { StyleSheet, View, Image, Platform } from "react-native";
import { withNavigation } from "react-navigation";
import ImagePicker from "react-native-image-crop-picker";
import { Text, Item, Input, Form, Button } from "native-base";
import { ScrollView } from "react-native-gesture-handler";
import { BottomModal, ModalContent } from "react-native-modals";

import useQuery from "../hooks/useQuery";
import findPlayersQuery from "../queries/findPlayers";
import updatePlayerQuery from "../queries/updatePlayer";

import Colors from "../colors";
import BlankScreen from "./BlankScreen";
import HeaderSm from "../components/HeaderSmall";
import BgImage from "../components/backgroundImage";
import ButtonPrimary from "../components/ButtonPrimary";
import ResponsiveSize from "../config/getScreenDimensions";

const defaultProfilePhoto = require("../assets/icons/Profile-Pic-Example.png");

const emailRegex = RegExp(/^.+@.+\..+$/);

function ProfileScreen ({ navigation }) {
	const navigationContext = navigation.state.params || {
	};

	const [name, setName] = useState(undefined);
	const [email, setEmail] = useState(undefined);
	const [profilePhoto, setProfilePhoto] = useState(undefined);
	const [nameError, setNameError] = useState(undefined);
	const [emailError, setEmailError] = useState(undefined);
	const [playerUpdated, setPlayerUpdated] = useState(false);
	const [playerUpdateObj, setPlayerUpdateObj] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [foundPlayer, findPlayerLoading] = useQuery(findPlayersQuery(navigationContext.id));
	const [updatedPlayer, updatePlayerLoading, updatePlayerError] = useQuery(updatePlayerQuery(playerUpdateObj));

	const checkFormValid = () => {
		setNameError((name || foundPlayer.fullName) && (name || foundPlayer.fullName).trim().length > 0 ? false : "enter your name");
		setEmailError((email || foundPlayer.emailAddress) && emailRegex.test((email || foundPlayer.emailAddress).trim()) ? false : "enter a valid email");
		return [nameError, emailError];
	};

	const onSubmit = () => {
		checkFormValid();

		if (((name || foundPlayer.fullName) && (name || foundPlayer.fullName).trim().length > 0)
		&& ((email || foundPlayer.emailAddress) && emailRegex.test((email || foundPlayer.emailAddress).trim()))) {
			setPlayerUpdated(false);
			setPlayerUpdateObj({
				id: navigationContext.id,
				fullName: (name || foundPlayer.fullName),
				emailAddress: (email || foundPlayer.emailAddress),
				profilePhoto: (profilePhoto || "")
			});
			if (!updatePlayerError) {
				setPlayerUpdated(true);
			}
		}

		return false;
	};

	const ErrorMessage = (props) => {
		const { errors } = props;
		const errorsText = errors.filter((item) => Boolean(item)).join(" and ");
		if (errorsText) {
			return (
				<View style={styles.errorMessages}>
					<Text>{`Please ${errorsText}.`}</Text>
				</View>
			);
		}
		return null;
	};

	const ButtonLoading = () => {
		if (updatePlayerLoading) {
			return (
				<ButtonPrimary
					title="Updating..."
				/>
			);
		} if (playerUpdated) {
			return (
				<ButtonPrimary
					title="Done"
					onPress={() => {
						navigationContext.updatePlayers(playerUpdateObj);
						navigation.goBack();
					}}
				/>
			);
		}
		return (
			<ButtonPrimary
				title="Update"
				onPress={onSubmit}
			/>
		);
	};

	const UpdateMessage = () => {
		if (playerUpdated && !updatePlayerLoading) {
			return (
				<Text style={styles.playerUpdatedText}>Player updated.</Text>
			);
		}
		return null;
	};

	const handleChoosePhoto = () => {
		ImagePicker.openPicker({
			width: 400,
			height: 400,
			cropping: true,
			cropperCircleOverlay: true,
			compressImageMaxWidth: 100,
			compressImageMaxHeight: 100,
			compressImageQuality: 0.25,
			includeBase64: true
		}).then((image) => {
			if (image && image.mime && image.data) {
				setPlayerUpdated(false);
				setProfilePhoto(`data:${image.mime};base64,${image.data}`);
				setShowModal(false);
			}
		});
	};

	const handleTakePhoto = () => {
		ImagePicker.openCamera({
			useFrontCamera: true,
			width: 400,
			height: 400,
			cropping: true,
			cropperCircleOverlay: true,
			compressImageMaxWidth: 100,
			compressImageMaxHeight: 100,
			compressImageQuality: 0.25,
			includeBase64: true
		}).then((image) => {
			if (image && image.mime && image.data) {
				setPlayerUpdated(false);
				setProfilePhoto(`data:${image.mime};base64,${image.data}`);
				setShowModal(false);
			}
		});
	};

	const handleDeletePhoto = () => {
		setPlayerUpdated(false);
		setProfilePhoto(false);
		setShowModal(false);
	};

	if (!foundPlayer || findPlayerLoading) {
		return (
			<BlankScreen />
		);
	}

	return (
		<BgImage>
			<HeaderSm style={styles.title} headerTitle="Update Profile" />
			<ScrollView style={styles.parent}>
				<Form>
					<View style={styles.container}>
						<Text style={styles.text}>Full Name</Text>
						<Item style={styles.item}>
							<Input
								style={nameError ? styles.error : styles.input}
								onChangeText={(nameVal) => { setPlayerUpdated(false); setName(nameVal); }}
								placeholder="Max Power"
								placeholderTextColor="#c2c2c2"
								autoCapitalize="words"
								textContentType="name"
								autoCompleteType="name"
								returnKeyType="done"
								value={name || foundPlayer.fullName}
								maxFontSizeMultiplier={1}
							/>
						</Item>
					</View>
					<View style={styles.container}>
						<Text style={styles.text}>Email Address</Text>
						<Item style={styles.item}>
							<Input
								style={emailError ? styles.error : styles.input}
								onChangeText={(emailVal) => { setPlayerUpdated(false); setEmail(emailVal); }}
								placeholder="Max.Power@insight.com"
								placeholderTextColor="#c2c2c2"
								autoCapitalize="none"
								textContentType="emailAddress"
								autoCompleteType="email"
								keyboardType="email-address"
								returnKeyType="done"
								value={email || foundPlayer.emailAddress}
								maxFontSizeMultiplier={1}
							/>
						</Item>
					</View>
					<View style={styles.photoContainer}>
						<Text style={styles.profText}>Profile Pic</Text>
						<Image
							style={styles.profile}
							source={(profilePhoto === false ? defaultProfilePhoto : (profilePhoto || foundPlayer.profilePhoto) ? {
								uri: (profilePhoto || foundPlayer.profilePhoto)
							} : defaultProfilePhoto)}
						/>
						<Button transparent onPress={() => { setShowModal(true); }}>
							<Text uppercase={false} style={styles.profileButton}>Add/Update</Text>
						</Button>
					</View>
					<View style={styles.container}>
						<ErrorMessage errors={[nameError, emailError]} />
						<UpdateMessage />
						<ButtonLoading />
						<Button
							style={styles.cancelButton}
							transparent
							onPress={() => (navigation.goBack())}
						>
							<Text uppercase={false} style={styles.cancelText}>Cancel</Text>
						</Button>
					</View>
				</Form>
				<BottomModal
					visible={showModal}
					onTouchOutside={() => {
						setShowModal(false);
					}}
					rounded={false}
					modalStyle={{
						backgroundColor: Colors.Transparent
					}}
				>
					<ModalContent>
						<Button
							text="Take Photo"
							onPress={handleTakePhoto}
							style={[styles.modalButton, {
								borderTopLeftRadius: 10,
								borderTopRightRadius: 10
							}]}
						>
							<Text style={styles.modalButtonText}>Take Photo</Text>
						</Button>
						<Button
							onPress={handleChoosePhoto}
							style={styles.modalButton}
						>
							<Text style={styles.modalButtonText}>Choose From Library</Text>
						</Button>
						<Button
							onPress={handleDeletePhoto}
							style={[styles.modalButton, {
								borderBottomLeftRadius: 10,
								borderBottomRightRadius: 10
							}]}
						>
							<Text style={styles.modalButtonText}>Delete Photo</Text>
						</Button>
						<Button
							onPress={() => {
								setShowModal(false);
							}}
							style={[styles.modalButton, styles.modalCancelButton]}
						>
							<Text style={styles.modalButtonText}>Cancel</Text>
						</Button>
					</ModalContent>
				</BottomModal>
			</ScrollView>
		</BgImage>
	);
}

const styles = StyleSheet.create({
	parent: {
		marginTop: "-10%"
	},
	container: {
		alignItems: "center",
		marginTop: "3%"
	},
	photoContainer: {
		alignItems: "center",
		marginLeft: "-50%",
		marginTop: "10%",
		borderRadius: 100
	},
	item: {
		borderBottomColor: Colors.InsightFuschia,
		borderBottomWidth: 2,
		width: "80%"
	},
	input: {
		fontWeight: "300",
		marginBottom: -10,
		marginLeft: "-1%",
		marginTop: "-4%"
	},
	profile: {
		height: ResponsiveSize(4.7),
		width: ResponsiveSize(4.7),
		resizeMode: "cover"
	},
	profText: {
		fontFamily: "KlinicSlab-Medium",
		fontSize: ResponsiveSize(14.4),
		color: Colors.DarkGray,
		fontWeight: "500",
		letterSpacing: -0.63
	},
	profileButton: {
		color: Colors.LinkBlue,
		fontSize: ResponsiveSize(24)
	},
	text: {
		fontFamily: "KlinicSlab-Medium",
		fontSize: ResponsiveSize(14.4),
		fontWeight: "500",
		marginTop: 30,
		alignSelf: "flex-start",
		marginLeft: "11%"
	},
	cancelButton: {
		alignSelf: "center"
	},
	cancelText: {
		letterSpacing: -0.52,
		fontWeight: "300",
		color: Colors.LinkBlue,
		fontSize: ResponsiveSize(23.4),
		marginLeft: -17
	},
	error: {
		borderWidth: 2,
		borderColor: Colors.Red,
		color: Colors.Red
	},
	errorMessages: {
		backgroundColor: Colors.TransparentRed,
		padding: 10,
		marginBottom: 20
	},
	playerUpdatedText: {
		marginBottom: 10
	},
	modalButton: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: Colors.White,
		borderRadius: 0
	},
	modalCancelButton: {
		marginTop: 10,
		borderTopWidth: 1,
		borderColor: Colors.MiddleGray,
		borderRadius: 10
	},
	modalButtonText: {
		width: "100%",
		textAlign: "center",
		...Platform.select({
			android: {
				color: Colors.LinkBlue
			},
			ios: {
				color: Colors.LinkBlue
			}
		})
	}
});

export default withNavigation(ProfileScreen);
