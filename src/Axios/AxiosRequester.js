import axios from "axios";
import { getBase64 } from "../utils/utils";

class AxiosRequester {
	token = null;
	baseUrl = "http://localhost:5008/";
	_instance = null;

	constructor() {}

	setToken(token) {
		console.log("Bearer " +token);
		this.token = token;
	}

	static getInstance() {
		if (!AxiosRequester._instance) {
			AxiosRequester._instance = new AxiosRequester();
		}
		return AxiosRequester._instance;
	}

	getConfig() {
		return {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
				accept: "*/*",
			},
		};
	}

	/*
	 * loginRequest:
	 * @param {object} data:
	 * @param {string} data.email
	 * @param {string} data.password
	 * @returns {object} response.data
	 * @returns {string} response.data.token
	 * @returns {object} response.data.user
	 */
	loginRequest = async (data) => {
		const apiUrl = this.baseUrl + "User/login";
		try {
			const response = await axios.post(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};
	/*
	 * registerRequest:
	 * @param {object} data:
	 * @param {string} data.userName
	 * @param {string} data.email
	 * @param {string} data.password
	 */
	registerRequest = async (data) => {
		const apiUrl = this.baseUrl + "User/register";
		try {
			const response = await axios.post(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* postScript:
	 * @param {object} data:
	 * @param {string} data.ScriptName
	 * @param {string} data.Description
	 * @param {string} data.ProgrammingLanguage
	 * @param {string} data.InputScryptType
	 * @param {string} data.OutputScryptType
	 * @param {string} data.Visibility
	 * @param {string} data.File
	 * @param {string} data.UserId
	 */
	postScript = async (data) => {
		const apiUrl = this.baseUrl + "Script";
		const dataUpdated = data;
		// //console.log(data.SourceScriptBinary);
		const fileAsBase64 = await getBase64(data.SourceScriptBinary);
		dataUpdated.SourceScriptBinary = fileAsBase64;
		// //console.log(dataUpdated);
		try {
			const response = await axios.post(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* postScriptVersion:
	 * @param {object} data:
	 * @param {string} data.ScriptId
	 * @param {string} data.VersionNumber
	 * @param {string} data.Comment
	 * @param {string} data.SourceScriptBinary
	 * @param {string} data.CreatorUserId
	 */
	postScriptVersion = async (data) => {
		const apiUrl = this.baseUrl + "Script/version";
		const dataUpdated = data;
		let fileAsBase64;
		if (typeof data.SourceScriptBinary === "string") {
			fileAsBase64 = btoa(
				unescape(encodeURIComponent(data.SourceScriptBinary))
			);
		} else {
			fileAsBase64 = await getBase64(data.SourceScriptBinary);
		}
		dataUpdated.SourceScriptBinary = fileAsBase64;
		// //console.log(dataUpdated);
		try {
			const response = await axios.post(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* getScriptById:
	 * @param {string} scriptId
	 */
	getScriptById = async (scriptId) => {
		const apiUrl = this.baseUrl + `Script/${scriptId}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* getScripts:
	 * @param {string} userId
	 */
	getScripts = async (props = {}) => {
		const apiUrl = this.baseUrl + `Script/user`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getMyScriptsAndFavoriteScript = async () => {
		const apiUrl = this.baseUrl + `Script/favorites`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			return response.data;
		} catch (error) {
			console.log("Erreur lors de la requête:", error);
		}
	}

	putAsFavoriteScript = async (scriptId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/favorites/${scriptId}`;
		try {
			const response = await axios.post(apiUrl, {}, this.getConfig());
			console.log(response);
			return response.data;
		} catch (error) {
			console.log("Erreur lors de la requête:", error);
		}
	}

	removeAsFavoriteScript = async (scriptId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/favorites/${scriptId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			return response.data;
		} catch (error) {
			console.log("Erreur lors de la requête:", error);
		}
	}

	getScriptsForFeed= async (options = {offset:0, records:5, visibility:"Public"}) => {
		const apiUrl = this.baseUrl + `Script?offset=${options.offset}&records=${options.records}&visibility=${options.visibility}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	/* deleteScript: Delete the script and all its versions from DB
	 * @param {string} scriptId
	 */
	deleteScript = async (scriptId) => {
		const apiUrl = this.baseUrl + `Script/${scriptId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* deleteScriptVersion: Delete the script version whose Id is provided from DB
	 * @param {string} scriptVersionId
	 */
	deleteScriptVersion = async (scriptVersionId) => {
		const apiUrl = this.baseUrl + `Script/version/${scriptVersionId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* getScriptBlob: Get the script blob from DB
	 * @param {string} scriptId
	 * @return {object} response.data
	 * @return {string} response.data.blob (base64)
	 * @return {string} response.data.fileName
	 */
	getScriptBlob = async (scriptId) => {
		const apiUrl = this.baseUrl + `Script/${scriptId}/file`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	checkEmailAvailability = async (email) => {
		const apiUrl = this.baseUrl + `User/checkEmailAvailability?email=${email}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			return response.data.isAvailable;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	checkUsernameAvailability = async (username) => {
		const apiUrl = this.baseUrl + `User/checkUsernameAvailability?username=${username}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			return response.data.isAvailable;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	validatePassword = async (password) => {
		const apiUrl = this.baseUrl + `User/checkPassword`;
		try {
			const response = await axios.post(apiUrl, {password},this.getConfig());
			return response.data.isValid;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	updateProfileInformation = async (data = {}) => {
		const apiUrl = this.baseUrl + `User/update`;
		try {
			const response = await axios.patch(apiUrl, data, this.getConfig());
			console.log(response);
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	/* getScriptVersionBlob: Get the script blob from DB
	 * @param {string} scriptVersionId
	 * @return {object} response.data
	 * @return {string} response.data.blob (base64)
	 * @return {string} response.data.fileName
	 */
	getScriptVersionBlob = async (scriptVersionId) => {
		const apiUrl = this.baseUrl + `Script/version/${scriptVersionId}/file`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/* getScriptVersions: Get all versions of a script
	 * @param {string} scriptId
	 * @return {array} array of script versions
	 */
	getScriptVersions = (scriptId) => {
		const apiUrl = this.baseUrl + `Script/${scriptId}/versions`;
		return new Promise((resolve, reject) => {
			try {
				return axios.get(apiUrl, this.getConfig()).then((response) => {
					//console.log("Réponse de l'API :", { response: response.data });
					return resolve(response.data);
				});
			} catch (error) {
				console.error("Erreur lors de la requête :", error);
				return reject(error);
			}
		});
	};

	searchScriptsByKeyWord = async (keyWord, options = {offset:0, records:5,visibility:"Public",language:"all"}) => {
		const apiUrl = this.baseUrl + `Script/search/${keyWord}?offset=${options.offset}&records=${options.records}&visibility=${options.visibility}&language=${options.language}`;

		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response.data });
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	updateScript = async (data) => {
		const apiUrl = this.baseUrl + `Script`;
		try {
			const response = await axios.put(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response });
			if (response.status === 200) {
				return data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getUserByToken = async () => {
		const apiUrl = this.baseUrl + `User`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getUserById = async (userId) => {
		const apiUrl = this.baseUrl + `User/${userId}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			// console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	getFriends = async () => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getFriendRequests = async () => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends/requests`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	deleteFriend = async (userId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends/${userId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	createFriendRequest = async (friendId, message) => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends/${friendId}`;
		try {
			const response = await axios.post(
				apiUrl,
				{ Message: message },
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	acceptFriendRequest = async (friendId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends/${friendId}`;
		try {
			const response = await axios.patch(apiUrl, {}, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	declineFriendRequest = async (userId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/friends/${userId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getFollows = async () => {
		const apiUrl = this.baseUrl + `SocialInteraction/follows`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	deleteFollow = async (userId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/follows/${userId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	addFollow = async (userId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/follows/${userId}`;
		try {
			const response = await axios.post(apiUrl, {}, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	//for the current user
	getGroups = async () => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getGroupByGroupId = async (groupId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups/${groupId}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getGroupMembers = async (groupId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups/${groupId}/members`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	//getGroupScripts = async (groupId) => {};

	//for the current user
	getGroupRequests = async () => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups/requests`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			//console.log("GetGroupRequests", response);

			if (response.status === 200) {
				//console.log("GetGroupRequests", response.data);
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getGroupRequestsByGroupId = async (groupId) => {
		try {
			const apiUrl =
				this.baseUrl + `SocialInteraction/groups/${groupId}/requests`;
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			} else {
				return null;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	/*
		@params {string} data.GroupName
		@params {string} data.Description (optional) 
	*/
	createGroup = async (data) => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups`;
		try {
			const response = await axios.post(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	updateGroupInformations = async (data) => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups`;
		try {
			const response = await axios.patch(apiUrl, data, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	inviteUserToGroup = async (groupId, userId, message) => {
		const apiUrl =
			this.baseUrl + `SocialInteraction/groups/${groupId}/${userId}`;
		try {
			const response = await axios.post(
				apiUrl,
				{ Message: message },
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	acceptGroupInvitation = async (groupId) => {
		const apiUrl =
			this.baseUrl + `SocialInteraction/groups/requests/${groupId}`;
		try {
			const response = await axios.patch(apiUrl, {}, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	declineGroupInvitation = async (groupId) => {
		const apiUrl =
			this.baseUrl + `SocialInteraction/groups/requests/${groupId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	//same as rejectGroupInvitation
	leaveGroup = async (groupId) => {
		this.declineGroupInvitation(groupId);
	};

	//same as removeUserFromGroup (only admin can add and remove users)
	cancelGroupInvitation = async (groupId, userId) => {
		this.removeUserFromGroup(groupId, userId);
	};

	removeUserFromGroup = async (groupId, userId) => {
		const apiUrl =
			this.baseUrl + `SocialInteraction/groups/${groupId}/${userId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	deleteGroup = async (groupId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/groups/${groupId}`;
		try {
			const response = await axios.delete(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	executeScript = async (formData) => {
		const apiUrl = this.baseUrl + `Runner/script/file`;
		try {
			//console.log({ formData });
			const response = await axios.post(apiUrl, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${this.token}`,
					accept: "*/*",
				},
			});
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				console.log(response);
				console.log(typeof response);
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	searchUsersByKeyword = async (keyword) => {
		const apiUrl = this.baseUrl + `User/search/${keyword}`;
		try {
			const response = await axios.get(apiUrl, this.getConfig());
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getScriptByUserIdAndVisiblity = async (
		userId,
		visibility,
		groupId = null
	) => {
		const apiUrl = this.baseUrl + `Script/byVisibility`;
		try {
			const response = await axios.post(
				apiUrl,
				{
					Visibility: visibility,
					UserId: userId,
					...(groupId && { GroupId: groupId }),
				},
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	};

	getComments = async (scriptId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/comments/${scriptId}`;
		try {
			const response = await axios.get(
				apiUrl,
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	postComment = async (scriptId,comment) => {
		const apiUrl = this.baseUrl + `SocialInteraction/comments/${scriptId}`;
		try {
			const response = await axios.post(
				apiUrl,
				{
					Description: comment
				},
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	updateComment = async (commentId, text) => {
		const apiUrl = this.baseUrl + `SocialInteraction/comments/${commentId}`;
		try {
			const response = await axios.patch(
				apiUrl,
				{
					Description: text
				},
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	deleteComment = async (commentId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/comments/${commentId}`;
		try {
			const response = await axios.delete(
				apiUrl,
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 204) {
				return "success";
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	like = async (scriptId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/likes/${scriptId}`;
		try {
			const response = await axios.post(
				apiUrl,
				{},
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 201) {
				return "success";
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	unlike = async (scriptId) => {
		const apiUrl = this.baseUrl + `SocialInteraction/likes/${scriptId}`;
		try {
			const response = await axios.delete(
				apiUrl,
				this.getConfig()
			);
			//console.log("Réponse de l'API :", { response: response });
			if (response.status === 204) {
				return "success";
			}
		} catch (error) {
			console.error("Erreur lors de la requête :", error);
		}
	}

	executePipeline = async(data) => {
		const apiUrl = this.baseUrl + `Runner/pipeline`;
		console.log('Axios Exec Pipeline');
		try {
			const response = await axios.post(apiUrl, data, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'accept': '*/*',
					'Authorization': `Bearer ${this.token}`
				},
				responseType: 'blob'
			});
			if (response.status === 200) {
				return response.data;
			}
		} catch (error) {
			console.error("Erreur lors de la requete \"execute pipeline\":",error);
		}
	}
}

export default AxiosRequester;
