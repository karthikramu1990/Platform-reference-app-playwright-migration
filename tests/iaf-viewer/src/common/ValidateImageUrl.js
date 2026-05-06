const imageCache = new Map();

async function _checkIfImageExists(url) {
  // Check if the result is cached
  if (imageCache.has(url)) {
    return imageCache.get(url);
  }

  // Create a promise that checks the image
  const imagePromise = new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Set CORS mode to anonymous

    // Resolve true if the image loads successfully and has valid dimensions
    img.onload = () => {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        imageCache.set(url, true); // Cache only valid images
        resolve(true);
      } else {
        resolve(false); // Image loaded but is likely invalid
      }
    };

    // Resolve false if there's an error loading the image
    img.onerror = () => {
      resolve(false); // Don't cache invalid images
    };

    // Set the image source
    img.src = url;

    // Check if the image is already cached and loaded
    if (img.complete) {
      if (img.naturalWidth > 0 && img.naturalHeight > 0) {
        imageCache.set(url, true);
        resolve(true);
      } else {
        resolve(false);
      }
    }
  });

  try {
    return await imagePromise;
  } catch (error) {
    console.error('Error checking image:', error);
    return false; // Consider as invalid in case of unexpected errors
  }
}

export async function verifyImage(url) {
  try {
    const exists = await _checkIfImageExists(url);
    return exists;
  } catch (error) {
    console.error('Error checking image:', error);
    return false;
  }
}