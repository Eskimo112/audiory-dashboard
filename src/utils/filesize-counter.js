export const MAX_CONTENT_SIZE = 1048576;

export const byteSizeFromString = str => new Blob([str]).size;

export const fileSizeFromBase64 = ({ base64String = '' }) => {
    // get the string length after MIME-type is removed
    const length = base64String.slice(base64String.indexOf(',') + 1).length ?? 0;
    var applyPaddingsRules = true;

    // get the size in byte
    var fileSizeInByte = Math.ceil(length / 4) * 3;

    // apply padding rules if mandatory
    // We need to subtract 2 from the fileSizeInByte we calculated above if the last 2 characters of the base64 string are paddings, 
    // otherwise subtract 1 when the last character only is a padding character.
    if (applyPaddingsRules && base64String.length >= 2) {
        const paddings = base64String.slice(-2);

        fileSizeInByte = paddings === "==" ? fileSizeInByte - 2 : paddings[1] === '=' ? fileSizeInByte - 1 : fileSizeInByte;
        // console.log('image size', fileSizeInByte);

        return fileSizeInByte;
    } else return 0;

}

export const convertImageLinkToBase64 = (url, callback) => {
    // Fetch the image
    fetch(url)
        .then(response => {
            // Check if the fetch was successful
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            // Convert the response to Blob
            return response.blob();
        })
        .then(blob => {
            // Create a new FileReader
            var reader = new FileReader();

            // Read the Blob as Data URL
            reader.readAsDataURL(blob);

            reader.onloadend = function () {

                // The result contains the Base64 string
                var base64String = reader.result;
                // Call the callback function with the Base64 string
                callback(base64String);
            };
        })
        .catch(error => {
            console.error('Error:', error);
        });
}