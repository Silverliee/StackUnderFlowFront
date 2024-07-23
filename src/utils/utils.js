import AxiosRequester from "../Axios/AxiosRequester.js";

export const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
			if (encoded.length % 4 > 0) {
				encoded += "=".repeat(4 - (encoded.length % 4));
			}
			resolve(encoded);
		};
		reader.onerror = (error) => reject(error);
	});
};

export const isValidEmail = (email) => {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
};

export const getRandomInt = (number) =>{
	// min and max are inclusive
	return (number % 7) +1;
}

export const isEmailAvailable = async (email) => {
	return await AxiosRequester.getInstance().checkEmailAvailability(email);
}

export const formatDateString = (dateString) => {
	const date = new Date(dateString);

	// Extract day, month, year, hours, and minutes
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
	const year = date.getFullYear();
	const hours = date.getHours().toString().padStart(2, '0');
	const minutes = date.getMinutes().toString().padStart(2, '0');

	// Format the date and time
	return `${day}/${month}/${year} ${hours}:${minutes}`;
}

export const formatDateTimeString = (dateTimeString) => {
	// Split the date and time parts
	const [datePart, timePart] = dateTimeString.split(' ');

	// Extract the hour and minute parts
	const [hour, minute] = timePart.split(':');

	// Combine the date part with the hour and minute parts
	return `${datePart} ${hour}:${minute}`;
}

export const isUsernameAvailable = async (username) => {
	return await AxiosRequester.getInstance().checkUsernameAvailability(username);
}

export const formatDateStringForLogs = (dateString) => {
	const date = new Date(dateString);

	const pad = (num) => num.toString().padStart(2, '0');

	const day = pad(date.getDate());
	const month = pad(date.getMonth() + 1); // Les mois sont basés sur 0
	const year = date.getFullYear();

	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());

	return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export const handleFile = (blob, contentType) => {
	// Créer un objet URL pour le blob
	if(blob){
		const url = window.URL.createObjectURL(blob);

		// Déterminer le type de fichier
		const filename = getFilenameFromContentType(contentType);

		// Télécharger le fichier
		downloadFile(url, filename);

		// Libérer l'URL de l'objet lorsque vous avez terminé
		window.URL.revokeObjectURL(url);
	}
};

// Fonction pour obtenir un nom de fichier basé sur le type MIME
export const getFilenameFromContentType = (contentType) => {
	switch (contentType) {
		case 'application/pdf':
			return 'document.pdf';
		case 'image/png':
			return 'image.png';
		case 'text/plain':
			return 'file.txt';
		// Ajouter d'autres types MIME si nécessaire
		default:
			return 'file.zip';
	}
};

// Fonction pour télécharger le fichier
export const downloadFile = (url, filename) => {
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
