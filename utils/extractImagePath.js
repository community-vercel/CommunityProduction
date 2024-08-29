export const extractImagePath = (fileurl) => {
  // Extract the path after "public/"
  const pathRegex = /\/public\/(.+)$/;
  const match = fileurl.match(pathRegex);

  if (match && match[1]) {
    let filePath = match[1];

    // Remove any double slashes
    filePath = filePath.replace(/\/+/g, "/");

    return (filePath);
  }
};
